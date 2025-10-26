import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

/**
 * カードコンポーネント
 *
 * コンテンツをグループ化するためのコンテナ
 */
const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * 基本的なカード
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>カードタイトル</CardTitle>
        <CardDescription>カードの説明文がここに入ります</CardDescription>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツがここに表示されます。</p>
      </CardContent>
    </Card>
  ),
};

/**
 * フッター付きカード
 */
export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>リポジトリを作成</CardTitle>
        <CardDescription>新しいプロジェクトを開始します</CardDescription>
      </CardHeader>
      <CardContent>
        <p>リポジトリ名を入力してください。</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">キャンセル</Button>
        <Button>作成</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * リポジトリ情報カード（実例）
 */
export const RepoInfo: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>facebook/react</CardTitle>
        <CardDescription>
          A declarative, efficient, and flexible JavaScript library for building
          user interfaces.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <div className="text-xl font-bold">220k</div>
            <div className="text-sm text-muted-foreground">Stars</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <div className="text-xl font-bold">45k</div>
            <div className="text-sm text-muted-foreground">Forks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
