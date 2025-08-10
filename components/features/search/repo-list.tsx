import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubSearchRepos } from "@/lib/types";

// リポジトリ検索結果のコンポーネント
export function RepoList({ repos }: { repos: GitHubSearchRepos }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
      {repos.map((repo) => (
        <Card key={repo.id} className="hover:shadow-lg transition-shadow">
          <Link href={`/repos/${repo.owner?.login}/${repo.name}`}>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Image
                src={repo.owner?.avatar_url || "./"}
                alt={repo.owner?.login || ""}
                width={48}
                height={48}
                className="rounded-full"
              />
              <CardTitle className="text-lg font-semibold">
                {repo.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Owner:</span>{" "}
                {repo.owner?.login || "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Language:</span>{" "}
                {repo.language || "N/A"}
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
