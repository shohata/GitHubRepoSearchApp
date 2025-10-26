import { RequestError } from "octokit";
import { env } from "./env";

/**
 * GitHub APIエラーメッセージの定数
 */
export const ERROR_MESSAGES = {
  RATE_LIMIT_EXCEEDED:
    "APIの利用回数制限に達しました。しばらくしてから再度お試しください。",
  REPOSITORY_NOT_FOUND: "指定されたリポジトリが見つかりませんでした。",
  INVALID_QUERY: "検索クエリが無効です。検索条件を確認してください。",
  UNEXPECTED_ERROR: "予期せぬエラーが発生しました。",
  FETCH_FAILED: "データの取得に失敗しました。",
  REPO_FETCH_FAILED: "リポジトリ情報の取得に失敗しました。",
} as const;

/**
 * カスタムエラークラス: GitHub APIエラー
 */
export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

/**
 * GitHub API のエラーを処理し、ユーザーフレンドリーなエラーメッセージを生成
 *
 * @param error - キャッチされたエラー
 * @param context - エラーのコンテキスト ('search' | 'repo')
 * @returns {never} - 常にエラーをスローする
 * @throws {GitHubAPIError}
 */
export function handleGitHubError(
  error: unknown,
  context: "search" | "repo" = "search"
): never {
  // RequestErrorの場合、ステータスコードに応じたエラーメッセージを返す
  if (error instanceof RequestError) {
    // 本番環境以外でのみエラーログを出力
    if (env.NODE_ENV !== "production") {
      console.error(
        `GitHub API Error (${context}): ${error.status}`,
        error.response
      );
    }

    switch (error.status) {
      case 403: {
        // レート制限情報を取得
        const _remaining = error.response?.headers?.["x-ratelimit-remaining"];
        const resetTime = error.response?.headers?.["x-ratelimit-reset"];
        let message: string = ERROR_MESSAGES.RATE_LIMIT_EXCEEDED;

        // リセット時刻を含めたメッセージを生成
        if (resetTime) {
          const resetDate = new Date(Number(resetTime) * 1000);
          message = `${ERROR_MESSAGES.RATE_LIMIT_EXCEEDED} リセット時刻: ${resetDate.toLocaleTimeString("ja-JP")}`;
        }

        throw new GitHubAPIError(message, 403, error);
      }
      case 404:
        if (context === "repo") {
          throw new GitHubAPIError(
            ERROR_MESSAGES.REPOSITORY_NOT_FOUND,
            404,
            error
          );
        }
        throw new GitHubAPIError(
          `${ERROR_MESSAGES.FETCH_FAILED} (Status: ${error.status})`,
          error.status,
          error
        );
      case 422:
        throw new GitHubAPIError(ERROR_MESSAGES.INVALID_QUERY, 422, error);
      default: {
        const message =
          context === "repo"
            ? ERROR_MESSAGES.REPO_FETCH_FAILED
            : ERROR_MESSAGES.FETCH_FAILED;
        throw new GitHubAPIError(
          `${message} (Status: ${error.status})`,
          error.status,
          error
        );
      }
    }
  }

  // 予期しないエラーの場合（本番環境以外でのみログ出力）
  if (env.NODE_ENV !== "production") {
    console.error(`Unexpected error (${context}):`, error);
  }
  throw new GitHubAPIError(ERROR_MESSAGES.UNEXPECTED_ERROR, undefined, error);
}
