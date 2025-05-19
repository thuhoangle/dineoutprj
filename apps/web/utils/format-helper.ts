 

export function numberWithCommas(value: any, thousandComma?: string, floatSymbol?: string) {
  if (value !== null && value !== undefined && !isNaN(value)) {
    const [currency, cents] = value.toString().split('.');
    if (cents === undefined) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandComma || ',');
    }
    return `${currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandComma || ',')}${
      floatSymbol || '.'
    }${cents || ''}`;
  }
  return '0';
}

export const anyToNumString = (input: any) => {
  if (typeof input !== 'string' && typeof input !== 'number') return null;
  let str = input
    .toString()
    .toLowerCase()
    .replace(/[^0-9.e+-]/g, '')
    .replace('.', '#')
    .replace(/\./g, '')
    .replace('#', '.');

  if (isNaN(parseFloat(str))) return null;

  if (str.includes('e')) {
    const [base = '0.0', e] = str.split('e');
    const exponent = e ? parseInt(e, 10) : 0;

    if (exponent < 0) {
      str = `0.${'0'.repeat(Math.abs(exponent) - 1)}${base.replace('.', '')}`;
    } else {
      const [integerPart, decimalPart = ''] = base.split('.');
      str = integerPart + decimalPart + '0'.repeat(exponent - decimalPart.length);
    }
  }

  str = str.replace(/^0+/g, '');
  if (str.startsWith('.')) str = `0${str}`;
  if (str.includes('.')) str = str.replace(/0+$/g, '');
  if (str.endsWith('.')) str = str.slice(0, -1);
  if (str.startsWith('+')) str = str.slice(1);

  return str || '0';
};

const regrexCheckIncrement = /^-?\d+(?:\.\d+)?$/;
export const getCurrencyString = (
  value: any,
  options?: {
    fixed?: number;
    prefix?: string;
    suffix?: string;
    trimZeros?: boolean;
  }
) => {
  let str = anyToNumString(value);
  if (str === null) return '-';

  const { fixed, prefix, suffix, trimZeros } = options || {};
  const isNegative = str.startsWith('-');
  str = str.replace('-', '');

  let calcValue = str;
  if (fixed || fixed === 0) {
    const arr = str.split('.');
    if (arr?.[1]?.length) {
      if (arr[1].length > fixed) calcValue = str.slice(0, str.length - arr[1].length + fixed);
      else calcValue = str + '0'.repeat(fixed - arr[1].length);
    } else if (fixed) calcValue = `${str}.${'0'.repeat(fixed)}`;
  }

  if (trimZeros && calcValue.includes('.')) calcValue = calcValue.replace(/0+$/g, '');
  if (calcValue.endsWith('.')) calcValue = calcValue.slice(0, -1);

  const numString = numberWithCommas(calcValue, ',', '.');
  return `${isNegative ? '-' : ''}${prefix || ''}${numString}${suffix || ''}`;
};

export const formatUSD = (value: any, increment?: string | number, trimZeros?: boolean) => {
  let fixed;
  if (!increment && increment !== 0) fixed = 2;
  else if (typeof increment === 'number') fixed = increment;
  else if (!regrexCheckIncrement.test(increment)) return '-';
  else fixed = increment.split?.('.')?.[1]?.length || 0; // get and count the fixed number from symbol . Example : 0.000001 -> 000001 -> 6 digits
  return getCurrencyString(value, {
    fixed,
    prefix: '$',
    trimZeros,
  });
};

export const formatAmount = (value: any, increment?: string | number, trimZeros?: boolean) => {
  if (!increment && increment !== 0) return getCurrencyString(value);
  if (typeof increment === 'number')
    return getCurrencyString(value, {
      fixed: increment,
      trimZeros,
    });
  if (!regrexCheckIncrement.test(increment)) return '-';

  const fixedNumber = increment?.split('.')?.[1]?.length || 0; // get and count the fixed number from symbol . Example : 0.000001 -> 000001 -> 6 digits
  return getCurrencyString(value, {
    fixed: fixedNumber,
    trimZeros,
  });
};

export const upcaseFirstLetter = (value: string) => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const convertInputToFloat = (str: string, maxFixed?: number) => {
  if (!str) return '';
  const isNegative = str.startsWith('-');
  const newStr = str
    .replace(/[^0-9.,]/g, '')
    .replace('.', 'x')
    .replace(',', 'x')
    .replace(/\./g, '')
    .replace('x', '.');

  if (maxFixed) {
    const arr = str.split('.');
    if (arr?.[1]?.length) {
      const fixed = arr[1].length > maxFixed ? arr[1].length - maxFixed : 0;
      return newStr.slice(0, newStr.length - fixed);
    }
  }
  return `${isNegative ? '-' : ''}${newStr}`;
};

