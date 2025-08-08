import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RepositorySearchResultItems } from "@/lib/types";
import RepoList from "@/components/features/search/repo-list";
import { FetchRepoSearchResult } from "@/lib/github";
import { ITEMS_PER_PAGE } from "@/lib/config";

// 検索結果を表示するコンポーネント
export default function SearchResults({
  query,
  page,
}: {
  query: string;
  page: string;
}) {
  const pageNumber = parseInt(page || "1", 10);
  const [loading, setLoading] = useState(true);
  const [repos, setRepos] = useState<RepositorySearchResultItems>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      setError(null);
      try {
        const repos = await FetchRepoSearchResult(query, pageNumber);
        if (error) {
          setError(error);
        } else {
          setRepos(repos.items);
          setTotalCount(repos.total_count);
        }
      } catch (e) {
        setError("データの取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      search();
    } else {
      // クエリがない場合はローディングを停止
      setLoading(false);
    }
  }, [query, pageNumber]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const maxPageLinks = 5;
  let startPage = Math.max(1, pageNumber - Math.floor(maxPageLinks / 2));
  let endPage = Math.min(totalPages, startPage + maxPageLinks - 1);

  if (endPage - startPage < maxPageLinks - 1) {
    startPage = Math.max(1, endPage - maxPageLinks + 1);
  }

  const paginationLinks = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div>
      {query && (
        <div className="text-gray-600 mt-4">
          検索結果: {totalCount.toLocaleString()}件
        </div>
      )}
      <RepoList repos={repos} />
      {totalCount > ITEMS_PER_PAGE && (
        <Pagination className="mt-8">
          <PaginationContent>
            {pageNumber > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`/?q=${query}&page=${pageNumber - 1}`}
                />
              </PaginationItem>
            )}
            {paginationLinks.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href={`/?q=${query}&page=${p}`}
                  isActive={p === pageNumber}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            {pageNumber < totalPages && (
              <PaginationItem>
                <PaginationNext href={`/?q=${query}&page=${pageNumber + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
