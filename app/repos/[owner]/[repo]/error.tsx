"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex h-[calc(100vh-10rem)] flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-2xl font-bold">リポジトリの読み込みに失敗しました</h2>
      <p className="text-muted-foreground">時間をおいて再度お試しください。</p>
      <Button onClick={() => reset()}>再試行</Button>
    </div>
  );
}
