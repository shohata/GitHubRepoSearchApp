/**
 * Next.js Link コンポーネントの自動モック
 *
 * 使用方法:
 * テストファイルで jest.mock("next/link") を呼び出すだけで、
 * このモックが自動的に適用されます
 */

const MockLink = ({
  children,
  href,
  onMouseEnter,
  onTouchStart,
  onClick,
}: {
  children: React.ReactNode;
  href: string | { pathname: string; query?: Record<string, string> };
  onMouseEnter?: () => void;
  onTouchStart?: () => void;
  onClick?: () => void;
}) => {
  const hrefString = typeof href === "string" ? href : href.pathname;
  return (
    <a
      href={hrefString}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
    >
      {children}
    </a>
  );
};

export default MockLink;
