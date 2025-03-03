const formatBufferTime = ({
  days,
  hours,
  minutes,
}: {
  days: number;
  hours: number;
  minutes: number;
}): string => {
  const timeParts: string[] = [];

  if (days > 0) timeParts.push(`${days}일`);
  if (hours > 0) timeParts.push(`${hours}시간`);
  if (minutes > 0) timeParts.push(`${minutes}분`);

  return timeParts.length ? timeParts.join(' ') : '0분';
};

export default formatBufferTime;
