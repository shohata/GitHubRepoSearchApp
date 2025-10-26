import type { GitHubRepo, GitHubSearchRepoResult } from "@/lib/types";

/**
 * E2Eテスト用のモックリポジトリデータ
 */
export const mockRepositories: GitHubRepo[] = [
  {
    id: 1,
    name: "react",
    full_name: "facebook/react",
    owner: {
      login: "facebook",
      avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    },
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    html_url: "https://github.com/facebook/react",
    stargazers_count: 220000,
    watchers_count: 220000,
    forks_count: 45000,
    open_issues_count: 1200,
    language: "JavaScript",
    created_at: "2013-05-24T16:15:54Z",
    updated_at: "2024-01-15T12:00:00Z",
    pushed_at: "2024-01-15T12:00:00Z",
  },
  {
    id: 2,
    name: "react-native",
    full_name: "facebook/react-native",
    owner: {
      login: "facebook",
      avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    },
    description: "A framework for building native applications using React",
    html_url: "https://github.com/facebook/react-native",
    stargazers_count: 115000,
    watchers_count: 115000,
    forks_count: 24000,
    open_issues_count: 2000,
    language: "JavaScript",
    created_at: "2015-01-09T18:10:16Z",
    updated_at: "2024-01-15T11:00:00Z",
    pushed_at: "2024-01-15T11:00:00Z",
  },
  {
    id: 3,
    name: "react-router",
    full_name: "remix-run/react-router",
    owner: {
      login: "remix-run",
      avatar_url: "https://avatars.githubusercontent.com/u/64235328?v=4",
    },
    description: "Declarative routing for React",
    html_url: "https://github.com/remix-run/react-router",
    stargazers_count: 52000,
    watchers_count: 52000,
    forks_count: 10000,
    open_issues_count: 50,
    language: "TypeScript",
    created_at: "2014-05-16T18:13:04Z",
    updated_at: "2024-01-15T10:00:00Z",
    pushed_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 4,
    name: "create-react-app",
    full_name: "facebook/create-react-app",
    owner: {
      login: "facebook",
      avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    },
    description: "Set up a modern web app by running one command.",
    html_url: "https://github.com/facebook/create-react-app",
    stargazers_count: 102000,
    watchers_count: 102000,
    forks_count: 26000,
    open_issues_count: 1600,
    language: "JavaScript",
    created_at: "2016-07-17T20:44:15Z",
    updated_at: "2024-01-15T09:00:00Z",
    pushed_at: "2024-01-15T09:00:00Z",
  },
  {
    id: 5,
    name: "react-redux",
    full_name: "reduxjs/react-redux",
    owner: {
      login: "reduxjs",
      avatar_url: "https://avatars.githubusercontent.com/u/13142323?v=4",
    },
    description: "Official React bindings for Redux",
    html_url: "https://github.com/reduxjs/react-redux",
    stargazers_count: 23000,
    watchers_count: 23000,
    forks_count: 3400,
    open_issues_count: 10,
    language: "TypeScript",
    created_at: "2015-07-11T18:38:28Z",
    updated_at: "2024-01-15T08:00:00Z",
    pushed_at: "2024-01-15T08:00:00Z",
  },
];

/**
 * TypeScript関連のモックリポジトリデータ
 */
export const mockTypeScriptRepositories: GitHubRepo[] = [
  {
    id: 101,
    name: "TypeScript",
    full_name: "microsoft/TypeScript",
    owner: {
      login: "microsoft",
      avatar_url: "https://avatars.githubusercontent.com/u/6154722?v=4",
    },
    description:
      "TypeScript is a superset of JavaScript that compiles to clean JavaScript output.",
    html_url: "https://github.com/microsoft/TypeScript",
    stargazers_count: 98000,
    watchers_count: 98000,
    forks_count: 12000,
    open_issues_count: 5800,
    language: "TypeScript",
    created_at: "2014-06-17T15:28:39Z",
    updated_at: "2024-01-15T12:00:00Z",
    pushed_at: "2024-01-15T12:00:00Z",
  },
  {
    id: 102,
    name: "typescript-book",
    full_name: "basarat/typescript-book",
    owner: {
      login: "basarat",
      avatar_url: "https://avatars.githubusercontent.com/u/1092738?v=4",
    },
    description:
      "The definitive guide to TypeScript and possibly the best TypeScript book",
    html_url: "https://github.com/basarat/typescript-book",
    stargazers_count: 20000,
    watchers_count: 20000,
    forks_count: 2500,
    open_issues_count: 100,
    language: "TypeScript",
    created_at: "2015-08-28T22:09:48Z",
    updated_at: "2024-01-15T11:00:00Z",
    pushed_at: "2024-01-15T11:00:00Z",
  },
];

