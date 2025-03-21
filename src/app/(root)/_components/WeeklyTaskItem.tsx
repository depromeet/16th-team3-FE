'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Task } from '@/types/task';

type WeeklyTaskItemProps = {
  task: Task;
  onClick: (task: Task) => void;
  onDelete: (taskId: number) => void;
};

const WeeklyTaskItem: React.FC<WeeklyTaskItemProps> = ({
  task,
  onClick,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const truncatedTitle =
    task.title.length > 16 ? task.title.substring(0, 16) + '...' : task.title;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
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
    const month = Number(task.dueDate.substring(5, 7)).toString();
    const day = Number(task.dueDate.substring(8, 10)).toString();

    // 시간 형식 처리
    let timeDisplay = task.dueTime;
    if (
      !timeDisplay.includes('까지') &&
      (timeDisplay.includes('오후') || timeDisplay.includes('오전'))
    ) {
      timeDisplay = `${timeDisplay}까지`;
    }

    return `${month}월 ${day}일 ${task.dueDay} ${timeDisplay}`;
  };

  return (
    <div
      className="relative mb-4 rounded-[20px] bg-component-gray-secondary p-4"
      onClick={handleTaskClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center">
            <div className="rounded-[6px] bg-component-accent-secondary px-[15px] py-[0px] text-text-primary">
              <span className="c2">D-{task.dDayCount}</span>
            </div>
          </div>
          <div className="c3 flex items-center text-text-primary">
            <span>{formatDateTime()}</span>
            <span className="c3 mx-1 text-text-neutral">•</span>
            <Image
              src="/icons/home/clock.svg"
              alt="Clock"
              width={14}
              height={14}
              className="mr-[4px]"
            />
            <span className="c3 text-text-neutral">{task.timeRequired}</span>
          </div>
          <div className="s2 mt-[3px] text-text-strong">{truncatedTitle}</div>
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
          className="absolute right-[0px] top-[57px] z-10 w-[190px] rounded-[16px] bg-component-gray-tertiary drop-shadow-lg"
        >
          <div className="c2 p-5 pb-0 text-text-alternative">편집</div>
          <div
            className="l3 flex items-center justify-between p-5 pt-3 text-text-red"
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
