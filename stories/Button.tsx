import "./button.css";

export interface ButtonProps {
  /** ページの主要なコールトゥアクションですか？ */
  primary?: boolean;
  /** 使用する背景色 */
  backgroundColor?: string;
  /** ボタンのサイズはどれくらいですか？ */
  size?: "small" | "medium" | "large";
  /** ボタンの内容 */
  label: string;
  /** オプションのクリックハンドラー */
  onClick?: () => void;
}

/** ユーザーインタラクションのためのプライマリUIコンポーネント */
export const Button = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";
  return (
    <button
      type="button"
      className={["storybook-button", `storybook-button--${size}`, mode].join(
        " "
      )}
      {...props}
    >
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  );
};
