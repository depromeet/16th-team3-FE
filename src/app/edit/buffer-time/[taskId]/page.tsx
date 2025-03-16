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
  calculateTriggerActionAlarmTime,
  clearTimeOnDueDatetime,
  combineDeadlineDateTime,
  convertEstimatedTime,
  convertToFormattedTime,
  getValidDate,
} from '@/utils/dateFormat';
import { useRouter } from 'next/navigation';
import { EditPageProps } from '../../context';

const BufferTimeEditPage = ({ params, searchParams }: EditPageProps) => {
  const { taskId } = use(params);
  const {
    task: taskQuery,
    deadlineDate: deadlineDateQuery,
    meridiem: meridiemQuery,
    hour: hourQuery,
    minute: minuteQuery,
    triggerAction: triggerActionQuery,
    estimatedTime: estimatedTimeQuery,
    triggerActionAlarmTime: triggerActionAlarmTimeQuery,
  } = use(searchParams);

  const query = new URLSearchParams({
    task: taskQuery || '',
    deadlineDate: deadlineDateQuery || '',
    meridiem: meridiemQuery || '',
    hour: hourQuery || '',
    minute: minuteQuery || '',
    triggerAction: triggerActionQuery || '',
    estimatedTime: estimatedTimeQuery ? estimatedTimeQuery.toString() : '',
    triggerActionAlarmTime: triggerActionAlarmTimeQuery || '',
  }).toString();

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: taskData } = useQuery<TaskResponse>({
    queryKey: ['singleTask', taskId],
    queryFn: async () =>
      await api.get(`v1/tasks/${taskId}`).json<TaskResponse>(),
  });

  const baseDate = deadlineDateQuery
    ? getValidDate(deadlineDateQuery)
    : getValidDate(taskData?.dueDatetime);

  const dateAtMidnight = clearTimeOnDueDatetime(baseDate);
  const formattedDate = format(dateAtMidnight, 'M월 d일 (E)', { locale: ko });

  const { meridiem, hour, minute } = convertToFormattedTime(
    taskData?.dueDatetime ? new Date(taskData.dueDatetime) : new Date(),
  );

  const effectiveTime = {
    meridiem: meridiemQuery || meridiem,
    hour: hourQuery || hour,
    minute: minuteQuery || minute,
  };

  const { estimatedDay, estimatedHour, estimatedMinute } = convertEstimatedTime(
    estimatedTimeQuery ? estimatedTimeQuery : (taskData?.estimatedTime ?? 0),
  );

  const { finalDays, finalHours, finalMinutes } = getBufferTime(
    estimatedDay.toString(),
    estimatedHour.toString(),
    estimatedMinute.toString(),
  );

  const calculatedTriggerActionAlarmTime = calculateTriggerActionAlarmTime(
    dateAtMidnight,
    effectiveTime,
    finalDays,
    finalHours,
    finalMinutes,
  );

  console.log(
    'calculatedTriggerActionAlarmTime',
    calculatedTriggerActionAlarmTime,
  );
  const formattedAlarmTime = format(
    calculatedTriggerActionAlarmTime,
    'M월 d일 (EEE) a hh:mm',
    {
      locale: ko,
    },
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
        triggerAction: triggerActionQuery || taskData?.triggerAction,
        estimatedTime: estimatedTimeQuery || taskData?.estimatedTime,
        triggerActionAlarmTime:
          triggerActionAlarmTimeQuery ||
          taskData?.triggerActionAlarmTime.replace('T', ' '),
      };

      const response = await api.patch(`v1/tasks/${taskId}`, {
        body: JSON.stringify(body),
      });

      return response.json();
    },
    onSuccess: (data) => {
      console.log('Mutation response:', data);
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'home'],
      });
      router.push('/home-page');
    },
  });

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
            <Image src="/icons/Bell.svg" alt="bell" width={60} height={60} />
            <div className="relative flex h-[26px] items-center justify-center overflow-hidden rounded-[8px] px-[7px] py-[6px] text-black before:absolute before:inset-0 before:-z-10 before:bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] before:[transform:scale(4,1)]">
              <span className="l6 text-inverse">1.5배의 여유시간 적용</span>
            </div>
          </div>
          <div className="bg-blur-purple absolute left-0 right-0 top-20 h-[240px] blur-[75px]" />
          <div className="mt-10 flex flex-col items-center">
            <div>
              <span className="t2 text-primary">{timeString}</span>
              <span className="t2 text-strong"> 전에는</span>
            </div>
            <span className="t2 text-strong">시작할 수 있게</span>
            <span className="t2 text-strong">작은 행동 알림을 보낼게요</span>
            <span className="b3 text-neutral mt-6">
              {formattedAlarmTime} 첫 알림
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
                onClick={() =>
                  router.push(`/edit/deadline-date/${taskId}?${query}`)
                }
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
                onClick={() =>
                  router.push(`/edit/small-action/${taskId}?${query}`)
                }
              >
                <span className="b2 text-neutral mt-[2px]">
                  {triggerActionQuery
                    ? triggerActionQuery
                    : taskData.triggerAction}
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
                onClick={() =>
                  router.push(`/edit/estimated-time/${taskId}?${query}`)
                }
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
