import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "./button";

type ErrorDisplayProps = {
  title?: string;
  message: string;
  reload?: () => void;
};

export function ErrorDisplay({
  title = "エラーが発生しました。",
  message,
  reload = () => window.location.reload(),
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
      <h3 className="text-xl font-semibold text-destructive">{title}</h3>
      <p className="text-muted-foreground mt-2">{message}</p>
      <div className="flex gap-4 mt-2">
        <Button onClick={reload}>再試行</Button>
        <Button variant="secondary" asChild>
          <Link href="/" className="flex center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            トップページに戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}
