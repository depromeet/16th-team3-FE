import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parseDateAndTime, calculateRemainingTime } from '@/utils/dateFormat';

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
  dueDateTime?: string;
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
  dueDateTime
}) => {
  const router = useRouter();
  const [showUrgentBottomSheet, setShowUrgentBottomSheet] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const isUrgent = ignoredAlerts >= 3;
  
  // 남은 시간 계산 함수
  const calculateRemainingTimeLocal = () => {
    // dueDateTime이 있으면 사용, 없으면 dueDate와 dueTime에서 계산
    let dueDateObj;
    if (dueDateTime) {
      dueDateObj = new Date(dueDateTime);
    } else {
      dueDateObj = parseDateAndTime(dueDate, dueTime);
    }
    
    return calculateRemainingTime(dueDateObj);
  };
  
  // 1초마다 남은 시간 업데이트
  useEffect(() => {
    setRemainingTime(calculateRemainingTimeLocal());
    
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTimeLocal());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [dueDate, dueTime, dueDateTime]);
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isUrgent) {
      // 알림을 3회 이상 무시한 경우 바텀시트 표시
      setShowUrgentBottomSheet(true);
    } else {
      // 그렇지 않은 경우 일반적인 미리 시작 처리
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
  const isToday = () => {
    const today = new Date();
    const taskDate = new Date(dueDate);
    
    return (
      today.getDate() === taskDate.getDate() &&
      today.getMonth() === taskDate.getMonth() &&
      today.getFullYear() === taskDate.getFullYear()
    );
  };
  
  // 시간 표시 형식 수정
  const formatDueTime = () => {
    // 자정인 경우
    if (dueTime.includes('자정')) {
      return '오늘 자정까지';
    }
    
    // 시간 텍스트에 "오후" 또는 "오전"이 포함되어 있는지 확인
    if (dueTime.includes('오후') || dueTime.includes('오전')) {
      // "까지"가 없으면 추가
      const formattedTime = dueTime.includes('까지') ? dueTime : `${dueTime}까지`;
      return `오늘 ${formattedTime}`;
    }
    
    // 그 외 경우 (예: "3시간 소요")
    return dueTime;
  };

  return (
    <>
      <div 
        className="bg-component-gray-secondary rounded-[20px] p-4 mb-4"
        onClick={onClick}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="c3 flex items-center text-text-primary">
              <span className="flex items-center">
                <span>{formatDueTime()}</span>
                <span className="c3 text-text-neutral mx-1">•</span>
                <Image
                  src="/icons/home/clock.svg"
                  alt="Character"
                  width={14}
                  height={14}
                  className="mr-[4px] mb-[2px]"
                  />
                <span className="c3 text-text-neutral">{timeRequired || '1시간 소요'}</span>
              </span>
            </div>
            <div className="s2 mt-[3px] text-text-strong">
              {title}
            </div>
          </div>
          <button 
            className={`l4 rounded-[10px] px-[12px] py-[9.5px] ${
              isUrgent 
                ? 'bg-hologram text-text-inverse' 
                : 'bg-component-accent-primary text-text-strong'
            }`}
            onClick={handleButtonClick}
          >
            {isUrgent ? '지금 시작' : '미리 시작'}
          </button>
        </div>
      </div>
      
      {showUrgentBottomSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
          <div className="w-full bg-component-gray-secondary rounded-t-[28px] p-4 pt-10 flex flex-col items-center">
            <h2 className="t3 text-text-strong text-center">{title}</h2>
            <p className="t3 text-text-strong text-center mb-2">더 늦기 전에 바로 시작할까요?</p>
            <p className="b3 text-text-neutral text-center mb-7">마감까지 {remainingTime}</p>
            <button
              className="w-full bg-component-accent-primary text-white rounded-xl py-4 mb-3 l2"
              onClick={handleStart}
            >
              지금 시작
            </button>
            
            <button
              className="w-full text-text-neutral py-4 l2"
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