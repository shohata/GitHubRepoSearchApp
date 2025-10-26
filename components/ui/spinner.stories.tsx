import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";

/**
 * スピナーコンポーネント
 *
 * ローディング状態を示すアニメーション
 */
const meta: Meta<typeof Spinner> = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

/**
 * デフォルト
 */
export const Default: Story = {};

/**
 * カスタムサイズ
 */
export const CustomSize: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Spinner className="h-4 w-4" />
      <Spinner className="h-8 w-8" />
      <Spinner className="h-12 w-12" />
      <Spinner className="h-16 w-16" />
    </div>
  ),
};

/**
 * カスタムカラー
 */
export const CustomColor: Story = {
  render: () => (
    <div className="flex gap-4">
      <Spinner className="text-blue-500" />
      <Spinner className="text-green-500" />
      <Spinner className="text-red-500" />
      <Spinner className="text-purple-500" />
    </div>
  ),
};

/**
 * センター配置
 */
export const Centered: Story = {
  render: () => (
    <div className="flex justify-center items-center h-64 border-2 border-dashed rounded">
      <Spinner />
    </div>
  ),
};
