import { generatePagination } from "@/lib/pagination";

describe("lib/pagination.ts", () => {
  describe("generatePagination", () => {
    it("総ページ数が0の場合、空配列を返す", () => {
      const result = generatePagination(1, 0, 5);
      expect(result).toEqual([]);
    });

    it("総ページ数が最大表示数以下の場合、すべてのページを表示", () => {
      const result = generatePagination(2, 3, 5);
      expect(result).toEqual([
        { type: "page", pageNumber: 1, isActive: false },
        { type: "page", pageNumber: 2, isActive: true },
        { type: "page", pageNumber: 3, isActive: false },
      ]);
    });

    it("現在ページが1で総ページ数が10の場合", () => {
      const result = generatePagination(1, 10, 5);
      expect(result).toEqual([
        { type: "page", pageNumber: 1, isActive: true },
        { type: "page", pageNumber: 2, isActive: false },
        { type: "page", pageNumber: 3, isActive: false },
        { type: "page", pageNumber: 4, isActive: false },
        { type: "page", pageNumber: 5, isActive: false },
        { type: "ellipsis", id: "end" },
        { type: "page", pageNumber: 10, isActive: false },
      ]);
    });

    it("現在ページが5で総ページ数が10の場合", () => {
      const result = generatePagination(5, 10, 5);
      expect(result).toEqual([
        { type: "page", pageNumber: 1, isActive: false },
        { type: "ellipsis", id: "start" },
        { type: "page", pageNumber: 3, isActive: false },
        { type: "page", pageNumber: 4, isActive: false },
        { type: "page", pageNumber: 5, isActive: true },
        { type: "page", pageNumber: 6, isActive: false },
        { type: "page", pageNumber: 7, isActive: false },
        { type: "ellipsis", id: "end" },
        { type: "page", pageNumber: 10, isActive: false },
      ]);
    });

    it("現在ページが10で総ページ数が10の場合", () => {
      const result = generatePagination(10, 10, 5);
      expect(result).toEqual([
        { type: "page", pageNumber: 1, isActive: false },
        { type: "ellipsis", id: "start" },
        { type: "page", pageNumber: 6, isActive: false },
        { type: "page", pageNumber: 7, isActive: false },
        { type: "page", pageNumber: 8, isActive: false },
        { type: "page", pageNumber: 9, isActive: false },
        { type: "page", pageNumber: 10, isActive: true },
      ]);
    });

    it("現在ページが2で総ページ数が5の場合（省略記号なし）", () => {
      const result = generatePagination(2, 5, 5);
      expect(result).toEqual([
        { type: "page", pageNumber: 1, isActive: false },
        { type: "page", pageNumber: 2, isActive: true },
        { type: "page", pageNumber: 3, isActive: false },
        { type: "page", pageNumber: 4, isActive: false },
        { type: "page", pageNumber: 5, isActive: false },
      ]);
    });

    it("総ページ数が1の場合", () => {
      const result = generatePagination(1, 1, 5);
      expect(result).toEqual([{ type: "page", pageNumber: 1, isActive: true }]);
    });

    it("最大表示数を3に設定した場合", () => {
      const result = generatePagination(5, 10, 3);
      expect(result).toEqual([
        { type: "page", pageNumber: 1, isActive: false },
        { type: "ellipsis", id: "start" },
        { type: "page", pageNumber: 4, isActive: false },
        { type: "page", pageNumber: 5, isActive: true },
        { type: "page", pageNumber: 6, isActive: false },
        { type: "ellipsis", id: "end" },
        { type: "page", pageNumber: 10, isActive: false },
      ]);
    });

    it("現在ページが2で総ページ数が4の場合（開始側のみ省略記号なし）", () => {
      const result = generatePagination(2, 4, 3);
      expect(result).toEqual([
        { type: "page", pageNumber: 1, isActive: false },
        { type: "page", pageNumber: 2, isActive: true },
        { type: "page", pageNumber: 3, isActive: false },
        { type: "page", pageNumber: 4, isActive: false },
      ]);
    });

    it("現在ページが3で総ページ数が4の場合（終了側のみ省略記号なし）", () => {
      const result = generatePagination(3, 4, 3);
      expect(result).toEqual([
        { type: "page", pageNumber: 1, isActive: false },
        { type: "page", pageNumber: 2, isActive: false },
        { type: "page", pageNumber: 3, isActive: true },
        { type: "page", pageNumber: 4, isActive: false },
      ]);
    });
  });
});
