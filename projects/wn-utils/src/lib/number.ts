export function formatNumber(num: number, precision = 2) {
  if (isNaN(num)) {
    return 0;
  }
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function isValidNumber(value: any) {
  return /^[+-]?(\d+|\d+\.\d*|\.\d+)([eE][+-]?\d+)?$/.test(value);
}
