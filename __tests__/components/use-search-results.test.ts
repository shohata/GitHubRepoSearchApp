import { renderHook, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
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

    const mockData = {
      items: [
        { id: 1, name: "repo1", owner: { login: "user1" } },
        { id: 2, name: "repo2", owner: { login: "user2" } },
      ],
      total_count: 100,
    };

    (useSWR as jest.Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchResults());

    expect(result.current.repos).toEqual(mockData.items);
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

    expect(result.current.error).toBe(mockError);
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

    expect(useSWR).toHaveBeenCalledWith(null, expect.any(Function), expect.any(Object));
  });
});
