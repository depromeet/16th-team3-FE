import ClearableInput from '@/components/clearableInput/ClearableInput';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import TimeSelectedComponent from '../timeSelectedComponent/TimeSelectedComponent';
import { TimePickerType } from '@/types/time';
import DateSelectedComponent from '../dateSelectedComponent/DateSelectedComponent';

interface TaskInputProps {
  onClick: ({
    task,
    deadlineDate,
    deadlineTime,
  }: {
    task: string;
    deadlineDate: Date;
    deadlineTime: TimePickerType;
  }) => void;
}

const MAX_TASK_LENGTH = 15;
const WAITING_TIME = 200;

const TaskInput = ({ onClick }: TaskInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [task, setTask] = useState<string>('');
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [deadlineTime, setDeadlineTime] = useState<TimePickerType | undefined>(
    undefined,
  );
  const [isFocused, setIsFocused] = useState(true);

  const isInvalid =
    task.length > MAX_TASK_LENGTH ||
    task.length === 0 ||
    !deadlineDate ||
    !deadlineTime;

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

  useEffect(() => {
    if (inputRef.current)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          setIsFocused(true);
        }
      }, WAITING_TIME);
  }, []);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div>
        <div className="pb-10 pt-4">
          <span className="t2">어떤 일의 마감이 급하신가요?</span>
        </div>
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
          onClick={() =>
            onClick({
              task,
              deadlineDate: deadlineDate as Date,
              deadlineTime: deadlineTime as TimePickerType,
            })
          }
          disabled={isInvalid}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default TaskInput;
