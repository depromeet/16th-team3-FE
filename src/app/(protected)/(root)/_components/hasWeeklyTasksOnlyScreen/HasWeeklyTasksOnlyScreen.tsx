import useTaskFiltering from "@/hooks/useTaskFilter";
import { useHomeData, useResetAlerts, useStartTask } from "@/hooks/useTasks";
import type { Task } from "@/types/task";
import { memo, useMemo } from "react";
import NoTaskScreen from "../NoTaskScreen";
import TaskItem from "../TaskItem";
import ThisWeekLeftTaskButton from "../todayTaskTabWrapper/thisWeekLeftTaskButton/ThisWeekLeftTaskButton";

interface HasWeeklyTasksOnlyScreenProps {
	handleTaskClick: (task: Task) => void;
	handleDeleteTask: (taskId: number) => void;
}

const HasWeeklyTasksOnlyScreen = ({
	handleTaskClick,
	handleDeleteTask,
}: HasWeeklyTasksOnlyScreenProps) => {
	const { mutate: startTaskMutation } = useStartTask();

	const { data: homeData } = useHomeData();

	const { weeklyTasks } = useTaskFiltering(homeData);

	/**
	 * *  마감이 임박한 순으로 정렬된 이번주 할 일 (최대 2개)
	 */
	const topWeeklyTasks = useMemo(() => {
		return [...weeklyTasks]
			.sort(
				(a, b) =>
					new Date(a.dueDatetime).getTime() - new Date(b.dueDatetime).getTime(),
			)
			.slice(0, 2);
	}, [weeklyTasks]);

	return (
		<div className="mt-4">
			<NoTaskScreen
				firstText="오늘 마감할 일이 없어요."
				secondText="이번주 할일 먼저 해볼까요?"
				thirdText="이번주 안에 끝내야 하는 할 일이에요"
			/>

			<div className="mb-4">
				{topWeeklyTasks.map((task) => (
					<TaskItem
						key={task.id}
						taskId={task.id}
						onClick={() => handleTaskClick(task)}
						onDelete={() => handleDeleteTask(task.id)}
						onPreviewStart={(taskId) => taskId && startTaskMutation(taskId)}
						{...task}
					/>
				))}
			</div>

			<ThisWeekLeftTaskButton />
		</div>
	);
};

export default memo(HasWeeklyTasksOnlyScreen);
