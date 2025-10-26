import { render, screen } from "@testing-library/react";
import { SearchResults } from "@/components/features/search/search-results";
import { useSearchResults } from "@/components/features/search/use-search-results";

// Import shared mock data
import { mockMultipleRepos } from "@/__tests__/__mocks__/github-data";
import {
  createSearchResultsMock,
  searchResultsPresets,
} from "@/__tests__/__mocks__/search-results-mocks";

// useSearchResultsフックをモック
jest.mock("@/components/features/search/use-search-results");

// Next.jsのImageとLinkをモック（自動的に __mocks__/next/ が使用される）
jest.mock("next/image");
jest.mock("next/link");

describe("SearchResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("クエリがない場合、初期メッセージが表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue(
      searchResultsPresets.initial
    );

    render(<SearchResults />);

    expect(
      screen.getByText("リポジトリを検索して、結果をここに表示します。")
    ).toBeInTheDocument();
  });

  test("検索結果がない場合、適切なメッセージが表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue(
      searchResultsPresets.noResults
    );

    render(<SearchResults />);

    expect(
      screen.getByText(/に一致するリポジトリが見つかりませんでした。/)
    ).toBeInTheDocument();
  });

  test("検索結果が1000件を超える場合、警告メッセージが表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue(
      searchResultsPresets.overLimit(mockMultipleRepos)
    );

    render(<SearchResults />);

    expect(
      screen.getByText(
        /検索結果が多数あります。APIの仕様により、最初の1,000件のみ表示しています。/
      )
    ).toBeInTheDocument();
  });

  test("ページネーションが正しく表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue(
      searchResultsPresets.withPagination(2, 4, mockMultipleRepos)
    );

    render(<SearchResults />);

    // ページ番号リンクが表示される
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    // 前へ/次へリンクが表示される
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  test("最初のページでは前へリンクが表示されない", () => {
    (useSearchResults as jest.Mock).mockReturnValue(
      searchResultsPresets.withPagination(1, 4, mockMultipleRepos)
    );

    render(<SearchResults />);

    // 前へリンクが表示されないことを確認
    const previousLink = screen.queryByText(/previous/i);
    expect(previousLink).not.toBeInTheDocument();
  });

  test("最後のページでは次へリンクが表示されない", () => {
    (useSearchResults as jest.Mock).mockReturnValue(
      searchResultsPresets.withPagination(4, 4, mockMultipleRepos)
    );

    render(<SearchResults />);

    // 次へリンクが表示されないことを確認
    const nextLink = screen.queryByText(/next/i);
    expect(nextLink).not.toBeInTheDocument();
  });

  test("省略記号が正しく表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue(
      createSearchResultsMock({
        query: "react",
        page: 5,
        repos: mockMultipleRepos,
        totalCount: 300,
        totalPage: 10,
        pagination: [
          { type: "page", pageNumber: 1, isActive: false },
          { type: "ellipsis", id: "start" },
          { type: "page", pageNumber: 4, isActive: false },
          { type: "page", pageNumber: 5, isActive: true },
          { type: "page", pageNumber: 6, isActive: false },
          { type: "ellipsis", id: "end" },
          { type: "page", pageNumber: 10, isActive: false },
        ],
      })
    );

    render(<SearchResults />);

    // 省略記号が表示されることを確認（MoreHorizontalIconとして表示される）
    const ellipsis = screen.getAllByText("More pages");
    expect(ellipsis.length).toBe(2); // start と end の2つ
  });

  test("複数のリポジトリが正しく表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue(
      createSearchResultsMock({
        query: "javascript",
        repos: mockMultipleRepos,
        totalCount: 2,
        totalPage: 1,
        pagination: [{ type: "page", pageNumber: 1, isActive: true }],
      })
    );

    render(<SearchResults />);

    expect(screen.getByText("検索結果: 2件")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("vue")).toBeInTheDocument();
  });

  test("検索結果のアクセシビリティ属性が正しく設定される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 1,
      error: null,
      isLoading: false,
      repos: mockMultipleRepos,
      totalCount: 2,
      totalPage: 1,
      pagination: [{ type: "page", pageNumber: 1, isActive: true }],
    });

    const { container } = render(<SearchResults />);

    // aria-live属性の確認
    const statusElements = container.querySelectorAll('[aria-live="polite"]');
    expect(statusElements.length).toBeGreaterThan(0);
  });

  test("ページネーションリンクのURLが正しく生成される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react framework",
      page: 2,
      error: null,
      isLoading: false,
      repos: mockMultipleRepos,
      totalCount: 100,
      totalPage: 4,
      pagination: [
        { type: "page", pageNumber: 1, isActive: false },
        { type: "page", pageNumber: 2, isActive: true },
        { type: "page", pageNumber: 3, isActive: false },
      ],
    });

    render(<SearchResults />);

    // ページ1へのリンク
    const page1Link = screen.getByRole("link", { name: "1" });
    expect(page1Link).toHaveAttribute("href", "/?q=react framework&page=1");

    // ページ3へのリンク
    const page3Link = screen.getByRole("link", { name: "3" });
    expect(page3Link).toHaveAttribute("href", "/?q=react framework&page=3");
  });

  test("検索結果が大きな数値でも正しくフォーマットされる", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "javascript",
      page: 1,
      error: null,
      isLoading: false,
      repos: mockMultipleRepos,
      totalCount: 123456,
      totalPage: 1,
      pagination: [{ type: "page", pageNumber: 1, isActive: true }],
    });

    render(<SearchResults />);

    // toLocaleString()により、カンマ区切りで表示される
    expect(screen.getByText("検索結果: 123,456件")).toBeInTheDocument();
  });

  test("ローディング状態でスクリーンリーダー用のテキストが提供される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 1,
      error: null,
      isLoading: true,
      repos: [],
      totalCount: 0,
      totalPage: 0,
      pagination: [],
    });

    render(<SearchResults />);

    // スクリーンリーダー用の非表示テキスト
    expect(screen.getByText("検索中...")).toBeInTheDocument();
  });

  test("エラー時のアクセシビリティが適切に設定される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 1,
      error: new Error("Network Error"),
      isLoading: false,
      repos: [],
      totalCount: 0,
      totalPage: 0,
      pagination: [],
    });

    render(<SearchResults />);

    // ErrorDisplayコンポーネントが表示される
    expect(
      screen.getByText("リポジトリの検索に失敗しました。")
    ).toBeInTheDocument();
  });

  test("中間ページで前へと次へのリンクが両方表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 3,
      error: null,
      isLoading: false,
      repos: mockMultipleRepos,
      totalCount: 150,
      totalPage: 5,
      pagination: [
        { type: "page", pageNumber: 2, isActive: false },
        { type: "page", pageNumber: 3, isActive: true },
        { type: "page", pageNumber: 4, isActive: false },
      ],
    });

    render(<SearchResults />);

    // 前へリンク
    const prevLink = screen.getByRole("link", { name: /previous/i });
    expect(prevLink).toHaveAttribute("href", "/?q=react&page=2");

    // 次へリンク
    const nextLink = screen.getByRole("link", { name: /next/i });
    expect(nextLink).toHaveAttribute("href", "/?q=react&page=4");
  });
});
