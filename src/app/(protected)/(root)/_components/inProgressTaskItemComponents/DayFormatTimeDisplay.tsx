/**
 * * 일 포맷 시간 표시 컴포넌트 (n일 n시간 n분 형식)
 */
const DayFormatTimeDisplay = ({ time }: { time: string }) => {
	return (
		<span className="inline-flex items-center justify-center">{time}</span>
	);
};

export default DayFormatTimeDisplay;
