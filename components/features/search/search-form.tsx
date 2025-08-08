import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 検索フォームのコンポーネント
export default function SearchForm({ query }: { query: string }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(query);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?q=${searchTerm}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <div className="flex-grow">
        <Label htmlFor="search-input" className="sr-only">
          リポジトリを検索
        </Label>
        <Input
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="リポジトリを検索..."
          className="w-full"
          required
        />
      </div>
      <Button type="submit">検索</Button>
    </form>
  );
}