/**
 * Vue.js関連のモックリポジトリデータ
 */
export const mockVueRepositories: GitHubRepo[] = [
  {
    id: 201,
    name: "vue",
    full_name: "vuejs/vue",
    owner: {
      login: "vuejs",
      avatar_url: "https://avatars.githubusercontent.com/u/6128107?v=4",
    },
    description:
      "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
    html_url: "https://github.com/vuejs/vue",
    stargazers_count: 207000,
    watchers_count: 207000,
    forks_count: 33000,
    open_issues_count: 350,
    language: "TypeScript",
    created_at: "2013-07-29T03:24:51Z",
    updated_at: "2024-01-15T12:00:00Z",
    pushed_at: "2024-01-15T12:00:00Z",
  },
];

/**
 * JavaScript関連のモックリポジトリデータ（大量の結果をシミュレート）
 */
export const mockJavaScriptRepositories: GitHubRepo[] = Array.from(
  { length: 30 },
  (_, i) => ({
    id: 300 + i,
    name: `javascript-project-${i + 1}`,
    full_name: `developer${i + 1}/javascript-project-${i + 1}`,
    owner: {
      login: `developer${i + 1}`,
      avatar_url: `https://avatars.githubusercontent.com/u/${1000 + i}?v=4`,
    },
    description: `A JavaScript project example ${i + 1}`,
    html_url: `https://github.com/developer${i + 1}/javascript-project-${i + 1}`,
    stargazers_count: 10000 - i * 100,
    watchers_count: 10000 - i * 100,
    forks_count: 2000 - i * 20,
    open_issues_count: 100 - i,
    language: "JavaScript",
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2024-01-15T12:00:00Z",
    pushed_at: "2024-01-15T12:00:00Z",
  })
);

/**
 * 検索クエリに応じたモックレスポンスを生成
 */
export function generateMockSearchResponse(
  query: string,
  page = 1
): GitHubSearchRepoResult {
  const perPage = 10;

  // クエリに応じてリポジトリを選択
  let repositories: GitHubRepo[] = [];
  let totalCount = 0;

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("react")) {
    repositories = mockRepositories;
    totalCount = 50; // 複数ページをシミュレート
  } else if (lowerQuery.includes("typescript")) {
    repositories = mockTypeScriptRepositories;
    totalCount = mockTypeScriptRepositories.length;
  } else if (lowerQuery.includes("vue")) {
    repositories = mockVueRepositories;
    totalCount = mockVueRepositories.length;
  } else if (lowerQuery.includes("javascript")) {
    repositories = mockJavaScriptRepositories;
    totalCount = 1500; // 1000件超をシミュレート
  } else if (
    lowerQuery.includes("nonexistent") ||
    lowerQuery.includes("xyzzyx") ||
    lowerQuery.length > 50
  ) {
    // 存在しないリポジトリや非常に長いクエリ
    repositories = [];
    totalCount = 0;
  } else {
    // デフォルトはreactリポジトリを返す
    repositories = mockRepositories;
    totalCount = mockRepositories.length;
  }

  // ページネーション処理
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedItems = repositories.slice(startIndex, endIndex);

  return {
    total_count: totalCount,
    incomplete_results: false,
    items: paginatedItems,
  };
}

/**
 * リポジトリ詳細用のモックデータを取得
 */
export function getMockRepository(
  owner: string,
  repo: string
): GitHubRepo | null {
  const allRepositories = [
    ...mockRepositories,
    ...mockTypeScriptRepositories,
    ...mockVueRepositories,
    ...mockJavaScriptRepositories,
  ];

  return (
    allRepositories.find((r) => r.owner.login === owner && r.name === repo) ||
    null
  );
}
