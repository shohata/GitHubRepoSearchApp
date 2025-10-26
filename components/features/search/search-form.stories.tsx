import type { Meta, StoryObj } from "@storybook/react";
import { SearchForm } from "./search-form";

// Next.jsのhooksをモック
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: () => null,
  }),
}));

/**
 * 検索フォームコンポーネント
 *
 * GitHubリポジトリを検索するためのフォーム
 */
const meta: Meta<typeof SearchForm> = {
  title: "Features/Search/SearchForm",
  component: SearchForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

/**
 * デフォルト（空の状態）
 */
export const Default: Story = {};

/**
 * フォームの動作デモ
 */
export const Interactive: Story = {
  render: () => (
    <div className="w-[600px]">
      <SearchForm />
      <p className="text-sm text-muted-foreground mt-4">
        リポジトリ名を入力して検索してください
      </p>
    </div>
  ),
};
