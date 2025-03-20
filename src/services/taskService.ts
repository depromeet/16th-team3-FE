import { Task, TaskResponse, convertApiResponseToTask } from '@/types/task';

export interface HomeResponse {
  todayTasks?: TaskResponse[];
  weeklyTasks?: TaskResponse[];
  allTasks?: TaskResponse[];
  inProgressTasks?: TaskResponse[];
  futureTasks?: TaskResponse[];
  missionEscapeTask?: TaskResponse;
}

// 기본 fetch 래퍼 함수
const fetchWithError = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error ||
        `API 요청 실패 (${response.status}): ${response.statusText}`,
    );
  }

  return response.json();
};

// 태스크 변환 함수
function convertTask(task: TaskResponse): Task {
  return convertApiResponseToTask(task);
}

// 홈 화면 데이터 가져오기
export const fetchHomeData = async (): Promise<{
  todayTasks: Task[];
  weeklyTasks: Task[];
  allTasks: Task[];
  inProgressTasks: Task[];
  futureTasks: Task[];
}> => {
  try {
    const data: HomeResponse = await fetchWithError('/api/tasks/home');

    // ! TODO(fr0gydev): 페이지 이동 시 매번 호출되는 것 확인
    console.log('Home API 응답 데이터:', data);

    // 각 배열이 없는 경우 빈 배열로, 있는 경우 변환 처리
    const todayTasks = Array.isArray(data?.todayTasks)
      ? data.todayTasks.map((task: TaskResponse) => convertTask(task))
      : [];

    const weeklyTasks = Array.isArray(data?.weeklyTasks)
      ? data.weeklyTasks.map((task: TaskResponse) => convertTask(task))
      : [];

    const allTasks = Array.isArray(data?.allTasks)
      ? data.allTasks.map((task: TaskResponse) => convertTask(task))
      : [];

    // inProgressTasks가 응답에 없으면 allTasks에서 필터링
    const inProgressTasks = Array.isArray(data?.inProgressTasks)
      ? data.inProgressTasks.map((task: TaskResponse) => convertTask(task))
      : allTasks.filter((task) => task.status === 'inProgress');

    // futureTasks가 응답에 없으면 allTasks에서 필터링
    const futureTasks = Array.isArray(data?.futureTasks)
      ? data.futureTasks.map((task: TaskResponse) => convertTask(task))
      : allTasks.filter((task) => task.type === 'future');

    return {
      todayTasks,
      weeklyTasks,
      allTasks,
      inProgressTasks,
      futureTasks,
    };
  } catch (error) {
    console.error('Home API 호출 오류:', error);
    // 오류 발생 시 빈 데이터 반환
    return {
      todayTasks: [],
      weeklyTasks: [],
      allTasks: [],
      inProgressTasks: [],
      futureTasks: [],
    };
  }
};

// 전체 할일 목록 가져오기
export const fetchAllTasks = async (): Promise<Task[]> => {
  const data: TaskResponse[] = await fetchWithError('/api/tasks/all-todos');
  return data.map((task: TaskResponse) => convertApiResponseToTask(task));
};

// 특정 할일 가져오기
export const fetchTaskById = async (taskId: number): Promise<Task> => {
  const data: TaskResponse = await fetchWithError(`/api/tasks/${taskId}`);
  return convertApiResponseToTask(data);
};

// 오늘 할일 조회 API
export const fetchTodayTasksApi = async (): Promise<Task[]> => {
  try {
    // v1 API 경로로 요청
    const data: TaskResponse[] = await fetchWithError('/v1/tasks/today');
    console.log('오늘 할일 API 응답:', data);
    return data.map((task: TaskResponse) => convertApiResponseToTask(task));
  } catch (error) {
    console.error('오늘 할일 API 호출 오류:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
};

// 이번주 할일 조회 API
export const fetchCurrentWeekTasksApi = async (): Promise<Task[]> => {
  const data: TaskResponse[] = await fetchWithError('/api/tasks/current-week');
  return data.map((task: TaskResponse) => convertApiResponseToTask(task));
};

// 모든 할일 조회 API
export const fetchAllTodosApi = async (): Promise<Task[]> => {
  const data: TaskResponse[] = await fetchWithError('/api/tasks/all-todos');
  return data.map((task: TaskResponse) => convertApiResponseToTask(task));
};

// 오늘 할일 필터링
export const fetchTodayTasks = async (): Promise<Task[]> => {
  const allTasks = await fetchAllTasks();
  return allTasks.filter(
    (task) => task.type === 'today' && task.status !== 'inProgress',
  );
};

// 진행 중인 할일 필터링
export const fetchInProgressTasks = async (): Promise<Task[]> => {
  const allTasks = await fetchAllTasks();
  return allTasks.filter((task) => task.status === 'inProgress');
};

// 이번주 할일 필터링
export const fetchWeeklyTasks = async (): Promise<Task[]> => {
  const allTasks = await fetchAllTasks();
  return allTasks.filter((task) => task.type === 'weekly');
};

// 미래 할일 필터링
export const fetchFutureTasks = async (): Promise<Task[]> => {
  const allTasks = await fetchAllTasks();
  return allTasks.filter((task) => task.type === 'future');
};

// 상태 변경: 진행 중으로 변경
export const startTask = async (taskId: number): Promise<Task> => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'FOCUSED',
      startedAt: new Date().toISOString(),
    }),
  };

  const data: TaskResponse = await fetchWithError(
    `/api/tasks/${taskId}/status`,
    options,
  );
  return convertApiResponseToTask(data);
};

// 상태 변경: 완료로 변경
export const completeTask = async (taskId: number): Promise<Task> => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'COMPLETED' }),
  };

  const data: TaskResponse = await fetchWithError(
    `/api/tasks/${taskId}/status`,
    options,
  );
  return convertApiResponseToTask(data);
};

// 상태 변경: 회고 완료로 변경
export const reflectTask = async (taskId: number): Promise<Task> => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'REFLECTED' }),
  };

  const data: TaskResponse = await fetchWithError(
    `/api/tasks/${taskId}/status`,
    options,
  );
  return convertApiResponseToTask(data);
};

// 할일 삭제 기능
export const deleteTask = async (taskId: number): Promise<void> => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await fetchWithError(`/api/tasks/${taskId}`, options);
};

// * 작업 수정 페이지에서 할 일에 대한 정보를 가져오는 함수
export const fetchSingleTask = async (taskId: string) => {
  const response = await fetch(`/api/tasks/${taskId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '에러 발생');
  }
  return response.json();
};
