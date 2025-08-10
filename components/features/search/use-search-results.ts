import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import { ITEMS_PER_PAGE } from "@/lib/config";
import { GitHubSearchRepoResult } from "@/lib/types";

// ページネーションアイテムの型定義
export type PaginationItem =
  | { type: "page"; pageNumber: number; isActive?: boolean }
  | { type: "ellipsis" };

// JSONを返すシンプルなfetcher関数
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return res.json();
  });

// 検索結果とページネーションのロジックを扱うカスタムフック
export function useSearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  // useSWRを使用してデータ取得
  const apiUrl = query ? `/api/search?q=${query}&page=${page}` : null;
  const { data, error, isLoading } = useSWR<GitHubSearchRepoResult>(
    apiUrl,
    fetcher
  );

  // 取得したデータから必要な値を抽出
  const repos = data?.items ?? [];
  const totalCount = data?.total_count ?? 0;

  // 最初の1000件だけ取得可能なため制限
  const totalItems = useMemo(() => Math.min(totalCount, 1000), [totalCount]);

  // 総ページ数を計算
  const totalPage = useMemo(
    () => Math.ceil(totalItems / ITEMS_PER_PAGE),
    [totalItems]
  );

  // ページネーションの表示ロジック
  const pagination = useMemo(() => {
    const items: PaginationItem[] = [];
    const maxPagesToShow = 5; // 表示する最大ページ数
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPage, startPage + maxPagesToShow - 1);

    // 表示ページ数が最大表示数に満たない場合、開始ページを調整
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // 最初のページと省略記号(...)を追加
    if (startPage > 1) {
      items.push({ type: "page", pageNumber: 1 });
      if (startPage > 2) {
        items.push({ type: "ellipsis" });
      }
    }

    // 中間のページ番号を追加
    for (let i = startPage; i <= endPage; i++) {
      items.push({ type: "page", pageNumber: i, isActive: i === page });
    }

    // 最後のページと省略記号(...)を追加
    if (endPage < totalPage) {
      if (endPage < totalPage - 1) {
        items.push({ type: "ellipsis" });
      }
      items.push({ type: "page", pageNumber: totalPage });
    }

    return items;
  }, [page, totalPage]);

  return {
    query,
    page,
    error,
    isLoading,
    repos,
    totalCount,
    totalPage,
    pagination,
  };
}
