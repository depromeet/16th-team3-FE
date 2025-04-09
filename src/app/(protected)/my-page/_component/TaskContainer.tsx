import type { TaskOrigin } from "@/types/myPage";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import React, { useState } from "react";

const TaskItem = ({ task }: { task: TaskOrigin }) => {
	const date = new Date(task.dueDatetime);
	const formattedDate = format(date, "M월 d일 (eee)ㆍa hh:mm까지", {
		locale: ko,
	});

	return (
		// TODO : 여기에 완료한 일 또는 미룬 일 눌렀을때 해당 화면 전환 함수 추가 필요
		<div className="flex flex-col gap-2 py-4">
			<div className="text-s2">{task.name}</div>
			<div className="text-s3 text-gray-alternative">{formattedDate}</div>
		</div>
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
				<div
					className={`cursor-pointer text-t3 ${activeTab === "completed" ? "text-gray-normal" : "text-gray-alternative"}`}
					onClick={() => handleTabClick("completed")}
				>
					완료한 일 {completedTasks.length}
				</div>
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
