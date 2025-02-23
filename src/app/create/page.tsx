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
import TaskInput from './_components/taskInput/TaskInput';
import BackHeader from '@/components/backHeader/BackHeader';

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
    <div className="background-primary flex min-h-screen w-full flex-col items-center justify-start overflow-y-auto px-5">
      <BackHeader onClick={() => funnel.history.back()} />
      <funnel.Render
        taskForm={({ history }) => (
          <TaskInput
            onClick={(task: string) =>
              history.push('smallActionInput', {
                task: task,
                deadlineDate: new Date(),
                deadlineTime: '',
              })
            }
          />
        )}
        smallActionInput={() => <div>작은행동 입력</div>}
        estimatedTimeInput={() => <div>예상시간 입력</div>}
        bufferTime={() => <div>버퍼시간 입력</div>}
        taskTypeInput={() => <div>할 일 종류 입력</div>}
      />
    </div>
  );
};

export default TaskCreate;
