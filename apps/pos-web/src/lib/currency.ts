export const formatMoney = (amount: number, currency: string) => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'CRC' ? 0 : 2,
  }).format(amount);
};
