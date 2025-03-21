'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/header';
import Image from 'next/image';
import TaskDetailSheet from '@/app/(root)/_components/TaskDetailSheet';
import WeeklyTaskItem from '@/app/(root)/_components/WeeklyTaskItem';
import { useHomeData, useStartTask, useDeleteTask } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import Loader from '@/components/loader/Loader';

const WeeklyTasksPage = () => {
  const router = useRouter();
  const { data: homeData, isLoading } = useHomeData();
  const { mutate: startTaskMutation } = useStartTask();
  const { mutate: deleteTaskMutation } = useDeleteTask();
  const allTasks = useMemo(
    () => homeData?.allTasks || [],
    [homeData?.allTasks],
  );
  const weeklyTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 이번주의 월요일 찾기
    const mondayOfThisWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 일요일인 경우 이전 주의 월요일까지 거슬러 올라감
    mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);

    // 이번주의 일요일 찾기 (일요일 23:59:59)
    const sundayOfThisWeek = new Date(mondayOfThisWeek);
    sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
    sundayOfThisWeek.setHours(23, 59, 59, 999);

    return allTasks.filter((task) => {
      if (task.status === 'inProgress' || task.status === 'INPROGRESS')
        return false;

      // 날짜 계산
      const taskDueDate = task.dueDatetime
        ? new Date(task.dueDatetime)
        : task.dueDate
          ? new Date(task.dueDate)
          : null;

      if (!taskDueDate) return false;

      const taskDateOnly = new Date(taskDueDate);
      taskDateOnly.setHours(0, 0, 0, 0);

      const taskIsAfterToday = taskDateOnly.getTime() >= tomorrow.getTime();

      const taskIsBeforeSunday = taskDueDate <= sundayOfThisWeek;

      // 오늘 이후(또는 오늘 새벽 1시 이후)이고 이번주 일요일 이전인 작업
      return taskIsAfterToday && taskIsBeforeSunday;
    });
  }, [allTasks]);

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
    startTaskMutation(taskId);
    setIsDetailSheetOpen(false);
    router.push(`/immersion/${taskId}`);
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTaskMutation(taskId);
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
