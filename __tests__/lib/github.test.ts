import { getRepo, searchRepos } from "@/lib/github";
import { resetOctokitClient } from "@/lib/octokit-client";

// Mock the entire octokit module
jest.mock("octokit", () => {
  // Define RequestError inside the mock
  class RequestError extends Error {
    status: number;
    response: any;

    constructor(message: string, status: number, response: any) {
      super(message);
      this.status = status;
      this.response = response;
      this.name = "RequestError";
    }
  }

  return {
    Octokit: jest.fn(),
    RequestError,
  };
});

// Import RequestError after mocking
import { RequestError } from "octokit";

// Mock data for searchRepos
const mockSearchResult = {
  total_count: 1,
  items: [
    {
      id: 10270250,
      full_name: "facebook/react",
      name: "react",
      owner: { login: "facebook" },
      description: "The library for web and native user interfaces.",
      stargazers_count: 220000,
      language: "JavaScript",
      forks_count: 45000,
      open_issues_count: 1000,
      watchers_count: 7000,
    },
  ],
  incomplete_results: false,
};

// Mock data for getRepo
const mockRepoDetails = {
  id: 10270250,
  full_name: "facebook/react",
  name: "react",
  owner: { login: "facebook" },
  description: "The library for web and native user interfaces.",
  stargazers_count: 220000,
  language: "JavaScript",
  forks_count: 45000,
  open_issues_count: 1000,
  watchers_count: 7000,
  html_url: "https://github.com/facebook/react",
  subscribers_count: 7000,
};

// Import the mocked Octokit
import { Octokit } from "octokit";

describe("lib/github.ts", () => {
  describe("searchRepos", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      resetOctokitClient();
    });

    it("should return search results on a successful request", async () => {
      const mockOctokit = {
        rest: {
          search: {
            repos: jest.fn().mockResolvedValue({ data: mockSearchResult }),
          },
        },
      };

      (Octokit as jest.Mock).mockImplementation(() => mockOctokit);

      const result = await searchRepos("react", 1);

      expect(result).toEqual(mockSearchResult);
      expect(mockOctokit.rest.search.repos).toHaveBeenCalledWith({
        q: "react",
        page: 1,
        per_page: 12,
      });
    });

    it("should throw an error when rate limit is exceeded (403)", async () => {
      const mockError = new RequestError("Rate limit exceeded", 403, {
        data: "Rate limit exceeded",
      });

      const mockOctokit = {
        rest: {
          search: {
            repos: jest.fn().mockRejectedValue(mockError),
          },
        },
      };

      (Octokit as jest.Mock).mockImplementation(() => mockOctokit);

      await expect(searchRepos("react", 1)).rejects.toThrow(
        "APIの利用回数制限に達しました。しばらくしてから再度お試しください。"
      );
    });

    it("should throw an error when query is invalid (422)", async () => {
      const mockError = new RequestError("Validation failed", 422, {
        data: "Validation failed",
      });

      const mockOctokit = {
        rest: {
          search: {
            repos: jest.fn().mockRejectedValue(mockError),
          },
        },
      };

      (Octokit as jest.Mock).mockImplementation(() => mockOctokit);

      await expect(searchRepos("react", 1)).rejects.toThrow(
        "検索クエリが無効です。検索条件を確認してください。"
      );
    });

    it("should throw an error on other failed requests (500)", async () => {
      const mockError = new RequestError("Internal Server Error", 500, {
        data: "Internal Server Error",
      });

      const mockOctokit = {
        rest: {
          search: {
            repos: jest.fn().mockRejectedValue(mockError),
          },
        },
      };

      (Octokit as jest.Mock).mockImplementation(() => mockOctokit);

      await expect(searchRepos("react", 1)).rejects.toThrow(
        /データの取得に失敗しました。.*Status: 500/
      );
    });
  });

  describe("getRepo", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      resetOctokitClient();
    });

    it("should return repository details on a successful request", async () => {
      const mockOctokit = {
        rest: {
          repos: {
            get: jest.fn().mockResolvedValue({ data: mockRepoDetails }),
          },
        },
      };

      (Octokit as jest.Mock).mockImplementation(() => mockOctokit);

      const result = await getRepo("facebook", "react");

      expect(result).toEqual(mockRepoDetails);
      expect(mockOctokit.rest.repos.get).toHaveBeenCalledWith({
        owner: "facebook",
        repo: "react",
      });
    });

    it("should throw an error when rate limit is exceeded (403)", async () => {
      const mockError = new RequestError("Rate limit exceeded", 403, {
        data: "Rate limit exceeded",
      });

      const mockOctokit = {
        rest: {
          repos: {
            get: jest.fn().mockRejectedValue(mockError),
          },
        },
      };

      (Octokit as jest.Mock).mockImplementation(() => mockOctokit);

      await expect(getRepo("facebook", "react")).rejects.toThrow(
        "APIの利用回数制限に達しました。しばらくしてから再度お試しください。"
      );
    });

    it("should throw an error when repository is not found (404)", async () => {
      const mockError = new RequestError("Not Found", 404, {
        data: "Not Found",
      });

      const mockOctokit = {
        rest: {
          repos: {
            get: jest.fn().mockRejectedValue(mockError),
          },
        },
      };

      (Octokit as jest.Mock).mockImplementation(() => mockOctokit);

      await expect(getRepo("facebook", "react")).rejects.toThrow(
        "指定されたリポジトリが見つかりませんでした。"
      );
    });

    it("should throw an error on other failed requests (500)", async () => {
      const mockError = new RequestError("Internal Server Error", 500, {
        data: "Internal Server Error",
      });

      const mockOctokit = {
        rest: {
          repos: {
            get: jest.fn().mockRejectedValue(mockError),
          },
        },
      };

      (Octokit as jest.Mock).mockImplementation(() => mockOctokit);

      await expect(getRepo("facebook", "react")).rejects.toThrow(
        /リポジトリ情報の取得に失敗しました。.*Status: 500/
      );
    });
  });
});
