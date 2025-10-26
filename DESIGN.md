# 設計思想と技術選定

このドキュメントでは、GitHub リポジトリ検索アプリケーションの設計思想、技術選定の理由、実装時に工夫したポイントを説明します。

## 目次

1. [アーキテクチャ設計](#アーキテクチャ設計)
2. [技術選定](#技術選定)
3. [UI/UX設計](#uiux設計)
4. [パフォーマンス最適化](#パフォーマンス最適化)
5. [開発体験と保守性](#開発体験と保守性)
6. [品質保証戦略](#品質保証戦略)
7. [セキュリティ](#セキュリティ)
8. [今後の展望](#今後の展望)

---

## アーキテクチャ設計

### Next.js 15 App Routerの採用

最新のNext.js 15とApp Routerを採用し、モダンなReactアプリケーションのベストプラクティスに従った設計を実現しています。

**主な特徴:**

- **サーバーコンポーネント優先**: デフォルトでサーバーコンポーネントを使用し、必要な箇所のみクライアントコンポーネント化
- **ファイルベースルーティング**: 直感的なフォルダ構造でルーティングを管理
- **レイアウトとエラーハンドリング**: `layout.tsx`、`error.tsx`、`not-found.tsx`による階層的なUI管理

### APIレイヤーの設計

GitHub APIとの通信は、専用のAPIレイヤー（[lib/github.ts](lib/github.ts)）に集約しています。

```typescript
// lib/github.ts の設計パターン
async function getRepo(owner: string, repo: string): Promise<GitHubRepo> {
  try {
    const octokit = getOctokitClient();
    const res = await octokit.rest.repos.get({ owner, repo });
    return res.data;
  } catch (error) {
    handleGitHubError(error, "repo");
  }
}
```

**設計のメリット:**

1. **単一責任の原則**: API通信ロジックを一箇所に集約
2. **エラーハンドリングの統一**: `handleGitHubError`による一貫したエラー処理
3. **テストの容易性**: APIロジックを独立してテスト可能
4. **型安全性**: TypeScriptによる完全な型定義

### Octokitクライアントの管理

GitHub API呼び出しには公式のOctokit SDKを使用し、認証トークンを安全に管理しています（[lib/octokit-client.ts](lib/octokit-client.ts)）。

**セキュリティ対策:**

- 環境変数（`GITHUB_ACCESS_TOKEN`）によるトークン管理
- サーバーサイドでのみトークンを使用、クライアントに公開しない
- レート制限の適切な処理

### データフェッチング戦略

- **サーバーコンポーネント**: リポジトリ詳細ページはSSR（Server-Side Rendering）
- **クライアントコンポーネント**: 検索結果はSWRによるクライアントサイドフェッチング
- **ISR**: リポジトリ詳細ページは1時間ごとに再生成（[app/repos/[owner]/[repo]/page.tsx:12](app/repos/[owner]/[repo]/page.tsx#L12)）

---

## 技術選定

### フレームワーク・ライブラリ

| 技術 | 採用理由 |
|------|---------|
| **Next.js 15** | React最新機能対応、App Router、ISR、SSR、優れた開発体験 |
| **TypeScript** | 型安全性による開発効率向上、バグの早期発見 |
| **Tailwind CSS** | ユーティリティファーストによる高速な開発、一貫したデザイン |
| **shadcn/ui** | アクセシブルで再利用可能なコンポーネント、カスタマイズ性 |
| **SWR** | クライアントサイドのデータフェッチング、キャッシュ戦略 |
| **Octokit** | GitHub API公式SDK、型安全なAPI呼び出し |
| **Zod** | ランタイムバリデーション、型推論 |

### 開発ツール

| ツール | 採用理由 |
|--------|---------|
| **Biome** | 高速なリンター/フォーマッター、ESLintとPrettierの代替 |
| **Jest** | ユニットテスト、コンポーネントテスト |
| **Testing Library** | ユーザー中心のコンポーネントテスト |
| **Playwright** | クロスブラウザE2Eテスト、高信頼性 |
| **Storybook** | コンポーネント開発・ドキュメント化、デザインシステム基盤 |

### なぜBiomeを採用したか

従来のESLint + Prettierの組み合わせではなく、Biomeを採用しました。

**理由:**

- **圧倒的な高速性**: Rustベースの実装により、ESLintの10-20倍高速
- **設定の簡潔性**: 1つの設定ファイル（`biome.json`）で完結
- **統合ツール**: リンターとフォーマッターが統合され、競合がない
- **Next.js 15対応**: 最新のReact/Next.jsに完全対応

### なぜStorybookを導入したか

コンポーネント駆動開発（CDD）を実現するため、Storybookを導入しました。

**メリット:**

1. **独立した開発環境**: アプリケーションから切り離してUIコンポーネントを開発
2. **ドキュメント自動生成**: Props、使用例が自動的にドキュメント化
3. **ビジュアルテスト基盤**: Chromatic連携でUIリグレッション検出
4. **アクセシビリティテスト**: a11yアドオンによる自動チェック
5. **デザインシステム構築**: コンポーネントカタログとして機能

---

## UI/UX設計

### デザインシステム（shadcn/ui）

[shadcn/ui](https://ui.shadcn.com/)を採用し、一貫性のあるデザインシステムを構築しています。

**shadcn/uiの特徴:**

- **コピー&ペースト方式**: npmパッケージではなく、ソースコードをプロジェクトに直接配置
- **完全なカスタマイズ性**: コンポーネントのコードを直接編集可能
- **Radix UI基盤**: アクセシビリティが組み込まれた堅牢なプリミティブ
- **Tailwind CSS統合**: ユーティリティクラスによる柔軟なスタイリング

**使用しているコンポーネント:**

- Button, Input, Card, Label, Select
- Dialog, DropdownMenu
- カスタムコンポーネント（ErrorDisplay, Spinner, Pagination）

### テーマ切り替え機能

`next-themes`を使用したダークモード対応を実装しています（[components/features/theme/theme-provider.tsx](components/features/theme/theme-provider.tsx)）。

**実装の工夫:**

- システム設定に自動追従（`system`オプション）
- ローカルストレージによる設定永続化
- 画面のちらつき防止（script injection）
- アクセシブルなテーマ切り替えボタン

### レスポンシブデザイン

Tailwind CSSのブレークポイントを活用し、モバイルファーストのレスポンシブデザインを実現しています。

```tsx
// モバイルファーストのレスポンシブクラス例
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### ローディング状態とエラー表示

**ローディング状態:**

- カスタムSpinnerコンポーネント（[components/ui/spinner.tsx](components/ui/spinner.tsx)）
- Suspense境界による段階的な読み込み

**エラー表示:**

- 専用ErrorDisplayコンポーネント（[components/ui/error-display.tsx](components/ui/error-display.tsx)）
- ステータスコード別のメッセージ（404, 403など）
- エラーバウンダリによる回復可能なエラーハンドリング

### ページネーション

検索結果のページネーションは、UX を考慮した独自実装です（[components/ui/pagination.tsx](components/ui/pagination.tsx)）。

**工夫したポイント:**

- 現在のページをハイライト表示
- ページ番号の省略表示（1...5 6 7...20）
- 前後ページへの快適な移動
- URLパラメータによる状態管理

---

## パフォーマンス最適化

### ISR（Incremental Static Regeneration）

リポジトリ詳細ページにISRを適用し、パフォーマンスとデータ鮮度のバランスを実現しています。

```typescript
// app/repos/[owner]/[repo]/page.tsx
export const revalidate = 3600; // 1時間ごとに再生成
```

**メリット:**

- 初回アクセス時の高速表示（静的生成済みページを配信）
- 定期的なデータ更新（1時間ごと）
- GitHub API呼び出しの削減（レート制限対策）

### SWRによるクライアントサイドキャッシング

検索結果の表示にSWRを採用し、効率的なデータフェッチングを実現しています（[components/features/search/use-search-results.ts](components/features/search/use-search-results.ts)）。

**SWRの利点:**

- **自動キャッシュ**: 同じクエリの再取得を防止
- **バックグラウンド更新**: stale-while-revalidate戦略
- **フォーカス時再検証**: ウィンドウフォーカス時に最新データを取得
- **エラーリトライ**: 失敗時の自動リトライ

### 動的メタデータ生成

`generateMetadata`関数により、各リポジトリページのメタデータを動的に生成しています。

**SEO効果:**

- リポジトリ名をページタイトルに含める
- OGP（Open Graph Protocol）タグによるSNS共有最適化
- 説明文の動的生成

---

## 開発体験と保守性

### カスタムフックによるロジック分離

UIコンポーネントとビジネスロジックを分離し、テスタビリティと再利用性を向上させています。

**主要カスタムフック:**

- [use-search-form.ts](components/features/search/use-search-form.ts): 検索フォームのロジック
- [use-search-results.ts](components/features/search/use-search-results.ts): 検索結果のデータフェッチング
- [use-pagination.ts](components/ui/pagination/use-pagination.ts): ページネーションロジック

**設計パターン:**

```typescript
// カスタムフックの設計例
export const useSearchForm = (initialQuery = "", initialSort = "stars") => {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // フォーム送信ロジック
  };

  return { query, setQuery, sort, setSort, handleSubmit };
};
```

### 型安全性の徹底

TypeScriptの型システムを最大限活用し、実行時エラーを防止しています。

**型定義の戦略:**

1. **GitHub API型定義**: [lib/types.ts](lib/types.ts)でGitHub APIのレスポンス型を定義
2. **Zodによるランタイムバリデーション**: [lib/validations.ts](lib/validations.ts)でパラメータ検証
3. **コンポーネントProps型**: すべてのコンポーネントでPropsを厳密に型定義

```typescript
// Zodによるバリデーション例
const repoParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export type RepoParams = z.infer<typeof repoParamsSchema>;
```

### エラーハンドリングの一元化

GitHub APIのエラーハンドリングを[lib/errors.ts](lib/errors.ts)に集約しています。

**エラー処理の工夫:**

- HTTPステータスコード別の詳細なエラーメッセージ
- レート制限エラーの特別処理（リセット時刻表示）
- カスタムエラークラス（`GitHubAPIError`）

```typescript
// エラーハンドリング例
case 403: {
  const remaining = error.response?.headers?.["x-ratelimit-remaining"];
  const resetTime = error.response?.headers?.["x-ratelimit-reset"];
  let message: string = ERROR_MESSAGES.RATE_LIMIT_EXCEEDED;

  if (resetTime) {
    const resetDate = new Date(Number(resetTime) * 1000);
    const remainingText = remaining ? ` (残り: ${remaining}回)` : "";
    message = `${ERROR_MESSAGES.RATE_LIMIT_EXCEEDED} リセット時刻: ${resetDate.toLocaleTimeString("ja-JP")}${remainingText}`;
  }

  throw new GitHubAPIError(message, 403, error);
}
```

### コンポーネント設計

**Atomic Designに影響を受けた構造:**

```
components/
├── ui/              # 基本UIコンポーネント（Atoms/Molecules）
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
└── features/        # 機能コンポーネント（Organisms）
    ├── search/
    ├── repo/
    └── theme/
```

**コンポーネント原則:**

- 単一責任の原則: 1コンポーネント = 1つの責務
- 再利用性: 汎用的なUIコンポーネントとドメイン固有のコンポーネントを分離
- テスト容易性: Propsによる制御で単体テスト可能

---

## 品質保証戦略

### 包括的なテスト戦略

テストピラミッドに基づく多層的なテスト戦略を採用しています。

```
        E2E Tests (Playwright)
       /                      \
  Component Tests (Testing Library)
 /                                    \
Unit Tests (Jest)
```

### ユニットテスト（Jest）

**カバレッジ目標: 96%以上**

主なテスト対象:

- API通信ロジック（[__tests__/lib/github.test.ts](__tests__/lib/github.test.ts)）
- エラーハンドリング（[__tests__/lib/errors.test.ts](__tests__/lib/errors.test.ts)）
- カスタムフック（[__tests__/components/hooks/](__tests__/components/hooks/)）
- バリデーション（[__tests__/lib/validations.test.ts](__tests__/lib/validations.test.ts)）

**テスト手法:**

- モックを活用したAPI呼び出しの分離
- エッジケース・エラーケースの網羅
- スナップショットテストによるレンダリング検証

### コンポーネントテスト（Testing Library）

**ユーザー視点のテスト:**

```typescript
// Testing Libraryの設計思想
test("検索フォームに入力して送信できる", async () => {
  const user = userEvent.setup();
  render(<SearchForm />);

  const input = screen.getByPlaceholderText("リポジトリを検索");
  await user.type(input, "react");
  await user.click(screen.getByRole("button", { name: "検索" }));

  expect(input).toHaveValue("react");
});
```

**テスト原則:**

- 実装詳細ではなく、ユーザーの操作をテスト
- アクセシビリティを考慮したクエリ（`getByRole`など）
- ユーザーイベント（`userEvent`）による操作シミュレーション

### E2Eテスト（Playwright）

**主要なユーザーフロー:**

1. リポジトリ検索フロー（[e2e/app.spec.ts](e2e/app.spec.ts)）
2. ページネーション
3. リポジトリ詳細表示
4. エラーハンドリング

**Playwrightの利点:**

- クロスブラウザテスト（Chromium, Firefox, WebKit）
- 自動待機による安定したテスト
- スクリーンショット・動画記録
- UIモードによる対話的デバッグ

### Storybook（ビジュアルテスト基盤）

Storybookをビジュアルテストとドキュメントのベースとしています。

**作成済みストーリー:**

- UIコンポーネント: Button, Input, Card, ErrorDisplay, Spinner
- Featureコンポーネント: RepoStatCard, SearchForm

**活用方法:**

1. コンポーネントのバリエーション確認
2. アクセシビリティチェック（a11yアドオン）
3. レスポンシブデザイン検証
4. 将来的なChromatic連携によるビジュアルリグレッション検出

---

## セキュリティ

### Content Security Policy (CSP)

[next.config.mjs](next.config.mjs)で包括的なセキュリティヘッダーを設定しています。

**設定項目:**

```javascript
headers: [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https://avatars.githubusercontent.com data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.github.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
]
```

### XSS対策の多層防御

1. **CSPヘッダー**: スクリプト実行を制限
2. **Zodバリデーション**: 入力値のランタイム検証
3. **Reactの自動エスケープ**: デフォルトでXSS防止
4. **型安全性**: TypeScriptによる静的解析

### 認証トークンの安全な管理

- 環境変数による管理（`.env.local`）
- サーバーサイドのみでトークン使用
- クライアントコードへの露出防止

---

## 今後の展望

### 機能拡張の候補

1. **高度な検索フィルター**
   - プログラミング言語フィルター
   - スター数・フォーク数での絞り込み
   - 更新日時でのソート

2. **お気に入り機能**
   - ローカルストレージによる永続化
   - お気に入りリストの管理

3. **リポジトリ比較機能**
   - 複数リポジトリの並列表示
   - 統計情報の比較

### パフォーマンス改善

1. **画像最適化**
   - Next.js Imageコンポーネントの活用
   - アバター画像の最適化

2. **コード分割**
   - Dynamic Importによる遅延読み込み
   - ルートベースのコード分割

### テスト強化

1. **ビジュアルリグレッションテスト**
   - Chromaticの導入
   - UIの意図しない変更を自動検出

2. **パフォーマンステスト**
   - Lighthouse CI
   - Core Web Vitalsの継続的監視

### アクセシビリティ向上

1. **WCAG 2.1 AA準拠**
   - キーボード操作の完全サポート
   - スクリーンリーダー対応強化

2. **アクセシビリティテスト自動化**
   - axe-coreの統合
   - CI/CDパイプラインでの自動チェック

---

## まとめ

このアプリケーションは、以下の原則に基づいて設計・実装されています:

1. **ユーザー第一**: 高速で使いやすいUIを提供
2. **開発者体験**: 型安全性、テスト容易性、保守性を重視
3. **品質保証**: 包括的なテスト戦略による高品質コード
4. **セキュリティ**: 多層的なセキュリティ対策
5. **パフォーマンス**: ISR、SWR、最適化手法の適用

モダンなWebアプリケーション開発のベストプラクティスを実践し、スケーラブルで保守しやすいコードベースを実現しています。
