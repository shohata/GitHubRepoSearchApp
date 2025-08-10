"use client";

import { SearchForm } from "@/components/features/search/search-form";
import { SearchResults } from "@/components/features/search/search-results";

/**
 * アプリケーションのメインページ
 * 検索フォームと検索結果を表示します。
 */
export default function Page() {
  return (
    <div>
      {/* 検索フォーム */}
      <SearchForm />

      {/* 検索結果 */}
      <SearchResults />
    </div>
  );
}
