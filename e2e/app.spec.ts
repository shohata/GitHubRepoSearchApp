import { expect, type Page, test } from "@playwright/test";

// ヘルパー関数: 検索を実行してAPIレスポンスを待つ
async function searchAndWaitForResults(page: Page, query: string) {
  await page.fill("input#search-input", query);

  // ボタンをクリックして検索を実行
  await page.getByRole("button", { name: "Search" }).click();

  // URLが更新されるまで待機（検索が実行されたことを確認）
  await page.waitForURL(`**/?q=${encodeURIComponent(query)}*`, {
    timeout: 10000,
  });

  // DOMの読み込みが完了するまで待機
  await page.waitForLoadState("domcontentloaded", { timeout: 10000 });
}

test.describe("GitHubリポジトリ検索アプリケーションのE2Eテスト", () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にトップページにアクセスする
    await page.goto("/");
  });

  test("リポジトリを検索し、詳細ページに遷移できること", async ({ page }) => {
    const searchQuery = "react";

    // 1. 検索を実行してAPIレスポンスを待つ
    await searchAndWaitForResults(page, searchQuery);

    // 2. 検索結果が表示されることを確認する
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });

    // 3. リポジトリカードが表示されるのを待つ
    await expect(page.locator('a[href^="/repos/"]').first()).toBeVisible({
      timeout: 10000,
    });

    // 4. 検索結果の最初の項目をクリックして詳細ページに遷移する
    await page.locator('a[href^="/repos/"]').first().click();

    // 5. 詳細ページに正しく遷移したことを確認する
    await expect(page).toHaveURL(/\/repos\//, { timeout: 15000 });
    await expect(page.locator("h1")).toBeVisible();

    // 6. 「トップページに戻る」リンクでトップページに戻れることを確認する
    const backLink = page.getByRole("link", { name: "トップページに戻る" });
    await expect(backLink).toBeVisible({ timeout: 5000 });
    await backLink.click();
    await expect(page).toHaveURL("/", { timeout: 5000 });
  });

  test("存在しないリポジトリを検索した場合にエラーメッセージが表示されること", async ({
    page,
  }) => {
    const nonExistentQuery = "this-repository-does-not-exist-1234567890";
    await searchAndWaitForResults(page, nonExistentQuery);

    // 「...に一致するリポジトリが見つかりませんでした。」というメッセージが表示されることを確認
    await expect(
      page.getByText(/に一致するリポジトリが見つかりませんでした/)
    ).toBeVisible({ timeout: 20000 });
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
    await searchAndWaitForResults(page, searchQuery);
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });

    // ページネーションの "Next" ボタンをクリック
    const nextButton = page.getByRole("link", { name: "Go to next page" });
    await expect(nextButton).toBeVisible({ timeout: 5000 });
    await nextButton.click();

    // URLに "page=2" が含まれていることを確認
    await expect(page).toHaveURL(/page=2/, { timeout: 10000 });

    // 検索結果が再表示されるまで待機
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });

    // ページネーションの "Previous" ボタンをクリック
    const prevButton = page.getByRole("link", { name: "Go to previous page" });
    await expect(prevButton).toBeVisible({ timeout: 5000 });
    await prevButton.click();

    // URLに "page=1" が含まれていることを確認
    await expect(page).toHaveURL(/page=1/, { timeout: 10000 });

    // 検索結果が再表示されるまで待機
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });
  });

  test("検索クエリが空の時に検索が実行されないこと", async ({ page }) => {
    // inputに 'required' attribute があることを確認
    const input = page.locator("input#search-input");
    await expect(input).toHaveAttribute("required");

    // 検索ボタンをクリック
    await page.getByRole("button", { name: "Search" }).click();

    // 検索が実行されていないことを確認
    await expect(page).not.toHaveURL(/q=/);
    await expect(page.locator("text=件の結果")).not.toBeVisible();
  });

  test("リポジトリ詳細ページでオーナー情報が表示されること", async ({
    page,
  }) => {
    const searchQuery = "react";

    // 検索を実行
    await searchAndWaitForResults(page, searchQuery);
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });

    // 最初のリポジトリの詳細ページに遷移
    await page.locator('a[href^="/repos/"]').first().click();
    await expect(page).toHaveURL(/\/repos\//, { timeout: 15000 });

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

    await searchAndWaitForResults(page, popularQuery);
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
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
    await page.waitForTimeout(1000);

    // 検索結果が表示されることを確認
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
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
    await searchAndWaitForResults(page, searchQuery);
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });

    const currentURL = page.url();

    // 同じクエリで再度検索
    await page.getByRole("button", { name: "Search" }).click();

    // ネットワークがアイドル状態になるまで待機
    await page.waitForLoadState("networkidle");

    // URLが変わっていないことを確認
    expect(page.url()).toBe(currentURL);
  });

  test("ダークモード切り替えが動作すること", async ({ page }) => {
    // ダークモード切り替えボタンを探す（sr-onlyテキストを含むボタン）
    const themeToggle = page.getByRole("button", { name: "Toggle theme" });

    // ボタンをクリック
    await expect(themeToggle).toBeVisible({ timeout: 5000 });
    await themeToggle.click();

    // ドロップダウンメニューが表示されることを確認
    await expect(
      page
        .getByRole("menuitem", { name: "Light" })
        .or(page.getByRole("menuitem", { name: "Dark" }))
    ).toBeVisible({ timeout: 5000 });
  });

  test("ページ番号を直接URLに指定してアクセスできること", async ({ page }) => {
    const searchQuery = "react";
    const pageNumber = 3;

    // ページ番号を含むURLに直接アクセス
    await page.goto(`/?q=${searchQuery}&page=${pageNumber}`);
    await page.waitForTimeout(1000);

    // 検索結果が表示されることを確認
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });

    // URLにpage=3が含まれていることを確認
    await expect(page).toHaveURL(/page=3/);
  });

  test("特殊文字を含むクエリで検索できること", async ({ page }) => {
    const specialQuery = "react-native";

    await searchAndWaitForResults(page, specialQuery);

    // 検索結果が表示されることを確認
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });

    // URLにクエリが含まれていることを確認
    await expect(page).toHaveURL(/q=react-native/);
  });

  test("非常に長いクエリで検索した場合でもエラーにならないこと", async ({
    page,
  }) => {
    const longQuery = "a".repeat(100);

    await searchAndWaitForResults(page, longQuery);

    // エラーメッセージが表示されるか、検索結果が表示される
    const resultOrError = page
      .getByText(/検索結果:\s*[\d,]+件/)
      .or(page.getByText(/に一致するリポジトリが見つかりませんでした/));
    await expect(resultOrError).toBeVisible({ timeout: 20000 });
  });

  test("リポジトリ詳細ページから別のリポジトリに遷移できること", async ({
    page,
  }) => {
    const searchQuery = "react";

    // 検索を実行
    await searchAndWaitForResults(page, searchQuery);
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });

    // 最初のリポジトリの詳細ページに遷移
    await page.locator('a[href^="/repos/"]').first().click();
    await expect(page).toHaveURL(/\/repos\//, { timeout: 15000 });

    // トップページに戻る
    const backLink = page.getByRole("link", { name: "トップページに戻る" });
    await expect(backLink).toBeVisible({ timeout: 5000 });
    await backLink.click();
    await expect(page).toHaveURL(/\?q=/, { timeout: 5000 });

    // 検索結果が再度表示されるまで待機
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });

    // 2番目のリポジトリの詳細ページに遷移
    await page.locator('a[href^="/repos/"]').nth(1).click();
    await expect(page).toHaveURL(/\/repos\//, { timeout: 10000 });
  });

  test("検索結果が0件の場合に適切なメッセージが表示されること", async ({
    page,
  }) => {
    const nonExistentQuery = "xyzzyx-nonexistent-repo-12345678901234567890";

    await searchAndWaitForResults(page, nonExistentQuery);

    // 「...に一致するリポジトリが見つかりませんでした。」というメッセージが表示されることを確認
    await expect(
      page.getByText(/に一致するリポジトリが見つかりませんでした/)
    ).toBeVisible({ timeout: 20000 });

    // ページネーションが表示されないことを確認
    await expect(
      page.getByRole("link", { name: "Go to next page" })
    ).not.toBeVisible();
  });

  test("検索結果から詳細ページへ、詳細ページから検索結果に戻ると元のページ番号が保持されること", async ({
    page,
  }) => {
    const searchQuery = "javascript";

    // 検索を実行
    await searchAndWaitForResults(page, searchQuery);
    await expect(page.getByText(/検索結果:\s*[\d,]+件/)).toBeVisible({
      timeout: 20000,
    });

    // 2ページ目に移動
    const nextButton = page.getByRole("link", { name: "Go to next page" });
    await expect(nextButton).toBeVisible({ timeout: 5000 });
    await nextButton.click();
    await expect(page).toHaveURL(/page=2/, { timeout: 10000 });

    // URLを保存
    const searchResultURL = page.url();

    // リポジトリの詳細ページに遷移
    await page.locator('a[href^="/repos/"]').first().click();
    await expect(page).toHaveURL(/\/repos\//, { timeout: 15000 });

    // ブラウザの戻るボタンで検索結果に戻る
    await page.goBack();

    // 元のページ番号が保持されていることを確認
    expect(page.url()).toBe(searchResultURL);
    await expect(page).toHaveURL(/page=2/);
  });
});
