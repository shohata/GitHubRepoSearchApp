/**
 * Next.js コンポーネントのモックフィクスチャ
 * テストで next/image と next/link をモックする際に使用
 */

import type { ComponentProps, ReactNode } from "react";

/**
 * next/image のモックコンポーネント
 */
export const MockImage = ({
  src,
  alt,
  ...props
}: ComponentProps<"img"> & { src: string; alt: string }) => {
  // テスト環境では単純な img タグとして扱う
  return <img src={src} alt={alt} {...props} />;
};

/**
 * next/link のモックコンポーネント
 */
export const MockLink = ({
  href,
  children,
  ...props
}: {
  href: string;
  children: ReactNode;
  [key: string]: unknown;
}) => {
  // テスト環境では単純な a タグとして扱う
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

/**
 * Next.js コンポーネントをモックするヘルパー関数
 *
 * @example
 * ```typescript
 * import { mockNextComponents } from "@/__tests__/fixtures/next-components";
 *
 * // テストファイルの先頭で
 * mockNextComponents();
 * ```
 */
export const mockNextComponents = () => {
  // next/image をモック
  jest.mock("next/image", () => ({
    __esModule: true,
    default: MockImage,
  }));

  // next/link をモック
  jest.mock("next/link", () => ({
    __esModule: true,
    default: MockLink,
  }));
};
