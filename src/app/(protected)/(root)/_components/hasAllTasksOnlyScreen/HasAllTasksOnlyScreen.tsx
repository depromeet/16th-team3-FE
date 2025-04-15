import useTaskFiltering from "@/hooks/useTaskFilter";
import { useHomeData, useResetAlerts, useStartTask } from "@/hooks/useTasks";
import type { Task } from "@/types/task";
import { useMemo } from "react";
import NoTaskScreen from "../NoTaskScreen";
import TaskItem from "../TaskItem";
import AllTaskButton from "./allTaskButton/AllTaskButton";

interface HasAllTasksOnlyScreenProps {
	handleTaskClick: (task: Task) => void;
	handleDeleteTask: (taskId: number) => void;
}

const HasAllTasksOnlyScreen = ({
	handleTaskClick,
	handleDeleteTask,
}: HasAllTasksOnlyScreenProps) => {
	const resetAlerts = useResetAlerts();

	const { mutate: startTaskMutation } = useStartTask();

	const { data: homeData } = useHomeData();

	const { allTasks } = useTaskFiltering(homeData);

	/**
	 * * 마감이 임박한 순으로 정렬된 전체 할 일 (최대 2개)
	 */
	const topAllTasks = useMemo(() => {
		return [...allTasks]
			.sort(
				(a, b) =>
					new Date(a.dueDatetime).getTime() - new Date(b.dueDatetime).getTime(),
			)
			.slice(0, 2);
	}, [allTasks]);

	return (
		<div className="mt-4">
			<NoTaskScreen
				firstText="이번주 마감할 일이 없어요."
				secondText="급한 할일부터 시작해볼까요?"
				thirdText="미루지 말고 여유있게 시작해보세요"
			/>

			<div className="mb-4">
				{topAllTasks.map((task) => (
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

			<AllTaskButton />
		</div>
	);
};

export default HasAllTasksOnlyScreen;
