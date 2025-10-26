import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GitHubSearchRepos } from "@/lib/types";

/**
 * リポジトリ検索結果を表示するコンポーネント
 * グリッドレイアウトで複数のリポジトリカードを表示
 *
 * @param repos - 検索結果のリポジトリリスト
 */
export function RepoList({ repos }: { repos: GitHubSearchRepos }) {
  return (
    <div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8"
      role="list"
      aria-label="検索結果のリポジトリリスト"
    >
      {repos.map((repo) => (
        <Card
          key={repo.id}
          className="hover:shadow-lg transition-shadow"
          role="listitem"
        >
          <Link
            href={`/repos/${repo.owner?.login}/${repo.name}`}
            aria-label={`${repo.full_name}の詳細を表示`}
          >
            <CardHeader className="flex flex-row items-center space-x-4">
              {repo.owner?.avatar_url && (
                <Image
                  src={repo.owner.avatar_url}
                  alt={`${repo.owner.login}のアバター`}
                  width={48}
                  height={48}
                  className="rounded-full"
                  loading="lazy"
                />
              )}
              <CardTitle className="text-lg font-semibold">
                {repo.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="text-sm text-muted-foreground space-y-1">
                <div>
                  <dt className="inline font-medium">Owner: </dt>
                  <dd className="inline">{repo.owner?.login || "N/A"}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Language: </dt>
                  <dd className="inline">{repo.language || "N/A"}</dd>
                </div>
              </dl>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
