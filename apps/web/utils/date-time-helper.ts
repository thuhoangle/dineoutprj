import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { anyToInt } from './format-helper';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

// declare const window: Window & typeof globalThis;

export const toServerTime = (datetime: Dayjs) => {
  return `${datetime.valueOf()}000000`;
};

export const toClientTime = (time?: string | undefined): Dayjs => {
  // eslint-disable-next-line no-restricted-globals
  if (!time || isNaN(+time)) return dayjs();
  const datetime = `${time}`;
  return dayjs(+datetime.slice(0, -6));
};

const loadNs = process?.hrtime?.bigint?.() || BigInt(0);
const loadMs = new Date().getTime();

export const nowInNano = () => {
  if (process?.hrtime?.bigint) {
    const current = process.hrtime.bigint();
    return BigInt(BigInt(loadMs * 1000000) + (current - loadNs)).toString();
  }
  const rand6Digits = Math.round(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `${dayjs().valueOf()}${rand6Digits}`;
};

function hashToUint32(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  // eslint-disable-next-line no-bitwise
  return hash >>> 0;
}
export const createClientNonce = (address: string | undefined) => {
  const baseNonce = nowInNano();
  const secondOfNonce = baseNonce.slice(0, -9);
  return baseNonce.slice(0, -6) + hashToUint32(`${secondOfNonce}${address?.toLowerCase()}`).toString().slice(-6);
};

export const getNanoSecondFromDateString = (dateString: string | undefined) => {
  if (!dateString) return 0;
  const regex = /^(.*?)\.(.*?)Z/;
  const match = dateString.match(regex);

  // Extract the matched substrings
  const partBeforeDot = match ? match[1] : null;
  const partAfterDot = match ? match[2] : null;

  // Calculate microseconds
  const date = new Date(`${partBeforeDot}Z`);
  const microsecondsSinceEpoch = date.valueOf() * 1000 + anyToInt(partAfterDot);

  return `${microsecondsSinceEpoch}000`;
};

export type ExpiredAt = {
  num: number;
  unit: 'h' | 'm' | 's' | 'd';
};
export const convertExpireAtToSeconds = (expiredAt: ExpiredAt) => {
  const { num, unit } = expiredAt;
  switch (unit) {
    case 'h':
      return num * 60 * 60;
    case 'm':
      return num * 60;
    case 's':
      return num;
    case 'd':
      return num * 24 * 60 * 60;
    default:
      return 0;
  }
};

export const timeInAMPM = (time: string, date: string) => {
  return dayjs(`${date} ${time}`).format('h:mm A');
};

// Function to convert AM/PM time to 24-hour format
export const AMPMTo24Hour = (time: string): string => {
  if (!time || !time.includes(':')) {
    return '00:00:00'; // Default to midnight if invalid time
  }

  const [timePart, period] = time.split(' ');
  let [hours, minutes] = timePart.split(':');

  if (period === 'PM' && hours !== '12') {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  if (period === 'AM' && hours === '12') {
    hours = '00';
  }

  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
};
