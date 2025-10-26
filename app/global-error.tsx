"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

/**
 * グローバルエラーバウンダリ
 * アプリケーション全体で捕捉されないエラーを処理
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="container mx-auto p-4 md:p-8 max-w-7xl min-h-screen flex items-center justify-center">
          <ErrorDisplay
            title="予期せぬエラーが発生しました"
            message={error.message || "アプリケーションでエラーが発生しました。"}
            reload={reset}
          />
        </div>
      </body>
    </html>
  );
}
