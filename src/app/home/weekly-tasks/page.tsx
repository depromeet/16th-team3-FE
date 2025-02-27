'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/header';
import TaskItem from '@/components/home/TaskItem';
import Image from 'next/image';
import TaskDetailSheet from '@/components/home/TaskDetailSheet';
import { Button } from '@/components/ui/button';

const SAMPLE_WEEKLY_TASKS = [
  {
    id: 1,
    title: '디프만 와이어프레임 수정하기',
    dueDate: '2025-02-25',
    dueTime: '3시간',
    description: '디프만 프로젝트의 와이어프레임을 수정해야 합니다.'
  },
  {
    id: 2,
    title: '주간 보고서 작성',
    dueDate: '2025-02-26',
    dueTime: '2시간',
    description: '이번 주 진행 상황에 대한 보고서를 작성해야 합니다.'
  },
  {
    id: 3,
    title: 'Figma 디자인 업데이트',
    dueDate: '2025-02-27',
    dueTime: '1시간',
    description: '최신 피드백 반영하여 디자인 업데이트하기.'
  }
];

const WeeklyTasksPage = () => {
  const router = useRouter();
  
  // 이번주 할일 데이터 - 빈 배열로 설정하여 '할일 없음' 화면 표시
  const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsDetailSheetOpen(true);
  };

  const handleCloseDetailSheet = () => {
    setIsDetailSheetOpen(false);
  };

  const handleStartTask = () => {
    console.log('태스크 시작:', selectedTask);
    setIsDetailSheetOpen(false);
    // 태스크 시작 관련 로직 추가
  };

  const handleAddTask = () => {
    console.log('할 일 추가');
    // 할 일 추가 로직 추가
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      <Header title="이번주 할일" />

      <main className="flex-1 mt-16 px-5 overflow-y-auto mb-24">
        {weeklyTasks.length > 0 ? (
          weeklyTasks.map(task => (
            <TaskItem
              key={task.id}
              title={task.title}
              dueDate={task.dueDate}
              dueTime={task.dueTime}
              onClick={() => handleTaskClick(task)}
            />
          ))
        ) : (
          <div className="text-center px-4 flex flex-col items-center justify-center h-full mt-[120px]">
            <div className="mb-[50px] mt-[50px]">
              <Image
                src="/icons/home/rocket.svg"
                alt="Rocket"
                width={64}
                height={64}
                className="mx-auto w-auto h-auto"
              />
            </div>
            <h2 className="t3 mt-[8px] mb-[8px] text-text-strong">이번주 할일이 없어요.<br />마감할 일을 추가해볼까요?</h2>
            <p className="b3 text-text-alternative">
              미루지 않도록 알림을 보내 챙겨드릴게요.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WeeklyTasksPage;