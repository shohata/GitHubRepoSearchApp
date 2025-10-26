import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchForm } from "@/components/features/search/search-form";

// Next.jsのnavigationモジュールをモック
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("SearchForm", () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  test("初期クエリがない場合、空の入力フィールドが表示される", () => {
    mockGet.mockReturnValue(null);

    render(<SearchForm />);

    const input = screen.getByPlaceholderText("リポジトリを検索...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  test("初期クエリがある場合、入力フィールドに表示される", () => {
    const initialQuery = "react";
    mockGet.mockReturnValue(initialQuery);

    render(<SearchForm />);

    const input = screen.getByDisplayValue(initialQuery);
    expect(input).toBeInTheDocument();
  });

  test("検索ボタンが表示される", () => {
    mockGet.mockReturnValue(null);

    render(<SearchForm />);

    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  test("フォーム送信時に新しいクエリでルーターがプッシュされる", async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue("");

    render(<SearchForm />);

    const input = screen.getByPlaceholderText("リポジトリを検索...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.type(input, "typescript");
    await user.click(button);

    expect(mockPush).toHaveBeenCalledWith("/?q=typescript");
  });

  test("同じクエリでフォーム送信してもルーターはプッシュされない", async () => {
    const user = userEvent.setup();
    const currentQuery = "react";
    mockGet.mockReturnValue(currentQuery);

    render(<SearchForm />);

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    expect(mockPush).not.toHaveBeenCalled();
  });

  test("空白のみのクエリでフォーム送信してもルーターはプッシュされない", async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue("");

    render(<SearchForm />);

    const input = screen.getByPlaceholderText("リポジトリを検索...");
    const button = screen.getByRole("button", { name: /search/i });

    await user.type(input, "   ");
    await user.click(button);

    expect(mockPush).not.toHaveBeenCalled();
  });

  test("入力フィールドが必須であることを確認", () => {
    mockGet.mockReturnValue(null);

    render(<SearchForm />);

    const input = screen.getByPlaceholderText("リポジトリを検索...");
    expect(input).toBeRequired();
  });
});
