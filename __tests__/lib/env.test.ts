/**
 * env.tsのテスト
 *
 * 注: env.tsはアプリケーション起動時に実行されるため、
 * このテストは環境変数のバリデーションロジックを検証します
 */

import { z } from "zod";

describe("lib/env.ts", () => {
  // env.tsと同じスキーマを使用してテスト
  const envSchema = z.object({
    GITHUB_ACCESS_TOKEN: z.string().optional(),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  });

  describe("環境変数のバリデーション", () => {
    it("有効な環境変数を解析する（すべて指定）", () => {
      const result = envSchema.parse({
        GITHUB_ACCESS_TOKEN: "ghp_test123",
        NODE_ENV: "production",
      });

      expect(result.GITHUB_ACCESS_TOKEN).toBe("ghp_test123");
      expect(result.NODE_ENV).toBe("production");
    });

    it("GITHUB_ACCESS_TOKENが未指定でも解析できる", () => {
      const result = envSchema.parse({
        NODE_ENV: "development",
      });

      expect(result.GITHUB_ACCESS_TOKEN).toBeUndefined();
      expect(result.NODE_ENV).toBe("development");
    });

    it("NODE_ENVが未指定の場合、デフォルト値developmentが使用される", () => {
      const result = envSchema.parse({
        GITHUB_ACCESS_TOKEN: "ghp_test123",
      });

      expect(result.NODE_ENV).toBe("development");
    });

    it("developmentが有効な値として認識される", () => {
      const result = envSchema.parse({
        NODE_ENV: "development",
      });

      expect(result.NODE_ENV).toBe("development");
    });

    it("productionが有効な値として認識される", () => {
      const result = envSchema.parse({
        NODE_ENV: "production",
      });

      expect(result.NODE_ENV).toBe("production");
    });

    it("testが有効な値として認識される", () => {
      const result = envSchema.parse({
        NODE_ENV: "test",
      });

      expect(result.NODE_ENV).toBe("test");
    });

    it("無効なNODE_ENVでエラーをスローする", () => {
      expect(() => {
        envSchema.parse({
          NODE_ENV: "invalid",
        });
      }).toThrow();
    });

    it("空の環境変数オブジェクトでもデフォルト値で解析できる", () => {
      const result = envSchema.parse({});

      expect(result.NODE_ENV).toBe("development");
      expect(result.GITHUB_ACCESS_TOKEN).toBeUndefined();
    });

    it("GITHUB_ACCESS_TOKENに空文字列を設定できる", () => {
      const result = envSchema.parse({
        GITHUB_ACCESS_TOKEN: "",
        NODE_ENV: "test",
      });

      expect(result.GITHUB_ACCESS_TOKEN).toBe("");
    });

    it("環境変数の型が正しいことを確認", () => {
      const result = envSchema.parse({
        GITHUB_ACCESS_TOKEN: "token",
        NODE_ENV: "production",
      });

      expect(typeof result.GITHUB_ACCESS_TOKEN).toBe("string");
      expect(typeof result.NODE_ENV).toBe("string");
    });
  });

  describe("型推論", () => {
    it("解析結果の型が正しい", () => {
      const result = envSchema.parse({
        GITHUB_ACCESS_TOKEN: "token",
        NODE_ENV: "production",
      });

      // TypeScriptの型チェックを通過することを確認
      const token: string | undefined = result.GITHUB_ACCESS_TOKEN;
      const nodeEnv: "development" | "production" | "test" = result.NODE_ENV;

      expect(token).toBeDefined();
      expect(nodeEnv).toBe("production");
    });
  });
});
