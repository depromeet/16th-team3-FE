import type { TimePickerType } from "@/types/create";
import { format, set } from "date-fns";

// ! 중복되는 함수 제거

// ISO 문자열에서 '월 일 (요일)' 형식으로 변환
export function formatDateWithDay(isoString: string): string {
	const date = new Date(isoString);
	const month = date.getMonth() + 1;
	const day = date.getDate();

	// 요일 구하기
	const days = ["(일)", "(월)", "(화)", "(수)", "(목)", "(금)", "(토)"];
	const dayOfWeek = days[date.getDay()];

	return `${month}월 ${day}일 ${dayOfWeek}`;
}

// ISO 문자열에서 '오전/오후 시:분' 형식으로 변환 (바텀시트용)
export function formatTimeForDetail(isoString: string): string {
	const date = new Date(isoString);
	let hours = date.getHours();
	const minutes = date.getMinutes();

	const period = hours >= 12 ? "오후" : "오전";
	if (hours > 12) hours -= 12;
	if (hours === 0) hours = 12;

	return `${period} ${hours}:${minutes.toString().padStart(2, "0")}`;
}

// ISO 문자열에서 '오전/오후 시시까지' 형식으로 변환 (리스트용)
export function formatTimeForList(
	isoString: string,
	includeToday = true,
): string {
	const date = new Date(isoString);
	let hours = date.getHours();
	const minutes = date.getMinutes();

	const period = hours >= 12 ? "오후" : "오전";
	if (hours > 12) hours -= 12;
	if (hours === 0) hours = 12;

	// 자정인 경우 특별 처리
	if (hours === 12 && minutes === 0 && period === "오전") {
		return includeToday ? "오늘 자정까지" : "자정까지";
	}

	// 분이 0인 경우는 시간만, 아닌 경우는 분까지 표시
	const timeStr =
		minutes === 0
			? `${period} ${hours}시까지`
			: `${period} ${hours}시 ${minutes}분까지`;

	return includeToday ? `오늘 ${timeStr}` : timeStr;
}

// 오늘인지 판별
export function isToday(isoString: string): boolean {
	const date = new Date(isoString);
	const today = new Date();

	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}

// 날짜 문자열 (YYYY-MM-DD) 및 시간 문자열에서 Date 객체 생성
export function parseDateAndTime(dateStr: string, timeStr: string): Date {
	const date = new Date(dateStr);

	let hours = 0;
	if (timeStr.includes("오후")) {
		const match = timeStr.match(/오후\s*(\d+)시/);
		if (match && match[1]) {
			hours = Number.parseInt(match[1]);
			if (hours !== 12) hours += 12;
		}
	} else if (timeStr.includes("오전")) {
		const match = timeStr.match(/오전\s*(\d+)시/);
		if (match && match[1]) {
			hours = Number.parseInt(match[1]);
			if (hours === 12) hours = 0;
		}
	} else if (timeStr.includes("자정")) {
		hours = 0;
	}

	date.setHours(hours, 0, 0, 0);
	return date;
}

// 남은 시간 계산하여 문자열 반환
export function calculateRemainingTime(targetDate: Date): string {
	const now = new Date().getTime();
	const timeLeft = targetDate.getTime() - now;

	if (timeLeft <= 0) return "00:00:00 남음";

	// 24시간(1일) 이상인 경우 일, 시간, 분 형식으로 표시
	if (timeLeft >= 24 * 60 * 60 * 1000) {
		const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
		const h = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

		return `${days}일 ${h}시간 ${m}분 남음`;
	} else {
		// 24시간 미만인 경우 시:분:초 형식으로 표시
		const h = Math.floor(timeLeft / (1000 * 60 * 60));
		const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
		const s = Math.floor((timeLeft % (1000 * 60)) / 1000);

		return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")} 남음`;
	}
}

