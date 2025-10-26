/**
 * Next.js Image コンポーネントの自動モック
 *
 * 使用方法:
 * テストファイルで jest.mock("next/image") を呼び出すだけで、
 * このモックが自動的に適用されます
 */

const MockImage = (props: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  onLoadingComplete?: (result: {
    naturalWidth: number;
    naturalHeight: number;
  }) => void;
  onLoad?: () => void;
  onError?: () => void;
}) => {
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  return (
    // biome-ignore lint/performance/noImgElement: This is a test mock component
    // biome-ignore lint/a11y/useAltText: Props including alt are spread from Next.js Image
    <img {...props} />
  );
};

export default MockImage;
