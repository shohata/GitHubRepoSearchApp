import { RateLimiter } from "@/lib/rate-limit";

describe("lib/rate-limit.ts", () => {
  describe("RateLimiter", () => {
    let rateLimiter: RateLimiter;

    afterEach(() => {
      if (rateLimiter) {
        rateLimiter.destroy();
      }
    });

    it("should allow requests within limit", () => {
      rateLimiter = new RateLimiter({
        interval: 60000,
        uniqueTokenPerInterval: 5,
      });

      const token = "test-token";

      // 5回のリクエストはすべて許可される
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.check(token)).toBe(true);
      }
    });

    it("should block requests exceeding limit", () => {
      rateLimiter = new RateLimiter({
        interval: 60000,
        uniqueTokenPerInterval: 3,
      });

      const token = "test-token";

      // 最初の3回は許可
      expect(rateLimiter.check(token)).toBe(true);
      expect(rateLimiter.check(token)).toBe(true);
      expect(rateLimiter.check(token)).toBe(true);

      // 4回目はブロック
      expect(rateLimiter.check(token)).toBe(false);
    });

    it("should return correct rate limit info", () => {
      rateLimiter = new RateLimiter({
        interval: 60000,
        uniqueTokenPerInterval: 10,
      });

      const token = "test-token";

      // 初期状態
      const initialInfo = rateLimiter.getInfo(token);
      expect(initialInfo?.limit).toBe(10);
      expect(initialInfo?.remaining).toBe(10);

      // 1回リクエスト後
      rateLimiter.check(token);
      const afterOneRequest = rateLimiter.getInfo(token);
      expect(afterOneRequest?.remaining).toBe(9);

      // 5回リクエスト後
      for (let i = 0; i < 4; i++) {
        rateLimiter.check(token);
      }
      const afterFiveRequests = rateLimiter.getInfo(token);
      expect(afterFiveRequests?.remaining).toBe(5);
    });

    it("should handle multiple tokens independently", () => {
      rateLimiter = new RateLimiter({
        interval: 60000,
        uniqueTokenPerInterval: 2,
      });

      const token1 = "token-1";
      const token2 = "token-2";

      // トークン1: 2回リクエスト（限界まで）
      expect(rateLimiter.check(token1)).toBe(true);
      expect(rateLimiter.check(token1)).toBe(true);
      expect(rateLimiter.check(token1)).toBe(false);

      // トークン2: まだ制限されていない
      expect(rateLimiter.check(token2)).toBe(true);
      expect(rateLimiter.check(token2)).toBe(true);
      expect(rateLimiter.check(token2)).toBe(false);
    });

    it("should reset after interval expires", async () => {
      rateLimiter = new RateLimiter({
        interval: 100, // 100ms
        uniqueTokenPerInterval: 2,
      });

      const token = "test-token";

      // 限界までリクエスト
      expect(rateLimiter.check(token)).toBe(true);
      expect(rateLimiter.check(token)).toBe(true);
      expect(rateLimiter.check(token)).toBe(false);

      // インターバル後にリセットされる
      await new Promise((resolve) => setTimeout(resolve, 150));

      // 再度リクエストが許可される
      expect(rateLimiter.check(token)).toBe(true);
    });

    it("should properly clean up resources on destroy", () => {
      rateLimiter = new RateLimiter({
        interval: 60000,
        uniqueTokenPerInterval: 10,
      });

      const token = "test-token";
      rateLimiter.check(token);

      // destroy呼び出し
      rateLimiter.destroy();

      // 新しいリクエストでもエラーが発生しないことを確認
      // （内部的にはクリアされているが、getInfoは安全に動作）
      const info = rateLimiter.getInfo(token);
      expect(info).toBeDefined();
    });

    it("should use default options when not specified", () => {
      rateLimiter = new RateLimiter();

      const token = "test-token";

      // デフォルトは10リクエスト/分
      for (let i = 0; i < 10; i++) {
        expect(rateLimiter.check(token)).toBe(true);
      }
      expect(rateLimiter.check(token)).toBe(false);
    });

    it("should handle edge case with remaining count", () => {
      rateLimiter = new RateLimiter({
        interval: 60000,
        uniqueTokenPerInterval: 1,
      });

      const token = "test-token";

      // 1回目は許可
      expect(rateLimiter.check(token)).toBe(true);

      // 残りは0になる
      const info = rateLimiter.getInfo(token);
      expect(info?.remaining).toBe(0);

      // 2回目はブロック
      expect(rateLimiter.check(token)).toBe(false);
    });
  });
});
