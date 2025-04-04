import Wheel from "@/components/timePicker/Wheel";

interface EstimatedDayPickerProps {
	leftDays: number;
	handleDaySelect: (hour: string) => void;
}

const EstimatedDayPicker = ({
	leftDays,
	handleDaySelect,
}: EstimatedDayPickerProps) => {
	return (
		<div className="background-primary flex h-[180px] justify-center gap-10 px-6">
			<div className="flex h-[180px] items-center gap-6">
				<Wheel
					initIdx={0}
					length={leftDays}
					width={50}
					loop={true}
					setValue={(relative) => {
						const day = (relative + 1).toString().padStart(2, "0");
						return day;
					}}
					onChange={(selected) => handleDaySelect(selected as string)}
				/>
				<span className="t2 mt-[8px] w-full">일</span>
			</div>
		</div>
	);
};

export default EstimatedDayPicker;
