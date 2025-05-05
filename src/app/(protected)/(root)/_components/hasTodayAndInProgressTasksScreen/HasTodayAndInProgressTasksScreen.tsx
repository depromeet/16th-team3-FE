import useTaskFiltering from "@/hooks/useTaskFilter";
import { useHomeData, useStartTask } from "@/hooks/useTasks";
import type { Task } from "@/types/task";
import Clock from "@public/icons/home/clock.svg";
import Image from "next/image";
import React from "react";
import InProgressTaskItem from "../InProgressTaskItem";
import ThisWeekTaskButton from "../thisWeekTaskButton/ThisWeekTaskButton";

interface HasTodayAndInProgressTasksScreenProps {
	taskType: string;
	handleTaskClick: (task: Task) => void;
	handleDetailTask: (task: Task) => void;
}

const HasTodayAndInProgressTasksScreen = ({
	taskType,
	handleTaskClick,
	handleDetailTask,
}: HasTodayAndInProgressTasksScreenProps) => {
	const { data: homeData } = useHomeData();

	const { mutate: startTaskMutation } = useStartTask();

	const { todayTasks, inProgressTasks } = useTaskFiltering(homeData);

	return (
		<>
			{/* 진행 중 섹션 */}
			<div className="mb-7">
				<h3 className="s2 mb-2 mt-2 text-text-neutral">진행 중</h3>
				{inProgressTasks.map((task, index) => (
					<InProgressTaskItem
						key={task.id}
						task={task}
						index={index}
						taskType={taskType}
						onShowDetails={() => handleDetailTask(task)}
					/>
				))}
			</div>

			{/* 진행 예정 섹션 */}
			<div className="mb-8">
				<h3 className="s2 mb-2 mt-2 text-text-neutral">진행 예정</h3>
				<div className="rounded-[20px] bg-component-gray-secondary p-4">
					{todayTasks.map((task, index) => (
						<React.Fragment key={task.id}>
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
												src={Clock}
												alt="시간"
												width={14}
												height={14}
												className="mr-[4px]"
												priority
											/>
											<span className="c3 text-text-neutral whitespace-nowrap">
												{task.timeRequired || "1시간 소요"}
											</span>
										</span>
									</div>
									<div className="s2 mt-[3px] text-text-strong">
										{task.title}
									</div>
								</div>
								<button
									type="button"
									className={`l4 rounded-[10px] px-[12px] py-[9.5px] whitespace-nowrap ${
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
							</div>
							{index < todayTasks.length - 1 && (
								<div className="h-[20px] w-full bg-component-gray-secondary" />
							)}
						</React.Fragment>
					))}
				</div>
			</div>

			<ThisWeekTaskButton />
		</>
	);
};

export default HasTodayAndInProgressTasksScreen;
