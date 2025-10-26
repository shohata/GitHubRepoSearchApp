import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";

/**
 * 検索フォームのロジックを扱うカスタムフック
 */
export const useSearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  //　フォーム送信時のハンドラ
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    // クエリが空でなく、現在のクエリと異なる場合のみURLを更新
    if (q.trim() && q !== initialQuery) {
      router.push(`/?q=${q}`);
    }
  };

  return {
    initialQuery,
    handleSubmit,
  };
};
