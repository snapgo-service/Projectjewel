export function formatCurrency(amount: number): string {
  return `₹${(amount ?? 0).toFixed(0)}`;
}
