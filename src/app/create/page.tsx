'use client';

import { createFunnelSteps, useFunnel } from '@use-funnel/browser';
import {
  BufferTimeType,
  EstimatedTimeInputType,
  SmallActionInputType,
  TaskInputType,
  TaskTypeInputType,
} from './context';
import useMount from '@/hooks/useMount';
import TaskInput from './_components/taskForm/TaskForm';

type FormState = {
  task?: string;
  deadlineDate?: Date;
  deadlineTime?: string;
  smallAction?: string;
  estimatedHour?: string;
  estimatedMinute?: string;
  taskType?: string;
  moodType?: string;
};

const steps = createFunnelSteps<FormState>()
  .extends('taskForm')
  .extends('smallActionInput', {
    requiredKeys: ['task', 'deadlineDate', 'deadlineTime'],
  })
  .extends('estimatedTimeInput', { requiredKeys: 'smallAction' })
  .extends('bufferTime', { requiredKeys: ['estimatedHour', 'estimatedMinute'] })
  .extends('taskTypeInput', { requiredKeys: ['taskType', 'moodType'] })
  .build();

const TaskCreate = () => {
  const funnel = useFunnel<{
    taskForm: TaskInputType;
    smallActionInput: SmallActionInputType;
    estimatedTimeInput: EstimatedTimeInputType;
    bufferTime: BufferTimeType;
    taskTypeInput: TaskTypeInputType;
  }>({
    id: 'task-create-main',
    steps: steps,
    initial: {
      step: 'taskForm',
      context: {},
    },
  });

  const { isMounted } = useMount();

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-6 overflow-y-auto bg-white px-4 py-6 dark:bg-gray-900">
      할 일 등록 페이지
      <funnel.Render
        taskForm={() => <TaskInput />}
        smallActionInput={() => <div>작은행동 입력</div>}
        estimatedTimeInput={() => <div>예상시간 입력</div>}
        bufferTime={() => <div>버퍼시간 입력</div>}
        taskTypeInput={() => <div>할 일 종류 입력</div>}
      />
    </div>
  );
};

export default TaskCreate;
