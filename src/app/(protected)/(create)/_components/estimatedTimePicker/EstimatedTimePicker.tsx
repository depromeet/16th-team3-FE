import Wheel from "@/components/timePicker/Wheel";

interface EstimatedTimePickerProps {
	leftHours: number;
	leftMinutes: number;
	handleHourSelect: (hour: string) => void;
	handleMinuteSelect: (minute: string) => void;
}

const EstimatedTimePicker = ({
	leftHours,
	leftMinutes,
	handleHourSelect,
	handleMinuteSelect,
}: EstimatedTimePickerProps) => {
	const isOnlyMinutes = leftHours === 0;

	return (
		<div className="background-primary flex h-[180px] justify-center gap-10 px-6">
			<div className="flex h-[180px] items-center gap-6">
				<Wheel
					initIdx={isOnlyMinutes ? 0 : 1}
					length={isOnlyMinutes ? 1 : leftHours}
					width={50}
					loop={!isOnlyMinutes}
					setValue={(relative) => {
						if (isOnlyMinutes) return "00";

						const modHour = relative % 24;
						const hour = modHour.toString().padStart(2, "0");
						return hour;
					}}
					onChange={(selected) => handleHourSelect(selected as string)}
				/>
				<span className="t2 mt-[8px] w-full">시간</span>
			</div>
			<div className="flex h-[180px] items-center gap-6">
				<Wheel
					initIdx={0}
					length={leftHours > 0 ? 12 : Math.floor(leftMinutes / 5)}
					width={50}
					loop={true}
					setValue={(relative) => {
						if (isOnlyMinutes) {
							const minute = String((relative + 1) * 5).padStart(2, "0");
							return minute;
						}
						const minute = String(relative * 5).padStart(2, "0");
						return minute;
					}}
					onChange={(selected) => handleMinuteSelect(selected as string)}
				/>
				<span className="t2 mt-[8px] w-full">분</span>
			</div>
		</div>
	);
};

export default EstimatedTimePicker;
