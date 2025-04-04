"use client";

import { TYPE_LABELS } from "@/app/(protected)/(create)/context";
import TaskDetailSheet from "@/app/(protected)/(root)/_components/TaskDetailSheet";
import TaskFilterDropdown from "@/app/(protected)/(root)/_components/TaskFilterDropdown";
import WeeklyTaskItem from "@/app/(protected)/(root)/_components/WeeklyTaskItem";
import Loader from "@/components/loader/Loader";
import Header from "@/components/ui/header";
import { useDeleteTask, useHomeData, useStartTask } from "@/hooks/useTasks";
import type { Task, TaskWithPersona } from "@/types/task";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useCallback } from "react";

// 유형별 우선순위 정의
const CATEGORY_PRIORITY: Record<string, number> = {
	과제: 1,
	"그림∙디자인": 2,
	디자인: 2, // '디자인'만 있는 경우도 추가
	글쓰기: 3,
	공부: 4,
	프로그래밍: 5,
	운동: 6,
};

// 소요시간 처리 함수 (시간을 분 단위로 변환)
const getDurationInMinutes = (task: Task): number => {
	// 추정시간 계산 (context.ts의 estimatedHour, estimatedMinute와 연계)
	const estimatedHour = task.estimatedHour
		? Number.parseInt(task.estimatedHour, 10)
		: 0;
	const estimatedMinute = task.estimatedMinute
		? Number.parseInt(task.estimatedMinute, 10)
		: 0;
	return estimatedHour * 60 + estimatedMinute;
};

