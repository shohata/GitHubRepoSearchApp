import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

// GitHub API で取得したリポジトリの情報
type GitHubRepo = RestEndpointMethodTypes["repos"]["get"]["response"]["data"];

// GitHub API で検索したレポジトリの一覧
type GitHubSearchRepoResult =
  RestEndpointMethodTypes["search"]["repos"]["response"]["data"];
type GitHubSearchRepos = GitHubSearchRepoResult["items"];

type SearchParams = {
  q?: string;
  page?: string;
};

export type {
  GitHubRepo,
  GitHubSearchRepoResult,
  GitHubSearchRepos,
  SearchParams,
};
