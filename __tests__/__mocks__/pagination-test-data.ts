import type { PaginationItem } from "@/lib/pagination";

/**
 * ページネーション生成関数のテスト用期待値
 * 使用例: __tests__/lib/pagination.test.ts
 */

/**
 * よく使われるページネーションパターンの期待値
 */
export const paginationExpectations = {
  /** 空の結果（総ページ数0） */
  empty: [] as PaginationItem[],

  /** 総ページ数が最大表示数以下（省略記号なし） */
  totalPages3Current2: [
    { type: "page", pageNumber: 1, isActive: false },
    { type: "page", pageNumber: 2, isActive: true },
    { type: "page", pageNumber: 3, isActive: false },
  ] as PaginationItem[],

  /** 総ページ数5、現在ページ2（省略記号なし） */
  totalPages5Current2: [
    { type: "page", pageNumber: 1, isActive: false },
    { type: "page", pageNumber: 2, isActive: true },
    { type: "page", pageNumber: 3, isActive: false },
    { type: "page", pageNumber: 4, isActive: false },
    { type: "page", pageNumber: 5, isActive: false },
  ] as PaginationItem[],

  /** 総ページ数10、現在ページ1（先頭ページ） */
  totalPages10Current1: [
    { type: "page", pageNumber: 1, isActive: true },
    { type: "page", pageNumber: 2, isActive: false },
    { type: "page", pageNumber: 3, isActive: false },
    { type: "page", pageNumber: 4, isActive: false },
    { type: "page", pageNumber: 5, isActive: false },
    { type: "ellipsis", id: "end" },
    { type: "page", pageNumber: 10, isActive: false },
  ] as PaginationItem[],

  /** 総ページ数10、現在ページ5（中間ページ、両端に省略記号） */
  totalPages10Current5: [
    { type: "page", pageNumber: 1, isActive: false },
    { type: "ellipsis", id: "start" },
    { type: "page", pageNumber: 3, isActive: false },
    { type: "page", pageNumber: 4, isActive: false },
    { type: "page", pageNumber: 5, isActive: true },
    { type: "page", pageNumber: 6, isActive: false },
    { type: "page", pageNumber: 7, isActive: false },
    { type: "ellipsis", id: "end" },
    { type: "page", pageNumber: 10, isActive: false },
  ] as PaginationItem[],

  /** 総ページ数10、現在ページ10（最終ページ） */
  totalPages10Current10: [
    { type: "page", pageNumber: 1, isActive: false },
    { type: "ellipsis", id: "start" },
    { type: "page", pageNumber: 6, isActive: false },
    { type: "page", pageNumber: 7, isActive: false },
    { type: "page", pageNumber: 8, isActive: false },
    { type: "page", pageNumber: 9, isActive: false },
    { type: "page", pageNumber: 10, isActive: true },
  ] as PaginationItem[],

  /** 総ページ数1（単一ページ） */
  singlePage: [
    { type: "page", pageNumber: 1, isActive: true },
  ] as PaginationItem[],

  /** 総ページ数10、現在ページ5、最大表示数3 */
  totalPages10Current5Max3: [
    { type: "page", pageNumber: 1, isActive: false },
    { type: "ellipsis", id: "start" },
    { type: "page", pageNumber: 4, isActive: false },
    { type: "page", pageNumber: 5, isActive: true },
    { type: "page", pageNumber: 6, isActive: false },
    { type: "ellipsis", id: "end" },
    { type: "page", pageNumber: 10, isActive: false },
  ] as PaginationItem[],

  /** 総ページ数4、現在ページ2、最大表示数3（開始側のみ省略記号なし） */
  totalPages4Current2Max3: [
    { type: "page", pageNumber: 1, isActive: false },
    { type: "page", pageNumber: 2, isActive: true },
    { type: "page", pageNumber: 3, isActive: false },
    { type: "page", pageNumber: 4, isActive: false },
  ] as PaginationItem[],

  /** 総ページ数4、現在ページ3、最大表示数3（終了側のみ省略記号なし） */
  totalPages4Current3Max3: [
    { type: "page", pageNumber: 1, isActive: false },
    { type: "page", pageNumber: 2, isActive: false },
    { type: "page", pageNumber: 3, isActive: true },
    { type: "page", pageNumber: 4, isActive: false },
  ] as PaginationItem[],
};

/**
 * ページネーション生成関数のテストケース
 * 各テストで使用するパラメータと期待値のセット
 */
export const paginationTestCases = [
  {
    description: "総ページ数が0の場合、空配列を返す",
    params: { currentPage: 1, totalPages: 0, maxDisplay: 5 },
    expected: paginationExpectations.empty,
  },
  {
    description: "総ページ数が最大表示数以下の場合、すべてのページを表示",
    params: { currentPage: 2, totalPages: 3, maxDisplay: 5 },
    expected: paginationExpectations.totalPages3Current2,
  },
  {
    description: "現在ページが1で総ページ数が10の場合",
    params: { currentPage: 1, totalPages: 10, maxDisplay: 5 },
    expected: paginationExpectations.totalPages10Current1,
  },
  {
    description: "現在ページが5で総ページ数が10の場合",
    params: { currentPage: 5, totalPages: 10, maxDisplay: 5 },
    expected: paginationExpectations.totalPages10Current5,
  },
  {
    description: "現在ページが10で総ページ数が10の場合",
    params: { currentPage: 10, totalPages: 10, maxDisplay: 5 },
    expected: paginationExpectations.totalPages10Current10,
  },
  {
    description: "現在ページが2で総ページ数が5の場合（省略記号なし）",
    params: { currentPage: 2, totalPages: 5, maxDisplay: 5 },
    expected: paginationExpectations.totalPages5Current2,
  },
  {
    description: "総ページ数が1の場合",
    params: { currentPage: 1, totalPages: 1, maxDisplay: 5 },
    expected: paginationExpectations.singlePage,
  },
  {
    description: "最大表示数を3に設定した場合",
    params: { currentPage: 5, totalPages: 10, maxDisplay: 3 },
    expected: paginationExpectations.totalPages10Current5Max3,
  },
  {
    description: "現在ページが2で総ページ数が4の場合（開始側のみ省略記号なし）",
    params: { currentPage: 2, totalPages: 4, maxDisplay: 3 },
    expected: paginationExpectations.totalPages4Current2Max3,
  },
  {
    description: "現在ページが3で総ページ数が4の場合（終了側のみ省略記号なし）",
    params: { currentPage: 3, totalPages: 4, maxDisplay: 3 },
    expected: paginationExpectations.totalPages4Current3Max3,
  },
];