const WeeklyTasksPage = () => {
	const router = useRouter();
	const { data: homeData, isLoading } = useHomeData();
	const { mutate: startTaskMutation } = useStartTask();
	const { mutate: deleteTaskMutation } = useDeleteTask();
	const allTasks = useMemo(
		() => homeData?.allTasks || [],
		[homeData?.allTasks],
	);

	const filterOptions = [
		{ id: "due-asc", label: "마감일 가까운 순" },
		{ id: "duration-desc", label: "소요시간 긴 순" },
		{ id: "category", label: "마감 유형별" },
	];

	const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

	// 마감 유형별로 태스크를 그룹화
	const groupTasksByCategory = useCallback((tasks: Task[]) => {
		const grouped: Record<string, Task[]> = {};

		// 개발 환경에서 디버깅용 로그
		if (process.env.NODE_ENV === "development" && tasks.length > 0) {
			console.log("Sample task:", tasks[0]);
		}

		for (const task of tasks) {
			// persona.taskKeywordsCombination.taskType.name에서 카테고리 정보 가져오기
			const category =
				task.persona?.taskKeywordsCombination?.taskType?.name || "";

			// 카테고리가 없는 경우는 skip (모든 태스크는 카테고리가 있다고 가정)
			if (!category) {
				console.warn(`Task #${task.id} has no category information`);
				continue;
			}

			if (!grouped[category]) {
				grouped[category] = [];
			}
			grouped[category].push(task);
		}

		// 카테고리 우선순위에 따라 정렬
		const sortedCategories = Object.keys(grouped).sort((a, b) => {
			const aPriority = CATEGORY_PRIORITY[a] || 999;
			const bPriority = CATEGORY_PRIORITY[b] || 999;
			return aPriority - bPriority;
		});

		return { grouped, sortedCategories };
	}, []);

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

		const filteredTasks = allTasks.filter((task) => {
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

		return filteredTasks.sort((a, b) => {
			const aDate = a.dueDatetime
				? new Date(a.dueDatetime)
				: a.dueDate
					? new Date(a.dueDate)
					: new Date();

			const bDate = b.dueDatetime
				? new Date(b.dueDatetime)
				: b.dueDate
					? new Date(b.dueDate)
					: new Date();

			const aDuration = getDurationInMinutes(a);
			const bDuration = getDurationInMinutes(b);

			switch (selectedFilter.id) {
				case "due-asc": {
					// 마감일 가까운 순
					return aDate.getTime() - bDate.getTime();
				}
				case "duration-desc": {
					// 소요시간 긴 순
					// 소요시간이 같으면 마감일 가까운 순, 마감일도 같으면 이름순
					if (bDuration === aDuration) {
						if (aDate.getTime() === bDate.getTime()) {
							return (a.title || "").localeCompare(b.title || "");
						}
						return aDate.getTime() - bDate.getTime();
					}
					return bDuration - aDuration;
				}
				case "category": {
					// 마감 유형별
					// persona.taskKeywordsCombination.taskType.name에 카테고리 정보가 있음
					const aCategory =
						a.persona?.taskKeywordsCombination?.taskType?.name || "";
					const bCategory =
						b.persona?.taskKeywordsCombination?.taskType?.name || "";

					const aCategoryPriority = CATEGORY_PRIORITY[aCategory] || 999;
					const bCategoryPriority = CATEGORY_PRIORITY[bCategory] || 999;

					// 같은 카테고리면 마감일 기준으로 정렬
					if (aCategoryPriority === bCategoryPriority) {
						return aDate.getTime() - bDate.getTime();
					}
					return aCategoryPriority - bCategoryPriority;
				}
				default: {
					return aDate.getTime() - bDate.getTime();
				}
			}
		});
	}, [allTasks, selectedFilter]);

	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

	const handleTaskClick = useCallback((task: Task) => {
		setSelectedTask(task);
		setIsDetailSheetOpen(true);
	}, []);

	const handleCloseDetailSheet = useCallback(() => {
		setIsDetailSheetOpen(false);
	}, []);

	const handleStartTask = useCallback(
		(taskId: number) => {
			startTaskMutation(taskId);
			setIsDetailSheetOpen(false);
			router.push(`/immersion/${taskId}`);
		},
		[startTaskMutation, router],
	);

	const handleDeleteTask = useCallback(
		(taskId: number) => {
			deleteTaskMutation(taskId);
			if (isDetailSheetOpen && selectedTask && selectedTask.id === taskId) {
				setIsDetailSheetOpen(false);
			}
		},
		[deleteTaskMutation, isDetailSheetOpen, selectedTask],
	);

	const handleFilterChange = useCallback(
		(option: (typeof filterOptions)[0]) => {
			setSelectedFilter(option);
		},
		[],
	);

	// 필터가 '마감 유형별'일 때 사용할 그룹화된 태스크
	const groupedTasksData = useMemo(() => {
		if (selectedFilter.id === "category") {
			return groupTasksByCategory(weeklyTasks);
		}
		return {
			grouped: {} as Record<string, Task[]>,
			sortedCategories: [] as string[],
		};
	}, [weeklyTasks, selectedFilter, groupTasksByCategory]);

	const groupedTasks = groupedTasksData.grouped;
	const sortedCategories = groupedTasksData.sortedCategories;

	if (isLoading) {
		return (
			<div className="flex min-h-screen flex-col bg-background-primary">
				<Header title="이번주 할일" />
				<div className="mt-16 flex flex-1 items-center justify-center px-5 pb-24">
					<Loader />
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col bg-background-primary">
			<Header title="이번주 할일" />

			<main className="mt-[70px] flex-1 px-5 pb-24">
				{weeklyTasks.length > 0 ? (
					<>
						<div className="mb-4 flex justify-end">
							<TaskFilterDropdown
								options={filterOptions}
								defaultOptionId="due-asc"
								onChange={handleFilterChange}
							/>
						</div>

						{selectedFilter.id === "category"
							? sortedCategories.map((category) => (
									<div key={category} className="mb-6">
										<h3 className="s3 mb-2 text-gray-neutral">{category}</h3>
										{groupedTasks[category].map((task) => (
											<WeeklyTaskItem
												key={task.id}
												task={task}
												onClick={handleTaskClick}
												onDelete={handleDeleteTask}
											/>
										))}
									</div>
								))
							: weeklyTasks.map((task) => (
									<WeeklyTaskItem
										key={task.id}
										task={task}
										onClick={handleTaskClick}
										onDelete={handleDeleteTask}
									/>
								))}
					</>
				) : (
					<div className="mt-[120px] flex h-full flex-col items-center justify-center px-4 text-center">
						<div className="mb-[40px] mt-[60px]">
							<Image
								src="/icons/home/rocket.svg"
								alt="Rocket"
								width={142}
								height={80}
								className="mx-auto"
							/>
						</div>
						<h2 className="t3 mb-[8px] mt-[8px] text-text-strong">
							이번주 할일이 없어요.
							<br />
							마감할 일을 추가해볼까요?
						</h2>
						<p className="b3 text-text-alternative">
							미루지 않도록 알림을 보내 챙겨드릴게요.
						</p>
					</div>
				)}
			</main>

			{selectedTask && (
				<TaskDetailSheet
					isOpen={isDetailSheetOpen}
					onClose={handleCloseDetailSheet}
					task={selectedTask as TaskWithPersona}
					onDelete={handleDeleteTask}
					onStart={handleStartTask}
				/>
			)}
		</div>
	);
};

export default WeeklyTasksPage;
