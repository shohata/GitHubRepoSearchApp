import { z } from "zod";

/**
 * 環境変数のバリデーションスキーマ
 */
const envSchema = z.object({
  GITHUB_ACCESS_TOKEN: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/**
 * 型安全な環境変数
 * アプリケーション起動時に環境変数をバリデーション
 */
export const env = envSchema.parse({
  GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
  NODE_ENV: process.env.NODE_ENV,
});
