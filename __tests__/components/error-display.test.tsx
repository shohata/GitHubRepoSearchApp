import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorDisplay } from "@/components/ui/error-display";

// Next.jsのLinkをモック（自動的に __mocks__/next/link.tsx が使用される）
jest.mock("next/link");

describe("ErrorDisplay", () => {
  const mockReload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("デフォルトのタイトルとメッセージが表示される", () => {
    render(<ErrorDisplay message="エラーが発生しました" />);

    expect(screen.getByText("エラーが発生しました。")).toBeInTheDocument();
    expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
  });

  test("カスタムタイトルが表示される", () => {
    render(
      <ErrorDisplay
        title="カスタムエラータイトル"
        message="カスタムメッセージ"
      />
    );

    expect(screen.getByText("カスタムエラータイトル")).toBeInTheDocument();
    expect(screen.getByText("カスタムメッセージ")).toBeInTheDocument();
  });

  test("再試行ボタンが表示される", () => {
    render(<ErrorDisplay message="エラー" />);

    const retryButton = screen.getByRole("button", {
      name: /ページを再読み込み/i,
    });
    expect(retryButton).toBeInTheDocument();
  });

  test("トップページに戻るリンクが表示される", () => {
    render(<ErrorDisplay message="エラー" />);

    const homeLink = screen.getByRole("link", { name: /トップページに戻る/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  test("再試行ボタンをクリックするとreload関数が呼ばれる", async () => {
    const user = userEvent.setup();
    render(<ErrorDisplay message="エラー" reload={mockReload} />);

    const retryButton = screen.getByRole("button", {
      name: /ページを再読み込み/i,
    });
    await user.click(retryButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  test("アイコンが表示される", () => {
    render(<ErrorDisplay message="エラー" />);

    // AlertTriangleアイコンが描画されることを確認
    const icon = document.querySelector(".text-destructive");
    expect(icon).toBeInTheDocument();
  });

  test("適切なARIA属性が設定されている", () => {
    render(<ErrorDisplay message="エラーメッセージ" />);

    const errorContainer = screen.getByRole("alert");
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveAttribute("aria-live", "assertive");

    const errorTitle = screen.getByText("エラーが発生しました。");
    expect(errorTitle).toHaveAttribute("id", "error-title");

    const errorMessage = screen.getByText("エラーメッセージ");
    expect(errorMessage).toHaveAttribute("id", "error-message");
  });
});
