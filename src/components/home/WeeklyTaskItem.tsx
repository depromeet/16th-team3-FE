import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

type WeeklyTaskItemProps = {
  task: {
    id: number;
    title: string;
    dueDate: string;
    dueDay: string;
    dueTime: string;
    timeRequired: string;
    dDayCount: number;
    description?: string;
    dueDateTime?: string;
  };
  onClick: (task: any) => void;
  onDelete: (taskId: number) => void;
};

const WeeklyTaskItem: React.FC<WeeklyTaskItemProps> = ({ task, onClick, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const truncatedTitle = task.title.length > 16 ? task.title.substring(0, 16) + '...' : task.title;

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)
        ) {
          setShowMenu(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(task.id);
  };

  const handleTaskClick = () => {
    if (!showMenu) {
      onClick(task);
    }
  };

  // 날짜 및 시간 표시 형식 수정
  const formatDateTime = () => {
    const month = task.dueDate.substring(5, 7);
    const day = task.dueDate.substring(8, 10);
    
    // 시간 형식 처리
    let timeDisplay = task.dueTime;
    if (!timeDisplay.includes('까지') && (timeDisplay.includes('오후') || timeDisplay.includes('오전'))) {
      timeDisplay = `${timeDisplay}까지`;
    }
    
    return `${month}월 ${day}일 ${task.dueDay} ${timeDisplay}`;
  };

  return (
    <div className="bg-component-gray-secondary rounded-[20px] p-4 mb-4 relative" onClick={handleTaskClick}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="bg-component-accent-secondary text-text-primary rounded-[6px] px-[15px] py-[0px]">
              <span className="c2">D-{task.dDayCount}</span>
            </div>
          </div>
          <div className="c3 flex items-center text-text-primary">
            <span>{formatDateTime()}</span>
            <span className="c3 text-text-neutral mx-1">•</span>
            <Image 
              src="/icons/home/clock.svg" 
              alt="Clock" 
              width={14} 
              height={14} 
              className="mr-[4px] mb-[2px]" 
            />
            <span className="c3 text-text-neutral">{task.timeRequired}</span>
          </div>
          <div className="s2 mt-[3px] text-text-strong">
            {truncatedTitle}
          </div>
        </div>
        <button className="mt-1 px-2" onClick={handleMoreClick}>
          <Image 
            src="/icons/home/dots-vertical.svg" 
            alt="More" 
            width={4} 
            height={18} 
          />
        </button>
      </div>

      {showMenu && (
        <div 
          ref={menuRef}
          className="absolute right-[0px] top-[57px] bg-component-gray-tertiary rounded-[16px] drop-shadow-lg z-10 w-[190px]"
        >
          <div className="c2 p-5 pb-0 text-text-alternative">
            편집
          </div>
          <div 
            className="l3 p-5 pt-3 flex justify-between items-center text-text-red"
            onClick={handleDeleteClick}
          >
            삭제하기
            <Image 
              src="/icons/home/trashcan.svg" 
              alt="Delete" 
              width={16} 
              height={16}
              className="ml-2" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyTaskItem;