import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Star, Eye, GitFork, AlertCircle } from "lucide-react";
import { getRepo } from "@/lib/github";

// ページ型定義
type PageProps = {
  owner: string;
  repo: string;
};

// サイトのメタデータ
export async function generateMetadata(
  { params }: { params: Promise<PageProps> },
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

// リポジトリ情報カードコンポーネント
function RepoStatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
      <Icon className="h-6 w-6 text-muted-foreground mb-2" />
      <div className="text-xl font-bold">{value.toLocaleString()}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

// リポジトリ詳細コンポーネント
async function RepoDetailsView({ params }: { params: Promise<PageProps> }) {
  const { owner, repo } = await params;
  const repoDetails = await getRepo(owner, repo);

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Image
            src={repoDetails.owner.avatar_url}
            alt={repoDetails.owner.login}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <CardTitle className="text-2xl font-bold mb-2">
              {repoDetails.name}
            </CardTitle>
            <p className="text-gray-600">{repoDetails.description || ""}</p>
            <div className="mt-2">
              <p className="text-gray-600">
                <span className="font-medium">Owner:</span>{" "}
                {repoDetails.owner.login}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Language:</span>{" "}
                {repoDetails.language || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        <RepoStatCard
          icon={Star}
          label="Stars"
          value={repoDetails.stargazers_count}
        />
        <RepoStatCard
          icon={Eye}
          label="Watchers"
          value={repoDetails.watchers_count}
        />
        <RepoStatCard
          icon={GitFork}
          label="Forks"
          value={repoDetails.forks_count}
        />
        <RepoStatCard
          icon={AlertCircle}
          label="Issues"
          value={repoDetails.open_issues_count}
        />
      </CardContent>
    </Card>
  );
}

// リポジトリ詳細ページ
export default async function RepoDetailsPage({
  params,
}: {
  params: Promise<PageProps>;
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
        <RepoDetailsView params={params} />
      </Suspense>
    </div>
  );
}
