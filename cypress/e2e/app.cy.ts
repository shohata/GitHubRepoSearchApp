describe("GitHubリポジトリ検索アプリケーションのE2Eテスト", () => {
  beforeEach(() => {
    // 各テストの前にトップページにアクセスする
    cy.visit("/");
  });

  it("リポジトリを検索し、詳細ページに遷移できること", () => {
    const searchQuery = "react";

    // 1. 検索フォームにキーワードを入力する
    // input要素のid="search-input"を指定して要素を取得し、キーワードを入力
    cy.get("input#search-input").type(searchQuery);

    // 2. 検索ボタンをクリックする
    // buttonのtype="submit"を指定して要素を取得し、クリック
    cy.get('button[type="submit"]').click();

    // 3. 検索結果が表示されることを確認する
    // 検索結果のリストが表示されるまで待機（最大10秒）
    // div要素に「検索結果」というテキストが含まれていることを確認
    cy.contains("div", "検索結果", { timeout: 10000 }).should("be.visible");

    // 4. 検索結果の最初の項目をクリックして詳細ページに遷移する
    // hrefが"/repos/"で始まるアンカータグの最初のものをクリック
    cy.get('a[href^="/repos/"]').first().click();

    // 5. 詳細ページに正しく遷移したことを確認する
    // URLに'/repos/'が含まれていることを確認
    cy.url().should("include", "/repos/", { timeout: 10000 });
    // div要素に'react'というテキストが含まれていることを確認
    cy.contains("div", searchQuery, { matchCase: false }).should("be.visible");

    // 6. 「トップページに戻る」リンクでトップページに戻れることを確認する
    cy.contains("a", "トップページに戻る").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("存在しないリポジトリを検索した場合にエラーメッセージが表示されること", () => {
    const nonExistentQuery = "this-repository-does-not-exist-1234567890";
    cy.get("input#search-input").type(nonExistentQuery);
    cy.get('button[type="submit"]').click();

    // 「リポジトリが見つかりませんでした。」というメッセージが表示されることを確認
    cy.contains("リポジトリが見つかりませんでした。").should("be.visible");
  });

  it("ページネーションが正しく動作すること", () => {
    const searchQuery = "react";

    // 検索を実行
    cy.get("input#search-input").type(searchQuery);
    cy.get('button[type="submit"]').click();
    cy.contains("div", "検索結果", { timeout: 10000 }).should("be.visible");

    // ページネーションの "Next" ボタンをクリック
    cy.get('a[aria-label="Go to next page"]').click();
    cy.contains("div", "検索結果", { timeout: 10000 }).should("be.visible");

    // URLに "page=2" が含まれていることを確認
    cy.url().should("include", "page=2");

    // ページネーションの "Next" ボタンをクリック
    cy.get('a[aria-label="Go to previous page"]').click();
    cy.contains("div", "検索結果", { timeout: 10000 }).should("be.visible");

    // URLに "page=1" が含まれていることを確認
    cy.url().should("include", "page=1");
  });

  it("検索クエリが空の時に検索が実行されないこと", () => {
    // inputに 'required' attribute があることを確認
    cy.get("input#search-input").should("have.attr", "required");

    // 検索ボタンをクリック
    cy.get('button[type="submit"]').click();

    // 検索が実行されていないことを確認
    cy.url().should("not.include", "q=");
    cy.get("body").should("not.contain", "件の結果");
  });
});
