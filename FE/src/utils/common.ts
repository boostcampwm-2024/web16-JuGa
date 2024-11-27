export function stringToLocaleString(s: string) {
  return (+s).toLocaleString();
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  setTimeout(() => {
    window.location.reload();
  }, 100);
}

export function parseTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function isNumericString(str: string) {
  return str.length === 0 || /^[0-9]+$/.test(str);
}

export function getTradeCommision(price: number) {
  let rate = 0;
  if (price <= 10_000_000) rate = 0.0016;
  else if (price <= 50_000_000) rate = 0.0014;
  else if (price <= 100_000_000) rate = 0.0012;
  else if (price <= 300_000_000) rate = 0.001;
  else rate = 0.0008;

  return Math.floor(price * rate);
}

export function calcYield(a: number, b: number) {
  if (a === 0) return 0;

  const result = ((b - a) / a) * 100;
  return result;
}

export function isWithinTimeRange(startTime: string, endTime: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes(); // 현재 시간을 분 단위로 계산

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  if (
    isNaN(startHour) ||
    isNaN(startMinute) ||
    isNaN(endHour) ||
    isNaN(endMinute)
  ) {
    throw new Error('Invalid time format. Use "HH:MM" format.');
  }

  const startMinutes = startHour * 60 + startMinute; // 시작 시간(분 단위)
  const endMinutes = endHour * 60 + endMinute; // 종료 시간(분 단위)

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}
