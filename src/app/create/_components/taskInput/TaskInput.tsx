import ClearableInput from '@/components/clearableInput/ClearableInput';
import DateSelectedComponent from '@/app/create/_components/DateSelectedComponent/DateSelectedComponent';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const WAITING_TIME = 300;
const MAX_TASK_LENGTH = 15;

interface TaskInputProps {
  onClick: (task: string) => void;
}

const TaskInput = ({ onClick }: TaskInputProps) => {
  const [task, setTask] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);

  const isInvalid = task.length > MAX_TASK_LENGTH || task.length === 0;

  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, WAITING_TIME);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="pb-10 pt-4">
        <span className="t2">어떤 일의 마감이 급하신가요?</span>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <ClearableInput
            ref={inputRef}
            value={task}
            onChange={handleTaskChange}
          />
          {task.length > MAX_TASK_LENGTH && (
            <p className="mt-2 text-sm text-red-500">
              최대 16자 이내로 입력할 수 있어요.
            </p>
          )}
        </div>

        <DateSelectedComponent
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
        />
      </div>

      <Button
        variant="primary"
        className="mt-6"
        onClick={() => onClick(task)}
        disabled={isInvalid}
      >
        다음
      </Button>
    </div>
  );
};

export default TaskInput;
