# GitHub Repository Search App

This project is a simple web application for searching GitHub repositories and viewing their detailed information.

## Features

- **Repository Search**: The app uses the GitHub API to search for repositories.
- **Detail Page**: From the search results, you can view detailed information for any repository, such as stars, watchers, and forks.
- **Pagination**: If there are many search results, you can navigate through the pages.
- **Theme Toggle**: The display can be switched between light and dark modes.
- **Error Handling**: A 404 page is displayed when a non-existent repository is accessed.

## Technologies Used

- **Next.js**: A React framework.
- **TypeScript**: A type-safe superset of JavaScript.
- **Tailwind CSS**: A utility-first CSS framework.
- **shadcn/ui**: A collection of reusable UI components based on Radix UI and Tailwind CSS.
- **Lucide React**: An icon library.

## Development Setup

To run the project locally, follow these steps:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/shohata/GitHubRepoSearchApp.git
    cd GitHubRepoSearchApp
    ```

2.  **Install dependencies**:
    This project uses pnpm.

    ```bash
    pnpm install
    ```

3.  **Start the development server**:

    ```bash
    pnpm dev
    ```

You can now access the application at `http://localhost:3000`.

## Environment Setup

This application uses the GitHub API. Unauthenticated requests have a strict rate limit, so setting up a **GitHub Personal Access Token (PAT)** is recommended for a smooth development experience.

1.  Follow [this guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) to create a Personal Access Token with repository read permissions.
2.  Create a file named `.env.local` in the project's root directory.
3.  In the created file, set the token you obtained as follows:

    ```
    GITHUB_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
    ```

4.  Restart the development server.

This will significantly relax the API rate limit, allowing you to send more requests. The `.env.local` file is included in `.gitignore`, so it will not be committed to the Git repository.

## Testing

This project uses Cypress for End-to-End (E2E) testing.

1. **Open Cypress in Interactive Mode:** This allows you to see the tests run in a browser, which is useful during development.

   ```bash
   pnpm cy:open
   ```

2. **Run Cypress in Headless Mode:** This runs all tests in the command line. It's ideal for CI/CD environments.

   ```bash
   pnpm cy:run
   ```

## 工夫した点・こだわったポイント

### アーキテクチャ

- **API ルートの活用 (BFF)**: クライアントから直接 GitHub API を呼び出すのではなく、Next.js の API ルートを経由しています。これにより、API の認証トークンをサーバーサイドで安全に管理し、クライアントに公開することなく API リクエストを行えます。

### UI/UX

- **モダンな UI デザイン**: UI コンポーネントライブラリ `shadcn/ui` と `Tailwind CSS` を全面的に採用し、再利用性が高く、モダンで見やすいデザインを効率的に構築しました。
- **テーマ切り替え機能**: `next-themes` を利用して、ライトモードとダークモードの切り替え機能を実装。ユーザーのシステム設定に合わせることも可能です。
- **きめ細かな状態表示**: 検索中のスピナー表示や、エラー発生時の専用画面など、ユーザーがアプリケーションの状態を直感的に把握できるよう配慮しました。
- **洗練されたページネーション**: 検索結果が多い場合でも、現在のページをハイライトし、ページ番号を省略表示するなど、快適にブラウジングできる UI を実装しました。

### パフォーマンスと SEO

- **サーバーコンポーネントによる高速表示**: リポジトリ詳細ページでは、Next.js のサーバーコンポーネントを採用。サーバー側でデータ取得とレンダリングを行うことで、ページの初期表示速度を向上させています。
- **動的なメタデータ生成**: 詳細ページでは、`generateMetadata` 関数を用いてリポジトリ情報をページのメタデータ（タイトルや OGP タグ）に動的に設定。これにより SEO を向上させ、SNS での共有時にも適切な情報が表示されるようにしています。
- **SWR による効率的なデータ取得**: 検索結果の表示には`SWR`を採用し、キャッシュ活用による高速な表示や、画面フォーカス時の自動データ更新など、ユーザー体験を高める工夫を凝らしています。

### 開発体験と品質

- **カスタムフックによるロジックの分離**: 検索フォームや検索結果に関するロジックをカスタムフックに切り出すことで、UI とロジックを分離。これにより、コードの可読性、再利用性、テストのしやすさを向上させています。
- **詳細なエラーハンドリング**: GitHub API との通信部分では、API の利用回数制限やリポジトリが見つからない場合など、HTTP ステータスコードに応じて具体的なエラーメッセージを生成し、ユーザーに分かりやすく伝わるようにしています。
- **Cypress による E2E テスト**: ユーザーの一連の操作を自動でテストする E2E テストを実装。アプリケーション全体の品質を担保し、将来の機能追加や修正時にも安心して開発を進められる体制を整えています。
