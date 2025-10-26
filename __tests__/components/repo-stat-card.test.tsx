import { render, screen } from "@testing-library/react";
import { Star } from "lucide-react";
import { RepoStatCard } from "@/components/features/repo/repo-stat-card";

describe("RepoStatCard", () => {
  it("正しくレンダリングされること", () => {
    render(<RepoStatCard icon={Star} label="Stars" value={1234} />);

    expect(screen.getByText("Stars")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("アイコンが表示されること", () => {
    const { container } = render(
      <RepoStatCard icon={Star} label="Stars" value={100} />
    );

    // アイコンが存在することを確認
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("適切なaria-labelが設定されていること", () => {
    render(<RepoStatCard icon={Star} label="Stars" value={5000} />);

    const statCard = screen.getByRole("group");
    expect(statCard).toHaveAttribute("aria-label", "Stars: 5,000");
  });

  it("数値が正しくフォーマットされること", () => {
    render(<RepoStatCard icon={Star} label="Stars" value={1234567} />);

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("0の値が正しく表示されること", () => {
    render(<RepoStatCard icon={Star} label="Stars" value={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("大きな数値が正しくフォーマットされること", () => {
    render(<RepoStatCard icon={Star} label="Stars" value={999999999} />);

    expect(screen.getByText("999,999,999")).toBeInTheDocument();
  });
});
