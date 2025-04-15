"use client";

import { useDeleteTask, useHomeData, useStartTask } from "@/hooks/useTasks";
import type { Task, TaskWithPersona } from "@/types/task";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense, useCallback } from "react";

import Loader from "@/components/loader/Loader";
import useTaskFiltering from "@/hooks/useTaskFilter";
import useTaskStatus from "@/hooks/useTaskStatus";
import { useAuthStore } from "@/store";
import dynamic from "next/dynamic";
import Footer from "./_components/footer/Footer";
import Header from "./_components/header/Header";

const TodayTaskTabWrapper = dynamic(
	() =>
		import(
			/* webpackPrefetch: true */ "./_components/todayTaskTabWrapper/TodayTaskTabWrapper"
		),
);

const AllTaskTabWrapper = dynamic(
	() =>
		import(
			/* webpackPrefetch: true */ "./_components/allTaskTabWrapper/AllTaskTabWrapper"
		),
);

const TaskDetailSheet = dynamic(
	() => import(/* webpackPrefetch: true */ "./_components/TaskDetailSheet"),
);

const CreateTaskSheet = dynamic(
	() => import(/* webpackPrefetch: true */ "./_components/CreateTaskSheet"),
);

const FailedDialog = dynamic(
	() =>
		import(
			/* webpackPrefetch: true */ "../(create)/_components/failedDialog/FailedDialog"
		),
);

const CharacterDialog = dynamic(
	() => import("../(create)/_components/characterDialog/CharacterDialog"),
	{
		ssr: false,
	},
);

const HomePageContent = () => {
	const router = useRouter();
	const { data: homeData, isPending } = useHomeData();

	const isUserProfileLoading = useAuthStore(
		(state) => state.isUserProfileLoading,
	);

	const { mutate: startTaskMutation } = useStartTask();
	const { mutate: deleteTaskMutation } = useDeleteTask();

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
							<TodayTaskTabWrapper
								taskType={taskType}
								isTotallyEmpty={isTotallyEmpty}
								hasWeeklyTasksOnly={hasWeeklyTasksOnly}
								hasAllTasksOnly={hasAllTasksOnly}
								hasTodayAndInProgressTasks={hasTodayAndInProgressTasks}
								hasInProgressTasksOnly={hasInProgressTasksOnly}
								hasTodayTasksOnly={hasTodayTasksOnly}
								handleTaskClick={handleTaskClick}
								handleDetailTask={handleDetailTask}
								handleDeleteTask={handleDeleteTask}
							/>
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
