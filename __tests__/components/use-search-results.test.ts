import { renderHook } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { mockSimpleSearchResponse } from "@/__tests__/fixtures/github-data";
import { useSearchResults } from "@/components/features/search/use-search-results";

// Next.jsのnavigationモジュールをモック
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

// SWRをモック
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// paginationモジュールをモック
jest.mock("@/lib/pagination", () => ({
  generatePagination: jest.fn((current, total) => {
    if (total === 0) return [];
    return [
      { type: "page", pageNumber: 1, isActive: current === 1 },
      { type: "page", pageNumber: 2, isActive: current === 2 },
    ];
  }),
}));

import useSWR from "swr";

describe("useSearchResults", () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("クエリがない場合、空の状態を返す", () => {
    mockGet.mockReturnValue(null);
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(result.current.query).toBe("");
    expect(result.current.page).toBe(1);
    expect(result.current.repos).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it("クエリがある場合、APIを呼び出す", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "react";
      if (key === "page") return "1";
      return null;
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(useSWR).toHaveBeenCalledWith(
      "/api/search?q=react&page=1",
      expect.any(Function),
      expect.any(Object)
    );
    expect(result.current.query).toBe("react");
    expect(result.current.isLoading).toBe(true);
  });

  it("データ取得成功時、リポジトリ情報を返す", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "typescript";
      if (key === "page") return "2";
      return null;
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: mockSimpleSearchResponse,
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(result.current.repos).toEqual(mockSimpleSearchResponse.items);
    expect(result.current.totalCount).toBe(100);
    expect(result.current.query).toBe("typescript");
    expect(result.current.page).toBe(2);
  });

  it("総ページ数を正しく計算する", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "test";
      return null;
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: { items: [], total_count: 144 }, // 144 / 12 = 12 pages
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(result.current.totalPage).toBe(12);
  });

  it("総件数が1000件を超える場合、1000件に制限する", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "popular";
      return null;
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: { items: [], total_count: 5000 },
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    // 1000 / 12 = 83.33... => 84 pages
    expect(result.current.totalPage).toBe(84);
  });

  it("エラー発生時、エラー状態を返す", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "error-query";
      return null;
    });

    const mockError = new Error("API Error");

    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(result.current.error).toBe("API Error");
    expect(result.current.repos).toEqual([]);
  });

  it("ページネーション情報を生成する", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "test";
      if (key === "page") return "5";
      return null;
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: { items: [], total_count: 1000 },
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(result.current.pagination).toEqual([
      { type: "page", pageNumber: 1, isActive: false },
      { type: "page", pageNumber: 2, isActive: false },
    ]);
  });

  it("クエリがnullの場合、APIを呼び出さない", () => {
    mockGet.mockReturnValue(null);

    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
    });

    renderHook(() => useSearchResults());

    expect(useSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("ページ番号が文字列として渡された場合、数値に変換する", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "test";
      if (key === "page") return "3";
      return null;
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: { items: [], total_count: 100 },
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(result.current.page).toBe(3);
    expect(typeof result.current.page).toBe("number");
  });

  it("ページ番号が不正な場合、1にフォールバックする", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "test";
      if (key === "page") return null;
      return null;
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: { items: [], total_count: 100 },
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(result.current.page).toBe(1);
  });

  it("totalCountが0の場合、totalPageも0になる", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "test";
      return null;
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: { items: [], total_count: 0 },
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalPage).toBe(0);
  });

  it("エラーオブジェクトにメッセージが含まれる", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "error-query";
      return null;
    });

    const mockError = new Error("API rate limit exceeded");

    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(result.current.error).toBe("API rate limit exceeded");
  });

  it("SWRのオプションが正しく設定される", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "q") return "test";
      return null;
    });

    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
    });

    renderHook(() => useSearchResults());

    expect(useSWR).toHaveBeenCalledWith(
      "/api/search?q=test&page=1",
      expect.any(Function),
      {
        revalidateOnFocus: false,
        dedupingInterval: 5000,
      }
    );
  });
});
