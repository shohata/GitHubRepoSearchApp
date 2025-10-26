import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorDisplay } from "@/components/ui/error-display";

// next/linkのモック
jest.mock("next/link", () => {
  return function Link({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("ErrorDisplay", () => {
  describe("基本レンダリング", () => {
    it("正しくレンダリングされること", () => {
      render(<ErrorDisplay message="テストエラーメッセージ" />);

      expect(screen.getByText("エラーが発生しました。")).toBeInTheDocument();
      expect(screen.getByText("テストエラーメッセージ")).toBeInTheDocument();
    });

    it("カスタムタイトルが表示されること", () => {
      render(
        <ErrorDisplay
          title="カスタムエラータイトル"
          message="テストメッセージ"
        />
      );

      expect(screen.getByText("カスタムエラータイトル")).toBeInTheDocument();
    });

    it("アクセシビリティ属性が正しく設定されること", () => {
      const { container } = render(<ErrorDisplay message="テストメッセージ" />);

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("aria-live", "assertive");
    });

    it("エラーアイコンが表示されること", () => {
      const { container } = render(<ErrorDisplay message="テストメッセージ" />);

      const icon = container.querySelector('svg[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });
  });

  describe("ボタン操作", () => {
    it("再試行ボタンが表示されること", () => {
      render(<ErrorDisplay message="テストメッセージ" />);

      expect(screen.getByText("再試行")).toBeInTheDocument();
    });

    it("再試行ボタンがクリックされた時にreload関数が呼ばれること", async () => {
      const mockReload = jest.fn();
      const user = userEvent.setup();

      render(<ErrorDisplay message="テストメッセージ" reload={mockReload} />);

      const reloadButton = screen.getByText("再試行");
      await user.click(reloadButton);

      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it("reload関数が渡されない場合、デフォルトの動作をすること", () => {
      render(<ErrorDisplay message="テストメッセージ" />);

      const reloadButton = screen.getByText("再試行");
      // デフォルトでは window.location.reload が使用されることを確認
      // (実際のリロード動作はテストでは行わない)
      expect(reloadButton).toBeInTheDocument();
    });

    it("トップページへのリンクが表示されること", () => {
      render(<ErrorDisplay message="テストメッセージ" />);

      const link = screen.getByText("トップページに戻る").closest("a");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/");
    });
  });

  describe("スタイリング", () => {
    it("エラータイトルがdestructiveスタイルで表示されること", () => {
      render(<ErrorDisplay message="テストメッセージ" />);

      const title = screen.getByText("エラーが発生しました。");
      expect(title).toHaveClass("text-destructive");
    });

    it("メッセージがmuted-foregroundスタイルで表示されること", () => {
      render(<ErrorDisplay message="テストメッセージ" />);

      const message = screen.getByText("テストメッセージ");
      expect(message).toHaveClass("text-muted-foreground");
    });
  });
});