/**
 * "2025-03-05T16:00:00" → "3월 5일 (수) 오후 04:00"
 *
 * @param isoString - ISO 형식의 날짜/시간 문자열
 * @returns "M월 d일 (요일) 오전/오후 hh:mm" 형태의 문자열
 */
export function formatKoreanDateTime(isoString: string): string {
	const date = new Date(isoString);

	// 요일 표기를 위한 배열
	const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
	const dayOfWeek = dayNames[date.getDay()];

	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours < 12 ? "오전" : "오후";

	// 12시간제로 변환
	if (hours === 0) {
		hours = 12;
	} else if (hours > 12) {
		hours -= 12;
	}

	const month = date.getMonth() + 1;
	const day = date.getDate();

	// 분이 한 자리 수일 때 앞에 0을 붙임
	const minuteStr = minutes < 10 ? `0${minutes}` : minutes;

	return `${month}월 ${day}일 (${dayOfWeek}) ${ampm} ${hours}:${minuteStr}`;
}

/**
 * 주어진 ISO 시간(미래 시각)으로부터 현재까지 남은 시간을
 * "HH시간 MM분 SS초" 형식으로 반환합니다.
 *
 * @param isoString ISO 8601 형식의 날짜/시간 문자열 (예: "2025-03-05T16:00:00")
 * @returns 남은 시간 "HH시간 MM분 SS초" (만약 이미 시간이 지났다면 "00시간 00분 00초")
 */
