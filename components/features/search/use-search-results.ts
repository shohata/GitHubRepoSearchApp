import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import {
  ITEMS_PER_PAGE,
  MAX_PAGINATION_PAGES,
  MAX_SEARCH_RESULTS,
} from "@/lib/config";
import type { GitHubSearchRepoResult, PaginationItem } from "@/lib/types";

/**
 * JSONを返すシンプルなfetcher関数
 * SWRで使用するデータフェッチング関数
 *
 * @param url - フェッチするURL
 * @returns {Promise<any>} JSONレスポンス
 * @throws {Error} フェッチに失敗した場合
 */
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return res.json();
  });

/**
 * 検索結果とページネーションのロジックを扱うカスタムフック
 *
 * @returns 検索状態とページネーション情報
 */
export function useSearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  // useSWRを使用してデータ取得
  const apiUrl = query ? `/api/search?q=${query}&page=${page}` : null;
  const { data, error, isLoading } = useSWR<GitHubSearchRepoResult>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false, // フォーカス時の再検証を無効化
      dedupingInterval: 5000, // 5秒間のキャッシュ
    }
  );

  // 取得したデータから必要な値を抽出
  const repos = data?.items ?? [];
  const totalCount = data?.total_count ?? 0;

  // GitHub API の仕様により、最初の1000件だけ取得可能
  const totalItems = useMemo(
    () => Math.min(totalCount, MAX_SEARCH_RESULTS),
    [totalCount]
  );

  // 総ページ数を計算
  const totalPage = useMemo(
    () => Math.ceil(totalItems / ITEMS_PER_PAGE),
    [totalItems]
  );

  // ページネーションの表示ロジック
  const pagination = useMemo(() => {
    const items: PaginationItem[] = [];
    let startPage = Math.max(1, page - Math.floor(MAX_PAGINATION_PAGES / 2));
    const endPage = Math.min(totalPage, startPage + MAX_PAGINATION_PAGES - 1);

    // 表示ページ数が最大表示数に満たない場合、開始ページを調整
    if (endPage - startPage + 1 < MAX_PAGINATION_PAGES) {
      startPage = Math.max(1, endPage - MAX_PAGINATION_PAGES + 1);
    }

    // 最初のページと省略記号(...)を追加
    if (startPage > 1) {
      items.push({ type: "page", pageNumber: 1 });
      if (startPage > 2) {
        items.push({ type: "ellipsis", id: "start" });
      }
    }

    // 中間のページ番号を追加
    for (let i = startPage; i <= endPage; i++) {
      items.push({ type: "page", pageNumber: i, isActive: i === page });
    }

    // 最後のページと省略記号(...)を追加
    if (endPage < totalPage) {
      if (endPage < totalPage - 1) {
        items.push({ type: "ellipsis", id: "end" });
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
