import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

type ErrorDisplayProps = {
  title?: string;
  message: string;
  reload?: () => void;
};

/**
 * エラー情報を表示するコンポーネント
 * ユーザーフレンドリーなエラーメッセージと再試行オプションを提供
 *
 * @param title - エラーのタイトル
 * @param message - エラーの詳細メッセージ
 * @param reload - 再試行時のコールバック関数
 */
export function ErrorDisplay({
  title = "エラーが発生しました。",
  message,
  reload = () => window.location.reload(),
}: ErrorDisplayProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg"
      role="alert"
      aria-live="assertive"
    >
      <AlertTriangle
        className="w-12 h-12 text-destructive mb-4"
        aria-hidden="true"
      />
      <h3 className="text-xl font-semibold text-destructive" id="error-title">
        {title}
      </h3>
      <p className="text-muted-foreground mt-2" id="error-message">
        {message}
      </p>
      {/* biome-ignore lint/a11y/useSemanticElements: role="group" provides better semantic grouping for action buttons */}
      <div
        className="flex gap-4 mt-4"
        role="group"
        aria-labelledby="error-title"
      >
        <Button onClick={reload} aria-label="ページを再読み込み">
          再試行
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            トップページに戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}
