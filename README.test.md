# テスト環境

このプロジェクトでは以下のテストフレームワークを使用しています:

- **Jest**: ユニットテスト
- **Testing Library**: Reactコンポーネントのテスト
- **Playwright**: E2Eテスト

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
