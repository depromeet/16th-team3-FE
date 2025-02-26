'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import TaskItem from '@/components//home/TaskItem';
import TaskDetailSheet from '@/components/home/TaskDetailSheet';

// 샘플 이번주 할 일 데이터
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
    title: '일이삼사오육칠팔구십일이삼사오육',
    dueDate: '2025-02-25',
    dueTime: '3시간',
    description: '긴 제목의 태스크 예시입니다.'
  },
  {
    id: 3,
    title: '주간 보고서 작성',
    dueDate: '2025-02-26',
    dueTime: '2시간',
    description: '이번 주 진행 상황에 대한 보고서를 작성해야 합니다.'
  }
];

const HomePage = () => {
  // 화면 분기 처리를 위한 상태
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<any[]>(SAMPLE_WEEKLY_TASKS);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // 첫 방문 시 툴팁 표시 관련 로직
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setShowTooltip(false);
    } else {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  // 마감이 임박한 순으로 정렬된 이번주 할 일 (최대 2개)
  const topWeeklyTasks = weeklyTasks
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 2);

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

  // 화면 분기 처리
  // 1. 오늘 할 일이 없고, 이번주 할 일도 없는 경우 (초기 화면)
  const isEmptyState = todayTasks.length === 0 && weeklyTasks.length === 0;
  
  // 2. 오늘 할 일이 없고, 이번주 할 일은 있는 경우 (현재 구현할 부분)
  const hasWeeklyTasksOnly = todayTasks.length === 0 && weeklyTasks.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      <header className="fixed top-0 left-0 right-0 bg-background-primary z-10">
        <div className="flex justify-between items-center px-[20px] py-[15px]">
          <Image
            src="/icons/home/spurt.svg"
            alt="SPURT"
            width={50}
            height={20}
            priority
            className="w-[50px]"
          />
          <Image
            src="/icons/home/mypage.svg"
            alt="My Page"
            width={20}
            height={20}
            className="w-[20px] h-[19px]"
          />
        </div>
        <div className="px-[20px] py-[11px]">
          <div className="flex space-x-4">
            <div>
              <span className="t3 text-text-normal">오늘 할일</span>{" "}
              <span className="s1 text-text-primary">0</span>
            </div>
            <div>
              <span className="t3 text-text-disabled">전체 할일</span>{" "}
              <span className="s1 text-text-disabled">{weeklyTasks.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-24 mb-40 px-5">
        {isEmptyState && (
          <div className="text-center px-4 flex flex-col items-center justify-center h-full">
            <div className="mb-[50px] mt-[50px]">
              <Image
                src="/icons/home/rocket.svg"
                alt="Rocket"
                width={64}
                height={64}
                className="mx-auto w-auto h-auto"
              />
            </div>
            <h2 className="t3 mt-[8px] mb-[8px] text-text-strong">마감 할 일을 추가하고<br />바로 시작해볼까요?</h2>
            <p className="b3 text-text-alternative">
              미루지 않도록 알림을 보내 챙겨드릴게요.
            </p>
          </div>
        )}

        {hasWeeklyTasksOnly && (
          <div className="mt-4">
            <div className="mb-[40px]">
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/icons/home/xman.svg"
                  alt="Character"
                  width={80}
                  height={80}
                  className="mb-[40px] mt-[60px]"
                />
                <h2 className="t3 text-text-strong text-center">오늘 마감할 일이 없어요.</h2>
                <h2 className="t3 text-text-strong text-center mb-2">이번주 할일 먼저 해볼까요?</h2>
                <p className="b3 text-text-alternative text-center">이번주 안에 끝내야 하는 할 일이에요</p>
              </div>
            </div>

            <div className="mb-4">
              {topWeeklyTasks.map(task => (
                <TaskItem
                  key={task.id}
                  title={task.title}
                  dueDate={task.dueDate}
                  dueTime={task.dueTime}
                  onClick={() => handleTaskClick(task)}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <button
                className="t3 text-text-primary flex items-center"
                onClick={() => console.log('이번주 할 일 더보기')}
              >
                이번주 할일 더보기
                <Image
                  src="/icons/home/arrow-right.svg"
                  alt="Arrow Right"
                  width={16}
                  height={16}
                  className="ml-1"
                />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-8 left-0 right-0 bg-background-primary z-10">
        <div className="p-5 flex justify-end">
          {showTooltip && (
            <div className="b3 text-text-normal absolute bottom-24 right-4 bg-component-gray-tertiary rounded-[12px] px-4 py-3 shadow-lg">
              지금 바로 할 일을 추가해보세요!
              <div className="absolute -bottom-2 right-12 w-4 h-4 bg-component-gray-tertiary rotate-45"></div>
            </div>
          )}
          <Button 
            variant="point" 
            size="md"
            className="l2 text-text-inverse flex items-center gap-2 rounded-full py-[16.5px]"
            onClick={handleAddTask}
          >
            <Image
              src="/icons/home/plus.svg"
              alt="Add Task"
              width={16}
              height={16}
            />
            할일
          </Button>
        </div>
      </footer>

      {/* 할 일 상세 바텀 시트 */}
      <TaskDetailSheet
        isOpen={isDetailSheetOpen}
        onClose={handleCloseDetailSheet}
        task={selectedTask || { title: '', dueDate: '', dueTime: '' }}
        onStartTask={handleStartTask}
      />
    </div>
  );
};

export default HomePage;