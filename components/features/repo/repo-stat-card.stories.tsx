import type { Meta, StoryObj } from "@storybook/react";
import { AlertCircle, Eye, GitFork, Star } from "lucide-react";
import { RepoStatCard } from "./repo-stat-card";

/**
 * リポジトリ統計カードコンポーネント
 *
 * スター数、フォーク数などの統計情報を表示します
 */
const meta: Meta<typeof RepoStatCard> = {
  title: "Features/Repo/RepoStatCard",
  component: RepoStatCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RepoStatCard>;

/**
 * スター数
 */
export const Stars: Story = {
  args: {
    icon: Star,
    label: "Stars",
    value: 220000,
  },
};

/**
 * ウォッチャー数
 */
export const Watchers: Story = {
  args: {
    icon: Eye,
    label: "Watchers",
    value: 7000,
  },
};

/**
 * フォーク数
 */
export const Forks: Story = {
  args: {
    icon: GitFork,
    label: "Forks",
    value: 45000,
  },
};

/**
 * イシュー数
 */
export const Issues: Story = {
  args: {
    icon: AlertCircle,
    label: "Issues",
    value: 1000,
  },
};

/**
 * 小さい数値
 */
export const SmallNumber: Story = {
  args: {
    icon: Star,
    label: "Stars",
    value: 42,
  },
};

/**
 * ゼロ
 */
export const Zero: Story = {
  args: {
    icon: AlertCircle,
    label: "Issues",
    value: 0,
  },
};

/**
 * 全統計の表示
 */
export const AllStats: Story = {
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <RepoStatCard icon={Star} label="Stars" value={220000} />
      <RepoStatCard icon={Eye} label="Watchers" value={7000} />
      <RepoStatCard icon={GitFork} label="Forks" value={45000} />
      <RepoStatCard icon={AlertCircle} label="Issues" value={1000} />
    </div>
  ),
};
