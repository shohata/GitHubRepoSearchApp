import { render } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";

describe("Card", () => {
  describe("Card", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(<Card>Test Card</Card>);
      const card = container.querySelector("[data-slot='card']");
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent("Test Card");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <Card className="custom-class">Test Card</Card>
      );
      const card = container.querySelector(".custom-class");
      expect(card).toBeInTheDocument();
    });

    it("追加のpropsが渡されること", () => {
      const { container } = render(
        <Card data-testid="test-card">Test Card</Card>
      );
      const card = container.querySelector("[data-testid='test-card']");
      expect(card).toBeInTheDocument();
    });
  });

  describe("CardHeader", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(<CardHeader>Test Header</CardHeader>);
      const header = container.querySelector("[data-slot='card-header']");
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent("Test Header");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <CardHeader className="custom-header">Test Header</CardHeader>
      );
      const header = container.querySelector(".custom-header");
      expect(header).toBeInTheDocument();
    });
  });

  describe("CardTitle", () => {
    it("正しくレンダリングされること", () => {
      const { getByText } = render(<CardTitle>Test Title</CardTitle>);
      const title = getByText("Test Title");
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe("DIV");
      expect(title).toHaveAttribute("data-slot", "card-title");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <CardTitle className="custom-title">Test Title</CardTitle>
      );
      const title = container.querySelector(".custom-title");
      expect(title).toBeInTheDocument();
    });
  });

  describe("CardDescription", () => {
    it("正しくレンダリングされること", () => {
      const { getByText } = render(
        <CardDescription>Test Description</CardDescription>
      );
      const description = getByText("Test Description");
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe("DIV");
      expect(description).toHaveAttribute("data-slot", "card-description");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <CardDescription className="custom-desc">
          Test Description
        </CardDescription>
      );
      const description = container.querySelector(".custom-desc");
      expect(description).toBeInTheDocument();
    });
  });

  describe("CardContent", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(<CardContent>Test Content</CardContent>);
      const content = container.querySelector("[data-slot='card-content']");
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent("Test Content");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <CardContent className="custom-content">Test Content</CardContent>
      );
      const content = container.querySelector(".custom-content");
      expect(content).toBeInTheDocument();
    });
  });

  describe("CardFooter", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(<CardFooter>Test Footer</CardFooter>);
      const footer = container.querySelector("[data-slot='card-footer']");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent("Test Footer");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <CardFooter className="custom-footer">Test Footer</CardFooter>
      );
      const footer = container.querySelector(".custom-footer");
      expect(footer).toBeInTheDocument();
    });
  });

  describe("CardAction", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(<CardAction>Test Action</CardAction>);
      const action = container.querySelector("[data-slot='card-action']");
      expect(action).toBeInTheDocument();
      expect(action).toHaveTextContent("Test Action");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(
        <CardAction className="custom-action">Test Action</CardAction>
      );
      const action = container.querySelector(".custom-action");
      expect(action).toBeInTheDocument();
    });
  });

  describe("統合テスト", () => {
    it("全てのコンポーネントが組み合わせて正しく動作すること", () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      );

      expect(getByText("Card Title")).toBeInTheDocument();
      expect(getByText("Card Description")).toBeInTheDocument();
      expect(getByText("Card Content")).toBeInTheDocument();
      expect(getByText("Card Footer")).toBeInTheDocument();
    });
  });
});
