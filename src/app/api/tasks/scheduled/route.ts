import { ScheduledTaskType } from '@/types/create';
import { TaskResponse } from '@/types/task';
import { serverApi } from '@/lib/serverKy';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data: ScheduledTaskType = await req.json();

    const apiResponse = await serverApi.post('v1/tasks/scheduled', {
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
      { error: 'Error creating scheduled task' },
      { status: 500 },
    );
  }
}
