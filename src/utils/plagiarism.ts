export function levenshteinSimilarity(a: string, b: string): number {
  const la = a.length, lb = b.length;
  if (la === 0 || lb === 0) return 0;
  const matrix: number[][] = Array.from({ length: la + 1 }, (_, i) =>
    Array.from({ length: lb + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      matrix[i][j] = a[i - 1] === b[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1], matrix[i - 1][j], matrix[i][j - 1]) + 1;
    }
  }
  return (1 - matrix[la][lb] / Math.max(la, lb)) * 100;
}
