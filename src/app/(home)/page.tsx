'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import TaskItem from '@/app/(home)/_components/TaskItem';
import TaskDetailSheet from '@/app/(home)/_components/TaskDetailSheet';
import AllTaskItem from '@/app/(home)/_components/AllTaskItem';
import InProgressTaskItem from '@/app/(home)/_components/InProgressTaskItem';

// 오늘 할일 샘플 데이터
const SAMPLE_TODAY_TASKS = [
  {
    id: 1,
    title: '산학 발표 준비하기',
    dueDate: '2025-03-03',
    dueDay: '(월)',
    dueTime: '오후 6시까지',
    timeRequired: '3시간 소요',
    dDayCount: 0,
    description: '산학 협력 프로젝트 중간 발표 준비하기',
    type: 'today',
    status: 'pending',
    ignoredAlerts: 3,
    dueDateTime: '2025-03-03T18:00:00.000Z'
  },
  {
    id: 2,
    title: '산학 발표 준비하기',
    dueDate: '2025-03-03',
    dueDay: '(월)',
    dueTime: '오후 6시까지',
    timeRequired: '3시간 소요',
    dDayCount: 0,
    description: '산학 협력 프로젝트 최종 발표 준비하기',
    type: 'today',
    status: 'pending',
    dueDateTime: '2025-03-03T18:00:00.000Z'
  }
];

// 진행 중인 태스크 샘플 데이터
const SAMPLE_IN_PROGRESS_TASKS = [
  {
    id: 7,
    title: 'PPT 만들고 대본 작성하기',
    dueDate: '2025-03-03',
    dueDay: '(월)',
    dueTime: '오후 7시까지',
    timeRequired: '3시간 소요',
    dDayCount: 0,
    description: 'PPT 슬라이드 20장 준비 및 발표 대본 작성',
    type: 'today',
    status: 'inProgress',
    startedAt: '2025-03-01T13:00:00',
    dueDateTime: '2025-03-03T19:00:00.000Z'
  },
  {
    id: 8,
    title: 'PPT 만들고 대본 작성하기',
    dueDate: '2025-03-03',
    dueDay: '(월)',
    dueTime: '오후 9시까지',
    timeRequired: '3시간 소요',
    dDayCount: 0,
    description: 'PPT 슬라이드 20장 준비 및 발표 대본 작성',
    type: 'today',
    status: 'inProgress',
    startedAt: '2025-03-01T13:00:00',
    dueDateTime: '2025-03-03T21:00:00.000Z'
  }
];

// 이번주 할일 샘플 데이터
const SAMPLE_THISWEEK_TASKS = [
  {
    id: 3,
    title: '산학 발표 준비하기',
    dueDate: '2025-03-05',
    dueDay: '(수)',
    dueTime: '오후 6시까지',
    timeRequired: '3시간 소요',
    dDayCount: 3,
    description: '산학 협력 프로젝트 발표 준비하기',
    type: 'weekly',
    dueDateTime: '2025-03-05T18:00:00.000Z'
  },
  {
    id: 4,
    title: '블로그 글쓰기 챌린지하기',
    dueDate: '2025-03-07',
    dueDay: '(목)',
    dueTime: '오후 6시까지',
    timeRequired: '1일 소요',
    dDayCount: 3,
    description: '기술 블로그 첫 번째 글 작성하기',
    type: 'weekly',
    dueDateTime: '2025-03-07T18:00:00.000Z'
  }
];

// 이후 할일 샘플 데이터
const SAMPLE_FUTURE_TASKS = [
  {
    id: 5,
    title: '블로그 글쓰기 챌린지하기',
    dueDate: '2025-04-02',
    dueDay: '(수)',
    dueTime: '오후 6시까지',
    timeRequired: '4시간 30분 소요',
    dDayCount: 90,
    description: '기술 블로그 첫 번째 글 작성하기',
    type: 'future',
    dueDateTime: '2025-04-02T18:00:00.000Z'
  },
  {
    id: 6,
    title: '일이삼사오육칠팔구십일이삼사오육칠팔구',
    dueDate: '2025-12-30',
    dueDay: '(화)',
    dueTime: '오후 11시까지',
    timeRequired: '4일 반 소요',
    dDayCount: 100,
    description: '긴 제목의 태스크 예시입니다.',
    type: 'future',
    dueDateTime: '2025-12-30T23:00:00.000Z'
  }
];

const SAMPLE_ALL_TASKS = [...SAMPLE_TODAY_TASKS, ...SAMPLE_THISWEEK_TASKS, ...SAMPLE_FUTURE_TASKS, ...SAMPLE_IN_PROGRESS_TASKS];

