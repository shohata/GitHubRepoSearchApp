# Jest 自動モック

このディレクトリには、Jestの自動モック機能で使用されるモックファイルが含まれています。

## 📁 ディレクトリ構造

```
__mocks__/
├── next/
│   ├── image.tsx  # Next.js Image コンポーネントのモック
│   └── link.tsx   # Next.js Link コンポーネントのモック
└── README.md      # このファイル
```

## 🔍 Jestの自動モック機能とは

Jestは、プロジェクトルートの `__mocks__/` ディレクトリに配置されたファイルを自動的に検出し、対応するモジュールのモックとして使用します。

## 使い方

### Next.js コンポーネントのモック

テストファイルで以下のように記述するだけで、自動的に `__mocks__/next/` のモックが使用されます：

```typescript
// next/image を自動モック
jest.mock("next/image");

// next/link を自動モック
jest.mock("next/link");
```

これにより、`__mocks__/next/image.tsx` と `__mocks__/next/link.tsx` が自動的に適用されます。

## `__tests__/fixtures/next-components.tsx` との違い

### `__mocks__/next/` (このディレクトリ)
- **用途**: Jestの自動モック機能を利用
- **使用方法**: `jest.mock("next/image")` のように引数なしで呼び出す
- **メリット**: シンプルで、テストコードが簡潔

### `__tests__/fixtures/next-components.tsx`
- **用途**: 手動でカスタマイズしたモックを使用したい場合
- **使用方法**: 明示的にモック実装を指定
- **メリット**: モックの動作を細かくカスタマイズ可能

## 使用例

### 自動モック（推奨）

```typescript
// __tests__/components/my-component.test.tsx
import { render } from "@testing-library/react";
import MyComponent from "@/components/my-component";

// シンプルに自動モックを使用
jest.mock("next/image");
jest.mock("next/link");

describe("MyComponent", () => {
  test("renders correctly", () => {
    render(<MyComponent />);
    // テスト内容...
  });
});
```

### 手動モック（カスタマイズが必要な場合）

```typescript
// __tests__/components/advanced.test.tsx
import { render } from "@testing-library/react";
import { MockImage, MockLink } from "@/__tests__/fixtures";

// カスタムモックを明示的に指定
jest.mock("next/image", () => ({
  __esModule: true,
  default: MockImage,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: MockLink,
}));

describe("Advanced", () => {
  test("with custom mock behavior", () => {
    // テスト内容...
  });
});
```

## ⚠️ 重要な注意事項

1. **このディレクトリは削除しないでください**
   - 多くのテストが自動モック機能に依存しています
   - 削除するとテストが失敗します

2. **ファイル名と配置が重要**
   - `__mocks__/next/image.tsx` → `next/image` のモック
   - `__mocks__/next/link.tsx` → `next/link` のモック
   - この階層構造を維持してください

3. **他のモジュールも追加可能**
   - 同じパターンで他のモジュールのモックも追加できます
   - 例: `__mocks__/next/navigation.tsx` など

## 📚 関連リソース

- [Jest Manual Mocks](https://jestjs.io/docs/manual-mocks)
- [Next.js Testing Documentation](https://nextjs.org/docs/testing)
- [`__tests__/fixtures/README.md`](../__tests__/fixtures/README.md) - テストフィクスチャのドキュメント
