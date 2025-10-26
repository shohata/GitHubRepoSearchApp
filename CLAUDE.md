# Claude Codeによる開発ガイド

このドキュメントは、Claude Codeを使用してこのプロジェクトを開発・テストする際のガイドラインです。

## プロジェクト概要

GitHub リポジトリを検索し、詳細情報を表示するWebアプリケーションです。

### 主な機能

- **リポジトリ検索**: GitHub API を使用したリポジトリ検索
- **詳細ページ**: スター数、ウォッチャー数、フォーク数などの表示
- **ページネーション**: 検索結果のページ遷移
- **テーマ切り替え**: ライト/ダークモード対応
- **エラーハンドリング**: 404ページなどのエラー処理

### 技術スタック

- **Next.js 15**: Reactフレームワーク
- **TypeScript**: 型安全な開発
- **Tailwind CSS**: ユーティリティファーストCSS
- **shadcn/ui**: 再利用可能なUIコンポーネント
- **SWR**: データフェッチングとキャッシング
- **Octokit**: GitHub API クライアント

## 開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/shohata/GitHubRepoSearchApp.git
cd GitHubRepoSearchApp
```

### 2. 依存関係のインストール

このプロジェクトは pnpm を使用します:

```bash
pnpm install
```

### 3. 環境変数の設定

GitHub API のレート制限を緩和するため、Personal Access Token (PAT) の設定を推奨:

1. [GitHub PAT作成ガイド](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)に従ってトークンを作成
2. プロジェクトルートに `.env.local` を作成
3. 以下の内容を設定:

```
GITHUB_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

`http://localhost:3000` でアプリケーションにアクセスできます。

## テスト環境

このプロジェクトでは以下のテストフレームワークを使用しています:

- **Jest**: ユニットテスト（API関数、ロジックのテスト）
- **Testing Library**: Reactコンポーネントのテスト
- **Playwright**: E2Eテスト（ユーザー操作フロー）

## テストの実行

### ユニットテスト (Jest)

```bash
# 全てのユニットテストを実行
pnpm test

# ウォッチモードでテストを実行
pnpm test:watch

# カバレッジレポートを生成
pnpm test:coverage
```

### E2Eテスト (Playwright)

```bash
# 全てのE2Eテストを実行
pnpm test:e2e

# UIモードでE2Eテストを実行
pnpm test:e2e:ui

# デバッグモードでE2Eテストを実行
pnpm test:e2e:debug
```

## テストファイルの配置

- ユニットテスト: `__tests__/**/*.test.ts(x)`
- E2Eテスト: `e2e/**/*.spec.ts`

## 初回セットアップ

Playwrightのブラウザをインストール:

```bash
pnpm exec playwright install
```

## 開発フロー

### 基本的な開発サイクル

1. **機能開発**: 新機能を実装
2. **ユニットテスト作成**: `__tests__/`にテストを追加
3. **E2Eテスト作成**: `e2e/`にテストを追加（必要に応じて）
4. **テスト実行**: `pnpm test`と`pnpm test:e2e`で確認
5. **リント実行**: `pnpm lint`でコード品質を確認
6. **ビルド確認**: `pnpm build`で本番ビルドが成功することを確認
7. **コミット**: 変更をコミット

### Claude Codeでの開発Tips

#### 1. コンテキストを活用

プロジェクト全体の理解を深めるため、以下のファイルを参照:

- `lib/github.ts` - GitHub API との通信ロジック
- `lib/types.ts` - 型定義
- `lib/config.ts` - 設定値
- `app/page.tsx` - トップページ（検索機能）
- `app/repos/[owner]/[repo]/page.tsx` - 詳細ページ

#### 2. テストファースト開発

新機能を追加する際は、まずテストを書いてから実装することを推奨:

```bash
# テストを作成
__tests__/lib/new-feature.test.ts

# ウォッチモードで開発
pnpm test:watch
```