// const SAMPLE_WEEKLY_TASKS = [
//   {
//     id: 1,
//     title: '산학 발표 준비하기',
//     dueDate: '2025-02-10',
//     dueDay: '(화)',
//     dueTime: '오후 6시까지',
//     timeRequired: '3시간 소요',
//     dDayCount: 1,
//     description: '산학 협력 프로젝트 중간 발표 준비하기',
//     dueDateTime: '2025-02-10T18:00:00.000Z'
//   },
//   {
//     id: 2,
//     title: '산학 발표 준비하기',
//     dueDate: '2025-02-11',
//     dueDay: '(수)',
//     dueTime: '오후 6시까지',
//     timeRequired: '3시간 소요',
//     dDayCount: 2,
//     description: '산학 협력 프로젝트 최종 발표 준비하기',
//     dueDateTime: '2025-02-11T18:00:00.000Z'
//   },
//   {
//     id: 3,
//     title: '블로그 글쓰기 챌린지하기',
//     dueDate: '2025-02-12',
//     dueDay: '(목)',
//     dueTime: '오후 6시까지',
//     timeRequired: '1일 소요',
//     dDayCount: 3,
//     description: '기술 블로그 첫 번째 글 작성하기',
//     dueDateTime: '2025-02-12T18:00:00.000Z'
//   },
//   {
//     id: 4,
//     title: '블로그 글쓰기 챌린지하기',
//     dueDate: '2025-02-13',
//     dueDay: '(금)',
//     dueTime: '오후 6시까지',
//     timeRequired: '1일 소요',
//     dDayCount: 4,
//     description: '기술 블로그 두 번째 글 작성하기',
//     dueDateTime: '2025-02-13T18:00:00.000Z'
//   },
//   {
//     id: 5,
//     title: '블로그 글쓰기 챌린지하기',
//     dueDate: '2025-02-14',
//     dueDay: '(토)',
//     dueTime: '오후 6시까지',
//     timeRequired: '1일 소요',
//     dDayCount: 5,
//     description: '기술 블로그 세 번째 글 작성하기',
//     dueDateTime: '2025-02-14T18:00:00.000Z'
//   },
//   {
//     id: 6,
//     title: '블로그 글쓰기 챌린지하기',
//     dueDate: '2025-02-15',
//     dueDay: '(일)',
//     dueTime: '오후 6시까지',
//     timeRequired: '1일 반 소요',
//     dDayCount: 6,
//     description: '기술 블로그 네 번째 글 작성하기',
//     dueDateTime: '2025-02-15T18:00:00.000Z'
//   }
// ];

const HomePage = () => {
  // 화면 분기 처리를 위한 상태
  const [todayTasks, setTodayTasks] = useState<any[]>(SAMPLE_TODAY_TASKS);
  const [inProgressTasks, setInProgressTasks] = useState<any[]>(SAMPLE_IN_PROGRESS_TASKS);
  const [weeklyTasks, setWeeklyTasks] = useState<any[]>(SAMPLE_THISWEEK_TASKS);
  const [allTasks, setAllTasks] = useState<any[]>(SAMPLE_ALL_TASKS);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');
  const router = useRouter();
  const [detailTask, setDetailTask] = useState<any>(null);
  const [showExpiredTaskSheet, setShowExpiredTaskSheet] = useState(false);
  const [expiredTask, setExpiredTask] = useState<any>(null);
  const [isReentry, setIsReentry] = useState(false);

  // 다른 페이지에서 돌아올 때 재진입으로 간주
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // 다른 페이지에서 홈으로 돌아오는 경우 재진입으로 처리
      if (url === '/' || url === '/home') {
        setIsReentry(true);
        setTimeout(() => {
          setIsReentry(false);
        }, 0);
      }
    };
    window.addEventListener('popstate', () => handleRouteChange(window.location.pathname));
    
    return () => {
      window.removeEventListener('popstate', () => handleRouteChange(window.location.pathname));
    };
  }, []);

   // 세션 스토리지를 사용해 더 확실한 재진입 감지
   useEffect(() => {
    const isFirstVisit = sessionStorage.getItem('visited');
    
    if (isFirstVisit) {
      // 이미 방문한 적이 있으면 재진입으로 간주
      setIsReentry(true);
      
      // 일정 시간 후 재진입 상태 초기화
      setTimeout(() => {
        setIsReentry(false);
      }, 5000);
    } else {
      // 첫 방문 시 세션 스토리지에 표시
      sessionStorage.setItem('visited', 'true');
      setIsReentry(false);
    }
  }, []);

