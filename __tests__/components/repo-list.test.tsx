import { render, screen } from "@testing-library/react";
import { RepoList } from "@/components/features/search/repo-list";
import type { GitHubSearchRepos } from "@/lib/types";

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

  test("リポジトリのリストが正しく表示される", () => {
    render(<RepoList repos={mockRepos} />);

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("vue")).toBeInTheDocument();
  });

  test("各リポジトリのオーナー情報が表示される", () => {
    render(<RepoList repos={mockRepos} />);

    expect(screen.getByText("facebook")).toBeInTheDocument();
    expect(screen.getByText("vuejs")).toBeInTheDocument();
  });

  test("各リポジトリの言語が表示される", () => {
    render(<RepoList repos={mockRepos} />);

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  test("リポジトリへのリンクが正しく設定される", () => {
    render(<RepoList repos={mockRepos} />);

    const reactLink = screen.getByRole("link", { name: /react/i });
    expect(reactLink).toHaveAttribute("href", "/repos/facebook/react");

    const vueLink = screen.getByRole("link", { name: /vue/i });
    expect(vueLink).toHaveAttribute("href", "/repos/vuejs/vue");
  });

  test("オーナーのアバター画像が表示される", () => {
    render(<RepoList repos={mockRepos} />);

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
        ...mockRepos[0],
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
