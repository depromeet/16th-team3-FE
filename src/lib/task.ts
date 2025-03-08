import { TaskResponse } from '@/types/task';

export async function fetchTask(taskId: string): Promise<TaskResponse> {
  const response = await fetch(`https://app.spurt.site/v1/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiaWF0IjoxNzQwMzA3MjAwLCJleHAiOjE3NDc5OTMyMDB9.wzUeK94JGyNnC0iyZpWjdJppD66R3dI4jBD8sdWdT44`,
    },
  });
  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 있습니다.');
  }
  return response.json();
}

export interface HoldOffRequestBody {
  remindInterval: number;
  remindCount: number;
  remindBaseTime: string;
}

interface PatchTaskParams {
  taskId: string | number;
  data: HoldOffRequestBody;
}

export const patchTaskHoldOff = async ({
  taskId,
  data,
}: PatchTaskParams): Promise<any> => {
  const response = await fetch(`/v1/tasks/${taskId}/hold-off`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      // 필요한 경우 인증 토큰 등의 헤더 추가
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // 에러 처리: 필요 시 response의 에러 메시지를 파싱
    throw new Error('Failed to update task');
  }

  return response.json();
};