export const removeTrailingZeros = (s: string) => (s.includes('.') ? s.replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1') : s);

export const trimZeros = (s: string) => s.replace(/^0+(?=\d)|(\.\d*?[1-9])0+$|(\.0*|\.)(?=$)/g, '$1') || '0';

export const getDecimalString = (value: any) => {
  const str = typeof value === 'number' ? value.toFixed(25) : value;
  return trimZeros(str);
};

export const floatToFixed = (value: string | number, fixedNumber: number | undefined) => {
  const str = typeof value === 'number' ? value.toString() : value;
  let result = str;
  if (fixedNumber || fixedNumber === 0) {
    const arr = str.split('.');
    if (arr?.[1]?.length) {
      const fixed = arr[1].length > fixedNumber ? arr[1].length - fixedNumber : 0;
      result = str.slice(0, str.length - fixed);
    }
  }
  return Number(result);
};

export const convertInputToFloatWithIncrement = (inputStr: string | number, increment?: string | number) => {
  if (!inputStr) return '';
  const str = typeof inputStr === 'number' ? inputStr.toString() : inputStr;
  const isNegative = str.startsWith('-');
  const newStr = str
    .replace(/[^0-9.,]/g, '')
    .replace('.', 'x')
    .replace(',', 'x')
    .replace(/\./g, '')
    .replace('x', '.');

  const fixedNumber = typeof increment === 'number' ? increment : increment?.split('.')?.[1]?.length || 0;
  if (fixedNumber) {
    const arr = str.split('.');
    if (arr?.[1]?.length) {
      const fixed = arr[1].length > fixedNumber ? arr[1].length - fixedNumber : 0;
      return newStr.slice(0, newStr.length - fixed);
    }
  }
  return `${isNegative ? '-' : ''}${newStr}`;
};

export const convertNumberInput = (inputStr: string | number | undefined, increment?: string | number) => {
  if (!inputStr) return '';
  let newStr = typeof inputStr === 'number' ? inputStr.toString() : inputStr;
  const isNegative = newStr.startsWith('-');
  newStr = newStr
    .replace(/[^0-9.]/g, '')
    .replace('.', 'x')
    .replace(/\./g, '')
    .replace('x', '.');

  const [currency, cents] = newStr.split('.');
  const fixedNumber = typeof increment === 'number' ? increment : increment?.split('.')?.[1]?.length || 0;
  newStr = `${isNegative ? '-' : ''}${currency?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || ''}${
    (increment === undefined || fixedNumber) && newStr.includes('.') ? '.' : ''
  }${(increment === undefined ? cents : fixedNumber ? cents?.substring(0, fixedNumber) : '') || ''}`;

  return newStr;
};

export const toFixedFloat = (value: any, fixed: number = 2) => {
  if (isNaN(value)) return '-';
  return parseFloat(value).toFixed(fixed);
};

export const weiToFloat = (value: any, fallback: any = 0) => {
  if (isNaN(value)) return fallback;
  return parseFloat(value) / 1e18;
};

export const anyToFloat = (value: any, fallback: any = 0) => {
  const calcValue = value?.toString?.().replace(/,/g, '');

  if (isNaN(calcValue) || !calcValue) return fallback;
  return parseFloat(calcValue);
};

export const anyToFloatWithIncrement = (value: any, increment?: string | number, fallback?: any) => {
  const calcValue = value?.toString?.().replace(/,/g, '');

  if (isNaN(calcValue) || !calcValue) return fallback || '0';
  const fixedNumber = typeof increment === 'number' ? increment : increment?.split('.')?.[1]?.length || 0;
  return floatToFixed(calcValue, fixedNumber).toString();
};

export const anyToInt = (value: any, fallback: any = 0) => {
  if (isNaN(value) || !value) return fallback;
  return parseInt(value, 10);
};

export const displayElipsisAddress = (address: string, start: number, end: number) => {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const formatUnit = (inputValue: number) => {
  if (inputValue === null || inputValue === undefined || inputValue === 0 || isNaN(inputValue)) return '0';

  const value = Number(inputValue.toFixed(3));
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.floor(Math.log10(Math.abs(value)) / 3); // Determine the suffix tier
  const scaled = value / 10 ** (tier * 3); // Scale the number

  // Format with one decimal place for numbers >= 1000 and less than the next tier
  const formatted = tier <= 0 ? value.toString() : scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0); // Adjust precision

  return `${formatted}${suffixes[tier] || ''}`;
};

export const getImageUrl = (url: string) => {
  if (url.includes('https://lh3.googleusercontent')) {
    return `https://oissfgnrpjfveyjaokgk.supabase.co/storage/v1/object/public/restaurant//photo-unavail.png`;
  }
  return url;
};

export const EMPTY_RESTAURANT_IMAGE = `https://oissfgnrpjfveyjaokgk.supabase.co/storage/v1/object/public/restaurant//photo-unavail.png`;
