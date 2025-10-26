import type { Meta, StoryObj } from "@storybook/react";
import { ErrorDisplay } from "./error-display";

/**
 * エラー表示コンポーネント
 *
 * ユーザーフレンドリーなエラーメッセージを表示します
 */
const meta: Meta<typeof ErrorDisplay> = {
  title: "UI/ErrorDisplay",
  component: ErrorDisplay,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "エラータイトル",
    },
    message: {
      control: "text",
      description: "エラーメッセージ",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorDisplay>;

/**
 * デフォルトエラー
 */
export const Default: Story = {
  args: {
    message: "予期せぬエラーが発生しました。",
  },
};

/**
 * 404エラー
 */
export const NotFound: Story = {
  args: {
    title: "ページが見つかりません",
    message: "お探しのページは存在しないか、移動した可能性があります。",
  },
};

/**
 * レート制限エラー
 */
export const RateLimit: Story = {
  args: {
    title: "APIレート制限",
    message:
      "APIの利用回数制限に達しました。しばらくしてから再度お試しください。 リセット時刻: 16:00:00",
  },
};

/**
 * ネットワークエラー
 */
export const NetworkError: Story = {
  args: {
    title: "接続エラー",
    message:
      "サーバーに接続できませんでした。インターネット接続を確認してください。",
  },
};

/**
 * バリデーションエラー
 */
export const ValidationError: Story = {
  args: {
    title: "入力エラー",
    message: "検索クエリは必須です。検索条件を入力してください。",
  },
};
