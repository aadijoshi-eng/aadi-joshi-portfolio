export function publicPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("Expected a local path beginning with a slash");
  }
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
