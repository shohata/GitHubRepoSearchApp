# Claude Codeによる開発ガイド

このドキュメントは、Claude Codeを使用してこのプロジェクトを開発・テストする際のガイドラインです。

## テスト環境

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

## 開発フロー

1. **機能開発**: 新機能を実装
2. **ユニットテスト作成**: `__tests__/`にテストを追加
3. **E2Eテスト作成**: `e2e/`にテストを追加（必要に応じて）
4. **テスト実行**: `pnpm test`と`pnpm test:e2e`で確認
5. **コミット**: 変更をコミット

## テストのベストプラクティス

### ユニットテスト (Jest)

- モックを適切に使用してAPI呼び出しを分離
- エラーケースも含めて網羅的にテスト
- テストは独立して実行可能に保つ

### E2Eテスト (Playwright)

- ユーザーの実際の操作フローをテスト
- 適切な待機とタイムアウトを設定
- エラーメッセージの表示も確認

## CI/CD統合

将来的にGitHub Actionsなどでテストを自動実行することを推奨:

```yaml
# .github/workflows/test.yml の例
- name: Run unit tests
  run: pnpm test

- name: Install Playwright
  run: pnpm exec playwright install --with-deps

- name: Run E2E tests
  run: pnpm test:e2e
```