export function getRemainingTime(isoString: string): string {
	const now = new Date();
	const target = new Date(isoString);

	let diff = target.getTime() - now.getTime();

	// 이미 시간이 지났다면 0으로 처리
	if (diff < 0) {
		diff = 0;
	}

	const totalSeconds = Math.floor(diff / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const hh = String(hours).padStart(2, "0");
	const mm = String(minutes).padStart(2, "0");
	const ss = String(seconds).padStart(2, "0");

	return `${hh}:${mm}:${ss}`;
}

export function combineDeadlineDateTime(
	date: Date,
	time: TimePickerType,
): string {
	const deadlineDateObj = new Date(date);
	let hour = Number(time.hour || 0);
	const minute = Number(time.minute || 0);
	const second = Number(time.second || 0);

	if (time.meridiem === "오후" && hour < 12) {
		hour += 12;
	} else if (time.meridiem === "오전" && hour === 12) {
		hour = 0;
	}
	const dueDateTime = set(deadlineDateObj, {
		hours: hour,
		minutes: minute,
		seconds: second,
	});

	const dueDatetimeStr = format(dueDateTime, "yyyy-MM-dd HH:mm:ss");

	return dueDatetimeStr;
}

export function combineDeadlineDateTimeToDate({
	deadlineDate,
	deadlineTime,
}: {
	deadlineDate?: Date;
	deadlineTime?: TimePickerType;
}): Date {
	if (!deadlineDate || !deadlineTime) {
		return new Date();
	}

	const combinedDate = new Date(deadlineDate);

	let hour = Number.parseInt(deadlineTime.hour, 10);
	const minute = Number.parseInt(deadlineTime.minute, 10);

	if (deadlineTime.meridiem === "오후" && hour < 12) {
		hour += 12;
	} else if (deadlineTime.meridiem === "오전" && hour === 12) {
		hour = 0;
	}

	combinedDate.setHours(hour, minute, 0, 0);

	return combinedDate;
}

export function clearTimeOnDueDatetime(dueDatetime: Date) {
	const date = new Date(dueDatetime);
	date.setHours(0, 0, 0, 0);

	return date;
}

export function convertToFormattedTime(dueDatetime: Date) {
	const hours24 = dueDatetime.getHours();
	const minutes = dueDatetime.getMinutes();

	const meridiem = hours24 < 12 ? "오전" : "오후";
	const hour = (hours24 % 12 || 12).toString().padStart(2, "0");
	const minute = minutes.toString().padStart(2, "0");

	return { meridiem, hour, minute };
}

export function convertEstimatedTime(estimatedTime: number) {
	const minutesInDay = 24 * 60;
	const days = Math.floor(estimatedTime / minutesInDay);
	const remainder = estimatedTime % minutesInDay;
	const hours = Math.floor(remainder / 60);
	const minutes = remainder % 60;

	return { estimatedDay: days, estimatedHour: hours, estimatedMinute: minutes };
}

export const convertDeadlineToDate = (
	date: Date,
	time: TimePickerType,
): Date => {
	let hour = Number.parseInt(time.hour, 10);
	if (isNaN(hour)) hour = 0;
	let minute = Number.parseInt(time.minute, 10);
	if (isNaN(minute)) minute = 0;

	if (time.meridiem === "오전" && hour === 12) {
		hour = 0;
	} else if (time.meridiem === "오후" && hour !== 12) {
		hour += 12;
	}

	return set(date, { hours: hour, minutes: minute, seconds: 0 });
};

export const calculateTriggerActionAlarmTime = (
	deadlineDate: Date,
	deadlineTime: TimePickerType,
	finalDays: number,
	finalHours: number,
	finalMinutes: number,
): string => {
	if (isNaN(deadlineDate.getTime())) {
		deadlineDate = new Date();
	}

	const deadlineDateTime = convertDeadlineToDate(deadlineDate, deadlineTime);

	if (isNaN(deadlineDateTime.getTime())) {
		throw new Error("Invalid deadline date/time provided.");
	}

	const subtractionMs =
		finalDays * 24 * 60 * 60 * 1000 +
		finalHours * 60 * 60 * 1000 +
		finalMinutes * 60 * 1000;

	const triggerActionAlarmTime = new Date(
		deadlineDateTime.getTime() - subtractionMs,
	);

	if (isNaN(triggerActionAlarmTime.getTime())) {
		throw new Error("Calculated trigger action alarm time is invalid.");
	}

	return format(triggerActionAlarmTime, "yyyy-MM-dd HH:mm:ss");
};

export const convertEstimatedTimeToMinutes = (
	estimatedDay: string,
	estimatedHour: string,
	estimatedMinute: string,
): number => {
	const daysInMinutes =
		(Number.parseInt(estimatedDay as string, 10) || 0) * 24 * 60;
	const hoursInMinutes =
		(Number.parseInt(estimatedHour as string, 10) || 0) * 60;
	const minutes = Number.parseInt(estimatedMinute as string, 10) || 0;

	return daysInMinutes + hoursInMinutes + minutes;
};

export const getValidDate = (dateInput?: string | Date): Date => {
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	return date && !isNaN(date.getTime()) ? date : new Date();
};

export const getTimeRemaining = (
	deadline: Date,
): { days: number; hours: number; minutes: number } => {
	const now = new Date();
	const diffMs = deadline.getTime() - now.getTime();
	if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0 };

	const totalMinutes = Math.floor(diffMs / 60000);

	const days = Math.floor(totalMinutes / (24 * 60));

	const remainderMinutes = totalMinutes % (24 * 60);

	const hours = Math.floor(remainderMinutes / 60);

	const minutes = remainderMinutes % 60;

	return { days, hours, minutes };
};

// 120분 => 2시간, 50분 => 50분, 90분 => 1시간 30분
export const formatTimeFromMinutes = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
  
	if (hours === 0 && mins === 0) return "0분";
	if (hours === 0) return `${mins}분`;
	if (mins === 0) return `${hours}시간`;
	return `${hours}시간 ${mins}분`;
}

// 2025-03-05T16:00:00 -> "3월 5일, 오후 4:00"
export const convertIsoToMonthDayTimeText = (input: string): string => {
	const date = new Date(input);
  
	const month = date.getMonth() + 1;
	const day = date.getDate();
  
	const time = date.toLocaleTimeString("ko-KR", {
	  hour: "numeric",
	  minute: "2-digit",
	  hour12: true,
	});
  
	return `${month}월 ${day}일, ${time}`;
  }