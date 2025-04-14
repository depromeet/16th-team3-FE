"use client";

import CreateTaskSheet from "@/app/(protected)/(root)/_components/CreateTaskSheet";
import InProgressTaskItem from "@/app/(protected)/(root)/_components/InProgressTaskItem";
import TaskDetailSheet from "@/app/(protected)/(root)/_components/TaskDetailSheet";
import TaskItem from "@/app/(protected)/(root)/_components/TaskItem";
import {
	useDeleteTask,
	useHomeData,
	useResetAlerts,
	useStartTask,
} from "@/hooks/useTasks";
import type { Task, TaskWithPersona } from "@/types/task";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
	useState,
	useEffect,
	useMemo,
	Suspense,
	useCallback,
} from "react";

import Loader from "@/components/loader/Loader";
import useTaskFiltering from "@/hooks/useTaskFilter";
import useTaskStatus from "@/hooks/useTaskStatus";
import { useAuthStore } from "@/store";
import CharacterDialog from "../(create)/_components/characterDialog/CharacterDialog";
import FailedDialog from "../(create)/_components/failedDialog/FailedDialog";
import AllTaskTabWrapper from "./_components/allTaskTabWrapper/AllTaskTabWrapper";
import Footer from "./_components/footer/Footer";
import Header from "./_components/header/Header";

