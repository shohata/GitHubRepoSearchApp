import { z } from "zod";

/**
 * 環境変数のバリデーションスキーマ
 */
const envSchema = z.object({
  /**
   * GitHub Personal Access Token
   * 本番環境では必須、開発環境では推奨
   */
  GITHUB_ACCESS_TOKEN: z.string().optional(),
  /**
   * Node環境
   */
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/**
 * 型安全な環境変数
 * アプリケーション起動時に環境変数をバリデーション
 *
 * @throws {ZodError} 環境変数が不正な場合
 */
export const env = envSchema.parse({
  GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
  NODE_ENV: process.env.NODE_ENV,
});

/**
 * 環境変数が正しく設定されているかの推奨事項を確認
 */
if (!env.GITHUB_ACCESS_TOKEN) {
  if (env.NODE_ENV === "production") {
    // 本番環境でトークンが設定されていない場合は警告
    console.error(
      "⚠️  ERROR: GITHUB_ACCESS_TOKEN is not set in production environment."
    );
    console.error(
      "   GitHub API rate limiting will severely restrict functionality."
    );
    console.error(
      "   Please set GITHUB_ACCESS_TOKEN environment variable immediately."
    );
  } else {
    // 開発環境での推奨メッセージ
    console.warn(
      "⚠️  Warning: GITHUB_ACCESS_TOKEN is not set. API rate limiting may occur."
    );
    console.warn(
      "   Set GITHUB_ACCESS_TOKEN in .env.local for better development experience."
    );
  }
}
