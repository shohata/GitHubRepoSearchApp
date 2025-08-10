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
    return NextResponse.json(
      {
        error: "リポジトリの検索中にサーバーでエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
