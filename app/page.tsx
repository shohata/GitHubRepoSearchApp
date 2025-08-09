import React, { lazy, Suspense } from "react";
import ModeToggle from "@/components/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import SearchForm from "@/components/features/search/search-form";
import SearchResults from "@/components/features/search/search-results";
import { SearchParams } from "@/lib/types";

// メインの検索ページ
export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">GitHub Repository Search App</h1>
        <ModeToggle />
      </div>
      <Suspense fallback={<Spinner />}>
        <SearchForm searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<Spinner className="mt-8" />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
