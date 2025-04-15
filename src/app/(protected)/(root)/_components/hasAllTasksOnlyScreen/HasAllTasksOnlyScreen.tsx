import React from "react";
import AllTaskButton from "./allTaskButton/AllTaskButton";

const HasAllTasksOnlyScreen = () => {
	return (
		<div className="mt-4">
			<div className="mb-[40px]">
				<div className="flex flex-col items-center justify-center">
					<Image
						src="/icons/home/xman.svg"
						alt="Character"
						width={80}
						height={80}
						className="mb-[40px] mt-[60px]"
					/>
					<h2 className="t3 text-center text-text-strong">
						이번주 마감할 일이 없어요.
					</h2>
					<h2 className="t3 mb-2 text-center text-text-strong">
						급한 할일부터 시작해볼까요?
					</h2>
					<p className="b3 text-center text-text-alternative">
						미루지 말고 여유있게 시작해보세요
					</p>
				</div>
			</div>

			<div className="mb-4">
				{topAllTasks.map((task) => (
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

			<AllTaskButton />
		</div>
	);
};

export default HasAllTasksOnlyScreen;
