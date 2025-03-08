import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';

type AllTaskItemProps = {
  task: Task;
  onClick: (task: Task) => void;
  onDelete: (taskId: number) => void;
};

const AllTaskItem: React.FC<AllTaskItemProps> = ({ task, onClick, onDelete }) => {
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

  const renderDayChip = () => {
    // D-Day 계산 - 음수인 경우 D+로 표시
    let dDayText;
    
    if (task.dDayCount > 0) {
      // 미래 날짜 (D-Day)
      dDayText = task.dDayCount > 99 ? 'D-99+' : `D-${task.dDayCount}`;
    } else if (task.dDayCount < 0) {
      // 지난 날짜 (D+Day) - 음수값을 양수로 변환
      const daysPassed = Math.abs(task.dDayCount);
      dDayText = daysPassed > 99 ? 'D+99+' : `D+${daysPassed}`;
    } else {
      // 오늘인 경우
      dDayText = 'D-DAY';
    }
  
    if (task.type === 'today') {
      return (
        <Button 
            variant="hologram" 
            size="sm"
            className="text-text-inverse z-10 rounded-[6px] px-[15px] py-[3px] h-auto"
        >
            <span className="c2">D-DAY</span>
        </Button>
      );
    } else if (task.type === 'weekly') {
      return (
        <div className="bg-component-accent-secondary text-text-primary rounded-[6px] px-[15px] py-[0px]">
          <span className="c2">{dDayText}</span>
        </div>
      );
    } else {
      return (
        <div className="bg-component-gray-tertiary text-text-neutral rounded-[6px] px-[15px] py-[0px]">
          <span className="c2">{dDayText}</span>
        </div>
      );
    }
  };  

  // 날짜 및 시간 표시 형식 수정
  const formatDateTime = () => {
    const month = task.dueDate.substring(5, 7);
    const day = task.dueDate.substring(8, 10);
    
    // 오늘 날짜와 비교
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    const isToday = 
      today.getDate() === taskDate.getDate() &&
      today.getMonth() === taskDate.getMonth() &&
      today.getFullYear() === taskDate.getFullYear();
    
    // 시간 형식 처리
    let timeDisplay = task.dueTime;
    if (task.dueTime.includes('자정')) {
      timeDisplay = isToday ? '오늘 자정까지' : '자정까지';
    } else if (task.dueTime.includes('오후') || task.dueTime.includes('오전')) {
      // "오후 n시까지" 또는 "오전 n시까지" 형식인지 확인
      if (!task.dueTime.includes('까지')) {
        timeDisplay = `${task.dueTime}까지`;
      }
      
      if (isToday) {
        timeDisplay = `오늘 ${timeDisplay}`;
      }
    }
    
    return `${month}월 ${day}일 ${task.dueDay} ${timeDisplay}`;
  };

  return (
    <div className="bg-component-gray-secondary rounded-[20px] p-4 mb-4 relative" onClick={handleTaskClick}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {renderDayChip()}
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
        <button ref={buttonRef} className="mt-1 px-2" onClick={handleMoreClick}>
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

export default AllTaskItem;