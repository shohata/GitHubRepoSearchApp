import type { GitHubRepo, GitHubSearchRepos } from "@/lib/types";

/**
 * テスト用のモックリポジトリデータ（React）
 */
const mockReactRepo: GitHubRepo = {
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
const mockVueRepo: GitHubRepo = {
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
 */
export const mockSearchResult = {
  total_count: 2,
  items: [
    {
      id: mockReactRepo.id,
      full_name: mockReactRepo.full_name,
      name: mockReactRepo.name,
      owner: mockReactRepo.owner,
      description: mockReactRepo.description,
      stargazers_count: mockReactRepo.stargazers_count,
      language: mockReactRepo.language,
      forks_count: mockReactRepo.forks_count,
      open_issues_count: mockReactRepo.open_issues_count,
      watchers_count: mockReactRepo.watchers_count,
    },
    {
      id: mockVueRepo.id,
      full_name: mockVueRepo.full_name,
      name: mockVueRepo.name,
      owner: mockVueRepo.owner,
      description: mockVueRepo.description,
      stargazers_count: mockVueRepo.stargazers_count,
      language: mockVueRepo.language,
      forks_count: mockVueRepo.forks_count,
      open_issues_count: mockVueRepo.open_issues_count,
      watchers_count: mockVueRepo.watchers_count,
    },
  ],
  incomplete_results: false,
};

/**
 * GitHub Repos API のレスポンス形式（リポジトリ詳細）
 */
export const mockRepoDetails = mockReactRepo;

/**
 * 個別のリポジトリをエクスポート（テストで個別に使用する場合）
 */
export const mockReactRepo_exported = mockReactRepo;
export const mockVueRepo_exported = mockVueRepo;

/**
 * useSearchResults テスト用の簡易APIレスポンスモック
 * 使用例: __tests__/components/use-search-results.test.ts
 * 既存のmockReactRepoとmockVueRepoを再利用
 */
export const mockSimpleSearchResponse = {
  items: [mockReactRepo, mockVueRepo],
  total_count: 100,
  incomplete_results: false,
};

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
