"use client";

import type { TimePickerType } from "@/types/create";
import Wheel from "./Wheel";

interface TimePickerProps {
	time: TimePickerType | undefined;
	handleMeridiem: (meridiem: string) => void;
	handleHour: (hour: string) => void;
	handleMinute: (minute: string) => void;
}

const TimePicker = ({
	time,
	handleMeridiem,
	handleHour,
	handleMinute,
}: TimePickerProps) => {
	const meridiemInitIdx = time ? (time.meridiem === "오후" ? 1 : 0) : 0;
	const hourInitIdx = time ? Number(time.hour) - 1 : 0;
	const minuteInitIdx = time ? Number(time.minute) : 0;

	const handleSelectedMeridiem = (deadlineTime: string) => {
		handleMeridiem(deadlineTime);
	};

	const handleSelectedHour = (deadlineTime: string) => {
		handleHour(deadlineTime);
	};

	const handleSelectedMinute = (deadlineTime: string) => {
		handleMinute(deadlineTime);
	};

	return (
		<div className="background-primary flex h-[200px] justify-center gap-6">
			<div className="h-[180px] w-[100px]">
				<Wheel
					initIdx={meridiemInitIdx}
					length={2}
					width={50}
					wheelSize={10}
					loop={true}
					setValue={(relative) => (relative % 2 === 0 ? "오전" : "오후")}
					onChange={(selected) => handleSelectedMeridiem(selected as string)}
				/>
			</div>
			<div className="h-[180px] w-[100px]">
				<Wheel
					initIdx={hourInitIdx}
					length={12}
					width={50}
					loop={true}
					wheelSize={20}
					setValue={(relative) => {
						const hour = ((relative % 12) + 1).toString().padStart(2, "0");
						return hour;
					}}
					onChange={(selected) => handleSelectedHour(selected as string)}
				/>
			</div>
			<div className="h-[180px] w-[100px]">
				<Wheel
					initIdx={minuteInitIdx}
					length={12}
					width={50}
					loop={true}
					wheelSize={20}
					setValue={(relative) => {
						const minute = String(relative * 5).padStart(2, "0");
						return minute;
					}}
					onChange={(selected) => handleSelectedMinute(selected as string)}
				/>
			</div>
		</div>
	);
};

export default TimePicker;
