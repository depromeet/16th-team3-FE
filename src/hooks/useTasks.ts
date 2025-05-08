import {
	completeTask,
	deleteTask,
	fetchAllTasks,
	fetchAllTodosApi,
	fetchCurrentWeekTasksApi,
	fetchFutureTasks,
	fetchHomeData,
	fetchInProgressTasks,
	fetchTaskById,
	fetchTodayTasksApi,
	reflectTask,
	startTask,
} from "@/services/taskService";
import { useAuthStore } from "@/store";
import type { Task } from "@/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 홈 화면 데이터 조회 훅
export const useHomeData = () => {
	const isUserProfileLoaded = useAuthStore(
		(state) => state.isUserProfileLoaded,
	);

	return useQuery<
		{
			todayTasks: Task[];
			weeklyTasks: Task[];
			allTasks: Task[];
			inProgressTasks: Task[];
			futureTasks: Task[];
		},
		Error
	>({
		queryKey: ["tasks", "home"],
		queryFn: fetchHomeData,
		enabled: isUserProfileLoaded,
	});
};

// 모든 할일 조회 훅
export const useAllTasks = () => {
	return useQuery<Task[], Error>({
		queryKey: ["tasks"],
		queryFn: fetchAllTasks,
	});
};

// 특정 할일 조회 훅
export const useTask = (taskId: number) => {
	return useQuery<Task, Error>({
		queryKey: ["tasks", taskId],
		queryFn: () => fetchTaskById(taskId),
		enabled: !!taskId,
	});
};

// 오늘 할일 조회 훅
export const useTodayTasks = () => {
	return useQuery({
		queryKey: ["todayTasks"],
		queryFn: fetchTodayTasksApi,
		refetchOnWindowFocus: true,
	});
};

// 오늘 할일 API 조회 훅 (서버 API 직접 호출)
export const useTodayTasksApi = () => {
	return useQuery<Task[], Error>({
		queryKey: ["tasks", "today-api"],
		queryFn: fetchTodayTasksApi,
	});
};

// 이번주 할일 API 조회 훅 (서버 API 직접 호출)
export const useCurrentWeekTasksApi = () => {
	return useQuery<Task[], Error>({
		queryKey: ["tasks", "current-week-api"],
		queryFn: fetchCurrentWeekTasksApi,
	});
};

// 모든 할일 API 조회 훅 (서버 API 직접 호출)
export const useAllTodosApi = () => {
	return useQuery<Task[], Error>({
		queryKey: ["tasks", "all-todos-api"],
		queryFn: fetchAllTodosApi,
	});
};

// 진행 중인 할일 조회 훅
export const useInProgressTasks = () => {
	return useQuery<Task[], Error>({
		queryKey: ["tasks", "inProgress"],
		queryFn: fetchInProgressTasks,
	});
};

// 이번주 할일 조회 훅
export const useWeeklyTasks = () => {
	return useQuery<Task[], Error>({
		queryKey: ["tasks", "weekly"],
		queryFn: fetchCurrentWeekTasksApi,
	});
};

// 미래 할일 조회 훅
export const useFutureTasks = () => {
	return useQuery<Task[], Error>({
		queryKey: ["tasks", "future"],
		queryFn: fetchFutureTasks,
	});
};

// 할일 시작 mutation 훅
export const useStartTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (taskId: number) => startTask(taskId),
		onSuccess: (updatedTask) => {
			// 개별 할일 데이터 업데이트
			queryClient.setQueryData(["tasks", updatedTask.id], updatedTask);

			// 전체 목록 데이터 업데이트
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});
};

// 할일 완료 mutation 훅
export const useCompleteTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (taskId: number) => completeTask(taskId),
		onSuccess: (updatedTask) => {
			queryClient.setQueryData(["tasks", updatedTask.id], updatedTask);
			queryClient.invalidateQueries({ queryKey: ["tasks", "myPage"] });
		},
	});
};

// 할일 회고 완료 mutation 훅
export const useReflectTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (taskId: number) => reflectTask(taskId),
		onSuccess: (updatedTask) => {
			queryClient.setQueryData(["tasks", updatedTask.id], updatedTask);
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});
};

