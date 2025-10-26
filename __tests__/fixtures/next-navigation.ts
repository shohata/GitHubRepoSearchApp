/**
 * Next.js navigation モジュールのモックヘルパー
 * テストで useRouter と useSearchParams をモックする際に使用
 */

/**
 * useRouter のモック関数を作成
 */
export const createMockRouter = () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockBack = jest.fn();
  const mockForward = jest.fn();
  const mockRefresh = jest.fn();
  const mockPrefetch = jest.fn();

  return {
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
    prefetch: mockPrefetch,
    // ヘルパー: モック関数をリセット
    clearAllMocks: () => {
      mockPush.mockClear();
      mockReplace.mockClear();
      mockBack.mockClear();
      mockForward.mockClear();
      mockRefresh.mockClear();
      mockPrefetch.mockClear();
    },
  };
};

/**
 * useSearchParams のモック関数を作成
 */
export const createMockSearchParams = (
  params: Record<string, string | null> = {}
) => {
  const mockGet = jest.fn((key: string) => params[key] ?? null);
  const mockGetAll = jest.fn((key: string) => {
    const value = params[key];
    return value ? [value] : [];
  });
  const mockHas = jest.fn((key: string) => key in params);

  return {
    get: mockGet,
    getAll: mockGetAll,
    has: mockHas,
    // ヘルパー: モック関数をリセット
    clearAllMocks: () => {
      mockGet.mockClear();
      mockGetAll.mockClear();
      mockHas.mockClear();
    },
    // ヘルパー: パラメータを更新
    updateParams: (newParams: Record<string, string | null>) => {
      Object.assign(params, newParams);
    },
  };
};

/**
 * Next.js navigation モジュール全体をモック
 *
 * @example
 * ```typescript
 * jest.mock("next/navigation", () => ({
 *   useRouter: jest.fn(),
 *   useSearchParams: jest.fn(),
 * }));
 *
 * const { router, searchParams } = setupNavigationMocks({
 *   searchParams: { q: "react" }
 * });
 * ```
 */
export const setupNavigationMocks = (
  options: { searchParams?: Record<string, string | null> } = {}
) => {
  const router = createMockRouter();
  const searchParams = createMockSearchParams(options.searchParams);

  return {
    router,
    searchParams,
    // ヘルパー: すべてのモック関数をリセット
    clearAllMocks: () => {
      router.clearAllMocks();
      searchParams.clearAllMocks();
    },
  };
};
