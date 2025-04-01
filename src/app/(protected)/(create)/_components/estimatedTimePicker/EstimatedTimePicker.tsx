import Wheel from "@/components/timePicker/Wheel";
import React from "react";

const EstimatedTimePicker = () => {
	return (
		<div className="background-primary flex h-[180px] justify-center gap-10 px-6">
			<div className="flex h-[180px] items-center gap-6">
				<Wheel
					initIdx={0}
					length={12}
					width={50}
					loop={true}
					setValue={(relative) => {
						const hour = ((relative % 12) + 1).toString().padStart(2, "0");
						return hour;
					}}
					// onChange={(selected) => handleSelectedHour(selected as string)}
				/>
				<span className="t2 mt-[14px]">시간</span>
			</div>
			<div className="flex h-[180px] items-center gap-6">
				<Wheel
					initIdx={0}
					length={12}
					width={50}
					loop={true}
					setValue={(relative) => {
						const minute = String(relative * 5).padStart(2, "0");
						return minute;
					}}
					// onChange={(selected) => handleSelectedMinute(selected as string)}
				/>
				<span className="t2 mt-[14px]">분</span>
			</div>
		</div>
	);
};

export default EstimatedTimePicker;
