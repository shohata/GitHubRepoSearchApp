describe("GitHubリポジトリ検索機能のE2Eテスト", () => {
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
});
