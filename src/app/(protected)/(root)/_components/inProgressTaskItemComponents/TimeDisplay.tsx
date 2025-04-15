import DayFormatTimeDisplay from "./DayFormatTimeDisplay";
import HMSFormatTimeDisplay from "./HMSFormatTimeDisplay";

const TimeDisplay = ({
	time,
	isUrgent = false,
}: {
	time: string;
	isUrgent?: boolean;
}) => {
	if (time.includes("일")) {
		return <DayFormatTimeDisplay time={time} />;
	}
	return <HMSFormatTimeDisplay time={time} isUrgent={isUrgent} />;
};

export default TimeDisplay;
