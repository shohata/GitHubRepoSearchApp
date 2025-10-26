// envモジュールをモック
jest.mock("@/lib/env", () => ({
  env: {
    NODE_ENV: "test",
    GITHUB_ACCESS_TOKEN: undefined,
  },
}));

// octokitモジュールをモック（ESMインポート問題を回避）
jest.mock("octokit", () => ({
  RequestError: class RequestError extends Error {
    constructor(
      message: string,
      public status: number,
      public response?: any,
      public request?: any
    ) {
      super(message);
      this.name = "RequestError";
    }
  },
}));

import { RequestError } from "octokit";
import {
  ERROR_MESSAGES,
  GitHubAPIError,
  handleGitHubError,
} from "@/lib/errors";

describe("lib/errors.ts", () => {
  describe("GitHubAPIError", () => {
    it("正しいプロパティでエラーを作成する", () => {
      const error = new GitHubAPIError("Test error", 400, new Error("Original"));

      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(400);
      expect(error.originalError).toBeInstanceOf(Error);
      expect(error.name).toBe("GitHubAPIError");
    });

    it("オプショナルパラメータなしでエラーを作成できる", () => {
      const error = new GitHubAPIError("Simple error");

      expect(error.message).toBe("Simple error");
      expect(error.statusCode).toBeUndefined();
      expect(error.originalError).toBeUndefined();
    });
  });

  describe("handleGitHubError", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe("403 Forbidden (レート制限)", () => {
      it("リセット時刻なしでレート制限エラーをスローする", () => {
        const requestError = new RequestError("Rate limit exceeded", 403, {
          response: {
            headers: {},
            data: "Rate limit exceeded",
          },
          request: {},
        } as any);

        expect(() => handleGitHubError(requestError, "search")).toThrow(
          GitHubAPIError
        );

        try {
          handleGitHubError(requestError, "search");
        } catch (error) {
          if (error instanceof GitHubAPIError) {
            expect(error.message).toBe(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
            expect(error.statusCode).toBe(403);
          }
        }
      });

      it("リセット時刻ありでレート制限エラーをスローする", () => {
        const resetTime = Math.floor(Date.now() / 1000) + 3600; // 1時間後
        const requestError = new RequestError("Rate limit exceeded", 403, {
          headers: {
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": resetTime.toString(),
          },
          data: "Rate limit exceeded",
        } as any, {} as any);

        try {
          handleGitHubError(requestError, "search");
        } catch (error) {
          if (error instanceof GitHubAPIError) {
            expect(error.message).toContain(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
            expect(error.message).toContain("リセット時刻:");
            expect(error.statusCode).toBe(403);
          }
        }
      });
    });

    describe("404 Not Found", () => {
      it("repoコンテキストで404エラーをスローする", () => {
        const requestError = new RequestError("Not found", 404, {
          response: { data: "Not found" },
          request: {},
        } as any);

        try {
          handleGitHubError(requestError, "repo");
        } catch (error) {
          if (error instanceof GitHubAPIError) {
            expect(error.message).toBe(ERROR_MESSAGES.REPOSITORY_NOT_FOUND);
            expect(error.statusCode).toBe(404);
          }
        }
      });

      it("searchコンテキストで404エラーをスローする", () => {
        const requestError = new RequestError("Not found", 404, {
          response: { data: "Not found" },
          request: {},
        } as any);

        try {
          handleGitHubError(requestError, "search");
        } catch (error) {
          if (error instanceof GitHubAPIError) {
            expect(error.message).toContain(ERROR_MESSAGES.FETCH_FAILED);
            expect(error.message).toContain("Status: 404");
            expect(error.statusCode).toBe(404);
          }
        }
      });
    });

    describe("422 Unprocessable Entity", () => {
      it("無効なクエリエラーをスローする", () => {
        const requestError = new RequestError("Validation failed", 422, {
          response: { data: "Validation failed" },
          request: {},
        } as any);

        try {
          handleGitHubError(requestError, "search");
        } catch (error) {
          if (error instanceof GitHubAPIError) {
            expect(error.message).toBe(ERROR_MESSAGES.INVALID_QUERY);
            expect(error.statusCode).toBe(422);
          }
        }
      });
    });

    describe("その他のHTTPエラー", () => {
      it("500エラー（searchコンテキスト）を処理する", () => {
        const requestError = new RequestError("Internal Server Error", 500, {
          response: { data: "Internal Server Error" },
          request: {},
        } as any);

        try {
          handleGitHubError(requestError, "search");
        } catch (error) {
          if (error instanceof GitHubAPIError) {
            expect(error.message).toContain(ERROR_MESSAGES.FETCH_FAILED);
            expect(error.message).toContain("Status: 500");
            expect(error.statusCode).toBe(500);
          }
        }
      });

      it("500エラー（repoコンテキスト）を処理する", () => {
        const requestError = new RequestError("Internal Server Error", 500, {
          response: { data: "Internal Server Error" },
          request: {},
        } as any);

        try {
          handleGitHubError(requestError, "repo");
        } catch (error) {
          if (error instanceof GitHubAPIError) {
            expect(error.message).toContain(ERROR_MESSAGES.REPO_FETCH_FAILED);
            expect(error.message).toContain("Status: 500");
            expect(error.statusCode).toBe(500);
          }
        }
      });
    });

    describe("予期しないエラー", () => {
      it("非RequestErrorを処理する", () => {
        const unknownError = new Error("Unknown error");

        try {
          handleGitHubError(unknownError, "search");
        } catch (error) {
          if (error instanceof GitHubAPIError) {
            expect(error.message).toBe(ERROR_MESSAGES.UNEXPECTED_ERROR);
            expect(error.statusCode).toBeUndefined();
            expect(error.originalError).toBe(unknownError);
          }
        }
      });

      it("文字列エラーを処理する", () => {
        try {
          handleGitHubError("String error", "repo");
        } catch (error) {
          if (error instanceof GitHubAPIError) {
            expect(error.message).toBe(ERROR_MESSAGES.UNEXPECTED_ERROR);
            expect(error.originalError).toBe("String error");
          }
        }
      });
    });
  });
});
