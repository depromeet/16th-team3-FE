'use client';

import { usePatchTaskHoldOff } from '@/hooks/useTask';
import type { TaskResponse } from '@/types/task';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Image from 'next/image';
import CompleteButton from './_component/CompleteButton';
import CountSelector from './_component/CountSelector';
import Header from './_component/Header';
import TaskDetails from './_component/TaskDetails';
import TimesList from './_component/TimesList';

const REMINDER_LIMITS = {
  MIN: 1,
  MAX: 3,
} as const;

const DEFAULT_VALUES = {
  INTERVAL: 15,
  COUNT: 1,
} as const;

interface ReminderTime {
  index: number;
  time: string;
}

interface ActionRemindPageClientProps {
  initialTask: TaskResponse;
}

const calculateReminderTimes = (
  count: number,
  interval: number,
): ReminderTime[] => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(now.getTime() + interval * 60000 * (i + 1));
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const period = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : hours;

    return {
      index: i + 1,
      time: `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`,
    };
  });
};

// 리마인더 카운트 관리 커스텀 훅
const useReminderCount = (initialCount: number = DEFAULT_VALUES.COUNT) => {
  const [count, setCount] = useState(initialCount);

  const handleCountChange = (action: 'increase' | 'decrease') => {
    setCount((prev) => {
      if (action === 'increase' && prev < REMINDER_LIMITS.MAX) return prev + 1;
      if (action === 'decrease' && prev > REMINDER_LIMITS.MIN) return prev - 1;
      return prev;
    });
  };

  return { count, handleCountChange };
};

function formatTimestamp(timestamp: string): string {
  return timestamp.replace('T', ' ');
}

export default function ActionRemindPageClient({
  initialTask,
}: ActionRemindPageClientProps) {
  const { count, handleCountChange } = useReminderCount();
  const [selectedInterval, setSelectedInterval] = useState<number>(
    DEFAULT_VALUES.INTERVAL,
  );
  const { mutate } = usePatchTaskHoldOff();
  const router = useRouter();
  const handlePatch = () => {
    console.log(selectedInterval, count);
    console.log(initialTask.triggerActionAlarmTime);
    console.log(formatTimestamp(initialTask.triggerActionAlarmTime));
    mutate({
      taskId: initialTask?.id.toString() ?? '',
      data: {
        remindInterval: selectedInterval,
        remindCount: count,
        remindBaseTime: formatTimestamp(initialTask.triggerActionAlarmTime),
      },
    });
  };

  const reminderTimes = calculateReminderTimes(count, selectedInterval);

  return (
    <div className="flex h-full flex-col bg-background-primary pb-[30px]">
      {/* TODO : 헤더 컴포넌트로 변경 예정 */}
      <div className="flex items-center px-5 py-[14px]">
        <Image
          src="/arrow-left.svg"
          alt="왼쪽 화살표"
          width={24}
          height={24}
          onClick={() => router.back()}
        />
      </div>
      <Header maxNotificationCount={REMINDER_LIMITS.MAX} />
      <TaskDetails
        taskName={initialTask?.name ?? ''}
        remainingTime="4시간"
        selectedInterval={selectedInterval}
        onIntervalChange={setSelectedInterval}
      />
      <CountSelector
        count={count}
        onIncrease={() => handleCountChange('increase')}
        onDecrease={() => handleCountChange('decrease')}
      />
      <TimesList times={reminderTimes} />
      <CompleteButton onClick={handlePatch} />
    </div>
  );
}
