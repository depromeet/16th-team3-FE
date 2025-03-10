'use client';

import { createFunnelSteps, useFunnel } from '@use-funnel/browser';
import { InstantTaskInputType, TaskInputType } from '../context';
import useMount from '@/hooks/useMount';
import BackHeader from '@/components/backHeader/BackHeader';
import TaskInput from '../_components/taskInput/TaskInput';
import InstantTaskTypeInput from '../_components/instantTaskTypeInput/InstantTaskTypeInput';
import { useMutation } from '@tanstack/react-query';
import { InstantTaskType, TimePickerType } from '@/types/create';
import { api } from '@/lib/ky';

type FormState = {
  task?: string;
  deadlineDate?: Date;
  deadlineTime?: TimePickerType;
  taskType?: string;
  moodType?: string;
};

const steps = createFunnelSteps<FormState>()
  .extends('taskForm')
  .extends('taskTypeInput', {
    requiredKeys: ['task', 'deadlineDate', 'deadlineTime'],
  })
  .build();

const InstantTaskCreate = () => {
  const funnel = useFunnel<{
    taskForm: TaskInputType;
    taskTypeInput: InstantTaskInputType;
  }>({
    id: 'task-create-main',
    steps: steps,
    initial: {
      step: 'taskForm',
      context: {
        task: '',
        deadlineDate: undefined,
        deadlineTime: undefined,
        taskType: '',
        moodType: '',
      },
    },
  });

  const { isMounted } = useMount();

  const { mutate: createScheduledTaskMutation } = useMutation({
    mutationFn: async (data: InstantTaskType) => {
      await api.post(`v1/tasks/urgent`, {
        body: JSON.stringify(data),
      });
    },
  });

  const lastStep =
    funnel.historySteps.length > 1
      ? funnel.historySteps[funnel.historySteps.length - 2].step
      : undefined;

  const handleHistoryBack = () => {
    funnel.history.replace('taskForm', {
      task: funnel.context.task,
      deadlineDate: funnel.context.deadlineDate,
      deadlineTime: funnel.context.deadlineTime,
    });
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
              history.push('taskTypeInput', {
                task: task,
                deadlineDate: deadlineDate,
                deadlineTime: deadlineTime,
              })
            }
          />
        )}
        taskTypeInput={({ context }) => (
          <InstantTaskTypeInput
            context={context}
            onClick={(data) => createScheduledTaskMutation(data)}
          />
        )}
      />
    </div>
  );
};

export default InstantTaskCreate;
