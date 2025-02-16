import ClearableInput from '@/components/clearableInput/ClearableInput';
import { useState } from 'react';

const TaskInput = () => {
  const [task, setTask] = useState('');

  return (
    <div>
      <ClearableInput value={task} onChange={(e) => setTask(e.target.value)} />
    </div>
  );
};

export default TaskInput;
