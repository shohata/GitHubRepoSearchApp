// テスト対象の関数をインポート
import { searchRepos, getRepo } from "../../lib/github";

// --- モックデータ ---
// searchRepos用のモックデータ
const mockSearchResult = {
  total_count: 1,
  items: [
    {
      id: 10270250,
      full_name: "facebook/react",
      name: "react",
      owner: { login: "facebook" },
      description: "The library for web and native user interfaces.",
      stargazers_count: 220000,
      language: "JavaScript",
      forks_count: 45000,
      open_issues_count: 1000,
      watchers_count: 7000,
    },
  ],
};

// getRepo用のモックデータ
const mockRepoDetails = {
  id: 10270250,
  full_name: "facebook/react",
  name: "react",
  owner: { login: "facebook" },
  description: "The library for web and native user interfaces.",
  stargazers_count: 220000,
  language: "JavaScript",
  forks_count: 45000,
  open_issues_count: 1000,
  watchers_count: 7000,
  html_url: "https://github.com/facebook/react",
  subscribers_count: 7000,
};

// --- テストスイート ---
describe("Unit tests for lib/github.ts functions", () => {
  describe("searchRepos", () => {
    it("should return search results on a successful request", () => {
      // APIリクエストをインターセプトして成功レスポンスを返す
      cy.intercept(
        "GET",
        "https://api.github.com/search/repositories?q=react&page=1*",
        { statusCode: 200, body: mockSearchResult }
      ).as("searchRepos");

      // 関数を実行し、返り値がモックデータと一致することを確認
      cy.wrap(searchRepos("react", 1)).should("deep.equal", mockSearchResult);
    });

    it("should throw an error on a failed request", (done) => {
      // APIリクエストをインターセプトしてエラーレスポンスを返す
      cy.intercept(
        "GET",
        "https://api.github.com/search/repositories?q=react&page=1*",
        { statusCode: 403 }
      ).as("searchReposError");

      // 関数がエラーをスローすることを確認
      searchRepos("react", 1).catch((err) => {
        expect(err.message).to.equal(
          "APIの利用回数制限に達しました。しばらくしてから再度お試しください。"
        );
        done(); // 非同期テストの完了を通知
      });
    });

    it("should throw an error on a failed request", (done) => {
      cy.intercept(
        "GET",
        "https://api.github.com/search/repositories?q=react&page=1*",
        { statusCode: 422 }
      ).as("searchReposError");

      searchRepos("react", 1).catch((err) => {
        expect(err.message).to.equal(
          "検索クエリが無効です。検索条件を確認してください。"
        );
        done();
      });
    });

    it("should throw an error on a failed request", (done) => {
      cy.intercept(
        "GET",
        "https://api.github.com/search/repositories?q=react&page=1*",
        { statusCode: 500 }
      ).as("searchReposError");

      searchRepos("react", 1).catch((err) => {
        expect(err.message).to.equal(
          "データの取得に失敗しました。(Status: 500)"
        );
        done();
      });
    });
  });

  describe("getRepo", () => {
    it("should return repository details on a successful request", () => {
      cy.intercept("GET", "https://api.github.com/repos/facebook/react", {
        statusCode: 200,
        body: mockRepoDetails,
      }).as("getRepo");

      cy.wrap(getRepo("facebook", "react")).should(
        "deep.equal",
        mockRepoDetails
      );
    });

    it("should throw an error on a failed request", (done) => {
      cy.intercept("GET", "https://api.github.com/repos/facebook/react", {
        statusCode: 403,
      }).as("getRepoError");

      getRepo("facebook", "react").catch((err) => {
        expect(err.message).to.equal(
          "APIの利用回数制限に達しました。しばらくしてから再度お試しください。"
        );
        done();
      });
    });

    it("should throw an error on a failed request", (done) => {
      cy.intercept("GET", "https://api.github.com/repos/facebook/react", {
        statusCode: 404,
      }).as("getRepoError");

      getRepo("facebook", "react").catch((err) => {
        expect(err.message).to.equal(
          "指定されたリポジトリが見つかりませんでした。"
        );
        done();
      });
    });

    it("should throw an error on a failed request", (done) => {
      cy.intercept("GET", "https://api.github.com/repos/facebook/react", {
        statusCode: 500,
      }).as("getRepoError");

      getRepo("facebook", "react").catch((err) => {
        expect(err.message).to.equal(
          "リポジトリ情報の取得に失敗しました。(Status: 500)"
        );
        done();
      });
    });
  });
});
