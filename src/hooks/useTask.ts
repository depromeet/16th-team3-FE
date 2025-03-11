import {
  useMutation,
  useQuery,
  UseQueryOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { fetchTask, patchTaskHoldOff, patchTaskStatus } from '@/lib/task';
import { TaskResponse } from '@/types/task';
import { useRouter } from 'next/navigation';

export interface TaskMutationParams {
  taskId: string;
}

export interface HoldOffParams extends TaskMutationParams {
  data: {
    remindInterval: number;
    remindCount: number;
    remindBaseTime: string;
  };
}

export interface StatusParams extends TaskMutationParams {
  status:
    | 'BEFORE'
    | 'WARMING_UP'
    | 'PROCRASTINATING'
    | 'HOLDING_OFF'
    | 'FOCUSED'
    | 'COMPLETE';
}

// 할일 조회
export const useTask = (
  taskId: string,
  options?: Omit<UseQueryOptions<TaskResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<TaskResponse, Error>({
    queryKey: ['task', taskId],
    queryFn: () => fetchTask(taskId),
    ...options,
  });
};

// 마감일 조회
export const useTaskDueDatetime = (taskId: string) => {
  return useQuery<string, Error>({
    queryKey: ['taskDueDatetime', taskId],
    queryFn: async () => {
      const task = await fetchTask(taskId);
      return task.dueDatetime;
    },
  });
};

// 할일 보류 요청
export const usePatchTaskHoldOff = (): UseMutationResult<
  TaskResponse,
  Error,
  HoldOffParams
> => {
  const router = useRouter();
  return useMutation<TaskResponse, Error, HoldOffParams>({
    mutationFn: ({ taskId, data }) => patchTaskHoldOff({ taskId, data }),
    onSuccess: () => {
      router.push('/home-page');
    },
  });
};

// 할일 상태 변경
export const usePatchTaskStatus = (): UseMutationResult<
  TaskResponse,
  Error,
  StatusParams
> => {
  const router = useRouter();
  return useMutation<TaskResponse, Error, StatusParams>({
    mutationFn: ({ taskId, status }) => patchTaskStatus({ taskId, status }),
    onSuccess: () => {
      router.push('/home-page');
    },
  });
};
