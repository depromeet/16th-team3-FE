import useTaskFiltering from "@/hooks/useTaskFilter";
import { useHomeData } from "@/hooks/useTasks";
import type { Task } from "@/types/task";

import React from "react";
import TaskCardSection from "../taskCardSection/TaskCardSection";
import ThisWeekTaskButton from "../thisWeekTaskButton/ThisWeekTaskButton";

interface HasTodayTasksOnlyScreenProps {
	handleTaskClick: (task: Task) => void;
	handleDetailTask: (task: Task) => void;
}

const HasTodayTasksOnlyScreen = ({
	handleTaskClick,
	handleDetailTask,
}: HasTodayTasksOnlyScreenProps) => {
	const { data: homeData } = useHomeData();

	const { todayTasks } = useTaskFiltering(homeData);

	return (
		<>
			{/* 진행 예정 섹션 */}
			<div className="mb-8">
				<h3 className="s2 mb-2 mt-2 text-text-neutral">진행 예정</h3>
				<div className="rounded-[20px] bg-component-gray-secondary p-4">
					{todayTasks.map((task, index) => (
						<TaskCardSection
							key={task.id}
							task={task}
							index={index}
							todayTasksLength={todayTasks.length}
							handleTaskClick={handleTaskClick}
							handleDetailTask={handleDetailTask}
						/>
					))}
				</div>
			</div>
			<ThisWeekTaskButton />
		</>
	);
};

export default HasTodayTasksOnlyScreen;
