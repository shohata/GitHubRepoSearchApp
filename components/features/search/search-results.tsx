import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import RepoList from "@/components/features/search/repo-list";
import { searchRepos } from "@/lib/github";
import { ITEMS_PER_PAGE } from "@/lib/config";
import { GitHubSearchRepos, SearchParams } from "@/lib/types";

// 検索結果を表示するコンポーネント
export default async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, page } = await searchParams;
  const query = q || "";
  const pageNumber = parseInt(page || "1", 10);

  if (query.length == 0) {
    return (
      <div className="text-center text-muted-foreground mt-16">
        <p>リポジトリを検索して、結果をここに表示します。</p>
      </div>
    );
  }

  const res = await searchRepos(query, pageNumber);
  const repos: GitHubSearchRepos = res.items;
  const totalCount = res.total_count;

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
      <div className="text-gray-600 mt-4">
        検索結果: {totalCount.toLocaleString()}件
      </div>
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
                <PaginationNext href={`/?q=${query}&page=${pageNumber + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
