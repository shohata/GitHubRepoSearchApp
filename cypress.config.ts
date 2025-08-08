import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // テスト対象のアプリケーションのベースURLを設定
    baseUrl: "http://localhost:3000",
    // supportFileをfalseに設定して、e2e.tsファイルを探さないように設定
    supportFile: false,
    // Node.jsのイベントリスナーをここで設定
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
