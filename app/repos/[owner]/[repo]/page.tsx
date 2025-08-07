import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

// ページ型定義
interface PageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

// リポジトリ詳細の型定義
interface RepositoryDetails {
  id: number;
  name: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
}

// サーバーコンポーネントでAPIを呼び出す
async function fetchRepoDetails(
  owner: string,
  repo: string
): Promise<RepositoryDetails> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 3600 }, // 1時間に1回キャッシュを再検証
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to fetch repository details");
  }

  return res.json();
}

// リポジトリ詳細ページ（ビューコンポーネント）
function RepoDetailsView({ repoDetails }: { repoDetails: RepositoryDetails }) {
  return (
    <>
      <Link
        href="/"
        className="flex items-center text-blue-600 hover:underline mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        トップページに戻る
      </Link>
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
              <CardTitle className="text-2xl font-bold">
                {repoDetails.name}
              </CardTitle>
              <div className="text-gray-600">
                オーナー: {repoDetails.owner.login}
              </div>
            </div>
          </div>
          <div className="text-lg font-medium text-gray-700">
            言語: {repoDetails.language || "N/A"}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">
              {repoDetails.stargazers_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Stars</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">
              {repoDetails.watchers_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Watchers</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">
              {repoDetails.forks_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Forks</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">
              {repoDetails.open_issues_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Issues</div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// リポジトリ詳細ページ（ページコンポーネント）
export default async function RepoDetailsPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { owner, repo } = resolvedParams;
  let repoDetails;

  try {
    repoDetails = await fetchRepoDetails(owner, repo);
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <RepoDetailsView repoDetails={repoDetails} />
      </div>
    );
  } catch (error) {
    // エラーハンドリング
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="text-center text-red-500 mt-8">
          リポジトリ詳細の取得中にエラーが発生しました。
        </div>
      </div>
    );
  }
}
