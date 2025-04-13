"use client";

import AllTasksTab from "@/app/(protected)/(root)/_components/AllTasksTab";
import CreateTaskSheet from "@/app/(protected)/(root)/_components/CreateTaskSheet";
import InProgressTaskItem from "@/app/(protected)/(root)/_components/InProgressTaskItem";
import TaskDetailSheet from "@/app/(protected)/(root)/_components/TaskDetailSheet";
import TaskItem from "@/app/(protected)/(root)/_components/TaskItem";
import { Button } from "@/components/ui/button";
import {
	useDeleteTask,
	useHomeData,
	useResetAlerts,
	useStartTask,
} from "@/hooks/useTasks";
import type { Task, TaskWithPersona } from "@/types/task";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo, Suspense } from "react";

import Loader from "@/components/loader/Loader";
import { useAuthStore } from "@/store";
import Link from "next/link";
import CharacterDialog from "../(create)/_components/characterDialog/CharacterDialog";
import FailedDialog from "../(create)/_components/failedDialog/FailedDialog";

const HomePageContent = () => {
	const router = useRouter();
	const { data: homeData, isPending } = useHomeData();

	const isUserProfileLoading = useAuthStore(
		(state) => state.isUserProfileLoading,
	);

	// 데이터 구조 분해
	const allTasks = useMemo(
		() => homeData?.allTasks || [],
		[homeData?.allTasks],
	);

	const todayTasks = useMemo(() => {
		const tasks = homeData?.todayTasks || [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tasks.filter((task) => {
			const taskDueDate = task.dueDatetime
				? new Date(task.dueDatetime)
				: new Date(task.dueDate);
			const taskDate = new Date(taskDueDate);
			taskDate.setHours(0, 0, 0, 0);
			return (
				taskDate.getTime() === today.getTime() && task.status !== "inProgress"
			);
		});
	}, [homeData?.todayTasks]);

	const weeklyTasks = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		// 이번주의 월요일 찾기
		const mondayOfThisWeek = new Date(today);
		const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
		const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 일요일인 경우 이전 주의 월요일까지 거슬러 올라감
		mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);

		// 이번주의 일요일 찾기 (일요일 23:59:59)
		const sundayOfThisWeek = new Date(mondayOfThisWeek);
		sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
		sundayOfThisWeek.setHours(23, 59, 59, 999);

		return allTasks.filter((task) => {
			if (task.status === "inProgress" || task.status === "INPROGRESS")
				return false;

			// 날짜 계산
			const taskDueDate = task.dueDatetime
				? new Date(task.dueDatetime)
				: task.dueDate
					? new Date(task.dueDate)
					: null;
			if (!taskDueDate) return false;

			const taskDateOnly = new Date(taskDueDate);
			taskDateOnly.setHours(0, 0, 0, 0);

			const taskIsAfterToday = taskDateOnly.getTime() >= tomorrow.getTime();

			const taskIsBeforeSunday = taskDueDate <= sundayOfThisWeek;

			// 오늘 이후(또는 오늘 새벽 1시 이후)이고 이번주 일요일 이전인 작업
			return taskIsAfterToday && taskIsBeforeSunday;
		});
	}, [allTasks]);

	const inProgressTasks = useMemo(
		() => homeData?.inProgressTasks || [],
		[homeData?.inProgressTasks],
	);

	// 미래 할일
	const futureTasks = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		// 이번주의 일요일 계산
		const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
		const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
		const mondayOfThisWeek = new Date(today);
		mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);
		const sundayOfThisWeek = new Date(mondayOfThisWeek);
		sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
		sundayOfThisWeek.setHours(23, 59, 59, 999);

		// 모든 작업에서 미래 작업 필터링
		return allTasks.filter((task) => {
			const dueDate = task.dueDatetime
				? new Date(task.dueDatetime)
				: task.dueDate
					? new Date(task.dueDate)
					: null;

			if (!dueDate) {
				return false;
			}

			if (task.status === "inProgress" || task.status === "INPROGRESS") {
				return false;
			}

			if (
				dueDate.getDate() === today.getDate() &&
				dueDate.getMonth() === today.getMonth() &&
				dueDate.getFullYear() === today.getFullYear()
			) {
				return false;
			}

			// 이번주 작업 제외 (오늘 이후, 이번주 일요일 이전)
			if (dueDate > today && dueDate <= sundayOfThisWeek) {
				return false;
			}
			// 이번주 이후의 작업만 포함
			const isAfterSunday = dueDate > sundayOfThisWeek;
			return isAfterSunday;
		});
	}, [allTasks]);

	// StartTask 뮤테이션 훅
	const { mutate: startTaskMutation } = useStartTask();
	const { mutate: deleteTaskMutation } = useDeleteTask();

	// Reset Alerts 훅
	const resetAlerts = useResetAlerts();

	// 화면 분기 처리를 위한 상태
	const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
	const [showTooltip, setShowTooltip] = useState(true);
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

	console.log("personaId", personaId);

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

	const handleDeleteTask = (taskId: number) => {
		deleteTaskMutation(taskId);
		if (isDetailSheetOpen && detailTask && detailTask.id === taskId) {
			setIsDetailSheetOpen(false);
		}
	};

	const handleTaskClick = (task: Task) => {
		setDetailTask(task);
		setIsDetailSheetOpen(true);
	};

	const handleCloseDetailSheet = () => {
		setIsDetailSheetOpen(false);
	};

	const handleStartTask = (taskId: number) => {
		// React Query mutation 실행
		startTaskMutation(taskId);
		setIsDetailSheetOpen(false);
		router.push(`/immersion/${taskId}`);
	};

	const handleAddTask = () => {
		setIsCreateSheetOpen(true);
	};

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

	// 탭 전환 처리
	const handleTabChange = (tab: "today" | "all") => {
		setActiveTab(tab);
	};

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

	// 툴팁 표시 관련 로직
	useEffect(() => {
		const hasVisited = localStorage.getItem("hasVisitedBefore");
		if (hasVisited) {
			setShowTooltip(false);
		} else {
			localStorage.setItem("hasVisitedBefore", "true");
		}
	}, []);

	// 화면 분기 처리
	// 1. 오늘 할 일이 없고, 진행 중인 일도 없는 경우 (완전 빈 화면)
	const isTotallyEmpty =
		todayTasks.length === 0 &&
		weeklyTasks.length === 0 &&
		allTasks.length === 0 &&
		inProgressTasks.length === 0;

	// 2. 오늘 할 일이 없고, 진행 중인 일도 없지만, 이번주 할 일은 있는 경우
	const hasWeeklyTasksOnly =
		todayTasks.length === 0 &&
		inProgressTasks.length === 0 &&
		weeklyTasks.length > 0;

	// 3. 오늘 할 일이 없고, 이번주 할 일도 없지만, 전체 할 일은 있는 경우
	const hasAllTasksOnly =
		todayTasks.length === 0 &&
		weeklyTasks.length === 0 &&
		inProgressTasks.length === 0 &&
		allTasks.length > 0;

	// 4. 전체 할 일이 없는 경우
	const isAllEmpty = allTasks.length === 0;

	// 5. 진행 중인 일이 있고, 오늘 할 일도 있는 경우
	const hasTodayAndInProgressTasks =
		inProgressTasks.length > 0 && todayTasks.length > 0;

	// 6. 진행 중인 일만 있는 경우
	const hasInProgressTasksOnly =
		inProgressTasks.length > 0 && todayTasks.length === 0;

	// 7. 진행 중인 일은 없고 오늘 진행 예정인 일만 있는 경우
	const hasTodayTasksOnly =
		inProgressTasks.length === 0 && todayTasks.length > 0;

	return (
		<div className="flex flex-col overflow-hidden bg-background-primary">
			<header className="z-20 fixed top-0 w-[100vw] bg-background-primary pt-[44px]">
				<div className="flex items-center justify-between px-[20px] py-[15px] h-[60px]">
					<Image
						src="/icons/home/spurt.svg"
						alt="SPURT"
						width={54}
						height={20}
						priority
						className="w-[54px]"
					/>
					<Link href="/my-page">
						<button type="button">
							<Image
								src="/icons/home/mypage.svg"
								alt="마이페이지"
								width={20}
								height={20}
							/>
						</button>
					</Link>
				</div>
				<div className="px-[20px] py-[11px]">
					<div className="flex space-x-4">
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							onClick={() => {
								handleTabChange("today");
								router.replace("/?tab=today", { scroll: true });
							}}
						>
							<span
								className={`t3 ${activeTab === "today" ? "text-text-normal" : "text-text-disabled"}`}
							>
								오늘 할일
							</span>
							<span
								className={`s1 ml-1 ${activeTab === "today" ? "text-text-primary" : "text-text-disabled"}`}
							>
								{todayTasks.length + inProgressTasks.length}
							</span>
						</div>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							onClick={() => {
								handleTabChange("all");
								router.replace("/?tab=all", { scroll: true });
							}}
						>
							<span
								className={`t3 ${activeTab === "all" ? "text-text-normal" : "text-text-disabled"}`}
							>
								전체 할일
							</span>
							<span
								className={`s1 ml-1 ${activeTab === "all" ? "text-text-primary" : "text-text-disabled"}`}
							>
								{allTasks.length}
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* 메인 영역 - flex-1과 overflow-y-auto로 설정 */}
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
																	task.ignoredAlerts && task.ignoredAlerts >= 3
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
											<span className="s2 text-text-neutral">이번주 할일</span>
											<Image
												src="/icons/home/arrow-right.svg"
												alt="Arrow Right"
												width={7}
												height={12}
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
											<span className="s2 text-text-neutral">이번주 할일</span>
											<Image
												src="/icons/home/arrow-right.svg"
												alt="Arrow Right"
												width={7}
												height={12}
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
																	task.ignoredAlerts && task.ignoredAlerts >= 3
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
											<span className="s2 text-text-neutral">이번주 할일</span>
											<Image
												src="/icons/home/arrow-right.svg"
												alt="Arrow Right"
												width={7}
												height={12}
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
												width={7}
												height={12}
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
												width={7}
												height={12}
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
					{activeTab === "all" &&
						(isAllEmpty ? (
							<div className="mt-[130px]">
								<div className="flex h-full flex-col items-center justify-center px-4 text-center">
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
								onTaskClick={handleTaskClick}
								onDeleteTask={handleDeleteTask}
							/>
						))}
				</main>
			)}

			<footer className="fixed bottom-0 left-0 right-0 z-10">
				{/* 투명에서 검정색으로 페이드되는 그라디언트 오버레이 */}
				<div
					className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
					style={{
						background:
							"linear-gradient(to bottom, rgba(15, 17, 20, 0) 0%, rgba(15, 17, 20, 1) 100%)",
					}}
				/>

				{/* 버튼 컨테이너 */}
				<div className="relative flex justify-end p-5 pb-[47px]">
					{showTooltip && (
						<div className="b3 absolute bottom-[130px] right-4 rounded-[12px] bg-component-accent-primary px-4 py-3 text-text-strong shadow-lg">
							지금 바로 할 일을 추가해보세요!
							<div
								className="absolute h-0 w-0"
								style={{
									bottom: "-11px",
									right: "3rem",
									transform: "translateX(50%)",
									borderStyle: "solid",
									borderWidth: "12px 7px 0 7px",
									borderColor: "#6B6BE1 transparent transparent transparent",
								}}
							/>
						</div>
					)}
					<Button
						variant="point"
						size="md"
						className="l2 flex h-[52px] w-[130px] items-center gap-2 rounded-full py-[16.5px] text-text-inverse"
						onClick={handleAddTask}
					>
						<Image
							src="/icons/home/plus.svg"
							alt="할일 추가"
							width={16}
							height={16}
						/>
						할일 추가
					</Button>
				</div>
			</footer>

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
		</div>
	);
};

const HomePage = () => (
	<Suspense>
		<HomePageContent />
	</Suspense>
);

export default HomePage;
