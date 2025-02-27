'use client';

import { Button } from '@/components/ui/button';
import { TimePickerType } from '@/types/create';
import { formatDistanceStrict, set } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRef, useState } from 'react';
import HeaderTitle from '../headerTitle/HeaderTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface EstimatedTimeInputProps {
  task: string;
  deadlineDate: Date;
  deadlineTime: TimePickerType;
  onClick: ({
    estimatedHour,
    estimatedMinute,
  }: {
    estimatedHour: string;
    estimatedMinute: string;
  }) => void;
}

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

const EstimatedTimeInput = ({
  task,
  deadlineDate,
  deadlineTime,
  onClick,
}: EstimatedTimeInputProps) => {
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minuteInputRef = useRef<HTMLInputElement>(null);

  const [estimatedHour, setEstimatedHour] = useState<string>('');
  const [estimatedMinute, setEstimatedMinute] = useState<string>('');
  const [focusedTab, setFocusedTab] = useState<string | null>('시간');
  const [currentTab, setCurrentTab] = useState('시간');

  const formattedDeadline = formatDistanceStrict(
    new Date(),
    convertDeadlineToDate(deadlineDate, deadlineTime),
    { addSuffix: true, locale: ko },
  );

  const handleHourChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    if (type === '시간') {
      const valueWithoutSuffix = event.target.value.replace(/시간$/, '');
      setEstimatedHour(valueWithoutSuffix);
    }

    if (type === '분') {
      const valueWithoutSuffix = event.target.value.replace(/분$/, '');
      setEstimatedMinute(valueWithoutSuffix);
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div>
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
          onValueChange={(value) => setCurrentTab(value)}
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
            <div className="mt-3 flex justify-between gap-6">
              <div className="flex w-full flex-col gap-2">
                <span
                  className={`b3 ${estimatedHour.length > 0 ? 'text-primary' : 'text-neutral'}`}
                >
                  시간
                </span>
                <div
                  className={`focus:border-primary relative flex items-center border-0 border-b transition-colors focus:border-b-2 focus:border-b-component-accent-primary focus:outline-none ${focusedTab === '시간' || estimatedHour.length > 0 ? 'border-b-component-accent-primary' : 'border-gray-300'}`}
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
                    onClick={() => setFocusedTab('시간')}
                    onChange={(event) => handleHourChange(event, '시간')}
                  />
                  {estimatedHour.length > 0 && (
                    <span
                      className={`t3 text-normal ${estimatedHour.length === 1 ? 'ml-[-14px]' : 'ml-[-4px]'} transform`}
                    >
                      시간
                    </span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-col gap-2">
                <span
                  className={`b3 ${estimatedMinute.length > 0 ? 'text-primary' : 'text-neutral'}`}
                >
                  분
                </span>
                <div
                  className={`focus:border-primary relative flex items-center border-0 border-b transition-colors focus:border-b-2 focus:border-b-component-accent-primary focus:outline-none ${focusedTab === '분' || estimatedMinute.length > 0 ? 'border-b-component-accent-primary' : 'border-gray-300'}`}
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
                    onChange={(event) => handleHourChange(event, '분')}
                  />
                  {estimatedMinute.length > 0 && (
                    <span
                      className={`t3 text-normal ${estimatedMinute.length === 1 ? 'ml-[-14px]' : 'ml-[-4px]'} transform`}
                    >
                      분
                    </span>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="일"></TabsContent>
        </Tabs>
      </div>

      <div
        className={`flex flex-col transition-all duration-300 ${focusedTab !== null ? 'mb-[35vh]' : 'pb-[46px]'} gap-6`}
      >
        <div className="flex items-center justify-center space-x-2">
          <label
            htmlFor="onlyMinute"
            className="mt-0.5 rounded-[2px] text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            분만 입력
          </label>
          <Checkbox />
        </div>
        <Button
          variant="primary"
          className="w-full"
          onClick={() => onClick({ estimatedHour, estimatedMinute })}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default EstimatedTimeInput;
