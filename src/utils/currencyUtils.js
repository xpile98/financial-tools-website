export const formatCurrency = (amount, currency = 'KRW') => {
  const formatter = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

export const currencyOptions = [
  { value: 'KRW', label: '대한민국 원 (₩)' },
  { value: 'USD', label: '미국 달러 ($)' },
  { value: 'EUR', label: '유로 (€)' },
];

export const formatNumberWithCommas = (value) => {
  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const parseFormattedNumber = (value) => {
  return value.replace(/,/g, '');
};