'use client';

import { Button } from '@/components/ui/button';
import { TimePickerType } from '@/types/create';
import { formatDistanceToNow, set } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import HeaderTitle from '../headerTitle/HeaderTitle';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';

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
  const [estimatedHour, setEstimatedHour] = useState<string>('');
  const [estimatedMinute, setEstimatedMinute] = useState<string>('');
  const [isFocused, setIsFocused] = useState(true);
  const [currentTab, setCurrentTab] = useState('시간');

  const formattedDeadline = formatDistanceToNow(
    convertDeadlineToDate(deadlineDate, deadlineTime),
    { addSuffix: true, locale: ko },
  );

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div>
        <HeaderTitle title="할일이 얼마나 걸릴 것 같나요?" />
        <div>
          <div className="flex gap-1">
            <span className="b2 text-text-alternative">할 일:</span>
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
              value="분"
              className={`l4 w-full p-[10px] ${currentTab === '분' ? 'bg-component-gray-tertiary' : ''} rounded-[8px]`}
            >
              분
            </TabsTrigger>
          </TabsList>
          <TabsContent value="시간">시간</TabsContent>
          <TabsContent value="분">분</TabsContent>
        </Tabs>
      </div>
      <div
        className={`transition-all duration-300 ${isFocused ? 'mb-[48vh]' : 'pb-[46px]'}`}
      >
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
