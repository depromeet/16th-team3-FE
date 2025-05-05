import type { Task } from "@/types/task";
import Image from "next/image";
import React from "react";
import AllTasksTab from "./allTasksTab/AllTasksTab";

import Rocket from "@public/icons/home/rocket.svg";

interface AllTaskTabWrapperProps {
	isAllEmpty: boolean;
	inProgressTasks: Task[];
	todayTasks: Task[];
	weeklyTasks: Task[];
	futureTasks: Task[];
	onTaskClick: (task: Task) => void;
	onDeleteTask: (taskId: number) => void;
}

const AllTaskTabWrapper = ({
	isAllEmpty,
	inProgressTasks,
	todayTasks,
	weeklyTasks,
	futureTasks,
	onTaskClick,
	onDeleteTask,
}: AllTaskTabWrapperProps) => {
	return isAllEmpty ? (
		<div className="mt-[130px]">
			<div className="flex h-full flex-col items-center justify-center px-4 text-center">
				<div className="mb-[40px]">
					<Image
						src={Rocket}
						alt="Rocket"
						width={142}
						height={80}
						className="mx-auto"
						priority
					/>
				</div>
				<h2 className="t3 mb-[8px] text-text-strong">
					이번주 할일이 없어요.
					<br />
					마감할 일을 추가해볼까요?
				</h2>
				<p className="b3 text-text-alternative">
					미루지 않도록 알림을 보내 챙겨드릴게요.
				</p>
			</div>
		</div>
	) : (
		<AllTasksTab
			inProgressTasks={inProgressTasks}
			todayTasks={todayTasks}
			weeklyTasks={weeklyTasks}
			futureTasks={futureTasks}
			onTaskClick={onTaskClick}
			onDeleteTask={onDeleteTask}
		/>
	);
};

export default AllTaskTabWrapper;
