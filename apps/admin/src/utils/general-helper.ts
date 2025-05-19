export const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password: string) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const isObjectExistKeys = (data = {} as any) => Object.keys(data).some((key) => data[key]);

export const limitStringPutEllipsisInMiddle = (str: string, limit: number) => {
  if (!str) return '';
  if (str.length > limit) {
    const left = str.substring(0, limit / 2);
    const right = str.substring(str.length - limit / 2, str.length);
    return `${left}...${right}`;
  }
  return str;
};

export function wait(n: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
}

export const getPlaceHolderByIncrement = (increment: string | undefined) => increment?.replace('1', '0') || '';

export function objectToGetParams(object: { [key: string]: string | number | undefined | null }) {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return params.length > 0 ? `?${params.join('&')}` : '';
}

export const getWeekdayName = (day: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
};
