export function formatTime(time: string) {
  if (!time || !time.length) return '----.--.--';
  const year = time.slice(0, 4);
  const mon = time.slice(4, 6);
  const day = time.slice(6, 8);
  return `${year}.${mon}.${day}`;
}
