import { useCallback } from "react";

interface Task {
	dueDate: string;
	dueTime: string;
	dueDatetime?: string;
}

export const useFormatDueTime = (task: Task) => {
	const isToday = useCallback(() => {
		const today = new Date();
		const taskDate = new Date(task.dueDate);

		return (
			today.getDate() === taskDate.getDate() &&
			today.getMonth() === taskDate.getMonth() &&
			today.getFullYear() === taskDate.getFullYear()
		);
	}, [task.dueDate]);

	const formatDueTime = useCallback(() => {
		// "자정" 문자열이 포함된 경우
		if (task.dueTime.includes("자정")) {
			return isToday() ? "오늘 자정까지" : task.dueTime;
		}

		// dueDatetime 값이 있는 경우 직접 계산
		if (task.dueDatetime) {
			const dueDate = new Date(task.dueDatetime);
			const hours = dueDate.getHours();
			const minutes = dueDate.getMinutes();
			const ampm = hours >= 12 ? "오후" : "오전";
			const hour12 = hours % 12 || 12;

			let formattedTime: string;
			if (minutes === 0) {
				formattedTime = `${ampm} ${hour12}시까지`;
			} else {
				formattedTime = `${ampm} ${hour12}시 ${minutes}분까지`;
			}

			return isToday() ? `오늘 ${formattedTime}` : formattedTime;
		}

		// "오전/오후 n시" 형식이면서 "까지"가 포함되지 않은 경우
		if (
			(task.dueTime.includes("오후") || task.dueTime.includes("오전")) &&
			!task.dueTime.includes("까지")
		) {
			const formattedTime = `${task.dueTime}까지`;
			return isToday() ? `오늘 ${formattedTime}` : formattedTime;
		}

		// 그 외의 경우
		return isToday() ? `오늘 ${task.dueTime}` : task.dueTime;
	}, [task, isToday]);

	return { isToday, formatDueTime };
};
