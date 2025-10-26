import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "lucide-react";
import { Button } from "./button";

/**
 * ボタンコンポーネント
 *
 * 様々なスタイルとサイズのボタンを提供します。
 */
const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "ボタンのスタイル",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "ボタンのサイズ",
    },
    disabled: {
      control: "boolean",
      description: "無効状態",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * デフォルトボタン
 */
export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

/**
 * セカンダリボタン
 */
export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

/**
 * 破壊的操作ボタン（削除など）
 */
export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

/**
 * アウトラインボタン
 */
export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

/**
 * ゴーストボタン
 */
export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

/**
 * リンクスタイル
 */
export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
  },
};

/**
 * 小サイズ
 */
export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

/**
 * 大サイズ
 */
export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

/**
 * アイコン付きボタン
 */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Search className="mr-2 h-4 w-4" />
        Search
      </>
    ),
  },
};

/**
 * 無効状態
 */
export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

/**
 * 全バリエーション
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-2">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex gap-2">
        <Button disabled>Disabled</Button>
      </div>
    </div>
  ),
};
