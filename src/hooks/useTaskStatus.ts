import type { Task } from "@/types/task";
import { useMemo } from "react";

interface UseTaskStatusProps {
	todayTasks: Task[];
	weeklyTasks: Task[];
	allTasks: Task[];
	inProgressTasks: Task[];
}

const useTaskStatus = ({
	todayTasks,
	weeklyTasks,
	allTasks,
	inProgressTasks,
}: UseTaskStatusProps) => {
	/**
	 * * 오늘 할 일이 없고, 진행 중인 일도 없는 경우 (완전 빈 화면)
	 */
	const isTotallyEmpty = useMemo(() => {
		return (
			todayTasks.length === 0 &&
			weeklyTasks.length === 0 &&
			allTasks.length === 0 &&
			inProgressTasks.length === 0
		);
	}, [todayTasks, weeklyTasks, allTasks, inProgressTasks]);

	/**
	 * * 오늘 할 일이 없고, 진행 중인 일도 없지만, 이번주 할 일은 있는 경우
	 */
	const hasWeeklyTasksOnly = useMemo(() => {
		return (
			todayTasks.length === 0 &&
			inProgressTasks.length === 0 &&
			weeklyTasks.length > 0
		);
	}, [todayTasks, weeklyTasks, inProgressTasks]);

	/**
	 * * 오늘 할 일이 없고, 이번주 할 일도 없지만, 전체 할 일은 있는 경우
	 */
	const hasAllTasksOnly = useMemo(() => {
		return (
			todayTasks.length === 0 &&
			weeklyTasks.length === 0 &&
			inProgressTasks.length === 0 &&
			allTasks.length > 0
		);
	}, [todayTasks, weeklyTasks, inProgressTasks, allTasks]);

	/**
	 * * 전체 할 일이 없는 경우
	 */
	const isAllEmpty = useMemo(() => allTasks.length === 0, [allTasks]);

	/**
	 * * 진행 중인 일이 있고, 오늘 할 일도 있는 경우
	 */
	const hasTodayAndInProgressTasks = useMemo(() => {
		return inProgressTasks.length > 0 && todayTasks.length > 0;
	}, [inProgressTasks, todayTasks]);

	/**
	 * * 진행 중인 일만 있는 경우
	 */
	const hasInProgressTasksOnly = useMemo(() => {
		return inProgressTasks.length > 0 && todayTasks.length === 0;
	}, [inProgressTasks, todayTasks]);

	/**
	 * * 진행 중인 일은 없고 오늘 진행 예정인 일만 있는 경우
	 */
	const hasTodayTasksOnly = useMemo(() => {
		return inProgressTasks.length === 0 && todayTasks.length > 0;
	}, [inProgressTasks, todayTasks]);

	/**
	 * * 오늘 할 일과 진행 중인 일을 합산한 개수
	 */
	const numberOfTodayTask = useMemo(() => {
		return todayTasks.length + inProgressTasks.length;
	}, [todayTasks, inProgressTasks]);

	/**
	 * * 전체 할 일 개수
	 */
	const numberOfAllTask = useMemo(() => allTasks.length, [allTasks]);

	return {
		isTotallyEmpty,
		hasWeeklyTasksOnly,
		hasAllTasksOnly,
		isAllEmpty,
		hasTodayAndInProgressTasks,
		hasInProgressTasksOnly,
		hasTodayTasksOnly,
		numberOfTodayTask,
		numberOfAllTask,
	};
};

export default useTaskStatus;
