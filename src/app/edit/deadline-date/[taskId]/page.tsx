'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import DateSelectedComponent from '@/app/(create)/_components/dateSelectedComponent/DateSelectedComponent';
import HeaderTitle from '@/app/(create)/_components/headerTitle/HeaderTitle';
import TimeSelectedComponent from '@/app/(create)/_components/timeSelectedComponent/TimeSelectedComponent';
import ClearableInput from '@/components/clearableInput/ClearableInput';
import { Button } from '@/components/ui/button';
import { TimePickerType } from '@/types/create';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/ky';
import { TaskResponse } from '@/types/task';
import { combineDeadlineDateTime } from '@/utils/dateFormat';

const MAX_TASK_LENGTH = 15;
const WAITING_TIME = 200;

const DeadlineDateEditPage = ({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) => {
  const { taskId } = use(params);

  const router = useRouter();
  const queryClient = useQueryClient();
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
    queryFn: async () => {
      const response = await api.get(`v1/tasks/${taskId}`);
      return response.json<TaskResponse>();
    },
  });

  const { mutate: editTaskDataMutation } = useMutation({
    mutationFn: async () => {
      if (!deadlineDate) {
        throw new Error('마감 날짜가 선택되지 않았습니다.');
      }

      const dueDatetime = combineDeadlineDateTime(deadlineDate, deadlineTime);
      const body = JSON.stringify({
        name: task,
        dueDatetime: dueDatetime,
      });
      return await api.post(`v1/tasks/${taskId}`, { body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      router.push('/edit/buffer-time');
    },
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
    editTaskDataMutation();
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
      setTask(taskData.name);

      const dateObj = new Date(taskData.dueDatetime);
      setDeadlineDate(dateObj);

      const hours24 = dateObj.getHours();
      const minutes = dateObj.getMinutes();

      const meridiem = hours24 < 12 ? '오전' : '오후';
      const hour = (hours24 % 12 || 12).toString().padStart(2, '0');
      const minute = minutes.toString().padStart(2, '0');

      setDeadlineTime({ meridiem, hour, minute });
    }
  }, [taskData]);

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
          onClick={() => router.push('/edit/buffer-time')}
          disabled={isInvalid}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default DeadlineDateEditPage;
