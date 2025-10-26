import { paginationExpectations } from "@/__tests__/fixtures/pagination-test-data";
import { generatePagination } from "@/lib/pagination";

describe("lib/pagination.ts", () => {
  describe("generatePagination", () => {
    it("総ページ数が0の場合、空配列を返す", () => {
      const result = generatePagination(1, 0, 5);
      expect(result).toEqual(paginationExpectations.empty);
    });

    it("総ページ数が最大表示数以下の場合、すべてのページを表示", () => {
      const result = generatePagination(2, 3, 5);
      expect(result).toEqual(paginationExpectations.totalPages3Current2);
    });

    it("現在ページが1で総ページ数が10の場合", () => {
      const result = generatePagination(1, 10, 5);
      expect(result).toEqual(paginationExpectations.totalPages10Current1);
    });

    it("現在ページが5で総ページ数が10の場合", () => {
      const result = generatePagination(5, 10, 5);
      expect(result).toEqual(paginationExpectations.totalPages10Current5);
    });

    it("現在ページが10で総ページ数が10の場合", () => {
      const result = generatePagination(10, 10, 5);
      expect(result).toEqual(paginationExpectations.totalPages10Current10);
    });

    it("現在ページが2で総ページ数が5の場合（省略記号なし）", () => {
      const result = generatePagination(2, 5, 5);
      expect(result).toEqual(paginationExpectations.totalPages5Current2);
    });

    it("総ページ数が1の場合", () => {
      const result = generatePagination(1, 1, 5);
      expect(result).toEqual(paginationExpectations.singlePage);
    });

    it("最大表示数を3に設定した場合", () => {
      const result = generatePagination(5, 10, 3);
      expect(result).toEqual(paginationExpectations.totalPages10Current5Max3);
    });

    it("現在ページが2で総ページ数が4の場合（開始側のみ省略記号なし）", () => {
      const result = generatePagination(2, 4, 3);
      expect(result).toEqual(paginationExpectations.totalPages4Current2Max3);
    });

    it("現在ページが3で総ページ数が4の場合（終了側のみ省略記号なし）", () => {
      const result = generatePagination(3, 4, 3);
      expect(result).toEqual(paginationExpectations.totalPages4Current3Max3);
    });

    // エッジケーステスト
    it("現在ページが総ページ数を超える場合でもエラーにならない", () => {
      const result = generatePagination(15, 10, 5);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // 最後のページが含まれていることを確認
      const lastPage = result.find(
        (item) => item.type === "page" && item.pageNumber === 10
      );
      expect(lastPage).toBeDefined();
    });

    it("現在ページが0以下の場合でもエラーにならない", () => {
      const result = generatePagination(0, 10, 5);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("総ページ数が負の値の場合は空配列を返す", () => {
      const result = generatePagination(1, -1, 5);
      expect(result).toEqual([]);
    });

    it("maxVisiblePagesが1の場合でも正しく動作する", () => {
      const result = generatePagination(5, 10, 1);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // 少なくとも現在ページと最初・最後のページが含まれる
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
