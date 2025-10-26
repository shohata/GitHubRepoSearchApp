import { ZodError } from "zod";
import {
  apiSearchRequestSchema,
  repoParamsSchema,
  searchParamsSchema,
} from "@/lib/validations";

describe("lib/validations.ts", () => {
  describe("searchParamsSchema", () => {
    it("有効な検索パラメータを解析する", () => {
      const result = searchParamsSchema.parse({
        q: "react",
        page: "1",
      });

      expect(result.q).toBe("react");
      expect(result.page).toBe(1);
    });

    it("ページ番号のデフォルト値が1になる", () => {
      const result = searchParamsSchema.parse({
        q: "test",
      });

      expect(result.page).toBe(1);
    });

    it("文字列のページ番号を数値に変換する", () => {
      const result = searchParamsSchema.parse({
        q: "test",
        page: "5",
      });

      expect(result.page).toBe(5);
      expect(typeof result.page).toBe("number");
    });

    it("クエリの前後の空白をトリムする", () => {
      const result = searchParamsSchema.parse({
        q: "  react  ",
        page: "1",
      });

      expect(result.q).toBe("react");
    });

    it("クエリから < と > を除去する（XSS対策）", () => {
      const result = searchParamsSchema.parse({
        q: "<script>alert('xss')</script>",
        page: "1",
      });

      expect(result.q).toBe("scriptalert('xss')/script");
      expect(result.q).not.toContain("<");
      expect(result.q).not.toContain(">");
    });

    it("複合的なサニタイゼーション（トリム + < > 除去）を実行する", () => {
      const result = searchParamsSchema.parse({
        q: "  <div>test</div>  ",
        page: "1",
      });

      expect(result.q).toBe("divtest/div");
    });

    it("空のクエリでエラーをスローする", () => {
      expect(() => {
        searchParamsSchema.parse({
          q: "",
          page: "1",
        });
      }).toThrow(ZodError);
    });

    it("空白のみのクエリはトリム後に空になりエラーをスローする", () => {
      expect(() => {
        searchParamsSchema.parse({
          q: "   ",
          page: "1",
        });
      }).toThrow(ZodError);
    });

    it("256文字を超えるクエリでエラーをスローする", () => {
      const longQuery = "a".repeat(257);
      expect(() => {
        searchParamsSchema.parse({
          q: longQuery,
          page: "1",
        });
      }).toThrow(ZodError);
    });

    it("ページ番号が0以下でエラーをスローする", () => {
      expect(() => {
        searchParamsSchema.parse({
          q: "test",
          page: "0",
        });
      }).toThrow(ZodError);

      expect(() => {
        searchParamsSchema.parse({
          q: "test",
          page: "-1",
        });
      }).toThrow(ZodError);
    });

    it("ページ番号が100を超えるとエラーをスローする", () => {
      expect(() => {
        searchParamsSchema.parse({
          q: "test",
          page: "101",
        });
      }).toThrow(ZodError);
    });

    it("整数でないページ番号でエラーをスローする", () => {
      expect(() => {
        searchParamsSchema.parse({
          q: "test",
          page: "1.5",
        });
      }).toThrow(ZodError);
    });
  });

  describe("repoParamsSchema", () => {
    it("有効なリポジトリパラメータを解析する", () => {
      const result = repoParamsSchema.parse({
        owner: "facebook",
        repo: "react",
      });

      expect(result.owner).toBe("facebook");
      expect(result.repo).toBe("react");
    });

    it("ハイフン付きのオーナー名を許可する", () => {
      const result = repoParamsSchema.parse({
        owner: "my-organization",
        repo: "my-repo",
      });

      expect(result.owner).toBe("my-organization");
    });

    it("ドット付きのリポジトリ名を許可する", () => {
      const result = repoParamsSchema.parse({
        owner: "user",
        repo: "repo.js",
      });

      expect(result.repo).toBe("repo.js");
    });

    it("空のオーナー名でエラーをスローする", () => {
      expect(() => {
        repoParamsSchema.parse({
          owner: "",
          repo: "react",
        });
      }).toThrow(ZodError);
    });

    it("39文字を超えるオーナー名でエラーをスローする", () => {
      const longOwner = "a".repeat(40);
      expect(() => {
        repoParamsSchema.parse({
          owner: longOwner,
          repo: "react",
        });
      }).toThrow(ZodError);
    });

    it("無効な形式のオーナー名でエラーをスローする", () => {
      expect(() => {
        repoParamsSchema.parse({
          owner: "-invalid",
          repo: "react",
        });
      }).toThrow(ZodError);

      expect(() => {
        repoParamsSchema.parse({
          owner: "invalid-",
          repo: "react",
        });
      }).toThrow(ZodError);
    });

    it("100文字を超えるリポジトリ名でエラーをスローする", () => {
      const longRepo = "a".repeat(101);
      expect(() => {
        repoParamsSchema.parse({
          owner: "user",
          repo: longRepo,
        });
      }).toThrow(ZodError);
    });

    it("無効な文字を含むリポジトリ名でエラーをスローする", () => {
      expect(() => {
        repoParamsSchema.parse({
          owner: "user",
          repo: "repo/name",
        });
      }).toThrow(ZodError);
    });
  });

  describe("apiSearchRequestSchema", () => {
    it("有効なAPI検索リクエストを解析する", () => {
      const result = apiSearchRequestSchema.parse({
        q: "typescript",
        page: 5,
      });

      expect(result.q).toBe("typescript");
      expect(result.page).toBe(5);
    });

    it("ページ番号のデフォルト値が1になる", () => {
      const result = apiSearchRequestSchema.parse({
        q: "test",
      });

      expect(result.page).toBe(1);
    });

    it("空のクエリでエラーをスローする", () => {
      expect(() => {
        apiSearchRequestSchema.parse({
          q: "",
          page: 1,
        });
      }).toThrow(ZodError);
    });

    it("ページ番号が100を超えるとエラーをスローする", () => {
      expect(() => {
        apiSearchRequestSchema.parse({
          q: "test",
          page: 101,
        });
      }).toThrow(ZodError);
    });
  });
});
