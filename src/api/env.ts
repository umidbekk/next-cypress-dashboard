function resolveOptional<T extends string | null>(
  key: string,
  defaultValue: T
): T {
  const value = process.env[key];

  if (value) {
    return value.trim() as T;
  }

  return defaultValue;
}

function resolveRequired(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`env: '${key}' is empty`);
  }

  return value;
}

export const JWT_SECRET = resolveRequired("JWT_SECRET");

export const CYPRESS_RECORD_KEY = resolveRequired("CYPRESS_RECORD_KEY");

export const GITHUB_CLIENT_ID = resolveRequired("GITHUB_ID");
export const GITHUB_CLIENT_SECRET = resolveRequired("GITHUB_SECRET");
export const GITHUB_CLIENT_SLUG = resolveOptional(
  "GITHUB_SLUG",
  "next-cypress-dashboard"
);
