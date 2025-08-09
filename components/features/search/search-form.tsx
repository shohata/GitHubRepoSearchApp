import { use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchParams } from "@/lib/types";

// 検索フォームのコンポーネント
export default function SearchForm({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = use(searchParams);
  const query = q || "";

  return (
    <form className="flex items-center gap-4">
      <div className="flex-grow">
        <Label htmlFor="search-input" className="sr-only">
          リポジトリを検索
        </Label>
        <Input
          id="search-input"
          type="text"
          name="q"
          defaultValue={query}
          placeholder="リポジトリを検索..."
          className="w-full"
          required
        />
      </div>
      <Button type="submit">検索</Button>
    </form>
  );
}
