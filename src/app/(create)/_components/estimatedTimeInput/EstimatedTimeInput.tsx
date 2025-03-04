'use client';

import { Button } from '@/components/ui/button';
import { TimePickerType } from '@/types/create';
import { formatDistanceStrict, set } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import HeaderTitle from '../headerTitle/HeaderTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { TaskInputType } from '../../context';

interface EstimatedTimeInputProps {
  context: TaskInputType;
  lastStep?: string;
  onNext: ({
    estimatedHour,
    estimatedMinute,
    estimatedDay,
  }: {
    estimatedHour: string;
    estimatedMinute: string;
    estimatedDay: string;
  }) => void;
  onEdit: ({
    estimatedHour,
    estimatedMinute,
    estimatedDay,
  }: {
    estimatedHour: string;
    estimatedMinute: string;
    estimatedDay: string;
  }) => void;
}

const EstimatedTimeInput = ({
  context: {
    task,
    deadlineDate,
    deadlineTime,
    estimatedHour: historyHourData,
    estimatedMinute: historyMinuteData,
    estimatedDay: historyDayData,
  },
  lastStep,
  onNext,
  onEdit,
}: EstimatedTimeInputProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minuteInputRef = useRef<HTMLInputElement>(null);
  const dayInputRef = useRef<HTMLInputElement>(null);

  const [estimatedHour, setEstimatedHour] = useState<string>(
    historyHourData || '',
  );
  const [estimatedMinute, setEstimatedMinute] = useState<string>(
    historyMinuteData || '',
  );
  const [estimatedDay, setEstimatedDay] = useState<string>(
    historyDayData || '',
  );

  const [focusedTab, setFocusedTab] = useState<string | null>('시간');
  const [currentTab, setCurrentTab] = useState(
    Boolean(historyDayData) ? '일' : '시간',
  );
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

  const convertDeadlineToDate = (date: Date, time: TimePickerType): Date => {
    let hour = parseInt(time.hour, 10);
    const minute = parseInt(time.minute, 10);

    if (time.meridiem === '오전' && hour === 12) {
      hour = 0;
    } else if (time.meridiem === '오후' && hour !== 12) {
      hour += 12;
    }

    return set(date, { hours: hour, minutes: minute, seconds: 0 });
  };

  const formattedDeadline = formatDistanceStrict(
    new Date(),
    convertDeadlineToDate(deadlineDate as Date, deadlineTime as TimePickerType),
    { addSuffix: true, locale: ko },
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

  useEffect(() => {
    const hour = parseInt(estimatedHour, 10) || 0;
    const minute = parseInt(estimatedMinute, 10) || 0;

    const now = new Date();
    const deadlineDateTime = convertDeadlineToDate(
      deadlineDate as Date,
      deadlineTime as TimePickerType,
    );
    const estimatedDurationMs = hour * 3600000 + minute * 60000;

    if (now.getTime() + estimatedDurationMs > deadlineDateTime.getTime()) {
      setHourError({
        isValid: false,
        message: '예상 소요시간이 마감 시간보다 길어요.',
      });
      setMinuteError({ isValid: false, message: '' });

      return;
    }

    if (hour > 23 && minute > 60) {
      setHourError({
        isValid: false,
        message: '시간과 분을 다시 입력해주세요.',
      });
      setMinuteError({ isValid: false, message: '' });
    } else if (hour > 23 && (minute < 61 || minute >= 0)) {
      setHourError({ isValid: false, message: '24시간 이하로 입력해주세요.' });
      setMinuteError({ isValid: true, message: '' });
    } else if (minute > 60 && (hour < 24 || hour >= 0)) {
      setHourError({ isValid: true, message: '' });
      setMinuteError({ isValid: false, message: '60분 이하로 입력해주세요.' });
    } else {
      setHourError({ isValid: true, message: '' });
      setMinuteError({ isValid: true, message: '' });
    }
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

  // ! TODO feat: 일 탭 선택 시, 일 Input 바로 focus 되도록

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div ref={containerRef}>
        <HeaderTitle title="할일이 얼마나 걸릴 것 같나요?" />
        <div>
          <div className="flex gap-1">
            <span className="b2 text-text-alternative">할일:</span>
            <span className="text-text-neutral">{task}</span>
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
                      : focusedTab === '분' || estimatedMinute.length > 0
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
                      : focusedTab === '분' || estimatedMinute.length > 0
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
            {/* !! TODO: Checkbox로 변환하기  */}
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
                src="/icons/UncheckedBox.svg"
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
          onClick={
            lastStep === 'bufferTime'
              ? () => onEdit({ estimatedHour, estimatedMinute, estimatedDay })
              : () => onNext({ estimatedHour, estimatedMinute, estimatedDay })
          }
        >
          {lastStep === 'bufferTime' ? '확인' : '다음'}
        </Button>
      </div>
    </div>
  );
};

export default EstimatedTimeInput;
