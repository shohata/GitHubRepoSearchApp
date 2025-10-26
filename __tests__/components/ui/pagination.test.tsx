import { render } from "@testing-library/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

describe("Pagination", () => {
  describe("Pagination", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const nav = container.querySelector("[data-slot='pagination']");
      expect(nav).toBeInTheDocument();
      expect(nav?.tagName).toBe("NAV");
      expect(nav).toHaveAttribute("aria-label", "pagination");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <Pagination className="custom-pagination">
          <PaginationContent>
            <PaginationItem>1</PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const nav = container.querySelector(".custom-pagination");
      expect(nav).toBeInTheDocument();
    });
  });

  describe("PaginationContent", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>1</PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const content = container.querySelector(
        "[data-slot='pagination-content']"
      );
      expect(content).toBeInTheDocument();
      expect(content?.tagName).toBe("UL");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent className="custom-content">
            <PaginationItem>1</PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const content = container.querySelector(".custom-content");
      expect(content).toBeInTheDocument();
    });
  });

  describe("PaginationItem", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>Item</PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const item = container.querySelector("[data-slot='pagination-item']");
      expect(item).toBeInTheDocument();
      expect(item?.tagName).toBe("LI");
    });
  });

  describe("PaginationLink", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const link = container.querySelector("[data-slot='pagination-link']");
      expect(link).toBeInTheDocument();
      expect(link?.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "#");
    });

    it("isActiveがtrueの場合、aria-current='page'が設定されること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const link = container.querySelector("[data-slot='pagination-link']");
      expect(link).toHaveAttribute("aria-current", "page");
    });

    it("isActiveがfalseの場合、aria-currentが設定されないこと", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive={false}>
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const link = container.querySelector("[data-slot='pagination-link']");
      expect(link).not.toHaveAttribute("aria-current");
    });

    it("data-active属性が正しく設定されること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const link = container.querySelector("[data-active='true']");
      expect(link).toBeInTheDocument();
    });

    it("sizeプロパティが設定できること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" size="default">
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const link = container.querySelector("[data-slot='pagination-link']");
      expect(link).toBeInTheDocument();
    });
  });

  describe("PaginationPrevious", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const previous = container.querySelector(
        "[aria-label='Go to previous page']"
      );
      expect(previous).toBeInTheDocument();
      expect(previous).toHaveTextContent("Previous");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="custom-previous" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const previous = container.querySelector(".custom-previous");
      expect(previous).toBeInTheDocument();
    });

    it("アイコンが表示されること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("PaginationNext", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const next = container.querySelector("[aria-label='Go to next page']");
      expect(next).toBeInTheDocument();
      expect(next).toHaveTextContent("Next");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" className="custom-next" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const next = container.querySelector(".custom-next");
      expect(next).toBeInTheDocument();
    });

    it("アイコンが表示されること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("PaginationEllipsis", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const ellipsis = container.querySelector(
        "[data-slot='pagination-ellipsis']"
      );
      expect(ellipsis).toBeInTheDocument();
      expect(ellipsis?.tagName).toBe("SPAN");
    });

    it("aria-hiddenが設定されること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const ellipsis = container.querySelector(
        "[data-slot='pagination-ellipsis']"
      );
      expect(ellipsis).toHaveAttribute("aria-hidden");
    });

    it("アイコンが表示されること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("sr-onlyテキストが含まれること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const srText = container.querySelector(".sr-only");
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveTextContent("More pages");
    });
  });

  describe("統合テスト", () => {
    it("完全なページネーションが正しく動作すること", () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      expect(
        container.querySelector("[aria-label='Go to previous page']")
      ).toBeInTheDocument();
      expect(
        container.querySelector("[aria-label='Go to next page']")
      ).toBeInTheDocument();
      expect(
        container.querySelector("[aria-current='page']")
      ).toHaveTextContent("2");
      expect(
        container.querySelector("[data-slot='pagination-ellipsis']")
      ).toBeInTheDocument();
    });
  });
});
