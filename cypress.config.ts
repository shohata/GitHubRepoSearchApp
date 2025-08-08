import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // テスト対象のアプリケーションのベースURLを設定
    baseUrl: "http://localhost:3000",
    // Node.jsのイベントリスナーをここで設定
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
