import { TaskResponse } from '@/types/task';
import { HoldOffParams } from '@/hooks/useTask';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchTask = async (
  taskId: string,
  accessToken: string,
): Promise<TaskResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/tasks/${taskId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('네트워크 응답에 문제가 있습니다.');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

/**
 * 작업의 미루기 설정을 업데이트합니다.
 * @param params - 미루기 설정에 필요한 파라미터
 * @returns 업데이트된 작업 정보
 */
export const patchTaskHoldOff = async ({
  taskId,
  data,
}: HoldOffParams): Promise<TaskResponse> => {
  const response = await fetch(`/api/tasks/${taskId}/hold-off`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const patchTaskStatus = async (taskId: string, data: string) => {
  const response = await fetch(`/api/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: data }),
  });

  if (!response.ok) {
    throw new Error('작업 상태 업데이트에 실패했습니다.');
  }

  return response.json();
};
