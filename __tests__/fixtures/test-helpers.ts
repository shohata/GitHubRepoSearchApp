/**
 * テストで共通して使用されるヘルパー関数
 */

/**
 * 非同期処理を待機するヘルパー
 */
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * モック関数が特定の引数で呼ばれたかチェック
 */
export const wasCalledWith = <T extends (...args: unknown[]) => unknown>(
  mockFn: jest.Mock<T>,
  ...expectedArgs: Parameters<T>
) => {
  const calls = mockFn.mock.calls;
  return calls.some((call) =>
    expectedArgs.every((arg, index) => {
      const callArg = call[index];
      if (typeof arg === "object" && arg !== null) {
        return JSON.stringify(callArg) === JSON.stringify(arg);
      }
      return callArg === arg;
    })
  );
};

/**
 * モック関数の呼び出し回数を取得
 */
export const getCallCount = (mockFn: jest.Mock) => mockFn.mock.calls.length;

/**
 * モック関数の最後の呼び出し引数を取得
 */
export const getLastCallArgs = <T extends (...args: unknown[]) => unknown>(
  mockFn: jest.Mock<T>
): Parameters<T> | undefined => {
  const calls = mockFn.mock.calls;
  return calls[calls.length - 1] as Parameters<T> | undefined;
};

/**
 * console.error を一時的に抑制
 * テスト中に意図的にエラーを発生させる場合に使用
 */
export const suppressConsoleError = (callback: () => void | Promise<void>) => {
  const originalError = console.error;
  console.error = jest.fn();

  try {
    return callback();
  } finally {
    console.error = originalError;
  }
};

/**
 * console.warn を一時的に抑制
 * テスト中に意図的に警告を発生させる場合に使用
 */
export const suppressConsoleWarn = (callback: () => void | Promise<void>) => {
  const originalWarn = console.warn;
  console.warn = jest.fn();

  try {
    return callback();
  } finally {
    console.warn = originalWarn;
  }
};

/**
 * 環境変数を一時的に設定するヘルパー
 */
export const withEnv = <T>(
  envVars: Record<string, string | undefined>,
  callback: () => T
): T => {
  const originalEnv = { ...process.env };

  try {
    Object.entries(envVars).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });

    return callback();
  } finally {
    process.env = originalEnv;
  }
};

/**
 * Date.now() をモックするヘルパー
 */
export const mockDateNow = (timestamp: number) => {
  const original = Date.now;
  Date.now = jest.fn(() => timestamp);
  return () => {
    Date.now = original;
  };
};
