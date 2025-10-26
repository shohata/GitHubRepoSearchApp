import { defineConfig, devices } from "@playwright/test";

/**
 * ファイルから環境変数を読み込む
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * Playwrightのテスト設定
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  /* ファイル内のテストを並列実行 */
  fullyParallel: true,
  /* CI環境でtest.onlyが残っている場合はビルドを失敗させる */
  forbidOnly: !!process.env.CI,
  /* CI環境でのみリトライを有効化 */
  retries: process.env.CI ? 2 : 0,
  /* CI環境では並列テストを無効化 */
  workers: process.env.CI ? 1 : undefined,
  /* 使用するレポーター形式。詳細: https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* 全プロジェクト共通の設定。詳細: https://playwright.dev/docs/api/class-testoptions */
  use: {
    /* `await page.goto('/')`などのアクションで使用するベースURL */
    baseURL: "http://localhost:3000",
    /* テスト失敗時にトレースを収集。詳細: https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* 主要ブラウザ向けのプロジェクト設定 */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* モバイルビューポートに対するテスト */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* ブランドブラウザに対するテスト */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* テスト開始前にローカル開発サーバーを起動 */
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
