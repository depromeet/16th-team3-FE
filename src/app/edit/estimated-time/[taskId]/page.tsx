'use client';

import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

import HeaderTitle from '@/app/(create)/_components/headerTitle/HeaderTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList } from '@/components/ui/tabs';
import { TabsContent, TabsTrigger } from '@radix-ui/react-tabs';
import { TimePickerType } from '@/types/create';
import { formatDistanceStrict } from 'date-fns';
import { ko } from 'date-fns/locale';
import { EditPageProps } from '../../context';
import {
  calculateTriggerActionAlarmTime,
  clearTimeOnDueDatetime,
  convertDeadlineToDate,
  convertEstimatedTime,
  convertEstimatedTimeToMinutes,
  convertToFormattedTime,
} from '@/utils/dateFormat';
import { useRouter } from 'next/navigation';
import getBufferTime from '@/utils/getBufferTime';
import Loader from '@/components/loader/Loader';
import { useQuery } from '@tanstack/react-query';
import { TaskResponse } from '@/types/task';
import { fetchSingleTask } from '@/services/taskService';

const EstimatedTimeEditPage = ({ params }: EditPageProps) => {
  const { taskId } = use(params);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minuteInputRef = useRef<HTMLInputElement>(null);
  const dayInputRef = useRef<HTMLInputElement>(null);

  const { data: taskData } = useQuery<TaskResponse>({
    queryKey: ['singleTask', taskId],
    queryFn: () => fetchSingleTask(taskId),
  });

  const [estimatedHour, setEstimatedHour] = useState<string>('');

  const [estimatedMinute, setEstimatedMinute] = useState<string>('');

  const [estimatedDay, setEstimatedDay] = useState<string>('');

  const [focusedTab, setFocusedTab] = useState<string | null>('시간');
  const [currentTab, setCurrentTab] = useState('시간');
  const [isOnlyMinute, setIsOnlyMinute] = useState(false);
  const [hourError, setHourError] = useState<{
    isValid: boolean;
    message: string;
  }>({
    isValid: true,
    message: '',
  });

  const [minuteError, setMinuteError] = useState<{
    isValid: boolean;
    message: string;
  }>({
    isValid: true,
    message: '',
  });

  const [dayError, setDayError] = useState<{
    isValid: boolean;
    message: string;
  }>({
    isValid: true,
    message: '',
  });

  const isEmptyValue =
    (currentTab === '시간' &&
      estimatedHour.length === 0 &&
      estimatedMinute.length === 0) ||
    (currentTab === '일' && estimatedDay.length === 0);

  const isInvalidValue =
    !hourError.isValid || !minuteError.isValid || !dayError.isValid;

  const { meridiem, hour, minute } = convertToFormattedTime(
    taskData?.dueDatetime ? new Date(taskData.dueDatetime) : new Date(),
  );

  const deadlineDate = useMemo(
    () =>
      taskData?.dueDatetime
        ? clearTimeOnDueDatetime(new Date(taskData.dueDatetime))
        : new Date(),
    [taskData?.dueDatetime],
  );

  const deadlineTime = useMemo(
    () => ({
      meridiem: meridiem,
      hour: hour,
      minute: minute,
    }),
    [meridiem, hour, minute],
  );

  const formattedDeadline = formatDistanceStrict(
    new Date(),
    convertDeadlineToDate(
      taskData?.dueDatetime
        ? clearTimeOnDueDatetime(new Date(taskData.dueDatetime))
        : new Date(),
      {
        meridiem: meridiem,
        hour: hour,
        minute: minute,
      } as TimePickerType,
    ),
    { addSuffix: true, locale: ko },
  );

  const { finalDays, finalHours, finalMinutes } = taskData
    ? getBufferTime(
        new Date(taskData.dueDatetime),
        estimatedDay,
        estimatedHour,
        estimatedMinute,
      )
    : { finalDays: 0, finalHours: 0, finalMinutes: 0 };

  const triggerActionAlarmTime = calculateTriggerActionAlarmTime(
    deadlineDate,
    deadlineTime,
    finalDays,
    finalHours,
    finalMinutes,
  );

  const totalEstimatedMinutes = convertEstimatedTimeToMinutes(
    estimatedDay,
    estimatedHour,
    estimatedMinute,
  );

  const handleHourChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, '');

    if (type === '시간') {
      setEstimatedHour(numericValue);
    } else if (type === '분') {
      setEstimatedMinute(numericValue);
    } else if (type === '일') {
      setEstimatedDay(numericValue);
    }
  };

  const resetInputValues = () => {
    setEstimatedHour('');
    setEstimatedMinute('');
    setEstimatedDay('');
    setHourError({ isValid: true, message: '' });
    setMinuteError({ isValid: true, message: '' });
    setDayError({ isValid: true, message: '' });
  };

  const handleNextButtonClick = () => {
    const query = new URLSearchParams({
      triggerActionAlarmTime: triggerActionAlarmTime,
      estimatedTime: totalEstimatedMinutes.toString(),
    }).toString();

    router.push(`/edit/buffer-time/${taskId}?${query}&type=estimatedTime`);
  };

  useEffect(() => {
    if (taskData) {
      const {
        estimatedDay: convertedEstimatedDay,
        estimatedHour: convertedEstimatedHour,
        estimatedMinute: convertedEstimatedMinute,
      } = convertEstimatedTime(taskData.estimatedTime);

      setEstimatedHour(convertedEstimatedHour.toString());
      setEstimatedMinute(convertedEstimatedMinute.toString());
      setEstimatedDay(convertedEstimatedDay.toString());
    }
  }, [taskData]);

  useEffect(() => {
    const hour = parseInt(estimatedHour, 10) || 0;
    const minute = parseInt(estimatedMinute, 10) || 0;

    const now = new Date();
    const deadlineDateTime = convertDeadlineToDate(
      deadlineDate as Date,
      deadlineTime as TimePickerType,
    );
    const estimatedDurationMs = hour * 3600000 + minute * 60000;

    let newHourError = { isValid: true, message: '' };
    let newMinuteError = { isValid: true, message: '' };

    if (now.getTime() + estimatedDurationMs > deadlineDateTime.getTime()) {
      newHourError = {
        isValid: false,
        message: '예상 소요시간이 마감 시간보다 길어요.',
      };
      newMinuteError = { isValid: false, message: '' };
    } else if (hour > 23 && minute > 60) {
      newHourError = {
        isValid: false,
        message: '시간과 분을 다시 입력해주세요.',
      };
      newMinuteError = { isValid: false, message: '' };
    } else if (hour > 23) {
      newHourError = { isValid: false, message: '24시간 이하로 입력해주세요.' };
    } else if (minute > 60) {
      newMinuteError = { isValid: false, message: '60분 이하로 입력해주세요.' };
    }

    setHourError((prev) =>
      prev.isValid === newHourError.isValid &&
      prev.message === newHourError.message
        ? prev
        : newHourError,
    );
    setMinuteError((prev) =>
      prev.isValid === newMinuteError.isValid &&
      prev.message === newMinuteError.message
        ? prev
        : newMinuteError,
    );
  }, [estimatedHour, estimatedMinute, deadlineDate, deadlineTime]);

  useEffect(() => {
    const now = new Date();
    const deadlineDateTime = convertDeadlineToDate(
      deadlineDate as Date,
      deadlineTime as TimePickerType,
    );
    const estimatedDurationMs = parseInt(estimatedDay, 10) * 86400000;

    if (now.getTime() + estimatedDurationMs > deadlineDateTime.getTime()) {
      setDayError({
        isValid: false,
        message: '예상 소요시간이 마감 시간보다 길어요.',
      });
    } else {
      setDayError({ isValid: true, message: '' });
    }
  }, [estimatedDay, deadlineDate, deadlineTime]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setFocusedTab(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!taskData) {
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div ref={containerRef}>
        <HeaderTitle title="할일이 얼마나 걸릴 것 같나요?" />
        <div>
          <div className="flex gap-1">
            <span className="b2 text-text-alternative">할일:</span>
            <span className="text-text-neutral">{taskData.name}</span>
          </div>
          <div className="flex gap-1">
            <span className="b2 text-text-alternative">마감:</span>
            <span className="text-text-neutral">{formattedDeadline}</span>
          </div>
        </div>
        <Tabs
          defaultValue="시간"
          value={currentTab}
          onValueChange={(value) => {
            setCurrentTab(value);
            resetInputValues();
          }}
          className="mt-6 w-full"
        >
          <TabsList className="h-full w-full rounded-[10px] bg-component-gray-primary p-1">
            <TabsTrigger
              value="시간"
              className={`l4 w-full p-[10px] ${currentTab === '시간' ? 'bg-component-gray-tertiary' : ''} rounded-[8px]`}
            >
              시간
            </TabsTrigger>
            <TabsTrigger
              value="일"
              className={`l4 w-full p-[10px] ${currentTab === '일' ? 'bg-component-gray-tertiary' : ''} rounded-[8px]`}
            >
              일
            </TabsTrigger>
          </TabsList>
          <TabsContent value="시간">
            <div className="relative mt-3 flex justify-between gap-6">
              {!isOnlyMinute && (
                <div className="flex w-full flex-col gap-2">
                  <span
                    className={`b3 ${
                      !hourError.isValid
                        ? 'text-red'
                        : focusedTab === '시간'
                          ? 'text-primary'
                          : 'text-neutral'
                    }`}
                  >
                    시간
                  </span>
                  <div
                    className={`focus:border-primary relative flex items-center border-0 border-b transition-colors focus:border-b-2 focus:border-b-component-accent-primary focus:outline-none ${
                      !hourError.isValid
                        ? 'border-b-2 border-line-error'
                        : focusedTab === '시간'
                          ? 'border-b-2 border-b-component-accent-primary'
                          : 'border-gray-300'
                    }`}
                    onClick={() => {
                      hourInputRef.current?.focus();
                      setFocusedTab('시간');
                    }}
                  >
                    <Input
                      type="text"
                      inputMode="decimal"
                      className="t3 text-normal border-0 bg-transparent p-0"
                      style={{
                        minWidth: '1ch',
                        width: `${Math.max(estimatedHour.length, 2)}ch`,
                        caretColor: 'transparent',
                      }}
                      ref={hourInputRef}
                      value={estimatedHour}
                      maxLength={2}
                      onChange={(event) => handleHourChange(event, '시간')}
                    />
                    {estimatedHour.length > 0 && (
                      <span
                        className={`t3 text-normal ${estimatedHour.length === 1 ? 'ml-[-8px]' : ''} transform`}
                      >
                        시간
                      </span>
                    )}
                  </div>
                  {!hourError.isValid && (
                    <span className="text-red s3 absolute bottom-[-28px]">
                      {hourError.message}
                    </span>
                  )}
                </div>
              )}
              <div className="relative flex w-full flex-col gap-2">
                <span
                  className={`b3 ${
                    !minuteError.isValid
                      ? 'text-red'
                      : focusedTab === '분'
                        ? 'text-primary'
                        : 'text-neutral'
                  }`}
                >
                  분
                </span>
                <div
                  className={`focus:border-primary relative flex items-center border-0 border-b transition-colors focus:border-b-component-accent-primary focus:outline-none ${
                    !minuteError.isValid
                      ? 'border-b-2 border-line-error'
                      : focusedTab === '분'
                        ? 'border-b-2 border-b-component-accent-primary'
                        : 'border-gray-300'
                  }`}
                  onClick={() => {
                    minuteInputRef.current?.focus();
                    setFocusedTab('분');
                  }}
                >
                  <Input
                    type="text"
                    inputMode="decimal"
                    className="t3 text-normal border-0 bg-transparent p-0"
                    style={{
                      minWidth: '1ch',
                      width: `${Math.max(estimatedMinute.length, 2)}ch`,
                      caretColor: 'transparent',
                    }}
                    ref={minuteInputRef}
                    value={estimatedMinute}
                    maxLength={2}
                    onChange={(event) => handleHourChange(event, '분')}
                  />
                  {estimatedMinute.length > 0 && (
                    <span
                      className={`t3 text-normal ${estimatedMinute.length === 1 ? 'ml-[-8px]' : ''} transform`}
                    >
                      분
                    </span>
                  )}
                </div>
                {!minuteError.isValid && (
                  <span className="text-red s3 absolute bottom-[-28px]">
                    {minuteError.message}
                  </span>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="일">
            <div className="relative mt-3 flex w-full flex-col gap-2">
              <span
                className={`b3 ${
                  !dayError.isValid
                    ? 'text-red'
                    : focusedTab === '일'
                      ? 'text-primary'
                      : 'text-neutral'
                }`}
              >
                일
              </span>
              <div
                className={`focus:border-primary relative flex items-center border-0 border-b transition-colors focus:border-b-component-accent-primary focus:outline-none ${
                  !dayError.isValid
                    ? 'border-b-2 border-line-error'
                    : focusedTab === '일'
                      ? 'border-b-2 border-b-component-accent-primary'
                      : 'border-gray-300'
                }`}
                onClick={() => {
                  dayInputRef.current?.focus();
                  setFocusedTab('일');
                }}
              >
                <Input
                  type="text"
                  inputMode="decimal"
                  className="t3 text-normal border-0 bg-transparent p-0"
                  style={{
                    minWidth: '1ch',
                    width: `${Math.max(estimatedDay.length, 2)}ch`,
                    caretColor: 'transparent',
                  }}
                  ref={dayInputRef}
                  value={estimatedDay}
                  maxLength={2}
                  onChange={(event) => handleHourChange(event, '일')}
                />
                {estimatedDay.length > 0 && (
                  <span
                    className={`t3 text-normal ${estimatedDay.length === 1 ? 'ml-[-14px]' : 'ml-[-2px]'} transform`}
                  >
                    일
                  </span>
                )}
              </div>
              {!dayError.isValid && (
                <span className="text-red s3 absolute bottom-[-28px]">
                  {dayError.message}
                </span>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div
        className={`flex flex-col transition-all duration-300 ${focusedTab !== null ? 'mb-[32vh]' : 'pb-[46px]'} gap-4`}
      >
        {currentTab === '시간' && (
          <div className="flex items-center justify-center space-x-2">
            <label
              htmlFor="onlyMinute"
              className="b3 text-neutral mt-0.5 rounded-[2px] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              분만 입력
            </label>
            {/* ! TODO: Checkbox로 변환하기  */}
            {isOnlyMinute ? (
              <Image
                src="/icons/CheckedBox.svg"
                alt="checkedBox"
                width={20}
                height={20}
                onClick={() => setIsOnlyMinute(false)}
              />
            ) : (
              <Image
                src="/icons/UnCheckedBox.svg"
                alt="uncheckedBox"
                width={20}
                height={20}
                onClick={() => setIsOnlyMinute(true)}
              />
            )}
          </div>
        )}
        <Button
          variant="primary"
          className="w-full"
          disabled={isEmptyValue || isInvalidValue}
          onClick={handleNextButtonClick}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default EstimatedTimeEditPage;
