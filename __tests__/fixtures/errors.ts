/**
 * テスト用のエラーフィクスチャ
 * 様々なエラーケースのモックを提供
 */

/**
 * GitHub API のエラーをモック
 * Octokitの RequestError をシミュレート
 */
export class MockRequestError extends Error {
  status: number;
  response: unknown;

  constructor(message: string, status: number, response: unknown) {
    super(message);
    this.name = "RequestError";
    this.status = status;
    this.response = response;
  }
}

/**
 * よくあるエラーケースのファクトリー関数
 */
export const createGitHubErrors = () => ({
  /**
   * レート制限エラー (403)
   */
  rateLimitError: new MockRequestError("Rate limit exceeded", 403, {
    data: "Rate limit exceeded",
  }),

  /**
   * リソースが見つからないエラー (404)
   */
  notFoundError: new MockRequestError("Not Found", 404, {
    data: "Not Found",
  }),

  /**
   * バリデーションエラー (422)
   */
  validationError: new MockRequestError("Validation failed", 422, {
    data: "Validation failed",
  }),

  /**
   * サーバーエラー (500)
   */
  serverError: new MockRequestError("Internal Server Error", 500, {
    data: "Internal Server Error",
  }),

  /**
   * 認証エラー (401)
   */
  authError: new MockRequestError("Unauthorized", 401, {
    data: "Unauthorized",
  }),

  /**
   * 権限エラー (403)
   */
  permissionError: new MockRequestError("Forbidden", 403, {
    data: "Forbidden",
  }),
});

/**
 * 一般的なJavaScriptエラー
 */
export const createCommonErrors = () => ({
  /**
   * ネットワークエラー
   */
  networkError: new Error("Network Error"),

  /**
   * タイムアウトエラー
   */
  timeoutError: new Error("Request Timeout"),

  /**
   * 不明なエラー
   */
  unknownError: new Error("Unknown Error"),

  /**
   * APIエラー
   */
  apiError: new Error("API Error"),

  /**
   * レート制限エラー (一般)
   */
  rateLimitError: new Error("API rate limit exceeded"),
});
