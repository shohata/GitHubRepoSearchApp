import { Octokit } from "octokit";

/**
 * Octokitクライアントのシングルトンインスタンス
 * メモリ効率とパフォーマンス向上のため、クライアントインスタンスを再利用
 */
let octokitInstance: Octokit | null = null;

/**
 * Octokitクライアントのファクトリー関数
 * 環境変数からトークンを取得し、認証済みまたは未認証のクライアントを返す
 *
 * @returns {Octokit} Octokitクライアントインスタンス
 */
export function getOctokitClient(): Octokit {
  if (!octokitInstance) {
    const token = process.env.GITHUB_ACCESS_TOKEN;
    octokitInstance = token ? new Octokit({ auth: token }) : new Octokit();
  }
  return octokitInstance;
}

/**
 * テスト用: シングルトンインスタンスをリセット
 */
export function resetOctokitClient(): void {
  octokitInstance = null;
}
