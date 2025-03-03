const getBufferTime = (
  estimatedDay?: string,
  estimatedHour?: string,
  estimatedMinute?: string,
  scale: number = 1.5,
) => {
  const days = Number(estimatedDay) || 0;
  const hours = Number(estimatedHour) || 0;
  const minutes = Number(estimatedMinute) || 0;
  const totalMinutes = days * 1440 + hours * 60 + minutes;
  const scaledMinutes = totalMinutes * scale;

  const finalDays = Math.floor(scaledMinutes / 1440);
  const remainder = scaledMinutes % 1440;
  const finalHours = Math.floor(remainder / 60);
  const finalMinutes = Math.round(remainder % 60);

  return { finalDays, finalHours, finalMinutes };
};

export default getBufferTime;
