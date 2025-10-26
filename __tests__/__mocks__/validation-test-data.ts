/**
 * バリデーションテスト用のテストデータ
 * 使用例: __tests__/lib/validations.test.ts
 */

/**
 * XSS対策とサニタイゼーションのテストケース
 */
export const sanitizationTestCases = {
  /** XSS攻撃のテストケース */
  xss: {
    input: "<script>alert('xss')</script>",
    expected: "scriptalert('xss')/script",
    description: "XSS対策: < と > を除去",
  },
  /** 前後の空白をトリムするテストケース */
  trim: {
    input: "  react  ",
    expected: "react",
    description: "前後の空白をトリム",
  },
  /** トリムとサニタイゼーションの複合 */
  combined: {
    input: "  <div>test</div>  ",
    expected: "divtest/div",
    description: "トリム + < > 除去",
  },
  /** 空白のみのクエリ */
  whitespaceOnly: {
    input: "   ",
    expected: "",
    description: "空白のみはトリム後に空になる",
  },
};

/**
 * 検索パラメータのバリデーションテストケース
 */
export const searchParamsTestCases = {
  /** 有効なパラメータ */
  valid: {
    q: "react",
    page: "1",
  },
  /** ページ番号が文字列の場合 */
  pageAsString: {
    q: "test",
    page: "5",
    expectedPage: 5,
  },
  /** 256文字を超えるクエリ */
  tooLongQuery: {
    q: "a".repeat(257),
    shouldThrow: true,
  },
  /** ページ番号が範囲外（下限） */
  pageOutOfRangeLow: [
    { q: "test", page: "0", shouldThrow: true },
    { q: "test", page: "-1", shouldThrow: true },
  ],
  /** ページ番号が範囲外（上限） */
  pageOutOfRangeHigh: {
    q: "test",
    page: "101",
    shouldThrow: true,
  },
  /** 整数でないページ番号 */
  pageNotInteger: {
    q: "test",
    page: "1.5",
    shouldThrow: true,
  },
};

/**
 * リポジトリパラメータのバリデーションテストケース
 */
export const repoParamsTestCases = {
  /** 有効なパラメータ */
  valid: {
    owner: "facebook",
    repo: "react",
  },
  /** ハイフン付きのオーナー名 */
  ownerWithHyphen: {
    owner: "my-organization",
    repo: "my-repo",
  },
  /** ドット付きのリポジトリ名 */
  repoWithDot: {
    owner: "user",
    repo: "repo.js",
  },
  /** 空のオーナー名 */
  emptyOwner: {
    owner: "",
    repo: "react",
    shouldThrow: true,
  },
  /** オーナー名が長すぎる（40文字以上） */
  ownerTooLong: {
    owner: "a".repeat(40),
    repo: "react",
    shouldThrow: true,
  },
  /** 無効な形式のオーナー名（先頭/末尾がハイフン） */
  invalidOwnerFormat: [
    { owner: "-invalid", repo: "react", shouldThrow: true },
    { owner: "invalid-", repo: "react", shouldThrow: true },
  ],
  /** リポジトリ名が長すぎる（101文字以上） */
  repoTooLong: {
    owner: "user",
    repo: "a".repeat(101),
    shouldThrow: true,
  },
  /** 無効な文字を含むリポジトリ名 */
  invalidRepoCharacters: {
    owner: "user",
    repo: "repo/name",
    shouldThrow: true,
  },
};
