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
