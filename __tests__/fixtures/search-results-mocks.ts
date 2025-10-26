import type { PaginationItem } from "@/lib/pagination";
import type { GitHubSearchRepos } from "@/lib/types";

/**
 * useSearchResults フック用のモック戻り値の型定義
 */
export interface SearchResultsState {
  query: string;
  page: number;
  error: Error | null;
  isLoading: boolean;
  repos: GitHubSearchRepos;
  totalCount: number;
  totalPage: number;
  pagination: PaginationItem[];
}

/**
 * useSearchResults フック用のモックファクトリー
 * デフォルト値を持ち、必要な部分だけ上書きできる
 *
 * @example
 * const mockState = createSearchResultsMock({
 *   query: "react",
 *   repos: mockMultipleRepos,
 *   totalCount: 2,
 * });
 */
export const createSearchResultsMock = (
  overrides?: Partial<SearchResultsState>
): SearchResultsState => ({
  query: "",
  page: 1,
  error: null,
  isLoading: false,
  repos: [],
  totalCount: 0,
  totalPage: 0,
  pagination: [],
  ...overrides,
});

/**
 * よく使われるモックパターンのプリセット
 */
export const searchResultsPresets = {
  /** 初期状態（クエリなし） */
  initial: createSearchResultsMock(),

  /** ローディング中 */
  loading: createSearchResultsMock({
    query: "react",
    isLoading: true,
  }),

  /** 検索結果なし */
  noResults: createSearchResultsMock({
    query: "nonexistent-repo-xyz",
    repos: [],
    totalCount: 0,
  }),

  /** エラー状態 */
  error: createSearchResultsMock({
    query: "react",
    error: new Error("Network Error"),
  }),

  /** 1000件超えの警告が必要な状態 */
  overLimit: (repos: GitHubSearchRepos) =>
    createSearchResultsMock({
      query: "react",
      repos,
      totalCount: 1500,
      totalPage: 50,
      pagination: [{ type: "page", pageNumber: 1, isActive: true }],
    }),

  /** 基本的なページネーション状態 */
  withPagination: (page: number, totalPage: number, repos: GitHubSearchRepos) =>
    createSearchResultsMock({
      query: "react",
      page,
      repos,
      totalCount: totalPage * 12,
      totalPage,
      pagination: Array.from({ length: totalPage }, (_, i) => ({
        type: "page" as const,
        pageNumber: i + 1,
        isActive: i + 1 === page,
      })),
    }),
};
