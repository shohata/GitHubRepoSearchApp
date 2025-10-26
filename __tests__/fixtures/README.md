# テストフィクスチャ

このディレクトリには、テストで使用される共通のモックデータとヘルパー関数が含まれています。

## 📁 ディレクトリ構造

```
fixtures/
├── github-data.ts           # GitHub APIのモックデータ
├── pagination-test-data.ts  # ページネーションのテストデータ
├── search-results-mocks.ts  # 検索結果のモック
├── validation-test-data.ts  # バリデーションのテストケース
├── errors.ts                # エラーオブジェクトのフィクスチャ
├── next-navigation.ts       # Next.js navigationモック
├── next-components.tsx      # Next.jsコンポーネントモック
├── test-helpers.ts          # テストヘルパー関数
├── index.ts                 # すべてのフィクスチャのエクスポート
└── README.md                # このファイル
```

## 🚀 使い方

### 基本的なインポート

すべてのフィクスチャは `index.ts` から一括でインポートできます:

```typescript
import {
  mockReactRepo,
  mockVueRepo,
  mockMultipleRepos,
  createMockRouter,
  createMockSearchParams,
} from "@/__tests__/fixtures";
```

### GitHub データフィクスチャ

リポジトリデータのモックを提供します。

```typescript
import { mockReactRepo, mockMultipleRepos } from "@/__tests__/fixtures";

// 単一のリポジトリ
const repo = mockReactRepo;

// 複数のリポジトリ
const repos = mockMultipleRepos;
```

### Next.js Navigation モック

`useRouter` と `useSearchParams` のモックを簡単に作成できます。

```typescript
import { createMockRouter, createMockSearchParams } from "@/__tests__/fixtures";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("MyComponent", () => {
  let mockRouter: ReturnType<typeof createMockRouter>;
  let mockSearchParams: ReturnType<typeof createMockSearchParams>;

  beforeEach(() => {
    mockRouter = createMockRouter();
    mockSearchParams = createMockSearchParams({ q: "react" });

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  test("検索パラメータが取得できる", () => {
    const query = mockSearchParams.get("q");
    expect(query).toBe("react");
  });

  test("ルーターのpushが呼ばれる", () => {
    mockRouter.push("/new-page");
    expect(mockRouter.push).toHaveBeenCalledWith("/new-page");
  });
});
```

### エラーフィクスチャ

様々なエラーケースのモックを提供します。

```typescript
import { createGitHubErrors, createCommonErrors } from "@/__tests__/fixtures";

const githubErrors = createGitHubErrors();
const commonErrors = createCommonErrors();

test("レート制限エラーを処理する", async () => {
  mockApi.mockRejectedValue(githubErrors.rateLimitError);

  await expect(fetchData()).rejects.toThrow("Rate limit exceeded");
});
```

### テストヘルパー

共通のテストヘルパー関数を提供します。

```typescript
import {
  suppressConsoleError,
  withEnv,
  mockDateNow
} from "@/__tests__/fixtures";

test("エラーログを抑制してテスト", () => {
  suppressConsoleError(() => {
    // ここではconsole.errorが抑制される
    throwError();
  });
});

test("環境変数を一時的に設定", () => {
  withEnv({ NODE_ENV: "production" }, () => {
    expect(process.env.NODE_ENV).toBe("production");
  });
  // テスト後は元に戻る
});

test("現在時刻をモック", () => {
  const restore = mockDateNow(1234567890);
  expect(Date.now()).toBe(1234567890);
  restore(); // 元に戻す
});
```

## 📝 フィクスチャの追加

新しいフィクスチャを追加する場合:

1. 適切なファイルを作成（例: `user-data.ts`）
2. `index.ts` にエクスポートを追加

```typescript
// user-data.ts
export const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
};

// index.ts に追加
export * from "./user-data";
```

## 💡 ベストプラクティス

1. **再利用性**: 複数のテストで使用されるモックデータはフィクスチャに配置
2. **明確な命名**: フィクスチャの名前は用途が明確になるようにする
3. **型安全性**: TypeScriptの型を活用してフィクスチャを定義
4. **ドキュメント**: 複雑なフィクスチャにはJSDocコメントを追加
5. **最小限**: テスト固有のデータはテストファイル内に記述

## 📚 関連ドキュメント

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Next.js Testing](https://nextjs.org/docs/testing)
