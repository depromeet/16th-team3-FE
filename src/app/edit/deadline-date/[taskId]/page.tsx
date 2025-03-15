'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import DateSelectedComponent from '@/app/(create)/_components/dateSelectedComponent/DateSelectedComponent';
import HeaderTitle from '@/app/(create)/_components/headerTitle/HeaderTitle';
import TimeSelectedComponent from '@/app/(create)/_components/timeSelectedComponent/TimeSelectedComponent';
import ClearableInput from '@/components/clearableInput/ClearableInput';
import { Button } from '@/components/ui/button';
import { TimePickerType } from '@/types/create';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/ky';
import { TaskResponse } from '@/types/task';
import {
  clearTimeOnDueDatetime,
  convertToFormattedTime,
} from '@/utils/dateFormat';
import { EditPageProps } from '../../context';

const MAX_TASK_LENGTH = 15;
const WAITING_TIME = 200;

const DeadlineDateEditPage = ({ params, searchParams }: EditPageProps) => {
  const { taskId } = use(params);
  const {
    task: taskQuery,
    deadlineDate: deadlineDateQuery,
    meridiem: meridiemQuery,
    hour: hourQuery,
    minute: minuteQuery,
  } = use(searchParams);

  console.log(taskQuery);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [task, setTask] = useState<string>('');
  const [isFocused, setIsFocused] = useState(true);
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [deadlineTime, setDeadlineTime] = useState<TimePickerType>({
    meridiem: '오전',
    hour: '01',
    minute: '00',
  });

  const { data: taskData } = useQuery<TaskResponse>({
    queryKey: ['singleTask', taskId],
    queryFn: async () =>
      await api.get(`v1/tasks/${taskId}`).json<TaskResponse>(),
  });

  const isInvalid = task.length > MAX_TASK_LENGTH || task.length === 0;

  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleDateChange = (date: Date) => {
    setDeadlineDate(date);
  };

  const handleTimeChange = (time: TimePickerType) => {
    setDeadlineTime(time);
  };

  const handleInputFocus = (value: boolean) => {
    setIsFocused(value);
  };

  const handleConfirmButtonClick = () => {
    if (!deadlineDate) return;

    const query = new URLSearchParams({
      task,
      deadlineDate: deadlineDate.toISOString(),
      meridiem: deadlineTime.meridiem,
      hour: deadlineTime.hour,
      minute: deadlineTime.minute,
    }).toString();

    console.log('query', query);

    router.push(`/edit/buffer-time/${taskId}?${query}`);
  };

  useEffect(() => {
    if (inputRef.current)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          setIsFocused(true);
        }
      }, WAITING_TIME);
  }, []);

  useEffect(() => {
    if (taskData) {
      setTask(taskQuery ? taskQuery : taskData.name);

      const originalDate = new Date(
        deadlineDateQuery ? deadlineDateQuery : taskData.dueDatetime,
      );
      const dateAtMidnight = clearTimeOnDueDatetime(originalDate);
      setDeadlineDate(dateAtMidnight);

      if (meridiemQuery && hourQuery && minuteQuery) {
        setDeadlineTime({
          meridiem: meridiemQuery,
          hour: hourQuery,
          minute: minuteQuery,
        });
      } else {
        const { meridiem, hour, minute } = convertToFormattedTime(originalDate);
        setDeadlineTime({ meridiem, hour, minute });
      }
    }
  }, [
    deadlineDateQuery,
    hourQuery,
    meridiemQuery,
    minuteQuery,
    taskData,
    taskQuery,
  ]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div>
        <HeaderTitle title="어떤 일의 마감이 급하신가요?" />
        <div className="flex flex-col gap-6">
          <div>
            <ClearableInput
              value={task}
              ref={inputRef}
              title="할 일 입력"
              isFocused={isFocused}
              onChange={handleTaskChange}
              handleInputFocus={handleInputFocus}
            />
            {task.length > MAX_TASK_LENGTH && (
              <p className="mt-2 text-sm text-red-500">
                최대 16자 이내로 입력할 수 있어요.
              </p>
            )}
          </div>

          <DateSelectedComponent
            deadlineDate={deadlineDate}
            handleDateChange={handleDateChange}
          />

          {deadlineDate !== undefined && (
            <TimeSelectedComponent
              deadlineTime={deadlineTime}
              deadlineDate={deadlineDate}
              handleTimeChange={handleTimeChange}
            />
          )}
        </div>
      </div>

      <div className="pb-[46px]">
        <Button
          variant="primary"
          className="mt-6"
          onClick={handleConfirmButtonClick}
          disabled={isInvalid}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default DeadlineDateEditPage;
