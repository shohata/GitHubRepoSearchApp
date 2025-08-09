import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GitHubSearchRepoResultItems } from "@/lib/types";
import RepoList from "@/components/features/search/repo-list";
import { SearchRepo } from "@/lib/github";
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
  const [repos, setRepos] = useState<GitHubSearchRepoResultItems>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await SearchRepo(query, pageNumber);
        setRepos(res.items);
        setTotalCount(res.total_count);
      } catch (e) {
        setError("データの取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      search();
    } else {
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

  const paginationNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div>
      {loading ? (
        <div className="flex justify-center mt-8">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-8">{error}</div>
      ) : (
        <>
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
                {paginationNumbers.map((p) => (
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
                    <PaginationNext
                      href={`/?q=${query}&page=${pageNumber + 1}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
