/**
 * シンプルなインメモリレート制限実装
 * 本番環境ではRedisなどの外部ストアを使用することを推奨
 */

type RateLimitOptions = {
  /**
   * レート制限のウィンドウ時間（ミリ秒）
   * @default 60000 (1分)
   */
  interval?: number;
  /**
   * ウィンドウ内で許可する最大リクエスト数
   * @default 10
   */
  uniqueTokenPerInterval?: number;
};

type TokenData = {
  count: number;
  resetTime: number;
};

/**
 * シンプルなレート制限実装
 * LRUキャッシュの代わりにMapを使用した軽量実装
 */
export class RateLimiter {
  private tokenCache: Map<string, TokenData>;
  private interval: number;
  private limit: number;

  constructor(options: RateLimitOptions = {}) {
    this.tokenCache = new Map();
    this.interval = options.interval || 60000; // デフォルト: 1分
    this.limit = options.uniqueTokenPerInterval || 10; // デフォルト: 10リクエスト/分

    // 定期的に古いエントリをクリーンアップ
    setInterval(() => this.cleanup(), this.interval);
  }

  /**
   * 古いエントリをクリーンアップ
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [token, data] of this.tokenCache.entries()) {
      if (now > data.resetTime) {
        this.tokenCache.delete(token);
      }
    }
  }

  /**
   * レート制限をチェック
   * @param token - ユニークトークン（通常はIPアドレス）
   * @returns レート制限に達している場合はfalse、それ以外はtrue
   */
  check(token: string): boolean {
    const now = Date.now();
    const tokenData = this.tokenCache.get(token);

    if (!tokenData || now > tokenData.resetTime) {
      // 新しいトークンまたはリセット時刻を過ぎている
      this.tokenCache.set(token, {
        count: 1,
        resetTime: now + this.interval,
      });
      return true;
    }

    if (tokenData.count >= this.limit) {
      // レート制限に達している
      return false;
    }

    // カウントをインクリメント
    tokenData.count += 1;
    return true;
  }

  /**
   * 現在のレート制限情報を取得
   * @param token - ユニークトークン
   * @returns レート制限情報
   */
  getInfo(
    token: string
  ): { limit: number; remaining: number; reset: number } | null {
    const tokenData = this.tokenCache.get(token);
    const now = Date.now();

    if (!tokenData || now > tokenData.resetTime) {
      return {
        limit: this.limit,
        remaining: this.limit,
        reset: now + this.interval,
      };
    }

    return {
      limit: this.limit,
      remaining: Math.max(0, this.limit - tokenData.count),
      reset: tokenData.resetTime,
    };
  }
}

/**
 * グローバルなレート制限インスタンス
 * APIルートで共有して使用
 */
export const apiRateLimiter = new RateLimiter({
  interval: 60000, // 1分
  uniqueTokenPerInterval: 10, // 10リクエスト/分
});
