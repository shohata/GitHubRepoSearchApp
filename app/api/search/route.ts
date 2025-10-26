import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { env } from "@/lib/env";
import { GitHubAPIError } from "@/lib/errors";
import { searchRepos } from "@/lib/github";
import { apiRateLimiter } from "@/lib/rate-limit";
import { searchParamsSchema } from "@/lib/validations";

/**
 * GitHubリポジトリを検索するAPIルート
 * クライアントからのリクエストを受け取り、サーバーサイドで安全にGitHub APIを呼び出す
 *
 * @param request - HTTPリクエストオブジェクト
 * @returns JSON形式の検索結果またはエラーレスポンス
 */
export async function GET(request: Request) {
  try {
    // レート制限チェック
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    if (!apiRateLimiter.check(ip)) {
      const rateLimitInfo = apiRateLimiter.getInfo(ip);
      return NextResponse.json(
        {
          error: "Too Many Requests",
          message:
            "リクエスト数が制限を超えました。しばらくしてから再度お試しください。",
          retryAfter: rateLimitInfo
            ? Math.ceil((rateLimitInfo.reset - Date.now()) / 1000)
            : 60,
        },
        {
          status: 429,
          headers: rateLimitInfo
            ? {
                "X-RateLimit-Limit": rateLimitInfo.limit.toString(),
                "X-RateLimit-Remaining": rateLimitInfo.remaining.toString(),
                "X-RateLimit-Reset": new Date(
                  rateLimitInfo.reset
                ).toISOString(),
                "Retry-After": Math.ceil(
                  (rateLimitInfo.reset - Date.now()) / 1000
                ).toString(),
              }
            : {},
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const page = searchParams.get("page");

    // バリデーション
    const validatedParams = searchParamsSchema.parse({ q, page });

    // サーバーサイドでGitHub APIを呼び出す
    const results = await searchRepos(validatedParams.q, validatedParams.page);

    // 環境に応じたキャッシュ戦略
    const cacheControl =
      env.NODE_ENV === "production"
        ? "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
        : "no-store, must-revalidate";

    // レート制限情報を含むヘッダーを追加
    const rateLimitInfo = apiRateLimiter.getInfo(ip);
    const headers: Record<string, string> = {
      "Cache-Control": cacheControl,
    };

    if (rateLimitInfo) {
      headers["X-RateLimit-Limit"] = rateLimitInfo.limit.toString();
      headers["X-RateLimit-Remaining"] = rateLimitInfo.remaining.toString();
      headers["X-RateLimit-Reset"] = new Date(
        rateLimitInfo.reset
      ).toISOString();
    }

    return NextResponse.json(results, { headers });
  } catch (error) {
    // Zodバリデーションエラー
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue) => issue.message);
      return NextResponse.json(
        {
          error: "Validation Error",
          message: errorMessages.join(", "),
          details: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
            code: issue.code,
          })),
        },
        { status: 400 }
      );
    }

    // GitHub APIエラー
    if (error instanceof GitHubAPIError) {
      if (env.NODE_ENV !== "production") {
        console.error("GitHub API Error:", error.message, error.statusCode);
      }
      return NextResponse.json(
        {
          error: "GitHub API Error",
          message: error.message,
        },
        { status: error.statusCode || 500 }
      );
    }

    // 予期しないエラー
    if (env.NODE_ENV !== "production") {
      console.error("Unexpected API error:", error);
    }
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "リポジトリの検索中にサーバーでエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