const handleGoToReflection = (taskId: number) => {
  router.push(`/reflection?taskId=${taskId}`);
  setShowExpiredTaskSheet(false);
};

// 앱 진입 시 마감 지난 태스크 확인
useEffect(() => {
  const now = new Date(); 
  
  // 마감 지난 태스크 찾기
  const expiredTasks = allTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    
    // 시간 추출
    let hours = 0;
    if (task.dueTime.includes('오후')) {
      const match = task.dueTime.match(/오후\s*(\d+)시/);
      if (match && match[1]) {
        hours = parseInt(match[1]);
        if (hours !== 12) hours += 12;
      }
    } else if (task.dueTime.includes('오전')) {
      const match = task.dueTime.match(/오전\s*(\d+)시/);
      if (match && match[1]) {
        hours = parseInt(match[1]);
        if (hours === 12) hours = 0;
      }
    }
    
    dueDate.setHours(hours, 0, 0, 0);
    
    // 마감일이 현재 시간보다 이전이고, 회고를 완료하지 않은 태스크
    return dueDate.getTime() < now.getTime() && task.status !== 'reflected';
  });
  
  // 마감 지난 태스크가 있으면 첫 번째 태스크로 바텀시트 표시
  if (expiredTasks.length > 0) {
    setExpiredTask(expiredTasks[0]);
    setShowExpiredTaskSheet(true);
  }
}, [allTasks]);

