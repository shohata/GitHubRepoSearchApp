"use client";

import { useState, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// リポジトリ検索結果の型定義
interface Repository {
  id: number;
  name: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
}

// リポジトリ検索結果のコンポーネント
const RepoList = ({ repos }: { repos: Repository[] }) => {
  if (repos.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        リポジトリが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
      {repos.map((repo) => (
        <Card key={repo.id} className="hover:shadow-lg transition-shadow">
          <Link href={`/repos/${repo.owner.login}/${repo.name}`}>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Image
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
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
                <span className="font-medium">オーナー:</span>{" "}
                {repo.owner.login}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">言語:</span>{" "}
                {repo.language || "N/A"}
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};

// サーバーコンポーネントでAPIを呼び出す
async function fetchRepos(query: string, page: number) {
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${query}&page=${page}&per_page=12`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) {
    // APIレート制限などのエラーを考慮
    if (res.status === 403) {
      return {
        repos: [],
        totalCount: 0,
        error:
          "APIレート制限に達しました。しばらく時間をおいてから再度お試しください。",
      };
    }
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return { repos: data.items, totalCount: data.total_count };
}

// 検索結果を表示するコンポーネント
const SearchResults = ({ query, page }: { query: string; page: string }) => {
  const pageNumber = parseInt(page || "1", 10);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      setError(null);
      try {
        const { repos, totalCount, error } = await fetchRepos(
          query,
          pageNumber
        );
        if (error) {
          setError(error);
          setRepos([]);
          setTotalCount(0);
        } else {
          setRepos(repos);
          setTotalCount(totalCount);
        }
      } catch (e) {
        setError("データの取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      search();
    } else {
      // クエリがない場合はローディングを停止
      setLoading(false);
      setRepos([]);
      setTotalCount(0);
    }
  }, [query, pageNumber]);

  const totalPages = Math.ceil(totalCount / 12);
  const paginationLinks = [];
  const maxPageLinks = 5;
  let startPage = Math.max(1, pageNumber - Math.floor(maxPageLinks / 2));
  let endPage = Math.min(totalPages, startPage + maxPageLinks - 1);

  if (endPage - startPage < maxPageLinks - 1) {
    startPage = Math.max(1, endPage - maxPageLinks + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationLinks.push(
      <PaginationItem key={i}>
        <PaginationLink
          href={`/?q=${query}&page=${i}`}
          isActive={i === pageNumber}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center mt-8">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-8">{error}</div>
      ) : (
        <>
          {query && (
            <div className="text-gray-600 mt-4">
              検索結果: {totalCount.toLocaleString()}件
            </div>
          )}
          <RepoList repos={repos} />
          {totalCount > 12 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {pageNumber > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/?q=${query}&page=${pageNumber - 1}`}
                    />
                  </PaginationItem>
                )}
                {paginationLinks}
                {pageNumber < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href={`/?q=${query}&page=${pageNumber + 1}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

// クエリからの検索結果のコンポーネント
function SearchComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";
  const [searchTerm, setSearchTerm] = useState(query);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?q=${searchTerm}`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <div className="flex-grow">
          <Label htmlFor="search-input" className="sr-only">
            リポジトリを検索
          </Label>
          <Input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="リポジトリを検索..."
            className="w-full"
          />
        </div>
        <Button type="submit">検索</Button>
      </form>
      <SearchResults query={query} page={page} />
    </>
  );
}

// メインの検索ページ
export default function HomePage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">GitHub リポジトリ検索</h1>
        <ModeToggle />
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center mt-8">
            <Spinner />
          </div>
        }
      >
        <SearchComponent />
      </Suspense>
    </div>
  );
}
