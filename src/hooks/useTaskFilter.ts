import type { Task } from "@/types/task";
import { useMemo } from "react";

interface HomeData {
	todayTasks: Task[];
	weeklyTasks: Task[];
	allTasks: Task[];
	inProgressTasks: Task[];
	futureTasks: Task[];
}

const useTaskFiltering = (homeData: HomeData | undefined) => {
	const allTasks = useMemo(
		() => homeData?.allTasks || [],
		[homeData?.allTasks],
	);

	const todayTasks = useMemo(() => {
		const tasks = homeData?.todayTasks || [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tasks.filter((task) => {
			const taskDueDate = task.dueDatetime
				? new Date(task.dueDatetime)
				: new Date(task.dueDate);
			const taskDate = new Date(taskDueDate);
			taskDate.setHours(0, 0, 0, 0);
			return (
				taskDate.getTime() === today.getTime() && task.status !== "inProgress"
			);
		});
	}, [homeData?.todayTasks]);

	const weeklyTasks = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		// 이번주의 월요일 찾기
		const mondayOfThisWeek = new Date(today);
		const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
		const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 일요일인 경우 이전 주의 월요일까지 거슬러 올라감
		mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);

		// 이번주의 일요일 찾기 (일요일 23:59:59)
		const sundayOfThisWeek = new Date(mondayOfThisWeek);
		sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
		sundayOfThisWeek.setHours(23, 59, 59, 999);

		return allTasks.filter((task) => {
			if (task.status === "inProgress" || task.status === "INPROGRESS")
				return false;

			// 날짜 계산
			const taskDueDate = task.dueDatetime
				? new Date(task.dueDatetime)
				: task.dueDate
					? new Date(task.dueDate)
					: null;
			if (!taskDueDate) return false;

			const taskDateOnly = new Date(taskDueDate);
			taskDateOnly.setHours(0, 0, 0, 0);

			const taskIsAfterToday = taskDateOnly.getTime() >= tomorrow.getTime();

			const taskIsBeforeSunday = taskDueDate <= sundayOfThisWeek;

			// 오늘 이후(또는 오늘 새벽 1시 이후)이고 이번주 일요일 이전인 작업
			return taskIsAfterToday && taskIsBeforeSunday;
		});
	}, [allTasks]);

	const inProgressTasks = useMemo(
		() => homeData?.inProgressTasks || [],
		[homeData?.inProgressTasks],
	);

	// 미래 할일
	const futureTasks = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		// 이번주의 일요일 계산
		const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
		const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
		const mondayOfThisWeek = new Date(today);
		mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);
		const sundayOfThisWeek = new Date(mondayOfThisWeek);
		sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
		sundayOfThisWeek.setHours(23, 59, 59, 999);

		// 모든 작업에서 미래 작업 필터링
		return allTasks.filter((task) => {
			const dueDate = task.dueDatetime
				? new Date(task.dueDatetime)
				: task.dueDate
					? new Date(task.dueDate)
					: null;

			if (!dueDate) {
				return false;
			}

			if (task.status === "inProgress" || task.status === "INPROGRESS") {
				return false;
			}

			if (
				dueDate.getDate() === today.getDate() &&
				dueDate.getMonth() === today.getMonth() &&
				dueDate.getFullYear() === today.getFullYear()
			) {
				return false;
			}

			// 이번주 작업 제외 (오늘 이후, 이번주 일요일 이전)
			if (dueDate > today && dueDate <= sundayOfThisWeek) {
				return false;
			}
			// 이번주 이후의 작업만 포함
			const isAfterSunday = dueDate > sundayOfThisWeek;
			return isAfterSunday;
		});
	}, [allTasks]);

	return { allTasks, todayTasks, weeklyTasks, inProgressTasks, futureTasks };
};

export default useTaskFiltering;
