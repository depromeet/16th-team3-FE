'use client';

import { useFunnel } from '@use-funnel/browser';
import {
  BufferTime,
  EstimatedTimeInput,
  SmallActionInput,
  TaskForm,
  TaskTypeInput,
} from './context';
import useMount from '@/hooks/useMount';

const TaskCreate = () => {
  const funnel = useFunnel<{
    taskForm: TaskForm;
    smallActionInput: SmallActionInput;
    estimatedTimeInput: EstimatedTimeInput;
    bufferTime: BufferTime;
    taskTypeInput: TaskTypeInput;
  }>({
    id: 'task-create-main',
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
        taskForm={() => <div>할 일 입력</div>}
        smallActionInput={() => <div>작은행동 입력</div>}
        estimatedTimeInput={() => <div>예상시간 입력</div>}
        bufferTime={() => <div>버퍼시간 입력</div>}
        taskTypeInput={() => <div>할 일 종류 입력</div>}
      />
    </div>
  );
};

export default TaskCreate;
