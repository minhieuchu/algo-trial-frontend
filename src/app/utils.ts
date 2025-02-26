export function formatUnixTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    // hour: "numeric",
    // minute: "2-digit",
    // hour12: false,
  });
}
