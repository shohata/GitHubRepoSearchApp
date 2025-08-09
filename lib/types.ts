import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

// GitHub API で取得したリポジトリの情報
type GitHubRepo = RestEndpointMethodTypes["repos"]["get"]["response"]["data"];

// GitHub API で検索したレポジトリの一覧
type GitHubSearchRepoResult =
  RestEndpointMethodTypes["search"]["repos"]["response"]["data"];
type GitHubSearchRepoResultItems =
  RestEndpointMethodTypes["search"]["repos"]["response"]["data"]["items"];

export type { GitHubRepo, GitHubSearchRepoResult, GitHubSearchRepoResultItems };
