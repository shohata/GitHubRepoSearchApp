import { render } from "@testing-library/react";
import { Spinner } from "@/components/ui/spinner";

describe("Spinner", () => {
  describe("基本レンダリング", () => {
    it("正しくレンダリングされること", () => {
      const { getByTestId } = render(<Spinner />);
      const spinner = getByTestId("spinner");
      expect(spinner).toBeInTheDocument();
    });

    it("デフォルトで表示されること", () => {
      const { getByTestId } = render(<Spinner />);
      const spinner = getByTestId("spinner");
      expect(spinner).toBeVisible();
    });

    it("スパンタグとしてレンダリングされること", () => {
      const { getByTestId } = render(<Spinner />);
      const spinner = getByTestId("spinner");
      expect(spinner.tagName).toBe("SPAN");
    });
  });

  describe("show prop", () => {
    it("show=trueで表示されること", () => {
      const { getByTestId } = render(<Spinner show />);
      const spinner = getByTestId("spinner");
      expect(spinner).toHaveClass("flex");
    });

    it("show=falseで非表示になること", () => {
      const { getByTestId } = render(<Spinner show={false} />);
      const spinner = getByTestId("spinner");
      expect(spinner).toHaveClass("hidden");
    });
  });

  describe("size prop", () => {
    it("デフォルトサイズ(medium)が適用されること", () => {
      const { container } = render(<Spinner />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("size-8");
    });

    it("smallサイズが適用されること", () => {
      const { container } = render(<Spinner size="small" />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("size-6");
    });

    it("mediumサイズが適用されること", () => {
      const { container } = render(<Spinner size="medium" />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("size-8");
    });

    it("largeサイズが適用されること", () => {
      const { container } = render(<Spinner size="large" />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("size-12");
    });
  });

  describe("カスタムクラス", () => {
    it("カスタムクラスが適用されること", () => {
      const { container } = render(<Spinner className="custom-spinner" />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("custom-spinner");
    });

    it("カスタムクラスがデフォルトクラスと併用されること", () => {
      const { container } = render(<Spinner className="custom-class" />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("animate-spin");
      expect(icon).toHaveClass("custom-class");
    });
  });

  describe("children prop", () => {
    it("子要素が表示されること", () => {
      const { getByText } = render(<Spinner>読み込み中...</Spinner>);
      expect(getByText("読み込み中...")).toBeInTheDocument();
    });

    it("複雑な子要素が表示されること", () => {
      const { getByText } = render(
        <Spinner>
          <p>データを読み込んでいます</p>
        </Spinner>
      );
      expect(getByText("データを読み込んでいます")).toBeInTheDocument();
    });
  });

  describe("アニメーション", () => {
    it("スピナーアイコンがアニメーションクラスを持つこと", () => {
      const { container } = render(<Spinner />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("animate-spin");
    });

    it("スピナーアイコンがprimaryカラーを持つこと", () => {
      const { container } = render(<Spinner />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("text-primary");
    });
  });

  describe("組み合わせ", () => {
    it("全てのプロパティを組み合わせて使用できること", () => {
      const { getByTestId, getByText, container } = render(
        <Spinner size="large" show className="custom-class">
          処理中
        </Spinner>
      );

      const spinner = getByTestId("spinner");
      const icon = container.querySelector("svg");

      expect(spinner).toBeVisible();
      expect(spinner).toHaveClass("flex");
      expect(icon).toHaveClass("size-12");
      expect(icon).toHaveClass("custom-class");
      expect(getByText("処理中")).toBeInTheDocument();
    });

    it("非表示状態でも子要素の構造は保たれること", () => {
      const { getByTestId } = render(
        <Spinner show={false}>非表示のテキスト</Spinner>
      );

      const spinner = getByTestId("spinner");
      expect(spinner).toHaveClass("hidden");
      // 非表示でも要素は存在する
      expect(spinner).toBeInTheDocument();
    });
  });
});
