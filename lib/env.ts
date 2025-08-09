import { z } from "zod";

// 環境変数のスキーマを定義
const envSchema = z.object({
  GITHUB_ACCESS_TOKEN: z.string().optional(),
});

// 環境変数をパース（検証）
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error("Invalid environment variables.");
}

export const GITHUB_ACCESS_TOKEN = parsedEnv.data.GITHUB_ACCESS_TOKEN;
