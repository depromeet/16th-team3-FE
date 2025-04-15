import type { Task } from "@/types/task";
import { calculateRemainingTime, parseDateAndTime } from "@/utils/dateFormat";
import { useCallback, useEffect, useState } from "react";

export const useRemainingTime = (task: Task) => {
	const [remainingTime, setRemainingTime] = useState<string>("");
	const [isExpired, setIsExpired] = useState<boolean>(false);
	const [isUrgent, setIsUrgent] = useState<boolean>(false);

	const calculateRemainingTimeLocal = useCallback(() => {
		const now = new Date().getTime();

		let dueDatetime: Date;
		if (task.dueDatetime) {
			dueDatetime = new Date(task.dueDatetime);
		} else {
			dueDatetime = parseDateAndTime(task.dueDate, task.dueTime);
		}

		const timeLeft = dueDatetime.getTime() - now;

		setIsExpired(timeLeft < 0);

		setIsUrgent(timeLeft <= 60 * 60 * 1000 && timeLeft > 0);

		return calculateRemainingTime(dueDatetime);
	}, [task]);

	useEffect(() => {
		const updateRemainingTime = () => {
			setRemainingTime(calculateRemainingTimeLocal());
		};

		updateRemainingTime();

		const timeInterval = setInterval(updateRemainingTime, 1000);

		return () => clearInterval(timeInterval);
	}, [calculateRemainingTimeLocal]);

	return { remainingTime, isExpired, isUrgent };
};
