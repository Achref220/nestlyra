/**
 * Estimate reading time from raw Markdown/MDX body text.
 * Uses ~200 words per minute (editorial average).
 */
export function getReadingTimeMinutes(body?: string | null): number {
  if (!body?.trim()) {
    return 1;
  }

  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = plain ? plain.split(' ').length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatReadingTime(minutes: number): string {
  return minutes === 1 ? '1 min read' : `${minutes} min read`;
}
