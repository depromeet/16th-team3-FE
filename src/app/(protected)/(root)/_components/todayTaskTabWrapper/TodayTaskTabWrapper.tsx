"use client";

import type { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import { useState } from "react";

import dynamic from "next/dynamic";

const IsEmptyScreen = dynamic(
	() => import(/* webpackPrefetch: true */ "../isEmptyScreen/IsEmptyScreen"),
);

const HasTodayAndInProgressTasksScreen = dynamic(
	() =>
		import(
			/* webpackPrefetch: true */ "../hasTodayAndInProgressTasksScreen/HasTodayAndInProgressTasksScreen"
		),
);
const HasInProgressTasksOnlyScreen = dynamic(
	() =>
		import(
			/* webpackPrefetch: true */ "../hasInProgressTasksOnlyScreen/HasInProgressTasksOnlyScreen"
		),
);
const HasTodayTasksOnlyScreen = dynamic(
	() =>
		import(
			/* webpackPrefetch: true */ "../hasTodayTasksOnlyScreen/HasTodayTasksOnlyScreen"
		),
);
const HasWeeklyTasksOnlyScreen = dynamic(
	() =>
		import(
			/* webpackPrefetch: true */ "../hasWeeklyTasksOnlyScreen/HasWeeklyTasksOnlyScreen"
		),
);
const HasAllTasksOnlyScreen = dynamic(
	() =>
		import(
			/* webpackPrefetch: true */ "../hasAllTasksOnlyScreen/HasAllTasksOnlyScreen"
		),
);
const ExpiredTaskDrawer = dynamic(
	() =>
		import(
			/* webpackPrefetch: true */ "../expiredTaskDrawer/ExpiredTaskDrawer"
		),
);

interface TodayTaskTabWrapperProps {
	taskType: string;
	isTotallyEmpty: boolean;
	hasWeeklyTasksOnly: boolean;
	hasAllTasksOnly: boolean;
	hasTodayAndInProgressTasks: boolean;
	hasInProgressTasksOnly: boolean;
	hasTodayTasksOnly: boolean;
	handleTaskClick: (task: Task) => void;
	handleDetailTask: (task: Task) => void;
	handleDeleteTask: (taskId: number) => void;
}

const TodayTaskTabWrapper = ({
	taskType,
	isTotallyEmpty,
	hasWeeklyTasksOnly,
	hasAllTasksOnly,
	hasTodayAndInProgressTasks,
	hasInProgressTasksOnly,
	hasTodayTasksOnly,
	handleTaskClick,
	handleDetailTask,
	handleDeleteTask,
}: TodayTaskTabWrapperProps) => {
	const router = useRouter();

	const [showExpiredTaskSheet, setShowExpiredTaskSheet] = useState(false);
	const [expiredTask, setExpiredTask] = useState<Task | null>(null);

	const handleGoToReflection = (taskId: number) => {
		router.push(`/retrospection/${taskId}`);
		setShowExpiredTaskSheet(false);
	};

	const handleCloseExpiredSheet = () => {
		setShowExpiredTaskSheet(false);
	};

	return (
		<>
			{isTotallyEmpty && <IsEmptyScreen />}

			{/* 진행 중인 일이 있고 오늘 할 일도 있는 경우 */}
			{hasTodayAndInProgressTasks && (
				<HasTodayAndInProgressTasksScreen
					taskType={taskType}
					handleTaskClick={handleTaskClick}
					handleDetailTask={handleDetailTask}
				/>
			)}

			{/* 진행 중인 일만 있고 오늘 할 일은 없는 경우 */}
			{hasInProgressTasksOnly && (
				<HasInProgressTasksOnlyScreen
					taskType={taskType}
					handleDetailTask={handleDetailTask}
				/>
			)}

			{/* 진행 중인 일은 없고 오늘 진행 예정인 일만 있는 경우 */}
			{hasTodayTasksOnly && (
				<HasTodayTasksOnlyScreen
					handleTaskClick={handleTaskClick}
					handleDetailTask={handleDetailTask}
				/>
			)}

			{hasWeeklyTasksOnly && (
				<HasWeeklyTasksOnlyScreen
					handleTaskClick={handleTaskClick}
					handleDeleteTask={handleDeleteTask}
				/>
			)}

			{hasAllTasksOnly && (
				<HasAllTasksOnlyScreen
					handleTaskClick={handleTaskClick}
					handleDeleteTask={handleDeleteTask}
				/>
			)}

			{/* 뭔가 잘못된거 같음. expiredTask를 할당하는 로직이 없음. */}
			{showExpiredTaskSheet && expiredTask && (
				<ExpiredTaskDrawer
					expiredTask={expiredTask}
					handleGoToReflection={handleGoToReflection}
					handleCloseExpiredSheet={handleCloseExpiredSheet}
				/>
			)}
		</>
	);
};

export default TodayTaskTabWrapper;
