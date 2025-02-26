import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type TaskDetailSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  task: {
    title: string;
    dueDate: string;
    dueTime: string;
    description?: string;
  };
  onStartTask: () => void;
};

const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({
  isOpen,
  onClose,
  task,
  onStartTask
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-background-primary rounded-t-[20px] w-full p-5 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="t2 text-text-strong">할 일 상세</h3>
          <button onClick={onClose}>
            <Image
              src="/icons/home/close.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center text-text-alternative b4 mb-2">
            <span>오늘 자정까지</span>
            <span className="mx-1">•</span>
            <span>{task.dueTime} 소요</span>
          </div>
          <h4 className="t1 text-text-strong mb-2">{task.title}</h4>
          {task.description && (
            <p className="b3 text-text-normal">{task.description}</p>
          )}
        </div>
        
        <Button 
          variant="point" 
          size="default"
          className="w-full l2 text-text-inverse rounded-[12px] py-[16.5px]"
          onClick={onStartTask}
        >
          미리 시작
        </Button>
      </div>
    </div>
  );
};

export default TaskDetailSheet;