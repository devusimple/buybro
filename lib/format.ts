const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

export function formatPrice(cents: number) {
  return currencyFormatter.format(cents / 100)
}
