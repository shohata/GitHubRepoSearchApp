import { ArrowLeft } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RepoDetails } from "@/components/features/repo/repo-details";
import { Spinner } from "@/components/ui/spinner";
import { getRepo } from "@/lib/github";
import type { RepoParams } from "@/lib/validations";

// ISR（Incremental Static Regeneration）設定
// 3600秒（1時間）ごとにページを再生成
export const revalidate = 3600;

// サイトのメタデータ
export async function generateMetadata(
  { params }: { params: Promise<RepoParams> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { owner, repo } = await params;
  const repoDetails = await getRepo(owner, repo);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${repoDetails.full_name} - GitHub Repo Search App`,
    description:
      repoDetails.description || `${repoDetails.full_name} の詳細情報です。`,
    openGraph: {
      title: repoDetails.full_name,
      description:
        repoDetails.description || `${repoDetails.full_name} の詳細情報です。`,
      images: [repoDetails.owner.avatar_url, ...previousImages],
    },
  };
}

// リポジトリ詳細ページ
export default async function RepoDetailsPage({
  params,
}: {
  params: Promise<RepoParams>;
}) {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <Link
        href="/"
        className="flex items-center text-blue-600 hover:underline mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        トップページに戻る
      </Link>
      <Suspense fallback={<Spinner className="mt-8" />}>
        <RepoDetails params={params} />
      </Suspense>
    </div>
  );
}
