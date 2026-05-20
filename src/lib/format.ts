export function formatPct(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}

export function formatDate(iso: string): string {
  const months = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}
