import {
  type GitHubRepo,
  type GitHubSearchRepoResult,
  toGitHubRepo,
  toGitHubSearchRepoResult,
} from "@/lib/types";
import { ITEMS_PER_PAGE } from "./config";
import { handleGitHubError } from "./errors";
import { getOctokitClient } from "./octokit-client";

/**
 * GitHub API を呼び出してリポジトリ情報を取得
 *
 * @param owner - リポジトリのオーナー名
 * @param repo - リポジトリ名
 * @returns {Promise<GitHubRepo>} リポジトリの詳細情報
 * @throws {GitHubAPIError} API呼び出しに失敗した場合
 */
async function getRepo(owner: string, repo: string): Promise<GitHubRepo> {
  try {
    const octokit = getOctokitClient();
    const res = await octokit.rest.repos.get({ owner, repo });
    // 生のAPIレスポンスをアプリケーション型に変換
    return toGitHubRepo(res.data);
  } catch (error) {
    handleGitHubError(error, "repo");
  }
}

/**
 * GitHub API を呼び出してリポジトリを検索
 *
 * @param query - 検索クエリ
 * @param page - ページ番号 (1始まり)
 * @returns {Promise<GitHubSearchRepoResult>} 検索結果
 * @throws {GitHubAPIError} API呼び出しに失敗した場合
 */
async function searchRepos(
  query: string,
  page: number
): Promise<GitHubSearchRepoResult> {
  try {
    const octokit = getOctokitClient();
    const res = await octokit.rest.search.repos({
      q: query,
      page,
      per_page: ITEMS_PER_PAGE,
    });
    // 生のAPIレスポンスをアプリケーション型に変換
    return toGitHubSearchRepoResult(res.data);
  } catch (error) {
    handleGitHubError(error, "search");
  }
}

export { getRepo, searchRepos };
