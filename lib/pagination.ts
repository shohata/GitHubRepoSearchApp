import type { PaginationItem } from "./types";

/**
 * ページネーション表示用のアイテムリストを生成する
 *
 * @param currentPage - 現在のページ番号
 * @param totalPages - 総ページ数
 * @param maxVisiblePages - 表示する最大ページ数（デフォルト: 5）
 * @returns ページネーションアイテムの配列
 *
 * @example
 * // 現在ページが5、総ページ数が10の場合
 * generatePagination(5, 10, 5)
 * // => [1, ..., 3, 4, 5, 6, 7, ..., 10]
 */
export function generatePagination(
  currentPage: number,
  totalPages: number,
  maxVisiblePages = 5
): PaginationItem[] {
  const items: PaginationItem[] = [];

  // ページがない場合は空配列を返す
  if (totalPages === 0) {
    return items;
  }

  // 開始ページを計算
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // 表示ページ数が最大表示数に満たない場合、開始ページを調整
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // 最初のページと省略記号(...)を追加
  if (startPage > 1) {
    items.push({
      type: "page",
      pageNumber: 1,
      isActive: 1 === currentPage,
    });
    if (startPage > 2) {
      items.push({ type: "ellipsis", id: "start" });
    }
  }

  // 中間のページ番号を追加
  for (let i = startPage; i <= endPage; i++) {
    items.push({ type: "page", pageNumber: i, isActive: i === currentPage });
  }

  // 最後のページと省略記号(...)を追加
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push({ type: "ellipsis", id: "end" });
    }
    items.push({
      type: "page",
      pageNumber: totalPages,
      isActive: totalPages === currentPage,
    });
  }

  return items;
}