const handleCloseExpiredSheet = () => {
  setShowExpiredTaskSheet(false);
};

  const handleDetailTask = (task: any) => {
    setDetailTask(task);
    setIsDetailSheetOpen(true);
  };

  // 분리된 전체 할일 목록
  const todayAllTasks = allTasks.filter(task => task.type === 'today' && task.status !== 'inProgress');
  const inProgressAllTasks = allTasks.filter(task => task.status === 'inProgress');
  const weeklyAllTasks = allTasks.filter(task => task.type === 'weekly');
  const futureAllTasks = allTasks.filter(task => task.type === 'future');

  // 첫 방문 시 툴팁 표시 관련 로직
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setShowTooltip(false);
    } else {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  const resetAlerts = (taskId: number) => {
    console.log('알림 초기화:', taskId);
    
    // 해당 태스크의 ignoredAlerts 값을 0으로 초기화
    setAllTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, ignoredAlerts: 0 } 
          : task
      )
    );
    
    // 오늘 할 일 목록도 업데이트
    setTodayTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, ignoredAlerts: 0 } 
          : task
      )
    );
  };

  // 진행 중인 작업 계속하기
  const handleContinueTask = (taskId: number) => {
    console.log('태스크 계속하기:', taskId);
    
    // 해당 태스크 찾기
    const taskToContinue = inProgressTasks.find(task => task.id === taskId);
    
    if (taskToContinue) {
      // 필요한 경우 상태 업데이트 (예: 마지막 접속 시간 등)
      console.log('계속할 태스크:', taskToContinue);
      
      // 몰입 화면으로 이동
      router.push(`/focus?taskId=${taskId}`);
    }
  };

  // 마감이 임박한 순으로 정렬된 이번주 할 일 (최대 2개)
  const topWeeklyTasks = weeklyTasks
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 2);

  // 마감이 임박한 순으로 정렬된 전체 할 일 (최대 2개)
  const topAllTasks = allTasks
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 2);

  const handleDeleteTask = (taskId: number) => {
    console.log('삭제할 ID:', taskId);
    // 특정 ID의 할일을 삭제
    setAllTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setInProgressTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setTodayTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    // TaskDetailSheet이 열려있는 경우 닫기
    if (isDetailSheetOpen && detailTask && detailTask.id === taskId) {
      setIsDetailSheetOpen(false);
    }
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setDetailTask(task);
    setIsDetailSheetOpen(true);
  };

  const handleCloseDetailSheet = () => {
    setIsDetailSheetOpen(false);
  };

  const handleStartTask = (taskId: number) => {
    console.log('태스크 시작:', taskId);
    
    // 선택한 태스크 찾기
    const taskToStart = allTasks.find(task => task.id === taskId);
    
    if (taskToStart) {
      // 태스크 상태를 진행 중으로 변경
      const updatedTask = {
        ...taskToStart,
        status: 'inProgress',
        startedAt: new Date().toISOString()
      };
      
      // 진행 중인 태스크 목록에 추가
      setInProgressTasks(prev => [...prev, updatedTask]);
      
      // 전체 태스크 목록 업데이트
      setAllTasks(prev => 
        prev.map(task => task.id === taskId ? updatedTask : task)
      );
      
      // 오늘 할 일 목록 업데이트
      if (taskToStart.type === 'today') {
        setTodayTasks(prev => 
          prev.map(task => task.id === taskId ? updatedTask : task)
        );
      }
      
      setIsDetailSheetOpen(false);
    }
  };

  const handleAddTask = () => {
    console.log('할 일 추가');
    // 할 일 추가 로직 추가
  };

  // 탭 전환 처리
  const handleTabChange = (tab: 'today' | 'all') => {
    setActiveTab(tab);
  };

  // 화면 분기 처리
  // 1. 오늘 할 일이 없고, 진행 중인 일도 없는 경우 (완전 빈 화면)
  const isTotallyEmpty = todayTasks.length === 0 && weeklyTasks.length === 0 && allTasks.length === 0 && inProgressTasks.length === 0;
  
  // 2. 오늘 할 일이 없고, 진행 중인 일도 없지만, 이번주 할 일은 있는 경우
  const hasWeeklyTasksOnly = todayTasks.length === 0 && inProgressTasks.length === 0 && weeklyTasks.length > 0;

  // 3. 오늘 할 일이 없고, 이번주 할 일도 없지만, 전체 할 일은 있는 경우
  const hasAllTasksOnly = todayTasks.length === 0 && weeklyTasks.length === 0 && inProgressTasks.length === 0 && allTasks.length > 0;

  // 4. 전체 할 일이 없는 경우
  const isAllEmpty = allTasks.length === 0;
  
  // 5. 진행 중인 일이 있고, 오늘 할 일도 있는 경우
  const hasTodayAndInProgressTasks = inProgressTasks.length > 0 && todayTasks.filter(t => t.status !== 'inProgress').length > 0;
  
  // 6. 진행 중인 일만 있는 경우
  const hasInProgressTasksOnly = inProgressTasks.length > 0 && todayTasks.filter(t => t.status !== 'inProgress').length === 0;

  // 7. 진행 중인 일은 없고 오늘 진행 예정인 일만 있는 경우
  const hasTodayTasksOnly = inProgressTasks.length === 0 && todayTasks.filter(t => t.status !== 'inProgress').length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      <header className="fixed top-0 left-0 right-0 bg-background-primary z-20">
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
            <div onClick={() => handleTabChange('today')}>
              <span className={`t3 ${activeTab === 'today' ? 'text-text-normal' : 'text-text-disabled'}`}>오늘 할일</span>{" "}
              <span className={`s1 ${activeTab === 'today' ? 'text-text-primary' : 'text-text-disabled'}`}>{todayTasks.length + inProgressTasks.length}</span>
            </div>
            <div onClick={() => handleTabChange('all')}>
              <span className={`t3 ${activeTab === 'all' ? 'text-text-normal' : 'text-text-disabled'}`}>전체 할일</span>{" "}
              <span className={`s1 ${activeTab === 'all' ? 'text-text-primary' : 'text-text-disabled'}`}>{allTasks.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-[104px] mb-40 px-5">
        {/* 오늘 할일 탭 */}
        {activeTab === 'today' && (
          <>
            {isTotallyEmpty && (
              <div className="text-center px-4 flex flex-col items-center justify-center h-full mt-20">
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

            {/* 진행 중인 일이 있고 오늘 할 일도 있는 경우 */}
            {hasTodayAndInProgressTasks && (
              <>
                {/* 진행 중 섹션 */}
                <div className="mb-6">
                  <h3 className="s2 text-text-neutral mb-2 mt-2">진행 중</h3>
                  {inProgressTasks.map(task => (
                    <InProgressTaskItem
                      key={task.id}
                      task={task}
                      onContinue={handleContinueTask}
                      isReentry={isReentry}
                      onShowDetails={handleDetailTask}
                    />
                  ))}
                </div>

                {/* 진행 예정 섹션 */}
                <div className="mb-8">
                  <h3 className="s2 text-text-neutral mb-2 mt-2">진행 예정</h3>
                  {todayTasks.filter(t => t.status !== 'inProgress').map(task => (
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
                      ignoredAlerts={task.ignoredAlerts || 0}
                      resetAlerts={resetAlerts}
                    />
                  ))}
                </div>

                <div>
                  <button 
                    className="flex justify-between items-center w-full px-4 py-4 bg-component-gray-secondary rounded-[20px]"
                    onClick={() => router.push('/home/weekly-tasks')}
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
                  <h3 className="s3 text-text-neutral mb-2">진행 중</h3>
                  {inProgressTasks.map(task => (
                    <InProgressTaskItem
                      key={task.id}
                      task={task}
                      onContinue={handleContinueTask}
                      isReentry={isReentry}
                      onShowDetails={handleDetailTask}
                    />
                  ))}
                </div>

                <div>
                  <button 
                    className="flex justify-between items-center w-full px-4 py-4 bg-component-gray-secondary rounded-[20px]"
                    onClick={() => router.push('/home/weekly-tasks')}
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
                    <h3 className="s2 text-text-neutral mb-2 mt-2">진행 예정</h3>
                    {todayTasks.filter(t => t.status !== 'inProgress').map(task => (
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
                        ignoredAlerts={task.ignoredAlerts || 0}
                        resetAlerts={resetAlerts}
                      />
                    ))}
                  </div>
                <div>
                  <button 
                    className="flex justify-between items-center w-full px-4 py-4 bg-component-gray-secondary rounded-[20px]"
                    onClick={() => router.push('/home/weekly-tasks')}
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
                    taskId={task.id}
                    onClick={() => handleTaskClick(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                    timeRequired={task.timeRequired}
                    onPreviewStart={() => handleDetailTask(task)}
                    ignoredAlerts={task.ignoredAlerts || 0}
                    resetAlerts={resetAlerts}
                  />
                  ))}
                </div>

                <div>
                  <button 
                    className="flex justify-between items-center w-full px-4 py-4"
                    onClick={() => router.push('/home/weekly-tasks')}
                  >
                    <span className="s2 text-text-neutral">이번주 할일 더보기</span>
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
                    <h2 className="t3 text-text-strong text-center">이번주 마감할 일이 없어요.</h2>
                    <h2 className="t3 text-text-strong text-center mb-2">급한 할일부터 시작해볼까요?</h2>
                    <p className="b3 text-text-alternative text-center">미루지 말고 여유있게 시작해보세요</p>
                  </div>
                </div>

                <div className="mb-4">
                  {topAllTasks.map(task => (
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
                    ignoredAlerts={task.ignoredAlerts || 0}
                    resetAlerts={resetAlerts}
                  />
                  ))}
                </div>

                <div>
                <button 
                  className="flex justify-between items-center w-full px-4 py-4"
                  onClick={() => setActiveTab('all')}
                >
                  <span className="s2 text-text-neutral">전체 할일 더보기</span>
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
                <div className="w-full bg-component-gray-secondary rounded-t-[28px] p-4 pt-10 flex flex-col items-center">
                  <h2 className="t3 text-text-strong text-center">{expiredTask.title}</h2>
                  <p className="t3 text-text-strong text-center mb-2">작업이 끝났어요. 짧게 돌아볼까요?</p>
                  <div className="flex justify-between w-full">
                    <p className="b3 text-text-neutral mb-7">마감일 </p>
                    <p className="b3 text-text-neutral mb-7">{new Date(expiredTask.dueDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} ({expiredTask.dueDay}), {expiredTask.dueTime}</p>
                  </div>
                  <button
                    className="w-full bg-component-accent-primary text-white rounded-[16px] py-4 mb-3 l2"
                    onClick={() => handleGoToReflection(expiredTask.id)}
                  >
                    회고하기
                  </button>
                  
                  <button
                    className="w-full text-text-neutral py-4 l2"
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
              <div className="text-center px-4 flex flex-col items-center justify-center h-full mt-20">
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
            ) : (
              <>
                <div className="flex justify-end">
                  <button className="c1 bg-component-gray-primary text-text-normal rounded-[8px] px-3 py-2">
                    마감일 가까운 순
                  </button>
                </div>

                {inProgressAllTasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="s3 text-text-neutral mb-2">진행 중</h3>
                    {inProgressAllTasks.map(task => (
                      <AllTaskItem
                        key={task.id}
                        task={task}
                        onClick={handleTaskClick}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}

                {todayAllTasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="s3 text-text-neutral mb-2">오늘</h3>
                    {todayAllTasks.map(task => (
                      <AllTaskItem
                        key={task.id}
                        task={task}
                        onClick={handleTaskClick}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}

                {weeklyAllTasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="s3 text-text-neutral mb-2">이번주</h3>
                    {weeklyAllTasks.map(task => (
                      <AllTaskItem
                        key={task.id}
                        task={task}
                        onClick={handleTaskClick}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}

                {futureAllTasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="s3 text-text-neutral mb-2">이후 할일</h3>
                    {futureAllTasks.map(task => (
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

      <footer className="fixed bottom-8 left-0 right-0 bg-none z-10">
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
        task={detailTask || { title: '', dueDate: '', dueTime: '' }}
        onDelete={handleDeleteTask}
        onStart={handleStartTask}
      />
    </div>

    
  );
};

export default HomePage;