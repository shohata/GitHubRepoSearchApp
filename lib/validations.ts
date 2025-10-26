import { z } from "zod";

/**
 * 検索パラメータのバリデーションスキーマ
 */
export const searchParamsSchema = z.object({
  q: z
    .string()
    .min(1, "検索クエリは必須です")
    .max(256, "検索クエリは256文字以内で入力してください")
    .transform((val) => val.trim().replace(/[<>]/g, "")),
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().int().positive().max(100)),
});

/**
 * リポジトリパラメータのバリデーションスキーマ
 */
export const repoParamsSchema = z.object({
  owner: z
    .string()
    .min(1, "オーナー名は必須です")
    .max(39, "オーナー名は39文字以内です")
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
      "オーナー名の形式が無効です"
    ),
  repo: z
    .string()
    .min(1, "リポジトリ名は必須です")
    .max(100, "リポジトリ名は100文字以内です")
    .regex(/^[\w.-]+$/, "リポジトリ名の形式が無効です"),
});

/**
 * API検索リクエストのバリデーションスキーマ
 */
export const apiSearchRequestSchema = z.object({
  q: z.string().min(1),
  page: z.number().int().positive().max(100).default(1),
});

/**
 * 型推論用のヘルパー型
 */
export type SearchParamsInput = z.input<typeof searchParamsSchema>;
export type SearchParams = z.output<typeof searchParamsSchema>;
export type RepoParams = z.infer<typeof repoParamsSchema>;
export type ApiSearchRequest = z.infer<typeof apiSearchRequestSchema>;
