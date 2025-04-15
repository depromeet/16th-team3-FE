import { useStartTask } from "@/hooks/useTasks";
import type { Task } from "@/types/task";
import { memo } from "react";

interface TaskCardButtonProps {
	task: Task;
	handleDetailTask: (task: Task) => void;
}

const TaskCardButton = ({ task, handleDetailTask }: TaskCardButtonProps) => {
	const { mutate: startTaskMutation } = useStartTask();

	return (
		<button
			type="button"
			className={`l4 rounded-[10px] px-[12px] py-[9.5px] ${
				(task.ignoredAlerts && task.ignoredAlerts >= 3) ||
				task.status === "procrastinating"
					? "bg-hologram text-text-inverse"
					: task.status === "inProgress"
						? "bg-component-accent-tertiary text-text-strong"
						: "bg-component-accent-primary text-text-strong"
			}`}
			onClick={(e) => {
				e.stopPropagation();
				if (
					(task.ignoredAlerts && task.ignoredAlerts >= 3) ||
					task.status === "procrastinating"
				) {
					handleDetailTask(task);
				} else {
					startTaskMutation(task.id);
				}
			}}
		>
			{task.status === "inProgress"
				? "이어서 몰입"
				: (task.ignoredAlerts && task.ignoredAlerts >= 3) ||
						task.status === "procrastinating"
					? "지금 시작"
					: "미리 시작"}
		</button>
	);
};

export default memo(TaskCardButton);
