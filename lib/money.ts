export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function dollarsToCents(dollars: string | number): number {
  return Math.round(Number(dollars) * 100)
}

export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2)
}
