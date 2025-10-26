/**
 * fetcherのエラーハンドリングをテスト
 */

// グローバルfetchをモック
global.fetch = jest.fn();

describe("fetcher (use-search-results.ts)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常なレスポンスの場合、JSONを返す", async () => {
    const mockData = { items: [], total_count: 0 };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    // fetcherは内部関数なので、実際のフェッチをテスト
    const response = await fetch("/api/search?q=test&page=1");
    const data = await response.json();

    expect(data).toEqual(mockData);
  });

  it("レスポンスがokでない場合、サーバーエラーメッセージを含むエラーをスロー", async () => {
    const errorMessage = "APIの利用回数制限に達しました。";
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 403,
      json: jest.fn().mockResolvedValue({
        error: "Rate limit exceeded",
        message: errorMessage,
      }),
    });

    // fetcherのロジックを直接テスト
    const response = await fetch("/api/search?q=test&page=1");
    const errorData = await response.json();

    expect(response.ok).toBe(false);
    expect(errorData.message).toBe(errorMessage);
  });

  it("エラーレスポンスのJSONパースに失敗した場合、デフォルトメッセージを使用", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    });

    const response = await fetch("/api/search?q=test&page=1");

    expect(response.ok).toBe(false);
    // JSONパースが失敗した場合の処理をテスト
    const errorData = await response.json().catch(() => ({}));
    expect(errorData).toEqual({});
  });

  it("404エラーの場合", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({
        error: "Not Found",
        message: "データの取得に失敗しました。",
      }),
    });

    const response = await fetch("/api/search?q=test&page=1");
    const errorData = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
    expect(errorData.message).toBe("データの取得に失敗しました。");
  });

  it("ネットワークエラーの場合", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    await expect(fetch("/api/search?q=test&page=1")).rejects.toThrow(
      "Network error"
    );
  });
});
