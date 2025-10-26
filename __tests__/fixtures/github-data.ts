import type { GitHubRepo, GitHubSearchRepos } from "@/lib/types";

/**
 * テスト用のモックリポジトリデータ（React）
 */
export const mockReactRepo: GitHubRepo = {
  id: 10270250,
  full_name: "facebook/react",
  name: "react",
  owner: {
    login: "facebook",
    avatar_url: "https://example.com/avatar1.png",
    html_url: "https://github.com/facebook",
  },
  description: "The library for web and native user interfaces.",
  stargazers_count: 220000,
  language: "JavaScript",
  forks_count: 45000,
  open_issues_count: 1000,
  watchers_count: 7000,
  html_url: "https://github.com/facebook/react",
  created_at: "2013-05-24T16:15:54Z",
  updated_at: "2024-01-01T00:00:00Z",
  pushed_at: "2024-01-01T00:00:00Z",
};

/**
 * テスト用のモックリポジトリデータ（Vue）
 */
export const mockVueRepo: GitHubRepo = {
  id: 11730342,
  full_name: "vuejs/vue",
  name: "vue",
  owner: {
    login: "vuejs",
    avatar_url: "https://example.com/avatar2.png",
    html_url: "https://github.com/vuejs",
  },
  description: "The Progressive JavaScript Framework",
  stargazers_count: 150000,
  language: "TypeScript",
  forks_count: 30000,
  open_issues_count: 300,
  watchers_count: 5000,
  html_url: "https://github.com/vuejs/vue",
  created_at: "2013-07-29T03:24:51Z",
  updated_at: "2024-01-01T00:00:00Z",
  pushed_at: "2024-01-01T00:00:00Z",
};

/**
 * 複数のリポジトリを含むモックデータ
 */
export const mockMultipleRepos: GitHubSearchRepos = [
  mockReactRepo,
  mockVueRepo,
];

/**
 * GitHub Search API のレスポンス形式（複数リポジトリ）
 * 既存のmockReactRepoとmockVueRepoを再利用
 */
export const mockSearchResult = {
  total_count: 2,
  items: [mockReactRepo, mockVueRepo],
  incomplete_results: false,
};

/**
 * GitHub Repos API のレスポンス形式（リポジトリ詳細）
 */
export const mockRepoDetails = mockReactRepo;

/**
 * 言語が設定されていないリポジトリのモック（検索結果用）
 */
export const mockRepoWithoutLanguage = {
  ...mockReactRepo,
  language: null,
  score: 1.0,
};

/**
 * APIレスポンスのファクトリー関数
 * 総件数を指定してカスタマイズ可能
 */
export const createMockSearchResponse = (
  totalCount: number,
  items: GitHubSearchRepos = mockMultipleRepos
) => ({
  items,
  total_count: totalCount,
  incomplete_results: false,
});
