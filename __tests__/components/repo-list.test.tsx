import { render, screen } from "@testing-library/react";
import { RepoList } from "@/components/features/search/repo-list";
import type { GitHubSearchRepos } from "@/lib/types";

// Import shared mock data
import { mockMultipleRepos } from "@/__tests__/__mocks__/github-data";

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

describe("RepoList", () => {
  test("リポジトリのリストが正しく表示される", () => {
    render(<RepoList repos={mockMultipleRepos} />);

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("vue")).toBeInTheDocument();
  });

  test("各リポジトリのオーナー情報が表示される", () => {
    render(<RepoList repos={mockMultipleRepos} />);

    expect(screen.getByText("facebook")).toBeInTheDocument();
    expect(screen.getByText("vuejs")).toBeInTheDocument();
  });

  test("各リポジトリの言語が表示される", () => {
    render(<RepoList repos={mockMultipleRepos} />);

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  test("リポジトリへのリンクが正しく設定される", () => {
    render(<RepoList repos={mockMultipleRepos} />);

    const reactLink = screen.getByRole("link", { name: /react/i });
    expect(reactLink).toHaveAttribute("href", "/repos/facebook/react");

    const vueLink = screen.getByRole("link", { name: /vue/i });
    expect(vueLink).toHaveAttribute("href", "/repos/vuejs/vue");
  });

  test("オーナーのアバター画像が表示される", () => {
    render(<RepoList repos={mockMultipleRepos} />);

    const facebookAvatar = screen.getByAltText("facebookのアバター");
    expect(facebookAvatar).toHaveAttribute(
      "src",
      "https://example.com/avatar1.png"
    );

    const vuejsAvatar = screen.getByAltText("vuejsのアバター");
    expect(vuejsAvatar).toHaveAttribute(
      "src",
      "https://example.com/avatar2.png"
    );
  });

  test("言語が設定されていない場合、N/Aが表示される", () => {
    const reposWithoutLanguage: GitHubSearchRepos = [
      {
        ...mockMultipleRepos[0],
        language: null,
      },
    ];

    render(<RepoList repos={reposWithoutLanguage} />);

    const languageElements = screen.getAllByText(/N\/A/);
    expect(languageElements.length).toBeGreaterThan(0);
  });

  test("空のリポジトリ配列が渡された場合、何も表示されない", () => {
    const { container } = render(<RepoList repos={[]} />);

    const cards = container.querySelectorAll("a");
    expect(cards).toHaveLength(0);
  });
});
