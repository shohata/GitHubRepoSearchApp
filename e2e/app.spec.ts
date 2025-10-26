import { expect, test } from "@playwright/test";

test.describe("GitHubリポジトリ検索アプリケーションのE2Eテスト", () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にトップページにアクセスする
    await page.goto("/");
  });

  test("リポジトリを検索し、詳細ページに遷移できること", async ({ page }) => {
    const searchQuery = "react";

    // 1. 検索フォームにキーワードを入力する
    await page.fill("input#search-input", searchQuery);

    // 2. 検索ボタンをクリックする
    await page.click('button[type="submit"]');

    // 3. 検索結果が表示されることを確認する
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // 4. 検索結果の最初の項目をクリックして詳細ページに遷移する
    await page.locator('a[href^="/repos/"]').first().click();

    // 5. 詳細ページに正しく遷移したことを確認する
    await expect(page).toHaveURL(/\/repos\//, { timeout: 10000 });
    await expect(
      page.locator("div", { hasText: new RegExp(searchQuery, "i") })
    ).toBeVisible();

    // 6. 「トップページに戻る」リンクでトップページに戻れることを確認する
    await page.click('a:has-text("トップページに戻る")');
    await expect(page).toHaveURL("/");
  });

  test("存在しないリポジトリを検索した場合にエラーメッセージが表示されること", async ({
    page,
  }) => {
    const nonExistentQuery = "this-repository-does-not-exist-1234567890";
    await page.fill("input#search-input", nonExistentQuery);
    await page.click('button[type="submit"]');

    // 「リポジトリが見つかりませんでした。」というメッセージが表示されることを確認
    await expect(
      page.locator("text=リポジトリが見つかりませんでした。")
    ).toBeVisible();
  });

  test("存在しないリポジトリ詳細ページに移動した場合にエラーメッセージが表示されること", async ({
    page,
  }) => {
    const nonExistentOwner = "this-owner-does-not-exist-1234567890";
    const nonExistentRepository = "this-repository-does-not-exist-1234567890";
    await page.goto(`/repos/${nonExistentOwner}/${nonExistentRepository}`);

    // 「エラーが発生しました」というメッセージが表示されることを確認
    await expect(page.locator("text=エラーが発生しました")).toBeVisible();
  });

  test("ページネーションが正しく動作すること", async ({ page }) => {
    const searchQuery = "react";

    // 検索を実行
    await page.fill("input#search-input", searchQuery);
    await page.click('button[type="submit"]');
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // ページネーションの "Next" ボタンをクリック
    await page.click('a[aria-label="Go to next page"]');
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // URLに "page=2" が含まれていることを確認
    await expect(page).toHaveURL(/page=2/);

    // ページネーションの "Previous" ボタンをクリック
    await page.click('a[aria-label="Go to previous page"]');
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // URLに "page=1" が含まれていることを確認
    await expect(page).toHaveURL(/page=1/);
  });

  test("検索クエリが空の時に検索が実行されないこと", async ({ page }) => {
    // inputに 'required' attribute があることを確認
    const input = page.locator("input#search-input");
    await expect(input).toHaveAttribute("required");

    // 検索ボタンをクリック
    await page.click('button[type="submit"]');

    // 検索が実行されていないことを確認
    await expect(page).not.toHaveURL(/q=/);
    await expect(page.locator("text=件の結果")).not.toBeVisible();
  });

  test("リポジトリ詳細ページでオーナー情報が表示されること", async ({
    page,
  }) => {
    const searchQuery = "react";

    // 検索を実行
    await page.fill("input#search-input", searchQuery);
    await page.click('button[type="submit"]');
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // 最初のリポジトリの詳細ページに遷移
    await page.locator('a[href^="/repos/"]').first().click();
    await expect(page).toHaveURL(/\/repos\//, { timeout: 10000 });

    // オーナー情報が表示されることを確認
    await expect(page.locator("text=Owner:")).toBeVisible();

    // 言語情報が表示されることを確認
    await expect(page.locator("text=Language:")).toBeVisible();

    // 統計情報（Stars, Forks, Watchers, Issues）が表示されることを確認
    await expect(page.locator("text=Stars")).toBeVisible();
    await expect(page.locator("text=Forks")).toBeVisible();
    await expect(page.locator("text=Watchers")).toBeVisible();
    await expect(page.locator("text=Issues")).toBeVisible();
  });

  test("検索結果が1000件を超える場合に警告メッセージが表示されること", async ({
    page,
  }) => {
    // 非常に多くの結果が返されるクエリで検索
    const popularQuery = "javascript";

    await page.fill("input#search-input", popularQuery);
    await page.click('button[type="submit"]');
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // 検索結果数を確認
    const resultText = await page
      .locator("p.text-sm.text-muted-foreground")
      .first()
      .textContent();

    // 結果が1000件を超える場合、警告メッセージが表示される
    if (
      resultText &&
      Number.parseInt(resultText.match(/\d+/)?.[0] || "0") > 1000
    ) {
      await expect(
        page.locator(
          "text=検索結果が多数あります。APIの仕様により、最初の1000件のみ表示しています。"
        )
      ).toBeVisible();
    }
  });

  test("検索フォームに初期クエリが表示されること", async ({ page }) => {
    const initialQuery = "typescript";

    // クエリパラメータ付きでページにアクセス
    await page.goto(`/?q=${initialQuery}`);

    // 検索結果が表示されることを確認
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // 検索フォームに初期クエリが表示されていることを確認
    const input = page.locator("input#search-input");
    await expect(input).toHaveValue(initialQuery);
  });

  test("同じクエリで再検索した場合、URLが更新されないこと", async ({
    page,
  }) => {
    const searchQuery = "vue";

    // 最初の検索
    await page.fill("input#search-input", searchQuery);
    await page.click('button[type="submit"]');
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    const currentURL = page.url();

    // 同じクエリで再度検索
    await page.click('button[type="submit"]');

    // ネットワークがアイドル状態になるまで待機
    await page.waitForLoadState("networkidle");

    // URLが変わっていないことを確認
    expect(page.url()).toBe(currentURL);
  });

  test("ダークモード切り替えが動作すること", async ({ page }) => {
    // ダークモード切り替えボタンを探す
    const themeToggle = page
      .locator('button[aria-label*="Toggle theme"]')
      .or(page.locator('button:has-text("Toggle theme")'))
      .or(page.getByRole("button", { name: /theme/i }));

    // ボタンが存在する場合のみテスト
    if ((await themeToggle.count()) > 0) {
      await themeToggle.first().click();

      // ドロップダウンメニューが表示されることを確認
      await expect(
        page.locator("text=Light").or(page.locator("text=Dark"))
      ).toBeVisible();
    }
  });

  test("ページ番号を直接URLに指定してアクセスできること", async ({ page }) => {
    const searchQuery = "react";
    const pageNumber = 3;

    // ページ番号を含むURLに直接アクセス
    await page.goto(`/?q=${searchQuery}&page=${pageNumber}`);

    // 検索結果が表示されることを確認
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // URLにpage=3が含まれていることを確認
    await expect(page).toHaveURL(/page=3/);
  });

  test("特殊文字を含むクエリで検索できること", async ({ page }) => {
    const specialQuery = "react-native";

    await page.fill("input#search-input", specialQuery);
    await page.click('button[type="submit"]');

    // 検索結果が表示されることを確認
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // URLにクエリが含まれていることを確認
    await expect(page).toHaveURL(/q=react-native/);
  });

  test("非常に長いクエリで検索した場合でもエラーにならないこと", async ({
    page,
  }) => {
    const longQuery = "a".repeat(100);

    await page.fill("input#search-input", longQuery);
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されるか、検索結果が表示される
    const resultOrError = page
      .locator("div", { hasText: "検索結果" })
      .or(page.locator("text=リポジトリが見つかりませんでした。"));
    await expect(resultOrError).toBeVisible({ timeout: 10000 });
  });

  test("リポジトリ詳細ページから別のリポジトリに遷移できること", async ({
    page,
  }) => {
    const searchQuery = "react";

    // 検索を実行
    await page.fill("input#search-input", searchQuery);
    await page.click('button[type="submit"]');
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // 最初のリポジトリの詳細ページに遷移
    await page.locator('a[href^="/repos/"]').first().click();
    await expect(page).toHaveURL(/\/repos\//, { timeout: 10000 });

    // トップページに戻る
    await page.click('a:has-text("トップページに戻る")');
    await expect(page).toHaveURL(/\?q=/);

    // 2番目のリポジトリの詳細ページに遷移
    await page.locator('a[href^="/repos/"]').nth(1).click();
    await expect(page).toHaveURL(/\/repos\//, { timeout: 10000 });
  });

  test("検索結果が0件の場合に適切なメッセージが表示されること", async ({
    page,
  }) => {
    const nonExistentQuery = "xyzzyx-nonexistent-repo-12345678901234567890";

    await page.fill("input#search-input", nonExistentQuery);
    await page.click('button[type="submit"]');

    // 「リポジトリが見つかりませんでした。」というメッセージが表示されることを確認
    await expect(
      page.locator("text=リポジトリが見つかりませんでした。")
    ).toBeVisible({ timeout: 10000 });

    // ページネーションが表示されないことを確認
    await expect(
      page.locator('a[aria-label="Go to next page"]')
    ).not.toBeVisible();
  });

  test("検索結果から詳細ページへ、詳細ページから検索結果に戻ると元のページ番号が保持されること", async ({
    page,
  }) => {
    const searchQuery = "javascript";

    // 検索を実行
    await page.fill("input#search-input", searchQuery);
    await page.click('button[type="submit"]');
    await expect(page.locator("div", { hasText: "検索結果" })).toBeVisible({
      timeout: 10000,
    });

    // 2ページ目に移動
    await page.click('a[aria-label="Go to next page"]');
    await expect(page).toHaveURL(/page=2/);

    // URLを保存
    const searchResultURL = page.url();

    // リポジトリの詳細ページに遷移
    await page.locator('a[href^="/repos/"]').first().click();
    await expect(page).toHaveURL(/\/repos\//, { timeout: 10000 });

    // ブラウザの戻るボタンで検索結果に戻る
    await page.goBack();

    // 元のページ番号が保持されていることを確認
    expect(page.url()).toBe(searchResultURL);
    await expect(page).toHaveURL(/page=2/);
  });
});
