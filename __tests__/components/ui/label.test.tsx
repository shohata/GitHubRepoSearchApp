import { render } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label", () => {
  describe("基本レンダリング", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(<Label>Test Label</Label>);
      const label = container.querySelector("[data-slot='label']");
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent("Test Label");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <Label className="custom-label">Test Label</Label>
      );
      const label = container.querySelector(".custom-label");
      expect(label).toBeInTheDocument();
    });

    it("追加のpropsが渡されること", () => {
      const { container } = render(
        <Label data-testid="test-label" htmlFor="input-id">
          Test Label
        </Label>
      );
      const label = container.querySelector("[data-testid='test-label']");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", "input-id");
    });
  });

  describe("htmlFor属性", () => {
    it("htmlForが正しく設定されること", () => {
      const { container } = render(
        <Label htmlFor="test-input">Label Text</Label>
      );
      const label = container.querySelector("[data-slot='label']");
      expect(label).toHaveAttribute("for", "test-input");
    });
  });

  describe("子要素", () => {
    it("テキストが表示されること", () => {
      const { getByText } = render(<Label>Label Content</Label>);
      expect(getByText("Label Content")).toBeInTheDocument();
    });

    it("複数の子要素を含むことができること", () => {
      const { getByText } = render(
        <Label>
          <span>Required</span>
          <span>*</span>
        </Label>
      );
      expect(getByText("Required")).toBeInTheDocument();
      expect(getByText("*")).toBeInTheDocument();
    });
  });

  describe("スタイリング", () => {
    it("基本スタイルが適用されること", () => {
      const { container } = render(<Label>Test</Label>);
      const label = container.querySelector("[data-slot='label']");
      expect(label).toHaveClass("flex");
      expect(label).toHaveClass("items-center");
      expect(label).toHaveClass("gap-2");
      expect(label).toHaveClass("text-sm");
    });
  });

  describe("組み合わせ", () => {
    it("inputと組み合わせて使用できること", () => {
      const { container } = render(
        <>
          <Label htmlFor="email">Email</Label>
          <input id="email" type="email" />
        </>
      );
      const label = container.querySelector("[data-slot='label']");
      const input = container.querySelector("#email");
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(label).toHaveAttribute("for", "email");
    });
  });
});
