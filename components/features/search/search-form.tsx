"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchForm } from "./use-search-form";

// 検索フォームのUIコンポーネント
export function SearchForm() {
  const { initialQuery, handleSubmit } = useSearchForm();

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <div className="flex-grow">
        <Label htmlFor="search-input" className="sr-only">
          リポジトリを検索
        </Label>
        <Input
          id="search-input"
          className="w-full"
          type="text"
          name="q"
          defaultValue={initialQuery}
          key={initialQuery}
          placeholder="リポジトリを検索..."
          required
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}
