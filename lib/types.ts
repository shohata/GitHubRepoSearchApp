import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import type { LucideIcon } from "lucide-react";

/**
 * GitHub API で取得したリポジトリの詳細情報
 */
export type GitHubRepo =
  RestEndpointMethodTypes["repos"]["get"]["response"]["data"];

/**
 * GitHub API で検索したリポジトリの検索結果
 */
export type GitHubSearchRepoResult =
  RestEndpointMethodTypes["search"]["repos"]["response"]["data"];

/**
 * GitHub API で検索したリポジトリのアイテムリスト
 */
export type GitHubSearchRepos = GitHubSearchRepoResult["items"];

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
