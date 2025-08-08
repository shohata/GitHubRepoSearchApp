"use server";

import { Octokit } from "octokit";
import { GitHubRepo, GitHubRepoSearchResult } from "@/lib/types";
import { ITEMS_PER_PAGE } from "./config";
import { GITHUB_ACCESS_TOKEN } from "./env";

// GitHub API をサーバコンポーネントで呼び出しレポジトリ情報を取得
async function FetchRepo(owner: string, repo: string): Promise<GitHubRepo> {
  const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });
  const res = await octokit.rest.repos.get({ owner: owner, repo: repo });

  return res.data;
}

// GitHub API をサーバーコンポーネントで呼び出し検索結果を取得
async function FetchRepoSearchResult(
  query: string,
  page: number
): Promise<GitHubRepoSearchResult> {
  const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });
  const res = await octokit.rest.search.repos({
    q: query,
    page: page,
    per_page: ITEMS_PER_PAGE,
  });

  return res.data;
}

export { FetchRepo, FetchRepoSearchResult };
