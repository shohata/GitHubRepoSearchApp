import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

// GitHub API で取得したリポジトリの情報
type GitHubRepo = RestEndpointMethodTypes["repos"]["get"]["response"]["data"];

// GitHub API で検索したレポジトリの一覧
type GitHubRepoSearchResult =
  RestEndpointMethodTypes["search"]["repos"]["response"]["data"];
type GitHubRepoSearchResultItems =
  RestEndpointMethodTypes["search"]["repos"]["response"]["data"]["items"];

export type { GitHubRepo, GitHubRepoSearchResult, GitHubRepoSearchResultItems };
