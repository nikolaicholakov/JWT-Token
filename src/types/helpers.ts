type KeyTypes<T> = {
  [K in keyof T]-?: K extends string
    ? string
    : K extends number
    ? number
    : K extends symbol
    ? symbol
    : never;
}[keyof T];

/**
 * Fix unexpected behavior of Typescript's `keyof` operator
 * @see https://github.com/microsoft/TypeScript/issues/23724
 */
export type KeyOfType<T, KeyType extends string | number | symbol = KeyTypes<T>> = Extract<
  keyof T,
  KeyType
>;

export const formatToSeconds = unixSeconds => {
  const secondsPerMinute = 60;
  const secondsPerHour = secondsPerMinute * 60;
  const secondsPerDay = secondsPerHour * 24;

  const days = Math.floor(unixSeconds / secondsPerDay);
  unixSeconds %= secondsPerDay;

  const hours = Math.floor(unixSeconds / secondsPerHour);
  unixSeconds %= secondsPerHour;

  const minutes = Math.floor(unixSeconds / secondsPerMinute);
  unixSeconds %= secondsPerMinute;

  const seconds = unixSeconds;

  const parts: string[] = [];

  if (days) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  if (seconds) parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

  return hours * secondsPerHour + minutes * secondsPerMinute + seconds;
};

export const formatToMSForSetInterval = (expiry, currentData) => {
  expiry = expiry * 1000;
  currentData = currentData * 1000;
  return expiry - currentData;
};
