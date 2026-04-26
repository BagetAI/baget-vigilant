export function processDiff(diff: string, maxChars: number = 20000): string {
  if (diff.length <= maxChars) return diff;

  // If the diff is too large, we take the first and last portions
  // and add a note about truncation. In a production environment,
  // we would use a more sophisticated chunking strategy.
  const half = Math.floor(maxChars / 2);
  const head = diff.slice(0, half);
  const tail = diff.slice(-half);

  return `${head}\n\n[... DIFF TRUNCATED DUE TO SIZE ...]\n\n${tail}`;
}

export function parseDiffMetadata(diff: string) {
  const filesChanged = (diff.match(/^diff --git/gm) || []).length;
  const insertions = (diff.match(/^\+/gm) || []).length;
  const deletions = (diff.match(/^\-/gm) || []).length;

  return { filesChanged, insertions, deletions };
}
