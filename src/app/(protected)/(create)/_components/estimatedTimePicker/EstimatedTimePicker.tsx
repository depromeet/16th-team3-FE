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
	return (
		<div className="background-primary flex h-[180px] justify-center gap-10 px-6">
			<div className="flex h-[180px] items-center gap-6">
				<Wheel
					initIdx={1}
					length={leftHours}
					width={50}
					loop={true}
					setValue={(relative) => {
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
