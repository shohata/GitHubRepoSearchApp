import { Endpoints } from "@octokit/types";

// GitHub API で取得したリポジトリの情報
type Repository = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];

// GitHub API で検索したレポジトリの一覧
type RepositorySearchResult =
  Endpoints["GET /search/repositories"]["response"]["data"];
type RepositorySearchResultItems =
  Endpoints["GET /search/repositories"]["response"]["data"]["items"];

export type { Repository, RepositorySearchResult, RepositorySearchResultItems };
