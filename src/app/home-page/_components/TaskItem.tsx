'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parseDateAndTime, calculateRemainingTime } from '@/utils/dateFormat';
import { TaskStatus } from '@/types/task';

type TaskItemProps = {
  title: string;
  dueTime: string;
  dueDate: string;
  taskId: number;
  onClick: () => void;
  onDelete: () => void;
  onPreviewStart?: () => void;
  ignoredAlerts?: number;
  timeRequired: string;
  resetAlerts?: (taskId: number) => void;
  dueDatetime?: string;
  status?: TaskStatus;
};

const TaskItem: React.FC<TaskItemProps> = ({
  title,
  dueTime,
  dueDate,
  taskId,
  onClick,
  timeRequired,
  onDelete,
  onPreviewStart = () => {},
  ignoredAlerts = 0, // 기본값은 0
  resetAlerts = () => {},
  dueDatetime,
  status,
}) => {
  const router = useRouter();
  const [showUrgentBottomSheet, setShowUrgentBottomSheet] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  
  // 진행 중인 태스크인지 확인
  const isInProgress = status === 'inProgress';

  // 남은 시간 계산 함수
  const calculateRemainingTimeLocal = useCallback(() => {
    let dueDateObj;
    if (dueDatetime) {
      dueDateObj = new Date(dueDatetime);
    } else {
      dueDateObj = parseDateAndTime(dueDate, dueTime);
    }
  
    // 남은 시간 계산
    const now = new Date();
    const diffMs = dueDateObj.getTime() - now.getTime();
    
    // isUrgent 상태 업데이트 (1시간 이내거나 ignoredAlerts가 3이상이거나 status가 procrastinating인 경우)
    const urgent = 
      (diffMs <= 60 * 60 * 1000 && diffMs > 0) || 
      ignoredAlerts >= 3 || 
      status === 'procrastinating';
      
    setIsUrgent(urgent);
  
    return calculateRemainingTime(dueDateObj);
  }, [dueDate, dueTime, dueDatetime, ignoredAlerts, status]);

  // 1초마다 남은 시간 업데이트
  useEffect(() => {
    setRemainingTime(calculateRemainingTimeLocal());
  
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTimeLocal());
    }, 1000);
  
    return () => clearInterval(interval);
  }, [calculateRemainingTimeLocal]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isInProgress) {
      router.push(`/focus?taskId=${taskId}`);
    } else if (isUrgent) {
      setShowUrgentBottomSheet(true);
    } else {
      onPreviewStart();
    }
  };

  const handleCloseUrgentSheet = () => {
    setShowUrgentBottomSheet(false);
  };

  const handleStart = () => {
    resetAlerts(taskId);
    router.push(`/focus?taskId=${taskId}`);
    setShowUrgentBottomSheet(false);
  };

  // 오늘 날짜 확인
  const isToday = useCallback(() => {
    const today = new Date();
    const taskDate = new Date(dueDate);

    return (
      today.getDate() === taskDate.getDate() &&
      today.getMonth() === taskDate.getMonth() &&
      today.getFullYear() === taskDate.getFullYear()
    );
  }, [dueDate]);

  // 시간 표시 형식 수정
  const formatDueTime = useCallback(() => {
    // 자정인 경우
    if (dueTime.includes('자정')) {
      return '오늘 자정까지';
    }

    // 시간 텍스트에 "오후" 또는 "오전"이 포함되어 있는지 확인
    if (dueTime.includes('오후') || dueTime.includes('오전')) {
      // "까지"가 없으면 추가
      const formattedTime = dueTime.includes('까지')
        ? dueTime
        : `${dueTime}까지`;
      return `오늘 ${formattedTime}`;
    }

    // 그 외 경우 (예: "3시간 소요")
    return dueTime;
  }, [dueTime]);

  return (
    <>
      <div
        className="mb-4 rounded-[20px] bg-component-gray-secondary p-4"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="c3 flex items-center text-text-primary">
              <span className="flex items-center">
                <span>{formatDueTime()}</span>
                <span className="c3 mx-1 text-text-neutral">•</span>
                <Image
                  src="/icons/home/clock.svg"
                  alt="Character"
                  width={14}
                  height={14}
                  className="mb-[2px] mr-[4px]"
                />
                <span className="c3 text-text-neutral">
                  {timeRequired || '1시간 소요'}
                </span>
              </span>
            </div>
            <div className="s2 mt-[3px] text-text-strong">{title}</div>
          </div>
          <button
            className={`l4 rounded-[10px] px-[12px] py-[9.5px] ${
              isUrgent
                ? 'bg-hologram text-text-inverse'
                : isInProgress
                  ? 'bg-component-accent-tertiary text-text-strong'
                  : 'bg-component-accent-primary text-text-strong'
            }`}
            onClick={handleButtonClick}
          >
            {isInProgress 
              ? '이어서 몰입' 
              : isUrgent 
                ? '지금 시작' 
                : '미리 시작'}
          </button>
        </div>
      </div>

      {showUrgentBottomSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
          <div className="flex w-full flex-col items-center rounded-t-[28px] bg-component-gray-secondary p-4 pt-10">
            <h2 className="t3 text-center text-text-strong">{title}</h2>
            <p className="t3 mb-2 text-center text-text-strong">
              더 늦기 전에 바로 시작할까요?
            </p>
            <p className="b3 mb-7 text-center text-text-neutral">
              마감까지 {remainingTime}
            </p>
            <button
              className="l2 mb-3 w-full rounded-xl bg-component-accent-primary py-4 text-white"
              onClick={handleStart}
            >
              지금 시작
            </button>

            <button
              className="l2 w-full py-4 text-text-neutral"
              onClick={handleCloseUrgentSheet}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;