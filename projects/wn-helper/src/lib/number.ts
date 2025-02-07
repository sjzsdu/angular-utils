export function formatNumber(num: number, precision = 2, threshold = 1e6) {
  if (isNaN(num)) {
    return '0';
  }

  const absNum = Math.abs(num);
  let result: string;

  if (absNum >= threshold || (absNum > 0 && absNum < 1 / threshold)) {
    result = num.toPrecision(precision);
  } else {
    result = num.toFixed(precision);
  }

  result = result.replace(/\.?0+$/, '');

  if (result.endsWith('.')) {
    result = result.slice(0, -1);
  }

  return result;
}

export function isValidNumber(value: any) {
  return /^[+-]?(\d+|\d+\.\d*|\.\d+)([eE][+-]?\d+)?$/.test(value);
}
