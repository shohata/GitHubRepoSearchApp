// リポジトリ情報カードコンポーネント
export function RepoStatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
      <Icon className="h-6 w-6 text-muted-foreground mb-2" />
      <div className="text-xl font-bold">{value.toLocaleString()}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
