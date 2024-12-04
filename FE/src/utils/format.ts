export const formatNoSpecialChar = (query: string) => {
  return query.replace(/[^a-zA-Z0-9가-힣 ]|\\/g, '');
};

export function formatTime(time: string) {
  if (!time || !time.length) return '----.--.--';
  const year = time.slice(0, 4);
  const mon = time.slice(4, 6);
  const day = time.slice(6, 8);
  return `${year}.${mon}.${day}`;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const formatNumber = (value: number) => {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    const inBillions = value / 1_000_000_000;
    const rounded = Math.round(inBillions * 10) / 10;
    return rounded % 1 === 0
      ? `${rounded.toFixed(0)}B`
      : `${rounded.toFixed(1)}B`;
  }

  if (absValue >= 1_000_000) {
    const inMillions = value / 1_000_000;
    const rounded = Math.round(inMillions * 10) / 10;
    return rounded % 1 === 0
      ? `${rounded.toFixed(0)}M`
      : `${rounded.toFixed(1)}M`;
  }

  if (absValue >= 1_000) {
    const inThousands = value / 1_000;
    const rounded = Math.round(inThousands * 10) / 10;
    return rounded % 1 === 0
      ? `${rounded.toFixed(0)}K`
      : `${rounded.toFixed(1)}K`;
  }

  return value.toString();
};
