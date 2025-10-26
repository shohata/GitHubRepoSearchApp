"use client";

import { ErrorDisplay } from "@/components/ui/error-display";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { RepoList } from "./repo-list";
import { useSearchResults } from "./use-search-results";

// 検索結果を表示するコンポーネント
export function SearchResults() {
  // 検索ロジックをカスタムフックから取得
  const {
    query,
    page,
    error,
    isLoading,
    repos,
    totalCount,
    totalPage,
    pagination,
  } = useSearchResults();

  // エラー発生時の表示
  if (error) {
    return (
      <ErrorDisplay title="リポジトリの検索に失敗しました。" message={error} />
    );
  }

  // 検索クエリがない場合
  if (!query) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: role="status" with aria-live is intentional for dynamic content announcements
      <div
        className="text-center text-muted-foreground mt-16"
        role="status"
        aria-live="polite"
      >
        <p>リポジトリを検索して、結果をここに表示します。</p>
      </div>
    );
  }

  // データ取得中の表示
  if (isLoading) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: role="status" with aria-live is intentional for loading state announcements
      <div
        className="flex justify-center mt-8"
        role="status"
        aria-live="polite"
      >
        <Spinner />
        <span className="sr-only">検索中...</span>
      </div>
    );
  }

  // 検索結果がない場合
  if (repos.length === 0) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: role="status" with aria-live is intentional for no results announcements
      <div
        className="text-center text-muted-foreground mt-8"
        role="status"
        aria-live="polite"
      >
        <p>「{query}」に一致するリポジトリが見つかりませんでした。</p>
      </div>
    );
  }

  // 検索結果の表示
  return (
    <div>
      {/* biome-ignore lint/a11y/useSemanticElements: role="status" with aria-live is intentional for result count announcements */}
      <p
        className="text-sm text-muted-foreground mt-4 mb-4"
        role="status"
        aria-live="polite"
      >
        検索結果: {totalCount.toLocaleString()}件
      </p>

      {totalCount > 1000 && (
        <p
          className="text-sm text-muted-foreground mt-4 mb-4"
          role="alert"
          aria-live="polite"
        >
          検索結果が多数あります。APIの仕様により、最初の1,000件のみ表示しています。
        </p>
      )}

      <RepoList repos={repos} />

      <Pagination className="mt-4">
        <PaginationContent>
          {/* 前のページへのリンク */}
          {page > 1 && (
            <PaginationPrevious href={`/?q=${query}&page=${page - 1}`} />
          )}

          {/* ページ番号 */}
          {pagination.map((item) => {
            if (item.type === "ellipsis") {
              return <PaginationEllipsis key={item.id} />;
            }
            return (
              <PaginationItem key={item.pageNumber}>
                <PaginationLink
                  href={`/?q=${query}&page=${item.pageNumber}`}
                  isActive={item.isActive}
                >
                  {item.pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* 次のページへのリンク */}
          {page < totalPage && (
            <PaginationNext href={`/?q=${query}&page=${page + 1}`} />
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
