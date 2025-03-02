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
import SmallActionInput from './_components/smallActionInput/SmallActionInput';
import { ScheduledTaskType, TimePickerType } from '@/types/create';
import EstimatedTimeInput from './_components/estimatedTimeInput/EstimatedTimeInput';
import BufferTime from './_components/bufferTime/BufferTime';
import TaskTypeInput from './_components/taskTypeInput/TaskTypeInput';
import { useMutation } from '@tanstack/react-query';

type FormState = {
  task?: string;
  deadlineDate?: Date;
  deadlineTime?: TimePickerType;
  smallAction?: string;
  estimatedHour?: string;
  estimatedMinute?: string;
  estimatedDay?: string;
  taskType?: string;
  moodType?: string;
};

const steps = createFunnelSteps<FormState>()
  .extends('taskForm')
  .extends('smallActionInput', {
    requiredKeys: ['task', 'deadlineDate', 'deadlineTime'],
  })
  .extends('estimatedTimeInput', { requiredKeys: 'smallAction' })
  .extends('bufferTime', {
    requiredKeys: ['estimatedHour', 'estimatedMinute', 'estimatedDay'],
  })
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
      context: {
        task: '',
        deadlineDate: undefined,
        deadlineTime: undefined,
        smallAction: '',
        estimatedHour: '',
        estimatedMinute: '',
        estimatedDay: '',
        taskType: '',
        moodType: '',
      },
    },
  });

  const lastStep =
    funnel.historySteps.length > 1
      ? funnel.historySteps[funnel.historySteps.length - 2].step
      : undefined;

  const { isMounted } = useMount();

  const { mutate: createScheduledTaskMutation } = useMutation({
    mutationFn: async (data: ScheduledTaskType) => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/tasks/scheduled`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEST_TOKEN_1! + process.env.NEXT_PUBLIC_TEST_TOKEN_2!}`,
        },
        body: JSON.stringify(data),
      });
    },
  });

  const handleHistoryBack = () => {
    if (funnel.step === 'smallActionInput') {
      funnel.history.replace('taskForm', {
        task: funnel.context.task,
        deadlineDate: funnel.context.deadlineDate,
        deadlineTime: funnel.context.deadlineTime,
      });
    } else if (funnel.step === 'estimatedTimeInput') {
      funnel.history.replace('smallActionInput', {
        task: funnel.context.task,
        deadlineDate: funnel.context.deadlineDate,
        deadlineTime: funnel.context.deadlineTime,
        smallAction: funnel.context.smallAction,
      });
    } else if (funnel.step === 'bufferTime') {
      funnel.history.replace('estimatedTimeInput', {
        task: funnel.context.task,
        deadlineDate: funnel.context.deadlineDate,
        deadlineTime: funnel.context.deadlineTime,
        smallAction: funnel.context.smallAction,
        estimatedHour: funnel.context.estimatedHour,
        estimatedMinute: funnel.context.estimatedMinute,
        estimatedDay: funnel.context.estimatedDay,
      });
    } else if (funnel.step === 'taskTypeInput') {
      funnel.history.replace('bufferTime', {
        task: funnel.context.task,
        deadlineDate: funnel.context.deadlineDate,
        deadlineTime: funnel.context.deadlineTime,
        smallAction: funnel.context.smallAction,
        estimatedHour: funnel.context.estimatedHour,
        estimatedMinute: funnel.context.estimatedMinute,
        estimatedDay: funnel.context.estimatedDay,
      } as BufferTimeType);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="background-primary flex h-screen w-full flex-col items-center justify-start overflow-y-auto px-5">
      <BackHeader onClick={handleHistoryBack} />
      <funnel.Render
        taskForm={({ history }) => (
          <TaskInput
            context={funnel.context}
            lastStep={lastStep}
            onNext={({ task, deadlineDate, deadlineTime }) =>
              history.push('smallActionInput', {
                task: task,
                deadlineDate: deadlineDate,
                deadlineTime: deadlineTime,
              })
            }
            onEdit={({ task, deadlineDate, deadlineTime }) =>
              funnel.history.push('bufferTime', {
                ...(funnel.context as BufferTimeType),
                task: task,
                deadlineDate: deadlineDate,
                deadlineTime: deadlineTime,
              } as BufferTimeType)
            }
          />
        )}
        smallActionInput={({ context, history }) => (
          <SmallActionInput
            smallAction={funnel.context.smallAction}
            lastStep={funnel.historySteps[funnel.historySteps.length - 2].step}
            onNext={(smallAction) =>
              history.push('estimatedTimeInput', {
                task: context.task,
                deadlineDate: context.deadlineDate,
                deadlineTime: context.deadlineTime,
                smallAction: smallAction,
              })
            }
            onEdit={(smallAction) =>
              funnel.history.push('bufferTime', {
                ...(funnel.context as BufferTimeType),
                smallAction: smallAction,
              } as BufferTimeType)
            }
          />
        )}
        estimatedTimeInput={({ context, history }) => (
          <EstimatedTimeInput
            context={context}
            lastStep={funnel.historySteps[funnel.historySteps.length - 2].step}
            onNext={({ estimatedHour, estimatedMinute, estimatedDay }) =>
              history.push('bufferTime', {
                task: context.task,
                deadlineDate: context.deadlineDate,
                deadlineTime: context.deadlineTime,
                smallAction: context.smallAction,
                estimatedHour: estimatedHour,
                estimatedMinute: estimatedMinute,
                estimatedDay: estimatedDay,
              })
            }
            onEdit={({ estimatedHour, estimatedMinute, estimatedDay }) =>
              funnel.history.push('bufferTime', {
                ...(funnel.context as BufferTimeType),
                estimatedHour: estimatedHour,
                estimatedMinute: estimatedMinute,
                estimatedDay: estimatedDay,
              } as BufferTimeType)
            }
          />
        )}
        bufferTime={({ context, history }) => (
          <BufferTime
            context={context}
            handleDeadlineModify={() =>
              history.push('taskForm', {
                task: context.task,
                deadlineDate: context.deadlineDate,
                deadlineTime: context.deadlineTime,
              })
            }
            handleSmallActionModify={() =>
              history.push('smallActionInput', {
                task: context.task,
                deadlineDate: context.deadlineDate,
                deadlineTime: context.deadlineTime,
                smallAction: context.smallAction,
              })
            }
            handleEstimatedTimeModify={() =>
              history.push('estimatedTimeInput', {
                task: context.task,
                deadlineDate: context.deadlineDate,
                deadlineTime: context.deadlineTime,
                smallAction: context.smallAction,
                estimatedHour: context.estimatedHour,
                estimatedMinute: context.estimatedMinute,
                estimatedDay: context.estimatedDay,
              })
            }
            onNext={() =>
              history.push('taskTypeInput', {
                task: context.task,
                deadlineDate: context.deadlineDate,
                deadlineTime: context.deadlineTime,
                smallAction: context.smallAction,
                estimatedHour: context.estimatedHour,
                estimatedMinute: context.estimatedMinute,
                estimatedDay: context.estimatedDay,
              } as TaskTypeInputType)
            }
          />
        )}
        taskTypeInput={({ context }) => (
          <TaskTypeInput
            context={context}
            onClick={(data) => createScheduledTaskMutation(data)}
          />
        )}
      />
    </div>
  );
};

export default TaskCreate;
