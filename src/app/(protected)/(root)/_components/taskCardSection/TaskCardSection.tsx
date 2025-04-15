import type { Task } from "@/types/task";
import Image from "next/image";
import TaskCardButton from "./taskCardButton/TaskCardButton";

interface TaskCardSectionProps {
	task: Task;
	index: number;
	todayTasksLength: number;
	handleTaskClick: (task: Task) => void;
	handleDetailTask: (task: Task) => void;
}

const TaskCardSection = ({
	task,
	index,
	todayTasksLength,
	handleTaskClick,
	handleDetailTask,
}: TaskCardSectionProps) => {
	return (
		<>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="flex items-center justify-between"
				onClick={() => handleTaskClick(task)}
			>
				<div>
					<div className="c3 flex items-center text-text-primary">
						<span className="flex items-center">
							<span>
								{task.dueTime && task.dueDate
									? `${task.dueDate === new Date().toISOString().split("T")[0] ? "오늘" : new Date(task.dueDate).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })} ${task.dueTime}`
									: task.dueDatetime
										? `${new Date(task.dueDatetime).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })} ${new Date(task.dueDatetime).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric" })}까지`
										: "시간 미정"}
							</span>
							<span className="c3 mx-1 text-text-neutral">•</span>
							<Image
								src="/icons/home/clock.svg"
								alt="시간"
								width={14}
								height={14}
								className="mr-[4px]"
								priority
							/>
							<span className="c3 text-text-neutral">
								{task.timeRequired || "1시간 소요"}
							</span>
						</span>
					</div>
					<div className="s2 mt-[3px] text-text-strong">{task.title}</div>
				</div>

				<TaskCardButton task={task} handleDetailTask={handleDetailTask} />
			</div>

			{index < todayTasksLength - 1 && (
				<div className="bg-divider-weak h-[20px] w-full" />
			)}
		</>
	);
};

export default TaskCardSection;
