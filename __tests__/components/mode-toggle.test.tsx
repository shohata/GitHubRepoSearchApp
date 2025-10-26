/**
 * ModeToggle コンポーネントは Radix UI の DropdownMenu を使用しており、
 * ユニットテストで完全にモックするのは複雑です。
 *
 * このコンポーネントの動作は E2E テストで検証されています：
 * - e2e/app.spec.ts: "ダークモード切り替えが動作すること"
 *
 * E2E テストでは以下が検証されています：
 * - トグルボタンの表示
 * - ドロップダウンメニューの開閉
 * - テーマ切り替え機能
 *
 * next-themes の useTheme フックのロジックは別途テストされています。
 */

import { render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import ModeToggle from "@/components/mode-toggle";

// next-themesのモック
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ModeToggle", () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
    });
  });

  it("正しくレンダリングされること", () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("アクセシビリティのためのスクリーンリーダーテキストが含まれること", () => {
    render(<ModeToggle />);

    const srText = screen.getByText("Toggle theme");
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass("sr-only");
  });
});
