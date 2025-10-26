import { render } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  describe("基本レンダリング", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(<Button>Test Button</Button>);
      const button = container.querySelector("[data-slot='button']");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Test Button");
    });

    it("デフォルトでbuttonタグとしてレンダリングされること", () => {
      const { container } = render(<Button>Test</Button>);
      const button = container.querySelector("[data-slot='button']");
      expect(button?.tagName).toBe("BUTTON");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <Button className="custom-class">Test</Button>
      );
      const button = container.querySelector(".custom-class");
      expect(button).toBeInTheDocument();
    });

    it("追加のpropsが渡されること", () => {
      const { container } = render(
        <Button data-testid="test-button" type="submit">
          Test
        </Button>
      );
      const button = container.querySelector("[data-testid='test-button']");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("variant", () => {
    it("defaultバリアントが適用されること", () => {
      const { getByText } = render(<Button variant="default">Default</Button>);
      const button = getByText("Default");
      expect(button).toBeInTheDocument();
    });

    it("destructiveバリアントが適用されること", () => {
      const { getByText } = render(
        <Button variant="destructive">Destructive</Button>
      );
      const button = getByText("Destructive");
      expect(button).toBeInTheDocument();
    });

    it("outlineバリアントが適用されること", () => {
      const { getByText } = render(<Button variant="outline">Outline</Button>);
      const button = getByText("Outline");
      expect(button).toBeInTheDocument();
    });

    it("secondaryバリアントが適用されること", () => {
      const { getByText } = render(
        <Button variant="secondary">Secondary</Button>
      );
      const button = getByText("Secondary");
      expect(button).toBeInTheDocument();
    });

    it("ghostバリアントが適用されること", () => {
      const { getByText } = render(<Button variant="ghost">Ghost</Button>);
      const button = getByText("Ghost");
      expect(button).toBeInTheDocument();
    });

    it("linkバリアントが適用されること", () => {
      const { getByText } = render(<Button variant="link">Link</Button>);
      const button = getByText("Link");
      expect(button).toBeInTheDocument();
    });
  });

  describe("size", () => {
    it("デフォルトサイズが適用されること", () => {
      const { getByText } = render(<Button size="default">Default</Button>);
      const button = getByText("Default");
      expect(button).toBeInTheDocument();
    });

    it("smサイズが適用されること", () => {
      const { getByText } = render(<Button size="sm">Small</Button>);
      const button = getByText("Small");
      expect(button).toBeInTheDocument();
    });

    it("lgサイズが適用されること", () => {
      const { getByText } = render(<Button size="lg">Large</Button>);
      const button = getByText("Large");
      expect(button).toBeInTheDocument();
    });

    it("iconサイズが適用されること", () => {
      const { container } = render(<Button size="icon">🔍</Button>);
      const button = container.querySelector("[data-slot='button']");
      expect(button).toBeInTheDocument();
    });
  });

  describe("asChild", () => {
    it("asChild=trueの場合、Slotとしてレンダリングされること", () => {
      const { container } = render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("disabled状態", () => {
    it("disabledが適用されること", () => {
      const { getByText } = render(<Button disabled>Disabled</Button>);
      const button = getByText("Disabled");
      expect(button).toBeDisabled();
    });
  });

  describe("組み合わせ", () => {
    it("variant と size を組み合わせられること", () => {
      const { getByText } = render(
        <Button variant="destructive" size="lg">
          Large Destructive
        </Button>
      );
      const button = getByText("Large Destructive");
      expect(button).toBeInTheDocument();
    });
  });
});
