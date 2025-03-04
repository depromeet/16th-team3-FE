'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/header';
import Image from 'next/image';
import TaskDetailSheet from '@/app/(home)/_components/TaskDetailSheet';
import WeeklyTaskItem from '@/app/(home)/_components/WeeklyTaskItem';

interface Task {
    id: number;
    title: string;
    dueDate: string;
    dueDay: string;
    dueTime: string;
    timeRequired: string;
    dDayCount: number;
    description: string;
  }

const SAMPLE_WEEKLY_TASKS = [
  {
    id: 1,
    title: '산학 발표 준비하기',
    dueDate: '2025-02-10',
    dueDay: '(화)',
    dueTime: '오후 6시까지',
    timeRequired: '3시간 소요',
    dDayCount: 1,
    description: '산학 협력 프로젝트 중간 발표 준비하기'
  },
  {
    id: 2,
    title: '산학 발표 준비하기',
    dueDate: '2025-02-11',
    dueDay: '(수)',
    dueTime: '오후 6시까지',
    timeRequired: '3시간 소요',
    dDayCount: 2,
    description: '산학 협력 프로젝트 최종 발표 준비하기'
  },
  {
    id: 3,
    title: '블로그 글쓰기 챌린지하기',
    dueDate: '2025-02-12',
    dueDay: '(목)',
    dueTime: '오후 6시까지',
    timeRequired: '1일 소요',
    dDayCount: 3,
    description: '기술 블로그 첫 번째 글 작성하기'
  },
  {
    id: 4,
    title: '블로그 글쓰기 챌린지하기',
    dueDate: '2025-02-13',
    dueDay: '(금)',
    dueTime: '오후 6시까지',
    timeRequired: '1일 소요',
    dDayCount: 4,
    description: '기술 블로그 두 번째 글 작성하기'
  },
  {
    id: 5,
    title: '블로그 글쓰기 챌린지하기',
    dueDate: '2025-02-14',
    dueDay: '(토)',
    dueTime: '오후 6시까지',
    timeRequired: '1일 소요',
    dDayCount: 5,
    description: '기술 블로그 세 번째 글 작성하기'
  },
  {
    id: 6,
    title: '블로그 글쓰기 챌린지하기',
    dueDate: '2025-02-15',
    dueDay: '(일)',
    dueTime: '오후 6시까지',
    timeRequired: '1일 반 소요',
    dDayCount: 6,
    description: '기술 블로그 네 번째 글 작성하기'
  }
];

const WeeklyTasksPage = () => {
  const router = useRouter();
  
  const [weeklyTasks, setWeeklyTasks] = useState<Task[]>(SAMPLE_WEEKLY_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailSheetOpen(true);
  };

  const handleCloseDetailSheet = () => {
    setIsDetailSheetOpen(false);
  };

  const handleStartTask = () => {
    console.log('태스크 시작:', selectedTask);
    setIsDetailSheetOpen(false);
    // 태스크 시작 관련 로직
  };

  const handleDeleteTask = (taskId: number) => {
    console.log('삭제할 ID:', taskId);
    // 특정 ID의 할일을 삭제
    setWeeklyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    // 삭제된 항목이 현재 상세 시트에 표시 중이라면 시트 닫기
    if (isDetailSheetOpen && selectedTask && selectedTask.id === taskId) {
      setIsDetailSheetOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      <Header title="이번주 할일" />

      <main className="flex-1 mt-16 px-5 pb-24">
        {weeklyTasks.length > 0 ? (
          <>
            <div className="flex justify-end mb-4">
              <button className="c1 bg-component-gray-primary text-text-normal rounded-[8px] px-3 py-2">
                마감일 가까운 순
              </button>
            </div>

            {weeklyTasks.map(task => (
              <WeeklyTaskItem
                key={task.id}
                task={task}
                onClick={handleTaskClick}
                onDelete={handleDeleteTask}
              />
            ))}
          </>
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

      <TaskDetailSheet
        isOpen={isDetailSheetOpen}
        onClose={handleCloseDetailSheet}
        task={selectedTask || { title: '', dueDate: '', dueTime: '' }}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default WeeklyTasksPage;