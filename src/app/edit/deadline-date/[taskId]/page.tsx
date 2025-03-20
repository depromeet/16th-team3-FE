'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import DateSelectedComponent from '@/app/(create)/_components/dateSelectedComponent/DateSelectedComponent';
import HeaderTitle from '@/app/(create)/_components/headerTitle/HeaderTitle';
import TimeSelectedComponent from '@/app/(create)/_components/timeSelectedComponent/TimeSelectedComponent';
import ClearableInput from '@/components/clearableInput/ClearableInput';
import { Button } from '@/components/ui/button';
import { TimePickerType } from '@/types/create';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/ky';
import { TaskResponse } from '@/types/task';
import {
  calculateTriggerActionAlarmTime,
  clearTimeOnDueDatetime,
  combineDeadlineDateTime,
  combineDeadlineDateTimeToDate,
  convertDeadlineToDate,
  convertEstimatedTime,
  convertToFormattedTime,
} from '@/utils/dateFormat';
import { EditPageProps } from '../../context';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import getBufferTime from '@/utils/getBufferTime';
import { fetchSingleTask } from '@/services/taskService';

const MAX_TASK_LENGTH = 15;
const WAITING_TIME = 200;

const DeadlineDateEditPage = ({ params }: EditPageProps) => {
  const { taskId } = use(params);

  const router = useRouter();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [task, setTask] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isUrgentDrawerOpen, setIsUrgentDrawerOpen] = useState<boolean>(false);
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [deadlineTime, setDeadlineTime] = useState<TimePickerType>({
    meridiem: '오전',
    hour: '01',
    minute: '00',
  });

  const { data: taskData } = useQuery<TaskResponse>({
    queryKey: ['singleTask', taskId],
    queryFn: () => fetchSingleTask(taskId),
  });

  const isInvalid = task.length > MAX_TASK_LENGTH || task.length === 0;

  const { estimatedDay, estimatedHour, estimatedMinute } = convertEstimatedTime(
    taskData?.estimatedTime ?? 0,
  );

  const deadlineDateTime = combineDeadlineDateTimeToDate({
    deadlineDate,
    deadlineTime,
  });

  const { finalDays, finalHours, finalMinutes } = getBufferTime(
    deadlineDateTime,
    estimatedDay.toString(),
    estimatedHour.toString(),
    estimatedMinute.toString(),
  );

  const newTriggerActionAlarmTime = deadlineDate
    ? calculateTriggerActionAlarmTime(
        deadlineDate,
        deadlineTime,
        finalDays,
        finalHours,
        finalMinutes,
      )
    : '';

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
      triggerActionAlarmTime: newTriggerActionAlarmTime,
      isUrgent: isUrgent.toString(),
    }).toString();

    router.push(`/edit/buffer-time/${taskId}?${query}&type=deadline`);
  };

  const editTaskDataMutation = async () => {
    if (!deadlineDate) {
      throw new Error('마감 날짜가 선택되지 않았습니다.');
    }

    const dueDatetime = combineDeadlineDateTime(deadlineDate, {
      meridiem: deadlineTime.meridiem,
      hour: deadlineTime.hour,
      minute: deadlineTime.minute,
    });

    const body = {
      name: taskData?.name,
      dueDatetime: dueDatetime,
      triggerActionAlarmTime: newTriggerActionAlarmTime,
      isUrgent: false,
    };

    const urgentBody = {
      name: taskData?.name,
      dueDatetime: dueDatetime,
      isUrgent: true,
    };

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: isUrgent ? JSON.stringify(urgentBody) : JSON.stringify(body),
    });

    const text = await res.text();
    const response = text ? JSON.parse(text) : {};

    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'home'] });
      router.push('/home-page');
    }
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

      const originalDate = new Date(taskData.dueDatetime);
      const dateAtMidnight = clearTimeOnDueDatetime(originalDate);
      setDeadlineDate(dateAtMidnight);

      const { meridiem, hour, minute } = convertToFormattedTime(originalDate);
      setDeadlineTime({ meridiem, hour, minute });
    }
  }, [taskData]);

  useEffect(() => {
    if (taskData && deadlineDate) {
      const currentEstimatedTime = taskData.estimatedTime;
      const changedDeadline = convertDeadlineToDate(deadlineDate, deadlineTime);

      const diffMs = changedDeadline.getTime() - new Date().getTime();
      const diffMinutes = diffMs / (1000 * 60);

      if (diffMinutes < currentEstimatedTime) {
        setIsUrgentDrawerOpen(true);
        setIsUrgent(true);
      } else {
        setIsUrgentDrawerOpen(false);
        setIsUrgent(false);
      }
    }
  }, [taskData, deadlineDate, deadlineTime]);

  return (
    <Drawer
      open={isUrgentDrawerOpen}
      dismissible
      setBackgroundColorOnScale
      onOpenChange={setIsUrgentDrawerOpen}
    >
      <div className="flex h-screen w-full flex-col justify-between">
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

      <DrawerContent className="w-auto border-0 bg-component-gray-secondary px-5 pb-[33px] pt-2">
        <DrawerHeader className="px-0 pb-4 pt-6">
          <DrawerTitle>
            <p className="t3 text-gray-normal">
              PPT 만들고 대본 작성의 <br />
              마감일이 바뀌었어요. <br />
              할일을 즉시 시작으로 전환할게요.
            </p>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="primary" onClick={() => editTaskDataMutation()}>
              확인
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeadlineDateEditPage;
