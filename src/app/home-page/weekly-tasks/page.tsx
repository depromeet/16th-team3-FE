'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/header';
import Image from 'next/image';
import TaskDetailSheet from '@/app/home-page/_components/TaskDetailSheet';
import WeeklyTaskItem from '@/app/home-page/_components/WeeklyTaskItem';
import { useWeeklyTasks, useStartTask } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import Loader from '@/components/loader/Loader';

const WeeklyTasksPage = () => {
  const router = useRouter();
  const { data: weeklyTasks = [], isLoading } = useWeeklyTasks();
  const { mutate: startTaskMutation } = useStartTask();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailSheetOpen(true);
  };

  const handleCloseDetailSheet = () => {
    setIsDetailSheetOpen(false);
  };

  const handleStartTask = (taskId: number) => {
    // React Query mutation 실행
    startTaskMutation(taskId);

    // 상세 시트 닫기
    setIsDetailSheetOpen(false);

    // 몰입 화면으로 이동
    router.push(`/focus?taskId=${taskId}`);
  };

  const handleDeleteTask = (taskId: number) => {
    // 삭제 API 연결 필요

    // 삭제된 항목이 현재 상세 시트에 표시 중이라면 시트 닫기
    if (isDetailSheetOpen && selectedTask && selectedTask.id === taskId) {
      setIsDetailSheetOpen(false);
    }
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background-primary">
        <Header title="이번주 할일" />
        <div className="mt-16 flex flex-1 items-center justify-center px-5 pb-24">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background-primary">
      <Header title="이번주 할일" />

      <main className="mt-16 flex-1 px-5 pb-24">
        {weeklyTasks.length > 0 ? (
          <>
            <div className="mb-4 flex justify-end">
              <button className="c1 rounded-[8px] bg-component-gray-primary px-3 py-2 text-text-normal">
                마감일 가까운 순
              </button>
            </div>

            {weeklyTasks.map((task) => (
              <WeeklyTaskItem
                key={task.id}
                task={task}
                onClick={handleTaskClick}
                onDelete={handleDeleteTask}
              />
            ))}
          </>
        ) : (
          <div className="mt-[120px] flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-[50px] mt-[50px]">
              <Image
                src="/icons/home/rocket.svg"
                alt="Rocket"
                width={64}
                height={64}
                className="mx-auto h-auto w-auto"
              />
            </div>
            <h2 className="t3 mb-[8px] mt-[8px] text-text-strong">
              이번주 할일이 없어요.
              <br />
              마감할 일을 추가해볼까요?
            </h2>
            <p className="b3 text-text-alternative">
              미루지 않도록 알림을 보내 챙겨드릴게요.
            </p>
          </div>
        )}
      </main>

      {selectedTask && (
        <TaskDetailSheet
          isOpen={isDetailSheetOpen}
          onClose={handleCloseDetailSheet}
          task={selectedTask}
          onDelete={handleDeleteTask}
          onStart={handleStartTask}
        />
      )}
    </div>
  );
};

export default WeeklyTasksPage;
