'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import getBufferTime from '@/utils/getBufferTime';
import formatBufferTime from '@/utils/formatBufferTime';
import { use } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TaskResponse } from '@/types/task';
import { api } from '@/lib/ky';
import {
  clearTimeOnDueDatetime,
  combineDeadlineDateTime,
  convertEstimatedTime,
  convertToFormattedTime,
} from '@/utils/dateFormat';
import { useRouter } from 'next/navigation';

interface BufferTimeEditPageProps {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{
    task?: string;
    deadlineDate?: string;
    meridiem?: string;
    hour?: string;
    minute?: string;
  }>;
}

const BufferTimeEditPage = ({
  params,
  searchParams,
}: BufferTimeEditPageProps) => {
  const { taskId } = use(params);
  const {
    task: taskQuery,
    deadlineDate: deadlineDateQuery,
    meridiem: meridiemQuery,
    hour: hourQuery,
    minute: minuteQuery,
  } = use(searchParams);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: taskData } = useQuery<TaskResponse>({
    queryKey: ['singleTask', taskId],
    queryFn: async () => {
      const response = await api.get(`v1/tasks/${taskId}`);
      return response.json<TaskResponse>();
    },
  });

  const dateAtMidnight = clearTimeOnDueDatetime(
    deadlineDateQuery
      ? new Date(deadlineDateQuery)
      : new Date(taskData?.dueDatetime || ''),
  );

  const formattedDate = format(dateAtMidnight, 'M월 d일 (E)', { locale: ko });

  const { meridiem, hour, minute } = convertToFormattedTime(
    taskData?.dueDatetime ? new Date(taskData.dueDatetime) : new Date(),
  );

  const effectiveTime = {
    meridiem: meridiemQuery ?? meridiem,
    hour: hourQuery ?? hour,
    minute: minuteQuery ?? minute,
  };

  // ! 예상소요시간 query로 받을 때 수정필요
  const { estimatedDay, estimatedHour, estimatedMinute } = convertEstimatedTime(
    taskData?.estimatedTime ?? 0,
  );

  // ! 예상소요시간 query로 받을 때 수정필요
  const { finalDays, finalHours, finalMinutes } = getBufferTime(
    taskData && estimatedDay.toString(),
    taskData && estimatedHour.toString(),
    taskData && estimatedMinute.toString(),
  );

  const { mutate: editTaskDataMutation } = useMutation({
    mutationFn: async () => {
      if (!dateAtMidnight) {
        throw new Error('마감 날짜가 선택되지 않았습니다.');
      }

      const dueDatetime = combineDeadlineDateTime(dateAtMidnight, {
        meridiem: meridiemQuery ? meridiemQuery : meridiem,
        hour: hourQuery ? hourQuery : hour,
        minute: minuteQuery ? minuteQuery : minute,
      });

      const body = {
        name: taskQuery || taskData?.name,
        dueDatetime: dueDatetime,
        triggerAction: taskData?.triggerAction,
        estimatedTime: taskData?.estimatedTime,
        triggerActionAlarmTime: taskData?.triggerActionAlarmTime.replace(
          'T',
          ' ',
        ),
      };

      return await api.patch(`v1/tasks/${taskId}`, {
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      router.push('/home-page');
    },
  });

  // ! 예상소요시간 query로 받을 때 수정필요
  const timeString = formatBufferTime({
    days: finalDays,
    hours: finalHours,
    minutes: finalMinutes,
  });

  const handleConfirmButtonClick = () => {
    editTaskDataMutation();
  };

  return (
    taskData && (
      <div className="flex h-full w-full flex-col justify-between">
        <div className="relative mt-[30px]">
          <div className="flex flex-col items-center gap-3">
            <Image
              src="/icons/yellowBell.svg"
              alt="bell"
              width={60}
              height={60}
            />
            <div className="relative flex h-[26px] items-center justify-center overflow-hidden rounded-[8px] bg-component-gray-secondary px-[7px] py-[6px] text-black">
              <span className="l6 text-alternative">1.5배의 여유시간 적용</span>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center">
            <div>
              <span className="t2 text-primary">{timeString}</span>
              <span className="t2 text-strong"> 전에는</span>
            </div>
            <span className="t2 text-strong">시작할 수 있게</span>
            <span className="t2 text-strong">작은 행동 알림을 보낼게요</span>
            <span className="b3 text-neutral mt-6">
              {`${formattedDate} ${effectiveTime.meridiem} ${effectiveTime.hour}:${effectiveTime.minute}`}{' '}
              첫 알림
            </span>
          </div>
        </div>
        <div className="pb-[46px] transition-all duration-300">
          <div className="mb-9 flex flex-col items-start gap-5">
            <span className="text-normal s2">
              {taskQuery ? taskQuery : taskData.name}
            </span>
            <div className="flex w-full items-center justify-between">
              <span className="b2 text-alternative mt-[2px]">마감일</span>
              <div
                className="flex items-center"
                onClick={() => router.push(`/edit/deadline-date/${taskId}`)}
              >
                <span className="b2 text-neutral mt-[2px]">
                  {`${formattedDate}, ${effectiveTime.meridiem} ${effectiveTime.hour}:${effectiveTime.minute}`}
                </span>
                <ChevronRight
                  width={20}
                  height={20}
                  className="text-icon-secondary"
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="b2 text-alternative mt-[2px]">작은 행동</span>
              <div
                className="flex items-center"
                onClick={() => router.push(`/edit/small-action/${taskId}`)}
              >
                <span className="b2 text-neutral mt-[2px]">
                  {taskData.triggerAction}
                </span>
                <ChevronRight
                  width={20}
                  height={20}
                  className="text-icon-secondary"
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="b2 text-alternative mt-[2px]">
                예상 소요시간
              </span>
              <div
                className="flex items-center"
                onClick={() => router.push(`/edit/estimated-time/${taskId}`)}
              >
                <span className="b2 text-neutral mt-[2px]">
                  {[
                    estimatedHour && `${estimatedHour}시간`,
                    estimatedMinute && `${estimatedMinute}분`,
                    estimatedDay && `${estimatedDay}일`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                </span>
                <ChevronRight
                  width={20}
                  height={20}
                  className="text-icon-secondary"
                />
              </div>
            </div>
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={handleConfirmButtonClick}
          >
            다음
          </Button>
        </div>
      </div>
    )
  );
};

export default BufferTimeEditPage;