// 할일 삭제 mutation 훅
export const useDeleteTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (taskId: number) => deleteTask(taskId),
		// 낙관적 업데이트: 서버 응답 전에 UI 먼저 업데이트
		onMutate: async (deletedTaskId) => {
			// 진행 중인 쿼리 취소 (충돌 방지)
			await queryClient.cancelQueries({ queryKey: ["tasks", "home"] });
			await queryClient.cancelQueries({ queryKey: ["tasks"] });
			await queryClient.cancelQueries({ queryKey: ["todayTasks"] });
			await queryClient.cancelQueries({ queryKey: ["tasks", "weekly"] });

			// 현재 캐시 데이터 백업
			const previousHomeData = queryClient.getQueryData(["tasks", "home"]);
			const previousTasks = queryClient.getQueryData(["tasks"]);
			const previousTodayTasks = queryClient.getQueryData(["todayTasks"]);
			const previousWeeklyTasks = queryClient.getQueryData(["tasks", "weekly"]);

			// 홈 데이터 업데이트
			queryClient.setQueryData(["tasks", "home"], (old: any) => {
				if (!old) return null;
				return {
					...old,
					todayTasks:
						old.todayTasks?.filter((task: Task) => task.id !== deletedTaskId) ||
						[],
					weeklyTasks:
						old.weeklyTasks?.filter(
							(task: Task) => task.id !== deletedTaskId,
						) || [],
					allTasks:
						old.allTasks?.filter((task: Task) => task.id !== deletedTaskId) ||
						[],
					inProgressTasks:
						old.inProgressTasks?.filter(
							(task: Task) => task.id !== deletedTaskId,
						) || [],
					futureTasks:
						old.futureTasks?.filter(
							(task: Task) => task.id !== deletedTaskId,
						) || [],
				};
			});

			// 전체 작업 리스트 업데이트
			queryClient.setQueryData(["tasks"], (old: Task[] | undefined) => {
				if (!old) return [];
				return old.filter((task) => task.id !== deletedTaskId);
			});

			// 오늘 작업 리스트 업데이트
			queryClient.setQueryData(["todayTasks"], (old: Task[] | undefined) => {
				if (!old) return [];
				return old.filter((task) => task.id !== deletedTaskId);
			});

			// 주간 작업 리스트 업데이트
			queryClient.setQueryData(
				["tasks", "weekly"],
				(old: Task[] | undefined) => {
					if (!old) return [];
					return old.filter((task) => task.id !== deletedTaskId);
				},
			);

			// 롤백용 데이터 반환
			return {
				previousHomeData,
				previousTasks,
				previousTodayTasks,
				previousWeeklyTasks,
			};
		},
		// 오류 발생 시 롤백
		onError: (_err, _deletedTaskId, context: any) => {
			if (context) {
				queryClient.setQueryData(["tasks", "home"], context.previousHomeData);
				queryClient.setQueryData(["tasks"], context.previousTasks);
				queryClient.setQueryData(["todayTasks"], context.previousTodayTasks);
				queryClient.setQueryData(
					["tasks", "weekly"],
					context.previousWeeklyTasks,
				);
			}
		},
		// 성공 또는 실패 후 모든 관련 쿼리 갱신
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks", "home"] });
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["todayTasks"] });
			queryClient.invalidateQueries({ queryKey: ["tasks", "weekly"] });
		},
	});
};

// 알림 무시 횟수 초기화 훅
export const useResetAlerts = () => {
	const queryClient = useQueryClient();

	return (taskId: number) => {
		// 캐시에서 현재 할일 데이터 가져오기
		const task = queryClient.getQueryData<Task>(["tasks", taskId]);

		if (task) {
			// 알림 무시 횟수 초기화한 새 객체 생성
			const updatedTask = { ...task, ignoredAlerts: 0 };

			// 캐시 업데이트
			queryClient.setQueryData(["tasks", taskId], updatedTask);

			// 전체 목록 업데이트
			queryClient.setQueryData<Task[] | undefined>(["tasks"], (oldData) => {
				if (!oldData) return undefined;
				return oldData.map((item) => (item.id === taskId ? updatedTask : item));
			});
		}
	};
};
