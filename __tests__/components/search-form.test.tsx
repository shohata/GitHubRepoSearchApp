import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import { createMockRouter, createMockSearchParams } from "@/__tests__/fixtures";
import { SearchForm } from "@/components/features/search/search-form";

// Next.jsのnavigationモジュールをモック
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("SearchForm", () => {
  let mockRouter: ReturnType<typeof createMockRouter>;
  let mockSearchParams: ReturnType<typeof createMockSearchParams>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = createMockRouter();
    mockSearchParams = createMockSearchParams();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  test("初期クエリがない場合、空の入力フィールドが表示される", () => {
    mockSearchParams.updateParams({ q: null });

    render(<SearchForm />);

    const input = screen.getByPlaceholderText("リポジトリを検索...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  test("初期クエリがある場合、入力フィールドに表示される", () => {
    const initialQuery = "react";
    mockSearchParams.updateParams({ q: initialQuery });

    render(<SearchForm />);

    const input = screen.getByDisplayValue(initialQuery);
    expect(input).toBeInTheDocument();
  });

  test("検索ボタンが表示される", () => {
    mockSearchParams.updateParams({ q: null });

    render(<SearchForm />);

    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  test("フォーム送信時に新しいクエリでルーターがプッシュされる", async () => {
    const user = userEvent.setup();
    mockSearchParams.updateParams({ q: "" });

    render(<SearchForm />);

    const input = screen.getByPlaceholderText("リポジトリを検索...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.type(input, "typescript");
    await user.click(button);

    expect(mockRouter.push).toHaveBeenCalledWith("/?q=typescript");
  });

  test("同じクエリでフォーム送信してもルーターはプッシュされない", async () => {
    const user = userEvent.setup();
    const currentQuery = "react";
    mockSearchParams.updateParams({ q: currentQuery });

    render(<SearchForm />);

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  test("空白のみのクエリでフォーム送信してもルーターはプッシュされない", async () => {
    const user = userEvent.setup();
    mockSearchParams.updateParams({ q: "" });

    render(<SearchForm />);

    const input = screen.getByPlaceholderText("リポジトリを検索...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.type(input, "   ");
    await user.click(button);

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  test("入力フィールドが必須であることを確認", () => {
    mockSearchParams.updateParams({ q: null });

    render(<SearchForm />);

    const input = screen.getByPlaceholderText("リポジトリを検索...");
    expect(input).toBeRequired();
  });
});