#### 3. コンポーネントの再利用

`components/ui/` にある shadcn/ui コンポーネントを活用:

- `button.tsx` - ボタン
- `card.tsx` - カード
- `input.tsx` - 入力フィールド
- `select.tsx` - セレクトボックス
- など

#### 4. エラーハンドリング

`lib/github.ts` のパターンに従ってエラーハンドリングを実装:

```typescript
try {
  // API呼び出し
} catch (error) {
  if (error instanceof RequestError) {
    if (error.status === 403) {
      throw new Error("APIの利用回数制限に達しました。");
    }
    // その他のエラー処理
  }
  throw new Error("予期せぬエラーが発生しました。");
}
```

## テストのベストプラクティス

### ユニットテスト (Jest)

- モックを適切に使用してAPI呼び出しを分離
- エラーケースも含めて網羅的にテスト
- テストは独立して実行可能に保つ

### E2Eテスト (Playwright)

- ユーザーの実際の操作フローをテスト
- 適切な待機とタイムアウトを設定
- エラーメッセージの表示も確認

## プロジェクト構成

```
GitHubRepoSearchApp/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # トップページ（検索機能）
│   ├── layout.tsx                # ルートレイアウト
│   ├── error.tsx                 # エラーページ
│   └── repos/[owner]/[repo]/     # 詳細ページ
│       ├── page.tsx
│       └── error.tsx
├── components/                   # コンポーネント
│   ├── ui/                       # shadcn/ui コンポーネント
│   ├── theme-provider.tsx        # テーマプロバイダー
│   └── theme-toggle.tsx          # テーマ切り替え
├── lib/                          # ライブラリとユーティリティ
│   ├── github.ts                 # GitHub API クライアント
│   ├── types.ts                  # 型定義
│   ├── config.ts                 # 設定値
│   └── utils.ts                  # ユーティリティ関数
├── __tests__/                    # ユニットテスト
│   └── lib/
│       └── github.test.ts
├── e2e/                          # E2Eテスト
│   └── app.spec.ts
├── jest.config.ts                # Jest設定
├── playwright.config.ts          # Playwright設定
└── next.config.mjs               # Next.js設定
```

## よくある開発タスク

### 新しいAPIエンドポイントの追加

1. `lib/github.ts` に新しい関数を追加
2. `lib/types.ts` に必要な型を定義
3. `__tests__/lib/github.test.ts` にテストを追加
4. コンポーネントから呼び出し

### 新しいページの追加

1. `app/` 配下に新しいディレクトリを作成
2. `page.tsx` でページコンポーネントを実装
3. 必要に応じて `layout.tsx` や `error.tsx` を追加
4. `e2e/` にE2Eテストを追加

### UIコンポーネントの追加

```bash
# shadcn/ui コンポーネントを追加
pnpx shadcn-ui@latest add [component-name]
```

### スタイルのカスタマイズ

- `tailwind.config.ts` でTailwind CSSの設定を変更
- `app/globals.css` でグローバルスタイルを調整

## トラブルシューティング

### APIレート制限エラー

環境変数 `GITHUB_ACCESS_TOKEN` が正しく設定されているか確認:

```bash
# .env.local の内容を確認
cat .env.local

# 開発サーバーを再起動
pnpm dev
```

### テストの失敗

```bash
# キャッシュをクリア
rm -rf .next
rm -rf node_modules/.cache

# テストを再実行
pnpm test
```

### Playwrightブラウザのインストール

```bash
# ブラウザを再インストール
pnpm exec playwright install --force
```

## CI/CD統合

GitHub Actionsでテストを自動実行する例:

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Build
        run: pnpm build
```

## 参考リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [GitHub API Documentation](https://docs.github.com/en/rest)

## その他のドキュメント

- [README.md](README.md) - プロジェクト概要とセットアップ
- [DESIGN.md](DESIGN.md) - 設計思想と主要機能
