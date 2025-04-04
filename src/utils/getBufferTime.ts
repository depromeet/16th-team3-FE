const getBufferTime = (
	deadlineDateTime?: Date,
	estimatedDay?: string,
	estimatedHour?: string,
	estimatedMinute?: string,
	scale = 1.5,
) => {
	const days = Number(estimatedDay) || 0;
	const hours = Number(estimatedHour) || 0;
	const minutes = Number(estimatedMinute) || 0;
	const estimatedTotalMinutes = days * 1440 + hours * 60 + minutes;

	const desiredBufferMinutes =
		Math.round((estimatedTotalMinutes * scale) / 5) * 5;

	const now = new Date();
	const remainingMinutes = deadlineDateTime
		? (deadlineDateTime.getTime() - now.getTime()) / (1000 * 60)
		: 0;

	let bufferMinutes: number;
	if (remainingMinutes < desiredBufferMinutes) {
		bufferMinutes = remainingMinutes;
	} else {
		bufferMinutes = desiredBufferMinutes;
	}

	const finalDays = Math.floor(bufferMinutes / 1440);
	const remainder = bufferMinutes % 1440;
	const finalHours = Math.floor(remainder / 60);
	const finalMinutes = Math.round(remainder % 60);

	return { finalDays, finalHours, finalMinutes };
};

export default getBufferTime;
