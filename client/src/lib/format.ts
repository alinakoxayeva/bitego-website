export const formatPrice = (value: string | number) => `${Number(value).toFixed(2)} ₼`;
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("az-AZ", { dateStyle: "medium", timeStyle: "short" });