"use client";

import { RepoList } from "./repo-list";
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
import { ErrorDisplay } from "@/components/ui/error-display";
import { useSearchResults } from "./use-search-results";

/**
 * 検索結果を表示するコンポーネント
 */
export function SearchResults() {
  // 検索ロジックをカスタムフックから取得
  const {
    query,
    page,
    isLoading,
    isError,
    repos,
    total_count,
    totalPage,
    pagination,
  } = useSearchResults();

  // 検索クエリがない場合
  if (!query) {
    return (
      <div className="text-center text-muted-foreground mt-16">
        <p>リポジトリを検索して、結果をここに表示します。</p>
      </div>
    );
  }

  // データ取得中の表示
  if (isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <Spinner />
      </div>
    );
  }

  // 検索結果がない場合
  if (repos.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        リポジトリが見つかりませんでした。
      </div>
    );
  }

  // エラー発生時の表示
  if (isError) {
    return <ErrorDisplay message="リポジトリの取得に失敗しました。" />;
  }

  // 検索結果の表示
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        検索結果: {total_count}件
      </p>

      <RepoList repos={repos} />

      <Pagination className="mt-4">
        <PaginationContent>
          {/* 前のページへのリンク */}
          {page > 1 && (
            <PaginationPrevious href={`/?q=${query}&page=${page - 1}`} />
          )}

          {/* ページ番号 */}
          {pagination.map((item, index) => {
            if (item.type === "ellipsis") {
              return <PaginationEllipsis key={`ellipsis-${index}`} />;
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
