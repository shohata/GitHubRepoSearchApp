"use server";

import { Octokit } from "octokit";
import { z } from "zod";
import { Repository, RepositorySearchResult } from "@/lib/types";
import { ITEMS_PER_PAGE } from "./config";

// 環境変数のスキーマを定義
const envSchema = z.object({
  GITHUB_ACCESS_TOKEN: z.string().min(1, "GITHUB_ACCESS_TOKEN is required"),
});

// 環境変数をパース（検証）
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error("Invalid environment variables.");
}

const GITHUB_ACCESS_TOKEN = parsedEnv.data.GITHUB_ACCESS_TOKEN;

// GitHub API をサーバコンポーネントで呼び出しレポジトリ情報を取得
async function FetchRepo(owner: string, repo: string): Promise<Repository> {
  const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });
  const res = await octokit.rest.repos.get({ owner: owner, repo: repo });

  return res.data;
}

// GitHub API をサーバーコンポーネントで呼び出し検索結果を取得
async function FetchRepoSearchResult(
  query: string,
  page: number
): Promise<RepositorySearchResult> {
  const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });
  const res = await octokit.rest.search.repos({
    q: query,
    page: page,
    per_page: ITEMS_PER_PAGE,
  });

  return res.data;
}

export { FetchRepo, FetchRepoSearchResult };
