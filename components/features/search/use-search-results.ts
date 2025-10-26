import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import {
  ITEMS_PER_PAGE,
  MAX_PAGINATION_PAGES,
  MAX_SEARCH_RESULTS,
} from "@/lib/config";
import { generatePagination } from "@/lib/pagination";
import type { GitHubSearchRepoResult } from "@/lib/types";

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
  const pagination = useMemo(
    () => generatePagination(page, totalPage, MAX_PAGINATION_PAGES),
    [page, totalPage]
  );

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
