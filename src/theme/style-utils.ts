export function mergeClassNames(
  ...classNames: Array<string | null | undefined | false>
): string | undefined {
  const merged = classNames.filter(Boolean).join(" ");
  return merged || undefined;
}
