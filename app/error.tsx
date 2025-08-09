"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex h-[calc(100vh-10rem)] flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">エラーが発生しました</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>再試行</Button>
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            トップページに戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}
