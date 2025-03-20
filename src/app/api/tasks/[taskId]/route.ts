import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/serverKy';
import { TaskResponse } from '@/types/task';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await serverApi.get(`v1/tasks/${taskId}`);

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: '해당 할일을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: '요청 시간이 초과되었습니다.' },
        { status: 408 },
      );
    }

    return NextResponse.json(
      {
        error: '할일을 가져오는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await serverApi.delete(`v1/tasks/${taskId}`);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '응답 내용 없음');

      if (response.status === 404) {
        return NextResponse.json(
          { error: '해당 할일을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error: `할일 삭제 실패 (${response.status}): ${response.statusText}`,
          details: errorBody,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: '요청 시간이 초과되었습니다.' },
        { status: 408 },
      );
    }

    return NextResponse.json(
      {
        error: `할일을 삭제하는 중 서버 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const data = await req.json();
    const { taskId } = await params;

    const apiResponse = await serverApi.patch(`v1/tasks/${taskId}`, {
      body: JSON.stringify(data),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return NextResponse.json(
        { error: 'Failed to POST request', details: errorData },
        { status: apiResponse.status },
      );
    }

    const taskResponse: TaskResponse = await apiResponse.json();

    const personaName = taskResponse.persona.name;
    const taskMode = taskResponse.persona.taskKeywordsCombination.taskMode.name;
    const taskType = taskResponse.persona.taskKeywordsCombination.taskType.name;

    const nextResponse = NextResponse.json({
      success: true,
      personaName: personaName,
      taskMode: taskMode,
      taskType: taskType,
    });

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: 'Error patch task data' },
      { status: 500 },
    );
  }
}
