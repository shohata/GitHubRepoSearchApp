import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

// GitHub API で取得したリポジトリの情報
type Repository = RestEndpointMethodTypes["repos"]["get"]["response"]["data"];

// GitHub API で検索したレポジトリの一覧
type RepositorySearchResult =
  RestEndpointMethodTypes["search"]["repos"]["response"]["data"];
type RepositorySearchResultItems =
  RestEndpointMethodTypes["search"]["repos"]["response"]["data"]["items"];

export type { Repository, RepositorySearchResult, RepositorySearchResultItems };
