import Image from "next/image";
import React from "react";
import TaskItem from "../TaskItem";
import ThisWeekLeftTaskButton from "../todayTaskTabWrapper/thisWeekLeftTaskButton/ThisWeekLeftTaskButton";

const HasWeeklyTasksOnlyScreen = () => {
	return (
		<div className="mt-4">
			<div className="mb-[40px]">
				<div className="flex flex-col items-center justify-center">
					<Image
						src="/icons/home/xman.svg"
						alt="Character"
						width={80}
						height={80}
						className="mb-[48px] mt-[60px]"
						priority
					/>
					<h2 className="t3 text-center text-text-strong">
						오늘 마감할 일이 없어요.
					</h2>
					<h2 className="t3 mb-2 text-center text-text-strong">
						이번주 할일 먼저 해볼까요?
					</h2>
					<p className="b3 text-center text-text-alternative">
						이번주 안에 끝내야 하는 할 일이에요
					</p>
				</div>
			</div>

			<div className="mb-4">
				{topWeeklyTasks.map((task) => (
					<TaskItem
						key={task.id}
						title={task.title}
						dueDate={task.dueDate}
						dueTime={task.dueTime}
						taskId={task.id}
						onClick={() => handleTaskClick(task)}
						onDelete={() => handleDeleteTask(task.id)}
						timeRequired={task.timeRequired}
						onPreviewStart={(taskId) => taskId && startTaskMutation(taskId)}
						ignoredAlerts={task.ignoredAlerts}
						resetAlerts={resetAlerts}
						dueDatetime={task.dueDatetime}
						status={task.status}
					/>
				))}
			</div>

			<ThisWeekLeftTaskButton />
		</div>
	);
};

export default HasWeeklyTasksOnlyScreen;
