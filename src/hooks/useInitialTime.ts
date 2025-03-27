import type { TimePickerType } from "@/types/create";
import { useMemo } from "react";

function useInitialTime(): TimePickerType {
	return useMemo(() => {
		const now = new Date();

		now.setMinutes(now.getMinutes() + 30);

		let hour24 = now.getHours();
		let minute = now.getMinutes();

		const roundedFive = Math.round(minute / 5);
		if (roundedFive === 12) {
			minute = 0;
			hour24++;
		} else {
			minute = roundedFive * 5;
		}

		if (hour24 >= 24) {
			hour24 -= 24;
		}

		const meridiem = hour24 < 12 ? "오전" : "오후";

		let hour12 = hour24 % 12;

		if (hour12 === 0) {
			hour12 = 12;
		}

		const hourString = hour12 < 10 ? `0${hour12}` : `${hour12}`;
		const minuteString = minute < 10 ? `0${minute}` : `${minute}`;

		return {
			meridiem,
			hour: hourString,
			minute: minuteString,
		};
	}, []);
}

export default useInitialTime;
