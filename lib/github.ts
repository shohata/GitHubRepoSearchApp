"use server";

import { Octokit } from "octokit";
import { Repository, RepositorySearchResult } from "@/lib/types";
import { ITEMS_PER_PAGE } from "./config";

// GitHub API をサーバコンポーネントで呼び出しレポジトリ情報を取得
async function FetchRepo(owner: string, repo: string): Promise<Repository> {
  const octokit = new Octokit();
  const res = await octokit.request("GET /repos/{owner}/{repo}", {
    owner: owner,
    repo: repo,
  });

  return res.data;
}

// GitHub API をサーバーコンポーネントで呼び出し検索結果を取得
async function FetchRepoSearchResult(
  query: string,
  page: number
): Promise<RepositorySearchResult> {
  const octokit = new Octokit();
  const res = await octokit.request("GET /search/repositories", {
    q: query,
    page: page,
    per_page: ITEMS_PER_PAGE,
  });

  return res.data;
}

export { FetchRepo, FetchRepoSearchResult };
