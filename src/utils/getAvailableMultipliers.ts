const getAvailableMultipliers = (
	deadlineDateTime: Date,
	estimatedDay: string,
	estimatedHour: string,
	estimatedMinute: string,
): number[] => {
	const days = Number(estimatedDay) || 0;
	const hours = Number(estimatedHour) || 0;
	const minutes = Number(estimatedMinute) || 0;

	const estimatedTotalMinutes = days * 1440 + hours * 60 + minutes;

	const now = new Date();
	const remainingMinutes = deadlineDateTime
		? (deadlineDateTime.getTime() - now.getTime()) / (1000 * 60)
		: 0;

	let maxMultiplierAllowed: number;

	if (estimatedTotalMinutes * 3.0 <= remainingMinutes) {
		maxMultiplierAllowed = 3.0;
	} else {
		maxMultiplierAllowed =
			Math.floor((remainingMinutes / estimatedTotalMinutes) * 2) / 2;
	}

	const allowedMultipliers = [1.5, 2.0, 2.5, 3.0];
	const availableMultipliers = allowedMultipliers.filter(
		(mult) => mult <= maxMultiplierAllowed,
	);

	return availableMultipliers.length > 0 ? availableMultipliers : [1.5];
};

export default getAvailableMultipliers;
