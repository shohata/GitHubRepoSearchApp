import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { GitHubAPIError } from "@/lib/errors";
import { searchRepos } from "@/lib/github";
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
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const page = searchParams.get("page");

    // バリデーション
    const validatedParams = searchParamsSchema.parse({ q, page });

    // サーバーサイドでGitHub APIを呼び出す
    const results = await searchRepos(validatedParams.q, validatedParams.page);

    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    // Zodバリデーションエラー
    if (error instanceof ZodError) {
      const issues = error.issues;
      const firstIssue = issues[0];
      return NextResponse.json(
        {
          error: "Validation Error",
          message: firstIssue?.message || "Invalid request parameters",
          field: firstIssue?.path.join("."),
        },
        { status: 400 }
      );
    }

    // GitHub APIエラー
    if (error instanceof GitHubAPIError) {
      console.error("GitHub API Error:", error.message, error.statusCode);
      return NextResponse.json(
        {
          error: "GitHub API Error",
          message: error.message,
        },
        { status: error.statusCode || 500 }
      );
    }

    // 予期しないエラー
    console.error("Unexpected API error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "リポジトリの検索中にサーバーでエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
