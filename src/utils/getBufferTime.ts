const getBufferTime = (
  estimatedHour: string,
  estimatedMinute: string,
  scale: number = 1.5,
) => {
  const hours = Number(estimatedHour);
  const minutes = Number(estimatedMinute);
  const totalMinutes = hours * 60 + minutes;

  const scaledMinutes = totalMinutes * scale;

  const finalHours = Math.floor(scaledMinutes / 60);
  const finalMinutes = Math.round(scaledMinutes % 60);

  return { finalHours, finalMinutes };
};

export default getBufferTime;
