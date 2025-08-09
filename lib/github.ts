import { Octokit, RequestError } from "octokit";
import { GitHubRepo, GitHubSearchRepoResult } from "@/lib/types";
import { ITEMS_PER_PAGE } from "./config";

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

// GitHub API をサーバコンポーネントで呼び出しレポジトリ情報を取得
async function getRepo(owner: string, repo: string): Promise<GitHubRepo> {
  try {
    let octokit: Octokit;
    if (!GITHUB_ACCESS_TOKEN) {
      octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });
    } else {
      octokit = new Octokit();
    }
    const res = await octokit.rest.repos.get({ owner: owner, repo: repo });
    return res.data;
  } catch (error) {
    if (error instanceof RequestError) {
      if (error.status === 403) {
        console.error("GitHub API rate limit exceeded.", error.response);
        throw new Error(
          "APIの利用回数制限に達しました。しばらくしてから再度お試しください。"
        );
      }
      if (error.status === 404) {
        console.error("Repository not found.", error.response);
        throw new Error("指定されたリポジトリが見つかりませんでした。");
      }
      console.error(`GitHub API Error: ${error.status}`, error.response);
      throw new Error(
        `リポジトリ情報の取得に失敗しました。(Status: ${error.status})`
      );
    }
    // Handle unexpected errors
    console.error("An unexpected error occurred:", error);
    throw new Error("予期せぬエラーが発生しました。");
  }
}

// GitHub API をサーバーコンポーネントで呼び出し検索結果を取得
async function searchRepos(
  query: string,
  page: number
): Promise<GitHubSearchRepoResult> {
  try {
    let octokit: Octokit;
    if (!GITHUB_ACCESS_TOKEN) {
      octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });
    } else {
      octokit = new Octokit();
    }
    const res = await octokit.rest.search.repos({
      q: query,
      page: page,
      per_page: ITEMS_PER_PAGE,
    });
    return res.data;
  } catch (error) {
    if (error instanceof RequestError) {
      // Handle specific API errors
      if (error.status === 403) {
        console.error("GitHub API rate limit exceeded.", error.response);
        throw new Error(
          "APIの利用回数制限に達しました。しばらくしてから再度お試しください。"
        );
      }
      if (error.status === 422) {
        console.error("Validation failed.", error.response);
        throw new Error("検索クエリが無効です。検索条件を確認してください。");
      }
      console.error(`GitHub API Error: ${error.status}`, error.response);
      throw new Error(`データの取得に失敗しました。(Status: ${error.status})`);
    }
    // Handle unexpected errors
    console.error("An unexpected error occurred:", error);
    throw new Error("予期せぬエラーが発生しました。");
  }
}

export { getRepo, searchRepos };
