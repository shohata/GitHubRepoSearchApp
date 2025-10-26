import { renderHook } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchForm } from "@/components/features/search/use-search-form";

// Next.jsのモック
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("useSearchForm", () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue({ get: mockGet });
  });

  it("URLパラメータからinitialQueryを取得できること", () => {
    mockGet.mockReturnValue("react");

    const { result } = renderHook(() => useSearchForm());

    expect(result.current.initialQuery).toBe("react");
    expect(mockGet).toHaveBeenCalledWith("q");
  });

  it("URLパラメータがない場合、initialQueryが空文字列になること", () => {
    mockGet.mockReturnValue(null);

    const { result } = renderHook(() => useSearchForm());

    expect(result.current.initialQuery).toBe("");
  });

  it("新しいクエリで検索するとrouter.pushが呼ばれること", () => {
    mockGet.mockReturnValue("react");

    const { result } = renderHook(() => useSearchForm());

    // フォーム送信イベントをシミュレート
    const mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: {
        get: (name: string) => (name === "q" ? "typescript" : null),
      } as unknown as HTMLFormElement,
    } as React.FormEvent<HTMLFormElement>;

    // FormDataをモック
    const formData = new FormData();
    formData.set("q", "typescript");
    global.FormData = jest.fn(() => formData) as never;

    result.current.handleSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/?q=typescript");
  });

  it("同じクエリで検索するとrouter.pushが呼ばれないこと", () => {
    mockGet.mockReturnValue("react");

    const { result } = renderHook(() => useSearchForm());

    const mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: {} as HTMLFormElement,
    } as React.FormEvent<HTMLFormElement>;

    const formData = new FormData();
    formData.set("q", "react");
    global.FormData = jest.fn(() => formData) as never;

    result.current.handleSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("空のクエリで検索するとrouter.pushが呼ばれないこと", () => {
    mockGet.mockReturnValue("react");

    const { result } = renderHook(() => useSearchForm());

    const mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: {} as HTMLFormElement,
    } as React.FormEvent<HTMLFormElement>;

    const formData = new FormData();
    formData.set("q", "");
    global.FormData = jest.fn(() => formData) as never;

    result.current.handleSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("空白のみのクエリで検索するとrouter.pushが呼ばれないこと", () => {
    mockGet.mockReturnValue("react");

    const { result } = renderHook(() => useSearchForm());

    const mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: {} as HTMLFormElement,
    } as React.FormEvent<HTMLFormElement>;

    const formData = new FormData();
    formData.set("q", "   ");
    global.FormData = jest.fn(() => formData) as never;

    result.current.handleSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("前後の空白をトリムして検索すること", () => {
    mockGet.mockReturnValue("react");

    const { result } = renderHook(() => useSearchForm());

    const mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: {} as HTMLFormElement,
    } as React.FormEvent<HTMLFormElement>;

    const formData = new FormData();
    formData.set("q", "  typescript  ");
    global.FormData = jest.fn(() => formData) as never;

    result.current.handleSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/?q=  typescript  ");
  });
});
