import { searchRepos } from "@/lib/github";
import { NextResponse } from "next/server";

/**
 * GitHubリポジトリを検索するAPIルート
 * クライアントからのリクエストを受け取り、サーバーサイドで安全にGitHub APIを呼び出す
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const page = searchParams.get("page");
  const pageNum = page ? parseInt(page, 10) : 1;

  // クエリがない場合はエラー
  if (!q) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    // サーバーサイドでGitHub APIを呼び出す
    const results = await searchRepos(q, pageNum);
    return NextResponse.json(results);
  } catch (error) {
    // エラーハンドリング
    console.error("GitHub API request failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: "GitHubリポジトリの検索に失敗しました。",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