const HomePageContent = () => {
	const router = useRouter();
	const { data: homeData, isPending } = useHomeData();

	const isUserProfileLoading = useAuthStore(
		(state) => state.isUserProfileLoading,
	);

	const { mutate: startTaskMutation } = useStartTask();
	const { mutate: deleteTaskMutation } = useDeleteTask();

	const resetAlerts = useResetAlerts();

	const { allTasks, todayTasks, weeklyTasks, inProgressTasks, futureTasks } =
		useTaskFiltering(homeData);

	const {
		isTotallyEmpty,
		hasWeeklyTasksOnly,
		hasAllTasksOnly,
		isAllEmpty,
		hasTodayAndInProgressTasks,
		hasInProgressTasksOnly,
		hasTodayTasksOnly,
		numberOfTodayTask,
		numberOfAllTask,
	} = useTaskStatus({
		todayTasks,
		weeklyTasks,
		allTasks,
		inProgressTasks,
	});

	// 화면 분기 처리를 위한 상태
	const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"today" | "all">("today");
	const [detailTask, setDetailTask] = useState<Task | null>(null);
	const [showExpiredTaskSheet, setShowExpiredTaskSheet] = useState(false);
	const [expiredTask, setExpiredTask] = useState<Task | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isFailedDialogOpen, setIsFailedDialogOpen] = useState(false);
	const [personaId, setPersonaId] = useState<number | undefined>(undefined);
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

	const searchParams = useSearchParams();
	const [taskName, setTaskName] = useState("");
	const [personaName, setPersonaName] = useState("");
	const [taskType, setTaskType] = useState("");
	const [urgentTaskId, setUrgentTaskId] = useState<number | undefined>(
		undefined,
	);

	const handleGoToReflection = (taskId: number) => {
		router.push(`/retrospection/${taskId}`);
		setShowExpiredTaskSheet(false);
	};

	const handleCloseExpiredSheet = () => {
		setShowExpiredTaskSheet(false);
	};

	const handleDetailTask = (task: Task) => {
		setDetailTask(task);
		setIsDetailSheetOpen(true);
	};

	const handleDeleteTask = useCallback(
		(taskId: number) => {
			deleteTaskMutation(taskId);
			if (isDetailSheetOpen && detailTask && detailTask.id === taskId) {
				setIsDetailSheetOpen(false);
			}
		},
		[deleteTaskMutation, isDetailSheetOpen, detailTask],
	);

	const handleTaskClick = useCallback((task: Task) => {
		setDetailTask(task);
		setIsDetailSheetOpen(true);
	}, []);

	const handleCloseDetailSheet = () => {
		setIsDetailSheetOpen(false);
	};

	const handleStartTask = (taskId: number) => {
		startTaskMutation(taskId);
		setIsDetailSheetOpen(false);
		router.push(`/immersion/${taskId}`);
	};

	const handleAddTask = useCallback(() => {
		setIsCreateSheetOpen(true);
	}, []);

	const handleCloseCreateSheet = () => {
		setIsCreateSheetOpen(false);
	};

	const handleCharacterDialogButtonClick = () => {
		if (taskType === "instant") {
			router.push(`/immersion/${urgentTaskId}`);
		} else {
			setIsDialogOpen(false);
		}
	};

	const handleFailedDialogButtonClick = () => {
		setIsFailedDialogOpen(false);
	};

	// 마감이 임박한 순으로 정렬된 이번주 할 일 (최대 2개)
	const topWeeklyTasks = useMemo(() => {
		return [...weeklyTasks]
			.sort(
				(a, b) =>
					new Date(a.dueDatetime).getTime() - new Date(b.dueDatetime).getTime(),
			)
			.slice(0, 2);
	}, [weeklyTasks]);

	// 마감이 임박한 순으로 정렬된 전체 할 일 (최대 2개)
	const topAllTasks = useMemo(() => {
		return [...allTasks]
			.sort(
				(a, b) =>
					new Date(a.dueDatetime).getTime() - new Date(b.dueDatetime).getTime(),
			)
			.slice(0, 2);
	}, [allTasks]);

	const handleTabChange = useCallback((tab: "today" | "all") => {
		setActiveTab(tab);
	}, []);

	useEffect(() => {
		if (searchParams.get("dialog") === "success") {
			setIsDialogOpen(true);
		}

		if (searchParams.get("dialog") === "error") {
			setIsFailedDialogOpen(true);
		}

		const taskParam = searchParams.get("task");
		if (taskParam) {
			setTaskName(taskParam);
		}

		const personaParam = searchParams.get("personaName");
		if (personaParam) {
			setPersonaName(personaParam);
		}

		const personaIdParam = searchParams.get("personaId");
		const personaId = personaIdParam
			? Number.parseInt(personaIdParam, 10)
			: undefined;

		if (personaId) {
			setPersonaId(personaId);
		}

		const taskTypeParam = searchParams.get("type");
		if (taskTypeParam) {
			setTaskType(taskTypeParam);
		}

		const taskIdParam = searchParams.get("taskId");
		if (taskIdParam) {
			setUrgentTaskId(Number(taskIdParam));
		}

		if (isDialogOpen) {
			router.replace("/", { scroll: false });
		}
	}, [searchParams, router, isDialogOpen]);

	useEffect(() => {
		if (searchParams.get("tab") === "all") {
			setActiveTab("all");
		} else if (searchParams.get("tab") === "today") {
			setActiveTab("today");
		}
	}, [searchParams]);

	return (
		<>
			<div className="flex flex-col overflow-hidden bg-background-primary">
				<Header
					activeTab={activeTab}
					numberOfTodayTasks={numberOfTodayTask}
					numberOfAllTasks={numberOfAllTask}
					handleTabChange={handleTabChange}
				/>

				{isUserProfileLoading || isPending ? (
					<Loader />
				) : (
					<main className="flex-1 overflow-y-auto px-5 pb-40 pt-28">
						{/* 오늘 할일 탭 */}
						{activeTab === "today" && (
							<>
								{isTotallyEmpty && (
									<div className="mt-[130px]">
										<div className="flex flex-col items-center px-4 text-center">
											<div className="mb-[40px]">
												<Image
													src="/icons/home/rocket.svg"
													alt="Rocket"
													width={142}
													height={80}
													className="mx-auto"
												/>
											</div>
											<h2 className="t3 mb-[8px] text-text-strong">
												마감 할 일을 추가하고
												<br />
												바로 시작해볼까요?
											</h2>
											<p className="b3 text-text-alternative">
												미루지 않도록 알림을 보내 챙겨드릴게요.
											</p>
										</div>
									</div>
								)}

								{/* 진행 중인 일이 있고 오늘 할 일도 있는 경우 */}
								{hasTodayAndInProgressTasks && (
									<>
										{/* 진행 중 섹션 */}
										<div className="mb-7">
											<h3 className="s2 mb-2 mt-2 text-text-neutral">
												진행 중
											</h3>
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
											<h3 className="s2 mb-2 mt-2 text-text-neutral">
												진행 예정
											</h3>
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
																		<span className="c3 mx-1 text-text-neutral">
																			•
																		</span>
																		<Image
																			src="/icons/home/clock.svg"
																			alt="시간"
																			width={14}
																			height={14}
																			className="mr-[4px]"
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
																	(
																		task.ignoredAlerts &&
																			task.ignoredAlerts >= 3
																	) || task.status === "procrastinating"
																		? "bg-hologram text-text-inverse"
																		: task.status === "inProgress"
																			? "bg-component-accent-tertiary text-text-strong"
																			: "bg-component-accent-primary text-text-strong"
																}`}
																onClick={(e) => {
																	e.stopPropagation();
																	if (
																		(task.ignoredAlerts &&
																			task.ignoredAlerts >= 3) ||
																		task.status === "procrastinating"
																	) {
																		handleDetailTask(task); // 상세 시트를 보여주거나 시작 로직 추가
																	} else {
																		startTaskMutation(task.id);
																	}
																}}
															>
																{task.status === "inProgress"
																	? "이어서 몰입"
																	: (task.ignoredAlerts &&
																				task.ignoredAlerts >= 3) ||
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

										<div>
											<button
												type="button"
												className="flex w-full items-center justify-between rounded-[20px] bg-component-gray-secondary px-4 py-4"
												onClick={() => router.push("/weekly-tasks")}
											>
												<span className="s2 text-text-neutral">
													이번주 할일
												</span>
												<Image
													src="/icons/home/arrow-right.svg"
													alt="Arrow Right"
													width={24}
													height={24}
												/>
											</button>
										</div>
									</>
								)}

								{/* 진행 중인 일만 있고 오늘 할 일은 없는 경우 */}
								{hasInProgressTasksOnly && (
									<>
										{/* 진행 중 섹션 */}
										<div className="mb-7">
											<h3 className="s3 mb-2 text-text-neutral">진행 중</h3>
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

										<div>
											<button
												type="button"
												className="flex w-full items-center justify-between rounded-[20px] bg-component-gray-secondary px-4 py-4"
												onClick={() => router.push("/weekly-tasks")}
											>
												<span className="s2 text-text-neutral">
													이번주 할일
												</span>
												<Image
													src="/icons/home/arrow-right.svg"
													alt="Arrow Right"
													width={24}
													height={24}
												/>
											</button>
										</div>
									</>
								)}

								{/* 진행 중인 일은 없고 오늘 진행 예정인 일만 있는 경우 */}
								{hasTodayTasksOnly && (
									<>
										{/* 진행 예정 섹션 */}
										<div className="mb-8">
											<h3 className="s2 mb-2 mt-2 text-text-neutral">
												진행 예정
											</h3>
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
																		<span className="c3 mx-1 text-text-neutral">
																			•
																		</span>
																		<Image
																			src="/icons/home/clock.svg"
																			alt="시간"
																			width={14}
																			height={14}
																			className="mr-[4px]"
																		/>
																		<span className="c3 text-text-neutral">
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
																className={`l4 rounded-[10px] px-[12px] py-[9.5px] ${
																	(
																		task.ignoredAlerts &&
																			task.ignoredAlerts >= 3
																	) || task.status === "procrastinating"
																		? "bg-hologram text-text-inverse"
																		: task.status === "inProgress"
																			? "bg-component-accent-tertiary text-text-strong"
																			: "bg-component-accent-primary text-text-strong"
																}`}
																onClick={(e) => {
																	e.stopPropagation();
																	if (
																		(task.ignoredAlerts &&
																			task.ignoredAlerts >= 3) ||
																		task.status === "procrastinating"
																	) {
																		handleDetailTask(task); // 상세 시트를 보여주거나 시작 로직 추가
																	} else {
																		startTaskMutation(task.id);
																	}
																}}
															>
																{task.status === "inProgress"
																	? "이어서 몰입"
																	: (task.ignoredAlerts &&
																				task.ignoredAlerts >= 3) ||
																			task.status === "procrastinating"
																		? "지금 시작"
																		: "미리 시작"}
															</button>
														</div>
														{index < todayTasks.length - 1 && (
															<div className="bg-divider-weak h-[20px] w-full" />
														)}
													</React.Fragment>
												))}
											</div>
										</div>
										<div>
											<button
												type="button"
												className="flex w-full items-center justify-between rounded-[20px] bg-component-gray-secondary px-4 py-4"
												onClick={() => router.push("/weekly-tasks")}
											>
												<span className="s2 text-text-neutral">
													이번주 할일
												</span>
												<Image
													src="/icons/home/arrow-right.svg"
													alt="Arrow Right"
													width={24}
													height={24}
												/>
											</button>
										</div>
									</>
								)}

								{hasWeeklyTasksOnly && (
									<div className="mt-4">
										<div className="mb-[40px]">
											<div className="flex flex-col items-center justify-center">
												<Image
													src="/icons/home/xman.svg"
													alt="Character"
													width={80}
													height={80}
													className="mb-[48px] mt-[60px]"
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
													onPreviewStart={(taskId) =>
														taskId && startTaskMutation(taskId)
													}
													ignoredAlerts={task.ignoredAlerts}
													resetAlerts={resetAlerts}
													dueDatetime={task.dueDatetime}
													status={task.status}
												/>
											))}
										</div>

										<div>
											<button
												type="button"
												className="flex w-full items-center justify-between px-4 py-4"
												onClick={() => router.push("/weekly-tasks")}
											>
												<span className="s2 text-text-neutral">
													이번주 할일 더보기
												</span>
												<Image
													src="/icons/home/arrow-right.svg"
													alt="Arrow Right"
													width={24}
													height={24}
												/>
											</button>
										</div>
									</div>
								)}

								{hasAllTasksOnly && (
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
													onPreviewStart={(taskId) =>
														taskId && startTaskMutation(taskId)
													}
													ignoredAlerts={task.ignoredAlerts}
													resetAlerts={resetAlerts}
													dueDatetime={task.dueDatetime}
													status={task.status}
												/>
											))}
										</div>

										<div>
											<button
												type="button"
												className="flex w-full items-center justify-between px-4 py-4"
												onClick={() => setActiveTab("all")}
											>
												<span className="s2 text-text-neutral">
													전체 할일 더보기
												</span>
												<Image
													src="/icons/home/arrow-right.svg"
													alt="Arrow Right"
													width={24}
													height={24}
												/>
											</button>
										</div>
									</div>
								)}

								{showExpiredTaskSheet && expiredTask && (
									<div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
										<div className="flex w-full flex-col items-center rounded-t-[28px] bg-component-gray-secondary p-4 pt-10">
											<h2 className="t3 text-center text-text-strong">
												{expiredTask.title}
											</h2>
											<p className="t3 mb-2 text-center text-text-strong">
												작업이 끝났어요. 짧게 돌아볼까요?
											</p>
											<div className="flex w-full justify-between">
												<p className="b3 mb-7 text-text-neutral">마감일 </p>
												<p className="b3 mb-7 text-text-neutral">
													{new Date(expiredTask.dueDate).toLocaleDateString(
														"ko-KR",
														{ month: "long", day: "numeric" },
													)}
													({expiredTask.dueDay}), {expiredTask.dueTime}
												</p>
											</div>
											<button
												type="button"
												className="l2 mb-3 w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
												onClick={() => handleGoToReflection(expiredTask.id)}
											>
												회고하기
											</button>

											<button
												type="button"
												className="l2 w-full py-4 text-text-neutral"
												onClick={handleCloseExpiredSheet}
											>
												닫기
											</button>
										</div>
									</div>
								)}
							</>
						)}

						{/* 전체 할일 탭 */}
						{activeTab === "all" && (
							<AllTaskTabWrapper
								isAllEmpty={isAllEmpty}
								inProgressTasks={inProgressTasks}
								todayTasks={todayTasks}
								weeklyTasks={weeklyTasks}
								futureTasks={futureTasks}
								onTaskClick={handleTaskClick}
								onDeleteTask={handleDeleteTask}
							/>
						)}
					</main>
				)}

				<Footer onClick={handleAddTask} />
			</div>

			{detailTask && (
				<TaskDetailSheet
					isOpen={isDetailSheetOpen}
					onClose={handleCloseDetailSheet}
					task={detailTask as TaskWithPersona}
					onDelete={handleDeleteTask}
					onStart={handleStartTask}
					setIsDetailSheetOpen={setIsDetailSheetOpen}
				/>
			)}

			<CharacterDialog
				isOpen={isDialogOpen}
				task={taskName}
				taskType={taskType}
				personaName={personaName}
				personaId={personaId}
				onClick={handleCharacterDialogButtonClick}
			/>

			<FailedDialog
				isOpen={isFailedDialogOpen}
				onClick={handleFailedDialogButtonClick}
			/>

			<CreateTaskSheet
				isOpen={isCreateSheetOpen}
				onClose={handleCloseCreateSheet}
			/>
		</>
	);
};

const HomePage = () => (
	<Suspense>
		<HomePageContent />
	</Suspense>
);

export default HomePage;
