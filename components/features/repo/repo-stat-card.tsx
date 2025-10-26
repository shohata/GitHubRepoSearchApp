import type { RepoStatCardProps } from "@/lib/types";

/**
 * リポジトリ統計情報を表示するカードコンポーネント
 *
 * @param icon - 表示するアイコン（Lucideアイコン）
 * @param label - 統計情報のラベル
 * @param value - 統計情報の値
 */
export function RepoStatCard({ icon: Icon, label, value }: RepoStatCardProps) {
  return (
    <div
      className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg"
      role="group"
      aria-label={`${label}: ${value.toLocaleString()}`}
    >
      <Icon className="h-6 w-6 text-muted-foreground mb-2" aria-hidden="true" />
      <div
        className="text-xl font-bold"
        aria-label={`${value.toLocaleString()}件`}
      >
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
