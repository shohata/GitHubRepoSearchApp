import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";

/**
 * 入力フィールドコンポーネント
 */
const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "number"],
      description: "入力タイプ",
    },
    placeholder: {
      control: "text",
      description: "プレースホルダー",
    },
    disabled: {
      control: "boolean",
      description: "無効状態",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * デフォルト
 */
export const Default: Story = {
  args: {
    placeholder: "テキストを入力...",
  },
};

/**
 * メールアドレス入力
 */
export const Email: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
  },
};

/**
 * パスワード入力
 */
export const Password: Story = {
  args: {
    type: "password",
    placeholder: "パスワードを入力",
  },
};

/**
 * 検索入力
 */
export const Search: Story = {
  args: {
    type: "search",
    placeholder: "検索...",
  },
};

/**
 * 数値入力
 */
export const Number: Story = {
  args: {
    type: "number",
    placeholder: "数値を入力",
  },
};

/**
 * 無効状態
 */
export const Disabled: Story = {
  args: {
    placeholder: "無効な入力フィールド",
    disabled: true,
  },
};

/**
 * ラベル付き
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

/**
 * 必須フィールド
 */
export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="required">
        ユーザー名 <span className="text-destructive">*</span>
      </Label>
      <Input id="required" placeholder="ユーザー名を入力" required />
    </div>
  ),
};
