import { render, screen } from "@testing-library/react";
import { SearchResults } from "@/components/features/search/search-results";
import { useSearchResults } from "@/components/features/search/use-search-results";
import type { GitHubSearchRepos } from "@/lib/types";

// useSearchResultsフックをモック
jest.mock("@/components/features/search/use-search-results");

// Next.jsのImageとLinkをモック
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className: string;
  }) => {
    return <img {...props} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  },
}));

describe("SearchResults", () => {
  const mockRepos: GitHubSearchRepos = [
    {
      id: 1,
      name: "react",
      full_name: "facebook/react",
      owner: {
        login: "facebook",
        avatar_url: "https://example.com/avatar1.png",
      },
      language: "JavaScript",
      html_url: "https://github.com/facebook/react",
      description: "A declarative, efficient, and flexible JavaScript library",
      stargazers_count: 200000,
      forks_count: 40000,
      open_issues_count: 500,
      created_at: "2013-05-24T16:15:54Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("エラー時にエラーメッセージが表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 1,
      error: new Error("API Error"),
      isLoading: false,
      repos: [],
      totalCount: 0,
      totalPage: 0,
      pagination: [],
    });

    render(<SearchResults />);

    expect(
      screen.getByText("リポジトリの検索に失敗しました。")
    ).toBeInTheDocument();
  });

  test("クエリがない場合、初期メッセージが表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "",
      page: 1,
      error: null,
      isLoading: false,
      repos: [],
      totalCount: 0,
      totalPage: 0,
      pagination: [],
    });

    render(<SearchResults />);

    expect(
      screen.getByText("リポジトリを検索して、結果をここに表示します。")
    ).toBeInTheDocument();
  });

  test("ローディング中にスピナーが表示される", () => {
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

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("検索結果がない場合、適切なメッセージが表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "nonexistent-repo-xyz",
      page: 1,
      error: null,
      isLoading: false,
      repos: [],
      totalCount: 0,
      totalPage: 0,
      pagination: [],
    });

    render(<SearchResults />);

    expect(
      screen.getByText(/に一致するリポジトリが見つかりませんでした。/)
    ).toBeInTheDocument();
  });

  test("検索結果が表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 1,
      error: null,
      isLoading: false,
      repos: mockRepos,
      totalCount: 1,
      totalPage: 1,
      pagination: [{ type: "page", pageNumber: 1, isActive: true }],
    });

    render(<SearchResults />);

    expect(screen.getByText("検索結果: 1件")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
  });

  test("検索結果が1000件を超える場合、警告メッセージが表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 1,
      error: null,
      isLoading: false,
      repos: mockRepos,
      totalCount: 1500,
      totalPage: 50,
      pagination: [{ type: "page", pageNumber: 1, isActive: true }],
    });

    render(<SearchResults />);

    expect(
      screen.getByText(
        /検索結果が多数あります。APIの仕様により、最初の1,000件のみ表示しています。/
      )
    ).toBeInTheDocument();
  });

  test("ページネーションが正しく表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 2,
      error: null,
      isLoading: false,
      repos: mockRepos,
      totalCount: 100,
      totalPage: 4,
      pagination: [
        { type: "page", pageNumber: 1, isActive: false },
        { type: "page", pageNumber: 2, isActive: true },
        { type: "page", pageNumber: 3, isActive: false },
        { type: "page", pageNumber: 4, isActive: false },
      ],
    });

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
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 1,
      error: null,
      isLoading: false,
      repos: mockRepos,
      totalCount: 100,
      totalPage: 4,
      pagination: [
        { type: "page", pageNumber: 1, isActive: true },
        { type: "page", pageNumber: 2, isActive: false },
      ],
    });

    render(<SearchResults />);

    // 前へリンクが表示されないことを確認
    const previousLink = screen.queryByText(/previous/i);
    expect(previousLink).not.toBeInTheDocument();
  });

  test("最後のページでは次へリンクが表示されない", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 4,
      error: null,
      isLoading: false,
      repos: mockRepos,
      totalCount: 100,
      totalPage: 4,
      pagination: [
        { type: "page", pageNumber: 3, isActive: false },
        { type: "page", pageNumber: 4, isActive: true },
      ],
    });

    render(<SearchResults />);

    // 次へリンクが表示されないことを確認
    const nextLink = screen.queryByText(/next/i);
    expect(nextLink).not.toBeInTheDocument();
  });

  test("省略記号が正しく表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 5,
      error: null,
      isLoading: false,
      repos: mockRepos,
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
    });

    render(<SearchResults />);

    // 省略記号が表示されることを確認（MoreHorizontalIconとして表示される）
    const ellipsis = screen.getAllByText("More pages");
    expect(ellipsis.length).toBe(2); // start と end の2つ
  });

  test("複数のリポジトリが正しく表示される", () => {
    const multipleRepos = [
      ...mockRepos,
      {
        id: 2,
        name: "vue",
        full_name: "vuejs/vue",
        owner: {
          login: "vuejs",
          avatar_url: "https://example.com/avatar2.png",
        },
        language: "TypeScript",
        html_url: "https://github.com/vuejs/vue",
        description: "The Progressive JavaScript Framework",
        stargazers_count: 150000,
        forks_count: 30000,
        open_issues_count: 300,
        created_at: "2013-07-29T03:24:51Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];

    (useSearchResults as jest.Mock).mockReturnValue({
      query: "javascript",
      page: 1,
      error: null,
      isLoading: false,
      repos: multipleRepos,
      totalCount: 2,
      totalPage: 1,
      pagination: [{ type: "page", pageNumber: 1, isActive: true }],
    });

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
      repos: mockRepos,
      totalCount: 1,
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
      repos: mockRepos,
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
      repos: mockRepos,
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

  test("1000件超の警告がrole=alertで表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "javascript",
      page: 1,
      error: null,
      isLoading: false,
      repos: mockRepos,
      totalCount: 2000,
      totalPage: 67,
      pagination: [{ type: "page", pageNumber: 1, isActive: true }],
    });

    const { container } = render(<SearchResults />);

    // role="alert"の要素が存在することを確認
    const alertElement = container.querySelector('[role="alert"]');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveTextContent(
      /検索結果が多数あります。APIの仕様により、最初の1,000件のみ表示しています。/
    );
  });

  test("中間ページで前へと次へのリンクが両方表示される", () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      query: "react",
      page: 3,
      error: null,
      isLoading: false,
      repos: mockRepos,
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
