export function cn(...inputs: (string | false | null | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function copyToClipboard(text: string) {
  if (typeof navigator === "undefined") return Promise.reject("Clipboard not available");
  return navigator.clipboard.writeText(text);
}
