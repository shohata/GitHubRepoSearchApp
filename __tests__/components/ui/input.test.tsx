import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  describe("基本レンダリング", () => {
    it("正しくレンダリングされること", () => {
      const { container } = render(<Input />);
      const input = container.querySelector("[data-slot='input']");
      expect(input).toBeInTheDocument();
    });

    it("inputタグとしてレンダリングされること", () => {
      const { container } = render(<Input />);
      const input = container.querySelector("[data-slot='input']");
      expect(input?.tagName).toBe("INPUT");
    });

    it("カスタムクラスが適用されること", () => {
      const { container } = render(<Input className="custom-class" />);
      const input = container.querySelector(".custom-class");
      expect(input).toBeInTheDocument();
    });

    it("追加のpropsが渡されること", () => {
      const { container } = render(
        <Input data-testid="test-input" placeholder="テスト" />
      );
      const input = container.querySelector("[data-testid='test-input']");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("placeholder", "テスト");
    });
  });

  describe("type属性", () => {
    it("typeがtextであること(デフォルト)", () => {
      const { container } = render(<Input />);
      const input = container.querySelector("[data-slot='input']");
      expect(input).not.toHaveAttribute("type");
    });

    it("type='text'が設定できること", () => {
      const { container } = render(<Input type="text" />);
      const input = container.querySelector("[data-slot='input']");
      expect(input).toHaveAttribute("type", "text");
    });

    it("type='email'が設定できること", () => {
      const { container } = render(<Input type="email" />);
      const input = container.querySelector("[data-slot='input']");
      expect(input).toHaveAttribute("type", "email");
    });

    it("type='password'が設定できること", () => {
      const { container } = render(<Input type="password" />);
      const input = container.querySelector("[data-slot='input']");
      expect(input).toHaveAttribute("type", "password");
    });

    it("type='number'が設定できること", () => {
      const { container } = render(<Input type="number" />);
      const input = container.querySelector("[data-slot='input']");
      expect(input).toHaveAttribute("type", "number");
    });

    it("type='search'が設定できること", () => {
      const { container } = render(<Input type="search" />);
      const input = container.querySelector("[data-slot='input']");
      expect(input).toHaveAttribute("type", "search");
    });
  });

  describe("入力操作", () => {
    it("値が入力できること", async () => {
      const user = userEvent.setup();
      const { container } = render(<Input />);
      const input = container.querySelector(
        "[data-slot='input']"
      ) as HTMLInputElement;

      await user.type(input, "テスト入力");

      expect(input.value).toBe("テスト入力");
    });

    it("onChange イベントが発火すること", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      const { container } = render(<Input onChange={handleChange} />);
      const input = container.querySelector(
        "[data-slot='input']"
      ) as HTMLInputElement;

      await user.type(input, "a");

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe("placeholder", () => {
    it("placeholderが表示されること", () => {
      const { container } = render(
        <Input placeholder="プレースホルダーテキスト" />
      );
      const input = container.querySelector("[data-slot='input']");
      expect(input).toHaveAttribute("placeholder", "プレースホルダーテキスト");
    });
  });

  describe("disabled状態", () => {
    it("disabledが適用されること", () => {
      const { container } = render(<Input disabled />);
      const input = container.querySelector("[data-slot='input']");
      expect(input).toBeDisabled();
    });

    it("disabled状態では入力できないこと", async () => {
      const user = userEvent.setup();
      const { container } = render(<Input disabled />);
      const input = container.querySelector(
        "[data-slot='input']"
      ) as HTMLInputElement;

      await user.type(input, "test");

      expect(input.value).toBe("");
    });
  });

  describe("aria-invalid", () => {
    it("aria-invalid='true'が設定できること", () => {
      const { container } = render(<Input aria-invalid="true" />);
      const input = container.querySelector("[data-slot='input']");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("value制御", () => {
    it("valueプロパティで値を制御できること", () => {
      const { container } = render(<Input value="制御された値" readOnly />);
      const input = container.querySelector(
        "[data-slot='input']"
      ) as HTMLInputElement;
      expect(input.value).toBe("制御された値");
    });
  });

  describe("file input", () => {
    it("type='file'が設定できること", () => {
      const { container } = render(<Input type="file" />);
      const input = container.querySelector("[data-slot='input']");
      expect(input).toHaveAttribute("type", "file");
    });
  });
});
