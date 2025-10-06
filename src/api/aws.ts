import { exec } from "child_process";
import { promisify } from "util";

function memo<T extends (...args: any[]) => Promise<any>>(fn: T) {
  const cache = new Map<string, { value: any; expiry: number }>();

  return async (
    ttl: number,
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> => {
    const key = JSON.stringify(args);
    const now = Date.now();

    const cached = cache.get(key);
    if (cached && cached.expiry > now) {
      return cached.value;
    }

    const result = await fn(...args);
    cache.set(key, { value: result, expiry: now + ttl });
    return result;
  };
}

const execute = memo(promisify(exec));

export function aws(
  cmd: string,
  format: "text" | "yaml",
  ttl?: number,
): Promise<string>;
export function aws<T>(cmd: string, format?: "json", ttl?: number): Promise<T>;
export async function aws<T>(
  cmd: string,
  format: "text" | "yaml" | "json" = "json",
  ttl: number = 30_000,
): Promise<T | string> {
  try {
    const fullCmd = `${cmd} --output ${format}`;
    const { stdout } = await execute(ttl, fullCmd, { timeout: 30_000 });
    if (format === "json") {
      return JSON.parse(stdout as string) as T;
    } else {
      return (stdout as string).trim();
    }
  } catch (err: any) {
    err.command = cmd;
    throw err;
  }
}
