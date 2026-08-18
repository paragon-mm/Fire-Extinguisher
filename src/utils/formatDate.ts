export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '';
  if (!dateString.includes('-')) return dateString;
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    if (y.length === 4) {
      return `${d}/${m}/${y}`;
    }
  }
  return dateString;
}
