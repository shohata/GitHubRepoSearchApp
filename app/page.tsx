"use client";

import { Suspense, use } from "react";
import ModeToggle from "@/components/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import SearchForm from "@/components/features/search/search-form";
import SearchResults from "@/components/features/search/search-results";

// メインの検索ページ
export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const query = resolvedParams.q || "";
  const page = resolvedParams.page || "1";

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">GitHub Repository Search App</h1>
        <ModeToggle />
      </div>
      <SearchForm query={query} />
      <Suspense
        key={query + page}
        fallback={
          <div className="flex justify-center mt-8">
            <Spinner />
          </div>
        }
      >
        {query ? (
          <SearchResults query={query} page={page} />
        ) : (
          <div className="text-center text-muted-foreground mt-16">
            <p>リポジトリを検索して、結果をここに表示します。</p>
          </div>
        )}
      </Suspense>
    </div>
  );
}
