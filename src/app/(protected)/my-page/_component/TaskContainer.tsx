import { useExpiredTaskStore } from "@/store/useTaskStore";
import type { TaskOrigin } from "@/types/myPage";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TaskItem = ({ task }: { task: TaskOrigin }) => {
	const router = useRouter();
	const date = new Date(task.dueDatetime);
	const formattedDate = format(date, "M월 d일 (eee)ㆍa hh:mm까지", {
		locale: ko,
	});
	const { setCurrentTask } = useExpiredTaskStore();

	const handleTaskClick = () => {
		setCurrentTask(task);
	};

	return (
		<Link href={`/my-page/task-detail/${task.id}`} prefetch>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div className="flex flex-col gap-2 py-4" onClick={handleTaskClick}>
				<div className="text-s2">{task.name}</div>
				<div className="text-s3 text-gray-alternative">{formattedDate}</div>
			</div>
		</Link>
	);
};

const TaskList = ({ tasks }: { tasks: TaskOrigin[] }) => (
	<>
		{tasks.map((task) => (
			<TaskItem key={task.id} task={task} />
		))}
	</>
);

const TaskContainer = ({
	completedTasks,
	postponedTasks,
}: {
	completedTasks: TaskOrigin[];
	postponedTasks: TaskOrigin[];
}) => {
	const [activeTab, setActiveTab] = useState("completed");

	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
	};

	const activeTasks =
		activeTab === "completed" ? completedTasks : postponedTasks;

	return (
		<div className="mt-8 px-5">
			<div className="flex items-center gap-4">
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					className={`cursor-pointer text-t3 ${activeTab === "completed" ? "text-gray-normal" : "text-gray-alternative"}`}
					onClick={() => handleTabClick("completed")}
				>
					완료한 일 {completedTasks.length}
				</div>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					className={`cursor-pointer text-t3 ${activeTab === "postponed" ? "text-gray-normal" : "text-gray-alternative"}`}
					onClick={() => handleTabClick("postponed")}
				>
					미룬 일 {postponedTasks.length}
				</div>
			</div>
			<TaskList tasks={activeTasks} />
		</div>
	);
};

export default TaskContainer;
