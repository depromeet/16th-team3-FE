import React from 'react';
import Image from 'next/image';

type TaskItemProps = {
  title: string;
  dueTime: string;
  dueDate: string;
  onClick: () => void;
  onPreviewStart?: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ 
  title, 
  dueTime, 
  dueDate, 
  onClick,
  onPreviewStart = () => {} 
}) => {
  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreviewStart();
  };

  return (
    <div 
      className="bg-component-gray-secondary rounded-[20px] p-4 mb-4"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="c3 flex items-center text-text-primary">
            <span className="flex items-center">
              <span>오늘 자정까지</span>
              <span className="c3 text-text-neutral mx-1">•</span>
              <Image
                src="/icons/home/clock.svg"
                alt="Character"
                width={14}
                height={14}
                className="mr-[4px] mb-[2px]"
                />
              <span className="c3 text-text-neutral">{dueTime} 소요</span>
            </span>
          </div>
          <div className="s2 mt-[3px] text-text-strong">
            {title}
          </div>
        </div>
        <button 
          className="l4 bg-component-accent-primary text-text-strong rounded-[10px] px-[12px] py-[9.5px]"
          onClick={handlePreviewClick}
        >
          미리 시작
        </button>
      </div>
    </div>
  );
};

export default TaskItem;