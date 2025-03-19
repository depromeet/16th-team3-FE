'use client';

import { createFunnelSteps, useFunnel } from '@use-funnel/browser';
import { InstantTaskInputType, TaskInputType } from '../context';
import useMount from '@/hooks/useMount';
import BackHeader from '@/components/backHeader/BackHeader';
import TaskInput from '../_components/taskInput/TaskInput';
import InstantTaskTypeInput from '../_components/instantTaskTypeInput/InstantTaskTypeInput';
import { useQueryClient } from '@tanstack/react-query';
import { InstantTaskType, TimePickerType } from '@/types/create';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();
  const queryClient = useQueryClient();
  const { isMounted } = useMount();

  const instantTaskMutation = async (data: InstantTaskType) => {
    const res = await fetch('/api/tasks/urgent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const text = await res.text();
    const response = text ? JSON.parse(text) : {};

    if (response.success) {
      const personaName = response.personaName;
      const taskMode = response.taskMode;
      const taskType = response.taskType;

      queryClient.invalidateQueries({ queryKey: ['tasks', 'home'] });
      router.push(
        `/home-page?dialog=success&task=${funnel.context.task}&personaName=${personaName}&taskMode=${taskMode}&taskType=${taskType}`,
      );
    }
  };

  const lastStep =
    funnel.historySteps.length > 1
      ? funnel.historySteps[funnel.historySteps.length - 2].step
      : undefined;

  const handleHistoryBack = () => {
    if (funnel.step === 'taskTypeInput') {
      funnel.history.replace('taskForm', {
        task: funnel.context.task,
        deadlineDate: funnel.context.deadlineDate,
        deadlineTime: funnel.context.deadlineTime,
      });
    } else {
      router.push('/home-page');
    }
  };

  if (!isMounted) return null;

  return (
    <div className="background-primary flex h-full w-full flex-col items-center justify-start overflow-y-auto px-5">
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
            onClick={(data) => instantTaskMutation(data)}
          />
        )}
      />
    </div>
  );
};

export default InstantTaskCreate;
