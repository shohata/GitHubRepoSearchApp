import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { searchRepos } from "@/lib/github";
import { ITEMS_PER_PAGE } from "@/lib/config";

// ページネーションアイテムの型定義
export type PaginationItem =
  | { type: "page"; pageNumber: number; isActive?: boolean }
  | { type: "ellipsis" };

// 検索結果とページネーションのロジックを扱うカスタムフック
export const useSearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  // useQueryを使用してデータ取得
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["repos", query, page],
    queryFn: () => searchRepos(query, page),
    enabled: !!query, // qが存在する場合のみクエリを有効化
  });

  // 取得したデータから必要な値を抽出
  const repos = data?.items ?? [];
  const total_count = data?.total_count ?? 0;

  // 総ページ数を計算
  const totalPage = useMemo(
    () => Math.ceil(total_count / ITEMS_PER_PAGE),
    [total_count]
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
    isLoading,
    isError,
    isFetching,
    repos,
    total_count,
    totalPage,
    pagination,
  };
};
