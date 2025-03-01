import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface InProgressTaskItemProps {
  task: {
    id: number;
    title: string;
    dueDate: string;
    dueTime: string;
    timeRequired: string;
    startedAt?: string;
  };
  onContinue: (taskId: number) => void;
}

const InProgressTaskItem: React.FC<InProgressTaskItemProps> = ({ task, onContinue }) => {
  const [showRemaining, setShowRemaining] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');

  // 남은 시간 계산 함수
  const calculateRemainingTime = () => {
    if (!task.startedAt) return '';
    
    const now = new Date().getTime();
    let dueDateTime = new Date(task.dueDate);
    
    let hours = 0;
    let timeString = task.dueTime;
    
    if (timeString.includes('오후')) {
      const match = timeString.match(/오후\s+(\d+)시/);
      if (match && match[1]) {
        hours = parseInt(match[1]);
        if (hours !== 12) hours += 12;
      }
    } else if (timeString.includes('오전')) {
      const match = timeString.match(/오전\s+(\d+)시/);
      if (match && match[1]) {
        hours = parseInt(match[1]);
        if (hours === 12) hours = 0;
      }
    }
    
    dueDateTime.setHours(hours, 0, 0, 0);
    const timeLeft = dueDateTime.getTime() - now;
    
    if (timeLeft <= 0) return '00:00:00 남음';
    
    if (timeLeft <= 24 * 60 * 60 * 1000) {
      const h = Math.floor(timeLeft / (1000 * 60 * 60));
      const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} 남음`;
    } else {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const h = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${days}일 ${h}시간 ${m}분 남음`;
    }
  };

  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setShowRemaining(prev => !prev);
    }, 3000);
    
    return () => clearInterval(toggleInterval);
  }, []);

  // 1초마다 남은 시간 업데이트
  useEffect(() => {
    const updateRemainingTime = () => {
      setRemainingTime(calculateRemainingTime());
    };
    
    updateRemainingTime();
    
    const timeInterval = setInterval(updateRemainingTime, 1000);
    
    return () => clearInterval(timeInterval);
  }, [task]);

  return (
    <div className="bg-component-gray-secondary rounded-[12px] p-4 mb-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-component-gray-tertiary rounded-xl p-2 w-12 h-12 flex items-center justify-center">
          <Image
            src="/icons/home/happy-character.svg"
            alt="Task"
            width={32}
            height={32}
          />
        </div>
        <div className="flex-1">
          <p className="text-text-neutral b3">
            {task.dueTime}
          </p>
          <h3 className="s1 text-text-strong t3 truncate" style={{ maxWidth: '240px' }}>
            {task.title}
          </h3>
        </div>
      </div>
      
      <button 
        onClick={() => onContinue(task.id)}
        className="w-full bg-component-accent-primary text-text-strong rounded-[12px] p-4 text-center l2"
      >
        {showRemaining ? (
          <TimeDisplay time={remainingTime} />
        ) : (
          '이어서 몰입'
        )}
      </button>
    </div>
  );
};

// 시간 표시 컴포넌트
const TimeDisplay = ({ time }: { time: string }) => {
  const splitTime = time.split(' ');
  const timeString = splitTime[0] || '00:00:00';
  const timeParts = timeString.split(':');
  const suffix = splitTime.slice(1).join(' ');
  
  // 각 시간 단위를 개별 숫자로 분리해서 관리
  const hours = timeParts[0] || '00';
  const minutes = timeParts[1] || '00';
  const seconds = timeParts[2] || '00';
  
  // 각 자릿수 분리
  const [h1, h2] = hours.split('');
  const [m1, m2] = minutes.split('');
  const [s1, s2] = seconds.split('');
  
  // 이전 자릿수 값 저장을 위한 ref
  const prevDigitsRef = useRef({
    h1: h1, h2: h2,
    m1: m1, m2: m2,
    s1: s1, s2: s2
  });
  
  // 변경된 값 감지
  const hasChangedH1 = h1 !== prevDigitsRef.current.h1;
  const hasChangedH2 = h2 !== prevDigitsRef.current.h2;
  const hasChangedM1 = m1 !== prevDigitsRef.current.m1;
  const hasChangedM2 = m2 !== prevDigitsRef.current.m2;
  const hasChangedS1 = s1 !== prevDigitsRef.current.s1;
  const hasChangedS2 = s2 !== prevDigitsRef.current.s2;
  
  // 이전 값 저장
  useEffect(() => {
    prevDigitsRef.current = {
      h1, h2, m1, m2, s1, s2
    };
  }, [timeString]);

  return (
    <span className="inline-flex items-center justify-center">
      {hasChangedH1 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`h1-${h1}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {h1}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{h1}</span>
      )}
      
      {hasChangedH2 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`h2-${h2}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {h2}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{h2}</span>
      )}
      
      <span>:</span>
      
      {hasChangedM1 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`m1-${m1}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {m1}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{m1}</span>
      )}
      
      {hasChangedM2 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`m2-${m2}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {m2}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{m2}</span>
      )}
      
      <span>:</span>
      
      {hasChangedS1 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`s1-${s1}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {s1}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{s1}</span>
      )}
      
      {hasChangedS2 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`s2-${s2}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {s2}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{s2}</span>
      )}
      
      {suffix && <span className="ml-1">{suffix}</span>}
    </span>
  );
};

export default InProgressTaskItem;