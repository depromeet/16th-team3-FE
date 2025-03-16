'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import TaskItem from '@/app/home-page/_components/TaskItem';
import TaskDetailSheet from '@/app/home-page/_components/TaskDetailSheet';
import AllTaskItem from '@/app/home-page/_components/AllTaskItem';
import InProgressTaskItem from '@/app/home-page/_components/InProgressTaskItem';
import CreateTaskSheet from '@/app/home-page/_components/CreateTaskSheet';
import { parseDateAndTime } from '@/utils/dateFormat';
import { Task } from '@/types/task';
import {
  useHomeData,
  useStartTask,
  useResetAlerts,
  useDeleteTask,
} from '@/hooks/useTasks';

import CharacterDialog from '../(create)/_components/characterDialog/CharacterDialog';
import Loader from '@/components/loader/Loader';
import { Dialog } from '@/components/ui/dialog';

const HomePageContent = () => {
  // 홈 API를 통해 모든 데이터 한번에 가져오기
  const { data: homeData, isLoading: isLoadingHome } = useHomeData();

  // 데이터 구조 분해
  const allTasks = useMemo(
    () => homeData?.allTasks || [],
    [homeData?.allTasks],
  );

  const todayTasks = useMemo(() => {
    const tasks = homeData?.todayTasks || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tasks.filter((task) => {
      const taskDueDate = task.dueDatetime
        ? new Date(task.dueDatetime)
        : new Date(task.dueDate);
      const taskDate = new Date(taskDueDate);
      taskDate.setHours(0, 0, 0, 0);
      return (
        taskDate.getTime() === today.getTime() && task.status !== 'inProgress'
      );
    });
  }, [homeData?.todayTasks]);

  const weeklyTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

      const taskIsAfterToday =
        taskDateOnly.getTime() > today.getTime() ||
        (taskDateOnly.getTime() === today.getTime() &&
          taskDueDate.getHours() >= 1);

      const taskIsBeforeSunday = taskDueDate <= sundayOfThisWeek;

      // 오늘 이후(또는 오늘 새벽 1시 이후)이고 이번주 일요일 이전인 작업
      return taskIsAfterToday && taskIsBeforeSunday;
    });
  }, [allTasks]);

  const inProgressTasks = useMemo(
    () => homeData?.inProgressTasks || [],
    [homeData?.inProgressTasks],
  );

  // 미래 할일
  const futureTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // 이번주의 일요일 계산
    const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const mondayOfThisWeek = new Date(today);
    mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);
    const sundayOfThisWeek = new Date(mondayOfThisWeek);
    sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
    sundayOfThisWeek.setHours(23, 59, 59, 999);

    // 모든 작업에서 미래 작업 필터링
    return allTasks.filter((task) => {
      const dueDate = task.dueDatetime
        ? new Date(task.dueDatetime)
        : task.dueDate
          ? new Date(task.dueDate)
          : null;

      if (!dueDate) {
        return false;
      }

      const isPastToday = dueDate > today;
      const isAfterThisWeek = dueDate > sundayOfThisWeek;

      if (task.status === 'inProgress' || task.status === 'INPROGRESS') {
        return false;
      }

      if (
        dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear()
      ) {
        return false;
      }

      // 이번주 작업 제외 (오늘 이후, 이번주 일요일 이전)
      if (dueDate > today && dueDate <= sundayOfThisWeek) {
        return false;
      }
      // 이번주 이후의 작업만 포함
      const isAfterSunday = dueDate > sundayOfThisWeek;
      return isAfterSunday;
    });
  }, [allTasks]);

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  // StartTask 뮤테이션 훅
  const { mutate: startTaskMutation } = useStartTask();
  const { mutate: deleteTaskMutation } = useDeleteTask();

  // Reset Alerts 훅
  const resetAlerts = useResetAlerts();

  // 화면 분기 처리를 위한 상태
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');
  const router = useRouter();
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [showExpiredTaskSheet, setShowExpiredTaskSheet] = useState(false);
  const [expiredTask, setExpiredTask] = useState<Task | null>(null);
  const [isReentry, setIsReentry] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const [taskName, setTaskName] = useState('');
  const [personaName, setPersonaName] = useState('');
  const [personaType, setPersonaType] = useState({
    taskType: '',
    taskMode: '',
  });

  const handleNavigateToMyPage = () => {
    router.push('/my-page');
  };

  // 다른 페이지에서 돌아올 때 재진입으로 간주
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/' || url === '/home') {
        setIsReentry(true);
        setTimeout(() => {
          setIsReentry(false);
        }, 1000);
      }
    };
    window.addEventListener('popstate', () =>
      handleRouteChange(window.location.pathname),
    );

    return () => {
      window.removeEventListener('popstate', () =>
        handleRouteChange(window.location.pathname),
      );
    };
  }, []);

  // 세션 스토리지를 사용해 더 확실한 재진입 감지
  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem('visited');
    if (isFirstVisit) {
      setIsReentry(true);
      // 바텀시트 표시 후 상태 초기화 시간 조정
      setTimeout(() => {
        setIsReentry(false);
      }, 5000);
    } else {
      sessionStorage.setItem('visited', 'true');
      setIsReentry(false);
    }
  }, []);

  // TODO: 회고 페이지로 이동
  const handleGoToReflection = (taskId: number) => {
    router.push(`/reflection?taskId=${taskId}`);
    setShowExpiredTaskSheet(false);
  };

  const expiredTasks = useMemo(() => {
    if (!isLoadingHome && allTasks.length > 0) {
      const now = new Date();
      return allTasks.filter((task) => {
        let dueDate;

        if (task.dueDatetime) {
          dueDate = new Date(task.dueDatetime);
        } else if (task.dueDate) {
          dueDate = parseDateAndTime(
            task.dueDate,
            task.dueTime || '오후 11시 59분',
          );
        } else {
          return false;
        }
        return (
          dueDate.getTime() < now.getTime() &&
          task.status !== 'reflected' &&
          task.status !== 'completed'
        );
      });
    }
    return [];
  }, [allTasks, isLoadingHome]);

  // 앱 재진입과 만료된 작업 확인 연결
  useEffect(() => {
    // 재진입 상태이고, 만료된 작업이 있을 때 바텀시트 표시
    if (isReentry && expiredTasks.length > 0) {
      setExpiredTask(expiredTasks[0]);
      setShowExpiredTaskSheet(true);
    }
  }, [isReentry, expiredTasks]);

  // 앱 진입 시 마감 지난 태스크 확인
  useEffect(() => {
    // 마감 지난 태스크가 있으면 첫 번째 태스크로 바텀시트 표시
    if (expiredTasks.length > 0) {
      setExpiredTask(expiredTasks[0]);
      setShowExpiredTaskSheet(true);
    }
  }, [expiredTasks]);

  // 이벤트 핸들러 함수
  const handleCloseExpiredSheet = () => {
    setShowExpiredTaskSheet(false);
  };

  const handleDetailTask = (task: Task) => {
    setDetailTask(task);
    setIsDetailSheetOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTaskMutation(taskId);
    if (isDetailSheetOpen && detailTask && detailTask.id === taskId) {
      setIsDetailSheetOpen(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDetailTask(task);
    setIsDetailSheetOpen(true);
  };

  const handleCloseDetailSheet = () => {
    setIsDetailSheetOpen(false);
  };

  const handleStartTask = (taskId: number) => {
    // React Query mutation 실행
    startTaskMutation(taskId);
    setIsDetailSheetOpen(false);
    router.push(`/immersion/${taskId}`);
  };

  const handleAddTask = () => {
    setIsCreateSheetOpen(true);
  };

  const handleCloseCreateSheet = () => {
    setIsCreateSheetOpen(false);
  };

  // 툴팁 표시 관련 로직
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setShowTooltip(false);
    } else {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  // 진행 중인 작업 계속하기
  const handleContinueTask = (taskId: number) => {
    // 해당 태스크 찾기
    const taskToContinue = inProgressTasks.find((task) => task.id === taskId);

    if (taskToContinue) {
      // TODO: 몰입 화면으로 이동
      router.push(`/immersion/${taskId}`);
    }
  };

  // 마감이 임박한 순으로 정렬된 이번주 할 일 (최대 2개)
  const topWeeklyTasks = useMemo(() => {
    return [...weeklyTasks]
      .sort(
        (a, b) =>
          new Date(a.dueDatetime).getTime() - new Date(b.dueDatetime).getTime(),
      )
      .slice(0, 2);
  }, [weeklyTasks]);

  // 마감이 임박한 순으로 정렬된 전체 할 일 (최대 2개)
  const topAllTasks = useMemo(() => {
    return [...allTasks]
      .sort(
        (a, b) =>
          new Date(a.dueDatetime).getTime() - new Date(b.dueDatetime).getTime(),
      )
      .slice(0, 2);
  }, [allTasks]);

  // 탭 전환 처리
  const handleTabChange = (tab: 'today' | 'all') => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (searchParams.get('modal') === 'success') {
      setIsDialogOpen(true);

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('dialog');
      router.replace(`/home-page?${newParams.toString()}`, { scroll: false });
    }

    if (searchParams.get('task')) {
      setTaskName(searchParams.get('task') || '');
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('task');
      router.replace(`/home-page?${newParams.toString()}`, { scroll: false });
    }

    if (searchParams.get('taskType') && searchParams.get('taskMode')) {
      setPersonaType({
        taskType: searchParams.get('taskType') || '',
        taskMode: searchParams.get('taskMode') || '',
      });
    }
  }, [searchParams, router]);

  useEffect(() => {
    // TODO(prgmr99): 서버로부터 별칭받기
    const newParams = new URLSearchParams(searchParams.toString());
    let shouldReplace = false;

    if (searchParams.get('dialog') === 'success') {
      setIsDialogOpen(true);
      newParams.delete('dialog');
      shouldReplace = true;
    }

    const taskParam = searchParams.get('task');
    if (taskParam) {
      setTaskName(taskParam);
      newParams.delete('task');
      shouldReplace = true;
    }

    const personaParam = searchParams.get('personaName');

    if (personaParam) {
      setPersonaName(personaParam);
      newParams.delete('personaName');
      shouldReplace = true;
    }

    if (shouldReplace) {
      router.replace(`/home-page?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  // 로딩 상태 처리
  if (isLoadingHome) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background-primary">
        <Loader />
      </div>
    );
  }

  // 화면 분기 처리
  // 1. 오늘 할 일이 없고, 진행 중인 일도 없는 경우 (완전 빈 화면)
  const isTotallyEmpty =
    todayTasks.length === 0 &&
    weeklyTasks.length === 0 &&
    allTasks.length === 0 &&
    inProgressTasks.length === 0;

  // 2. 오늘 할 일이 없고, 진행 중인 일도 없지만, 이번주 할 일은 있는 경우
  const hasWeeklyTasksOnly =
    todayTasks.length === 0 &&
    inProgressTasks.length === 0 &&
    weeklyTasks.length > 0;

  // 3. 오늘 할 일이 없고, 이번주 할 일도 없지만, 전체 할 일은 있는 경우
  const hasAllTasksOnly =
    todayTasks.length === 0 &&
    weeklyTasks.length === 0 &&
    inProgressTasks.length === 0 &&
    allTasks.length > 0;

  // 4. 전체 할 일이 없는 경우
  const isAllEmpty = allTasks.length === 0;

  // 5. 진행 중인 일이 있고, 오늘 할 일도 있는 경우
  const hasTodayAndInProgressTasks =
    inProgressTasks.length > 0 && todayTasks.length > 0;

  // 6. 진행 중인 일만 있는 경우
  const hasInProgressTasksOnly =
    inProgressTasks.length > 0 && todayTasks.length === 0;

  // 7. 진행 중인 일은 없고 오늘 진행 예정인 일만 있는 경우
  const hasTodayTasksOnly =
    inProgressTasks.length === 0 && todayTasks.length > 0;

  return (
    <Dialog open={isDialogOpen && taskName !== ''}>
      <div className="flex min-h-screen flex-col bg-background-primary">
        <header className="fixed left-0 right-0 top-[60px] z-20 bg-background-primary">
          <div className="flex items-center justify-between px-[20px] py-[15px]">
            <Image
              src="/icons/home/spurt.svg"
              alt="SPURT"
              width={50}
              height={20}
              priority
              className="w-[50px]"
            />
            <button onClick={handleNavigateToMyPage}>
              <Image
                src="/icons/home/mypage.svg"
                alt="마이페이지"
                width={20}
                height={20}
              />
            </button>
          </div>
          <div className="px-[20px] py-[11px]">
            <div className="flex space-x-4">
              <div onClick={() => handleTabChange('today')}>
                <span
                  className={`t3 ${activeTab === 'today' ? 'text-text-normal' : 'text-text-disabled'}`}
                >
                  오늘 할일
                </span>
                <span
                  className={`s1 ${activeTab === 'today' ? 'text-text-primary' : 'text-text-disabled'}`}
                >
                  {todayTasks.length + inProgressTasks.length}
                </span>
              </div>
              <div onClick={() => handleTabChange('all')}>
                <span
                  className={`t3 ${activeTab === 'all' ? 'text-text-normal' : 'text-text-disabled'}`}
                >
                  전체 할일
                </span>
                <span
                  className={`s1 ${activeTab === 'all' ? 'text-text-primary' : 'text-text-disabled'}`}
                >
                  {allTasks.length}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="mb-40 mt-[104px] flex-1 px-5">
          {/* 오늘 할일 탭 */}
          {activeTab === 'today' && (
            <>
              {isTotallyEmpty && (
                <div className="mt-20 flex h-full flex-col items-center justify-center px-4 text-center">
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
                    마감 할 일을 추가하고
                    <br />
                    바로 시작해볼까요?
                  </h2>
                  <p className="b3 text-text-alternative">
                    미루지 않도록 알림을 보내 챙겨드릴게요.
                  </p>
                </div>
              )}

              {/* 진행 중인 일이 있고 오늘 할 일도 있는 경우 */}
              {hasTodayAndInProgressTasks && (
                <>
                  {/* 진행 중 섹션 */}
                  <div className="mb-6">
                    <h3 className="s2 mb-2 mt-2 text-text-neutral">진행 중</h3>
                    {inProgressTasks.map((task) => (
                      <InProgressTaskItem
                        key={task.id}
                        task={task}
                        onContinue={handleContinueTask}
                        isReentry={isReentry}
                        onShowDetails={() => handleDetailTask(task)}
                      />
                    ))}
                  </div>

                  {/* 진행 예정 섹션 */}
                  <div className="mb-8">
                    <h3 className="s2 mb-2 mt-2 text-text-neutral">
                      진행 예정
                    </h3>
                    {todayTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        title={task.title}
                        dueDate={task.dueDate}
                        dueTime={task.dueTime}
                        taskId={task.id}
                        onClick={() => handleTaskClick(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                        timeRequired={task.timeRequired}
                        onPreviewStart={() => handleDetailTask(task)}
                        ignoredAlerts={task.ignoredAlerts}
                        resetAlerts={resetAlerts}
                        dueDatetime={task.dueDatetime}
                        status={task.status}
                      />
                    ))}
                  </div>

                  <div>
                    <button
                      className="flex w-full items-center justify-between rounded-[20px] bg-component-gray-secondary px-4 py-4"
                      onClick={() => router.push('/home-page/weekly-tasks')}
                    >
                      <span className="s2 text-text-neutral">이번주 할일</span>
                      <Image
                        src="/icons/home/arrow-right.svg"
                        alt="Arrow Right"
                        width={7}
                        height={12}
                      />
                    </button>
                  </div>
                </>
              )}

              {/* 진행 중인 일만 있고 오늘 할 일은 없는 경우 */}
              {hasInProgressTasksOnly && (
                <>
                  {/* 진행 중 섹션 */}
                  <div className="mb-6">
                    <h3 className="s3 mb-2 text-text-neutral">진행 중</h3>
                    {inProgressTasks.map((task) => (
                      <InProgressTaskItem
                        key={task.id}
                        task={task}
                        onContinue={handleContinueTask}
                        isReentry={isReentry}
                        onShowDetails={() => handleDetailTask(task)}
                      />
                    ))}
                  </div>

                  <div>
                    <button
                      className="flex w-full items-center justify-between rounded-[20px] bg-component-gray-secondary px-4 py-4"
                      onClick={() => router.push('/home-page/weekly-tasks')}
                    >
                      <span className="s2 text-text-neutral">이번주 할일</span>
                      <Image
                        src="/icons/home/arrow-right.svg"
                        alt="Arrow Right"
                        width={7}
                        height={12}
                      />
                    </button>
                  </div>
                </>
              )}

              {/* 진행 중인 일은 없고 오늘 진행 예정인 일만 있는 경우 */}
              {hasTodayTasksOnly && (
                <>
                  {/* 진행 예정 섹션 */}
                  <div className="mb-8">
                    <h3 className="s2 mb-2 mt-2 text-text-neutral">
                      진행 예정
                    </h3>
                    {todayTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        title={task.title}
                        dueDate={task.dueDate}
                        dueTime={task.dueTime}
                        taskId={task.id}
                        onClick={() => handleTaskClick(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                        timeRequired={task.timeRequired}
                        onPreviewStart={() => handleDetailTask(task)}
                        ignoredAlerts={task.ignoredAlerts}
                        resetAlerts={resetAlerts}
                        dueDatetime={task.dueDatetime}
                        status={task.status}
                      />
                    ))}
                  </div>
                  <div>
                    <button
                      className="flex w-full items-center justify-between rounded-[20px] bg-component-gray-secondary px-4 py-4"
                      onClick={() => router.push('/home-page/weekly-tasks')}
                    >
                      <span className="s2 text-text-neutral">이번주 할일</span>
                      <Image
                        src="/icons/home/arrow-right.svg"
                        alt="Arrow Right"
                        width={7}
                        height={12}
                      />
                    </button>
                  </div>
                </>
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
                      <h2 className="t3 text-center text-text-strong">
                        오늘 마감할 일이 없어요.
                      </h2>
                      <h2 className="t3 mb-2 text-center text-text-strong">
                        이번주 할일 먼저 해볼까요?
                      </h2>
                      <p className="b3 text-center text-text-alternative">
                        이번주 안에 끝내야 하는 할 일이에요
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    {topWeeklyTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        title={task.title}
                        dueDate={task.dueDate}
                        dueTime={task.dueTime}
                        taskId={task.id}
                        onClick={() => handleTaskClick(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                        timeRequired={task.timeRequired}
                        onPreviewStart={() => handleDetailTask(task)}
                        ignoredAlerts={task.ignoredAlerts}
                        resetAlerts={resetAlerts}
                        dueDatetime={task.dueDatetime}
                        status={task.status}
                      />
                    ))}
                  </div>

                  <div>
                    <button
                      className="flex w-full items-center justify-between px-4 py-4"
                      onClick={() => router.push('/home-page/weekly-tasks')}
                    >
                      <span className="s2 text-text-neutral">
                        이번주 할일 더보기
                      </span>
                      <Image
                        src="/icons/home/arrow-right.svg"
                        alt="Arrow Right"
                        width={7}
                        height={12}
                      />
                    </button>
                  </div>
                </div>
              )}

              {hasAllTasksOnly && (
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
                      <h2 className="t3 text-center text-text-strong">
                        이번주 마감할 일이 없어요.
                      </h2>
                      <h2 className="t3 mb-2 text-center text-text-strong">
                        급한 할일부터 시작해볼까요?
                      </h2>
                      <p className="b3 text-center text-text-alternative">
                        미루지 말고 여유있게 시작해보세요
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    {topAllTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        title={task.title}
                        dueDate={task.dueDate}
                        dueTime={task.dueTime}
                        taskId={task.id}
                        onClick={() => handleTaskClick(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                        timeRequired={task.timeRequired}
                        onPreviewStart={() => handleDetailTask(task)}
                        ignoredAlerts={task.ignoredAlerts}
                        resetAlerts={resetAlerts}
                        dueDatetime={task.dueDatetime}
                        status={task.status}
                      />
                    ))}
                  </div>

                  <div>
                    <button
                      className="flex w-full items-center justify-between px-4 py-4"
                      onClick={() => setActiveTab('all')}
                    >
                      <span className="s2 text-text-neutral">
                        전체 할일 더보기
                      </span>
                      <Image
                        src="/icons/home/arrow-right.svg"
                        alt="Arrow Right"
                        width={7}
                        height={12}
                      />
                    </button>
                  </div>
                </div>
              )}

              {showExpiredTaskSheet && expiredTask && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
                  <div className="flex w-full flex-col items-center rounded-t-[28px] bg-component-gray-secondary p-4 pt-10">
                    <h2 className="t3 text-center text-text-strong">
                      {expiredTask.title}
                    </h2>
                    <p className="t3 mb-2 text-center text-text-strong">
                      작업이 끝났어요. 짧게 돌아볼까요?
                    </p>
                    <div className="flex w-full justify-between">
                      <p className="b3 mb-7 text-text-neutral">마감일 </p>
                      <p className="b3 mb-7 text-text-neutral">
                        {new Date(expiredTask.dueDate).toLocaleDateString(
                          'ko-KR',
                          { month: 'long', day: 'numeric' },
                        )}
                        ({expiredTask.dueDay}), {expiredTask.dueTime}
                      </p>
                    </div>
                    <button
                      className="l2 mb-3 w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
                      onClick={() => handleGoToReflection(expiredTask.id)}
                    >
                      회고하기
                    </button>

                    <button
                      className="l2 w-full py-4 text-text-neutral"
                      onClick={handleCloseExpiredSheet}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 전체 할일 탭 */}
          {activeTab === 'all' && (
            <>
              {isAllEmpty ? (
                <div className="mt-20 flex h-full flex-col items-center justify-center px-4 text-center">
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
              ) : (
                <>
                  <div className="flex justify-end">
                    <button className="c1 rounded-[8px] bg-component-gray-primary px-3 py-2 text-text-normal">
                      마감일 가까운 순
                    </button>
                  </div>

                  {inProgressTasks.length > 0 && (
                    <div className="mb-6">
                      <h3 className="s3 mb-2 text-text-neutral">진행 중</h3>
                      {inProgressTasks.map((task) => (
                        <AllTaskItem
                          key={task.id}
                          task={task}
                          onClick={handleTaskClick}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  )}

                  {todayTasks.length > 0 && (
                    <div className="mb-6">
                      <h3 className="s3 mb-2 text-text-neutral">오늘</h3>
                      {todayTasks.map((task) => (
                        <AllTaskItem
                          key={task.id}
                          task={task}
                          onClick={handleTaskClick}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  )}

                  {weeklyTasks.length > 0 && (
                    <div className="mb-6">
                      <h3 className="s3 mb-2 text-text-neutral">이번주</h3>
                      {weeklyTasks.map((task) => (
                        <AllTaskItem
                          key={task.id}
                          task={task}
                          onClick={handleTaskClick}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  )}

                  {futureTasks.length > 0 && (
                    <div className="mb-6">
                      <h3 className="s3 mb-2 text-text-neutral">이후 할일</h3>
                      {futureTasks.map((task) => (
                        <AllTaskItem
                          key={task.id}
                          task={task}
                          onClick={handleTaskClick}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>

        <footer className="fixed bottom-8 left-0 right-0 z-10 bg-none">
          <div className="flex justify-end p-5">
            {showTooltip && (
              <div className="b3 absolute bottom-24 right-4 rounded-[12px] bg-component-accent-primary px-4 py-3 text-text-strong shadow-lg">
                지금 바로 할 일을 추가해보세요!
                <div className="absolute -bottom-2 right-12 h-4 w-4 rotate-45 bg-component-accent-primary"></div>
              </div>
            )}
            <Button
              variant="point"
              size="md"
              className="l2 flex h-[52px] w-[130px] items-center gap-2 rounded-full py-[16.5px] text-text-inverse"
              onClick={handleAddTask}
            >
              <Image
                src="/icons/home/plus.svg"
                alt="Add Task"
                width={16}
                height={16}
              />
              할일 추가
            </Button>
          </div>
        </footer>

        {detailTask && (
          <TaskDetailSheet
            isOpen={isDetailSheetOpen}
            onClose={handleCloseDetailSheet}
            task={detailTask}
            onDelete={handleDeleteTask}
            onStart={handleStartTask}
          />
        )}

        {/* TODO(prgmr99): 모달 띄워지는 애니메이션 확인 필요 */}
        <CharacterDialog
          task={taskName}
          personaName={personaName}
          personaType={personaType}
          onClick={() => setIsDialogOpen(false)}
        />

        <CreateTaskSheet
          isOpen={isCreateSheetOpen}
          onClose={handleCloseCreateSheet}
        />
      </div>
    </Dialog>
  );
};

const HomePage = () => (
  <Suspense>
    <HomePageContent />
  </Suspense>
);

export default HomePage;
