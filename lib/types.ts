import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import type { LucideIcon } from "lucide-react";

/**
 * GitHub API の生のレスポンス型（内部使用）
 * @internal
 */
type RawGitHubRepo =
  RestEndpointMethodTypes["repos"]["get"]["response"]["data"];

/**
 * GitHub API の生の検索結果型（内部使用）
 * @internal
 */
type RawGitHubSearchRepoResult =
  RestEndpointMethodTypes["search"]["repos"]["response"]["data"];

/**
 * アプリケーションで使用するリポジトリオーナー情報
 */
export type RepoOwner = {
  login: string;
  avatar_url: string;
  html_url?: string;
};

/**
 * アプリケーションで使用するリポジトリの詳細情報
 * 必要なフィールドのみを定義し、API変更時の影響を最小化
 */
export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  owner: RepoOwner;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
};

/**
 * GitHub API で検索したリポジトリの検索結果
 * 生のAPI型を再エクスポート（検索結果の構造はそのまま使用）
 */
export type GitHubSearchRepoResult = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
};

/**
 * GitHub API で検索したリポジトリのアイテムリスト
 */
export type GitHubSearchRepos = GitHubRepo[];

/**
 * 型アサーションヘルパー: 生のAPI型からアプリケーション型へ変換
 * @param raw - GitHub APIの生のレスポンス
 * @returns アプリケーション用の型付きデータ
 */
export function toGitHubRepo(raw: RawGitHubRepo): GitHubRepo {
  return {
    id: raw.id,
    name: raw.name,
    full_name: raw.full_name,
    description: raw.description,
    owner: {
      login: raw.owner.login,
      avatar_url: raw.owner.avatar_url,
      html_url: raw.owner.html_url,
    },
    html_url: raw.html_url,
    stargazers_count: raw.stargazers_count,
    watchers_count: raw.watchers_count,
    forks_count: raw.forks_count,
    open_issues_count: raw.open_issues_count,
    language: raw.language,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    pushed_at: raw.pushed_at,
  };
}

/**
 * 型アサーションヘルパー: 生の検索結果からアプリケーション型へ変換
 * @param raw - GitHub APIの生の検索結果
 * @returns アプリケーション用の型付き検索結果
 */
export function toGitHubSearchRepoResult(
  raw: RawGitHubSearchRepoResult
): GitHubSearchRepoResult {
  return {
    total_count: raw.total_count,
    incomplete_results: raw.incomplete_results,
    items: raw.items.map((item) =>
      toGitHubRepo(item as unknown as RawGitHubRepo)
    ),
  };
}

/**
 * ページネーションアイテムの型定義
 */
export type PaginationItem =
  | { type: "page"; pageNumber: number; isActive?: boolean }
  | { type: "ellipsis"; id: string };

/**
 * リポジトリ統計カードのプロパティ
 */
export type RepoStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
};

/**
 * エラー表示コンポーネントのプロパティ
 */
export type ErrorDisplayProps = {
  message: string;
  title?: string;
};
