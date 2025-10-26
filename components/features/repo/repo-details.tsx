import { AlertCircle, Eye, GitFork, Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRepo } from "@/lib/github";
import type { RepoParams } from "@/lib/validations";
import { RepoStatCard } from "./repo-stat-card";

// リポジトリ詳細コンポーネント
export async function RepoDetails({ params }: { params: Promise<RepoParams> }) {
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
