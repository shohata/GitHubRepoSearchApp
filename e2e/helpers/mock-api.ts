import type { Page } from "@playwright/test";
import {
  generateMockSearchResponse,
  getMockRepository,
} from "../fixtures/mock-data";

/**
 * /api/search エンドポイントをモックする
 * GitHub APIの代わりに固定されたモックデータを返すことで、テストを安定化させる
 *
 * @param page - Playwrightのページオブジェクト
 */
export async function mockSearchAPI(page: Page) {
  await page.route("**/api/search**", async (route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams.get("q") || "";
    const pageNum = Number.parseInt(url.searchParams.get("page") || "1", 10);

    const mockResponse = generateMockSearchResponse(query, pageNum);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockResponse),
    });
  });
}

/**
 * リポジトリ詳細ページ用のAPI（存在する場合）をモックする
 * 現在はクライアントサイドでGitHub APIを直接呼び出しているが、
 * 将来的にサーバーサイドAPIに移行する場合に備えて準備
 *
 * @param page - Playwrightのページオブジェクト
 */
export async function mockRepositoryAPI(page: Page) {
  // GitHub APIの直接呼び出しをモック
  await page.route("https://api.github.com/repos/**", async (route) => {
    const url = route.request().url();
    const pathMatch = url.match(
      /https:\/\/api\.github\.com\/repos\/([^/]+)\/([^/]+)/
    );

    if (!pathMatch) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Not Found",
        }),
      });
      return;
    }

    const [, owner, repo] = pathMatch;
    const mockRepo = getMockRepository(owner, repo);

    if (mockRepo) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockRepo),
      });
    } else {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Not Found",
        }),
      });
    }
  });
}

/**
 * すべてのAPIをモックする（検索 + リポジトリ詳細）
 *
 * @param page - Playwrightのページオブジェクト
 */
export async function mockAllAPIs(page: Page) {
  await mockSearchAPI(page);
  await mockRepositoryAPI(page);
}

/**
 * 特定のエラーレスポンスをシミュレートする
 *
 * @param page - Playwrightのページオブジェクト
 * @param statusCode - HTTPステータスコード
 * @param errorMessage - エラーメッセージ
 */
export async function mockAPIError(
  page: Page,
  statusCode = 500,
  errorMessage = "Internal Server Error"
) {
  await page.route("**/api/search**", async (route) => {
    await route.fulfill({
      status: statusCode,
      contentType: "application/json",
      body: JSON.stringify({
        error: errorMessage,
        message: errorMessage,
      }),
    });
  });
}

/**
 * レート制限エラーをシミュレートする
 *
 * @param page - Playwrightのページオブジェクト
 */
export async function mockRateLimitError(page: Page) {
  await page.route("**/api/search**", async (route) => {
    await route.fulfill({
      status: 429,
      contentType: "application/json",
      headers: {
        "X-RateLimit-Limit": "60",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": new Date(Date.now() + 3600000).toISOString(),
        "Retry-After": "3600",
      },
      body: JSON.stringify({
        error: "Too Many Requests",
        message:
          "リクエスト数が制限を超えました。しばらくしてから再度お試しください。",
        retryAfter: 3600,
      }),
    });
  });
}
