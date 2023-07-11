export function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Env "${key}" not found.`);
  return value;
}
