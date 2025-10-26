import { test, expect } from '@playwright/test';

test.describe('GitHubリポジトリ検索アプリケーションのE2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にトップページにアクセスする
    await page.goto('/');
  });

  test('リポジトリを検索し、詳細ページに遷移できること', async ({ page }) => {
    const searchQuery = 'react';

    // 1. 検索フォームにキーワードを入力する
    await page.fill('input#search-input', searchQuery);

    // 2. 検索ボタンをクリックする
    await page.click('button[type="submit"]');

    // 3. 検索結果が表示されることを確認する
    await expect(page.locator('div', { hasText: '検索結果' })).toBeVisible({
      timeout: 10000,
    });

    // 4. 検索結果の最初の項目をクリックして詳細ページに遷移する
    await page.locator('a[href^="/repos/"]').first().click();

    // 5. 詳細ページに正しく遷移したことを確認する
    await expect(page).toHaveURL(/\/repos\//, { timeout: 10000 });
    await expect(
      page.locator('div', { hasText: new RegExp(searchQuery, 'i') })
    ).toBeVisible();

    // 6. 「トップページに戻る」リンクでトップページに戻れることを確認する
    await page.click('a:has-text("トップページに戻る")');
    await expect(page).toHaveURL('/');
  });

  test('存在しないリポジトリを検索した場合にエラーメッセージが表示されること', async ({
    page,
  }) => {
    const nonExistentQuery = 'this-repository-does-not-exist-1234567890';
    await page.fill('input#search-input', nonExistentQuery);
    await page.click('button[type="submit"]');

    // 「リポジトリが見つかりませんでした。」というメッセージが表示されることを確認
    await expect(
      page.locator('text=リポジトリが見つかりませんでした。')
    ).toBeVisible();
  });

  test('存在しないリポジトリ詳細ページに移動した場合にエラーメッセージが表示されること', async ({
    page,
  }) => {
    const nonExistentOwner = 'this-owner-does-not-exist-1234567890';
    const nonExistentRepository = 'this-repository-does-not-exist-1234567890';
    await page.goto(`/repos/${nonExistentOwner}/${nonExistentRepository}`);

    // 「エラーが発生しました」というメッセージが表示されることを確認
    await expect(page.locator('text=エラーが発生しました')).toBeVisible();
  });

  test('ページネーションが正しく動作すること', async ({ page }) => {
    const searchQuery = 'react';

    // 検索を実行
    await page.fill('input#search-input', searchQuery);
    await page.click('button[type="submit"]');
    await expect(page.locator('div', { hasText: '検索結果' })).toBeVisible({
      timeout: 10000,
    });

    // ページネーションの "Next" ボタンをクリック
    await page.click('a[aria-label="Go to next page"]');
    await expect(page.locator('div', { hasText: '検索結果' })).toBeVisible({
      timeout: 10000,
    });

    // URLに "page=2" が含まれていることを確認
    await expect(page).toHaveURL(/page=2/);

    // ページネーションの "Previous" ボタンをクリック
    await page.click('a[aria-label="Go to previous page"]');
    await expect(page.locator('div', { hasText: '検索結果' })).toBeVisible({
      timeout: 10000,
    });

    // URLに "page=1" が含まれていることを確認
    await expect(page).toHaveURL(/page=1/);
  });

  test('検索クエリが空の時に検索が実行されないこと', async ({ page }) => {
    // inputに 'required' attribute があることを確認
    const input = page.locator('input#search-input');
    await expect(input).toHaveAttribute('required');

    // 検索ボタンをクリック
    await page.click('button[type="submit"]');

    // 検索が実行されていないことを確認
    await expect(page).not.toHaveURL(/q=/);
    await expect(page.locator('text=件の結果')).not.toBeVisible();
  });
});
