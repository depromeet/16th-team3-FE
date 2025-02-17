import ClearableInput from '@/components/clearableInput/ClearableInput';
import { useEffect, useRef, useState } from 'react';

const WAITING_TIME = 300;

const TaskInput = () => {
  const [task, setTask] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, WAITING_TIME);
    }
  }, []);

  return (
    <div>
      <ClearableInput ref={inputRef} value={task} onChange={handleTaskChange} />
    </div>
  );
};

export default TaskInput;
