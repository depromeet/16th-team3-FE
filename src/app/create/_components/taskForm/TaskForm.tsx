import ClearableInput from '@/components/clearableInput/ClearableInput';
import { useState } from 'react';

const TaskInput = () => {
  const [task, setTask] = useState<string>('');

  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  return (
    <div>
      <ClearableInput value={task} onChange={handleTaskChange} />
    </div>
  );
};

export default TaskInput;
