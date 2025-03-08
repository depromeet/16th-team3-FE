import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { parseDateAndTime, calculateRemainingTime } from '@/utils/dateFormat';
import { Task } from '@/types/task';
import { useTask } from '@/hooks/useTasks';

type TaskDetailSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onDelete?: (taskId: number) => void;
  onStart?: (taskId: number) => void;
};

const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({
  isOpen,
  onClose,
  task,
  onDelete,
  onStart
}) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [remainingTime, setRemainingTime] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  
  // const { data: taskDetail, isLoading } = useTask(task.id);
  
  // 남은 시간 계산 함수
  const calculateRemainingTimeLocal = useCallback(() => {
    if (!task.dueDate) return '';
    
    // dueDatetime이 있으면 사용, 없으면 dueDate와 dueTime에서 계산
    let dueDatetime;
    if (task.dueDatetime) {
      dueDatetime = new Date(task.dueDatetime);
    } else if (task.dueDate && task.dueTime) {
      dueDatetime = parseDateAndTime(task.dueDate, task.dueTime || '');
    } else {
      return '';
    }
    
    const now = new Date();
    const diffMs = dueDatetime.getTime() - now.getTime();
    
    // 1시간 이내인지 체크 또는 ignoredAlerts가 3 이상인지 확인
    setIsUrgent(diffMs <= 60 * 60 * 1000 && diffMs > 0 || (task.ignoredAlerts || 0) >= 3);
    
    return calculateRemainingTime(dueDatetime);
  }, [task]);
  
  // 남은 시간 업데이트
  useEffect(() => {
    if (isOpen) {
      setRemainingTime(calculateRemainingTimeLocal());
      
      const interval = setInterval(() => {
        setRemainingTime(calculateRemainingTimeLocal());
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, calculateRemainingTimeLocal]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  if (!isOpen) return null;

  // 닉네임 문자열 처리 (9자 초과시 말줄임표)
  const formatNickname = (name: string) => {
    if (!name) return '';
    if (name.length > 9) {
      return name.substring(0, 9) + '...';
    }
    return name;
  };

  const handleStartTask = () => {
    // task.id가 있고 onStart 함수가 제공된 경우 태스크 상태 변경
    if (task.id && onStart) {
      onStart(task.id);
    }
    
    // 몰입 화면으로 이동
    router.push(`/focus${task.id ? `?taskId=${task.id}` : ''}`);
    onClose();
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleEditTitle = () => {
    setShowMenu(false);
    // 이름 변경 로직 추가
  };

  const handleDelete = () => {
    if (onDelete && task.id) {
      onDelete(task.id);
    }
    setShowMenu(false);
    onClose();
  };

  const formatDueDatetime = () => {
    if (!task.dueDate) return '-';
    
    // Date 객체로 변환해서 새롭게 포맷팅
    const dueDate = new Date(task.dueDate);
    const month = dueDate.getMonth() + 1;
    const day = dueDate.getDate();
    const dayOfWeek = task.dueDay || '';
    
    // 시간 처리
    let timeDisplay = task.dueTime || '';
    timeDisplay = timeDisplay.replace('까지', '');
    
    return `${month}월 ${day}일 ${dayOfWeek}, ${timeDisplay}`;
  };

  // 진행 중인 태스크인지 확인
  const isInProgress = task.status === 'inProgress';
  
  const personaName = task.persona?.name || '페르소나 없음';
  const personaTriggerAction = task.triggerAction || '노트북 켜기';
  
  // 이미지 URL 처리
  const personaImageUrl = '/icons/home/happy-character.svg';
  
  // if (task.persona?.personalImageUrl) {
  //   const imageUrl = task.persona.personalImageUrl;
  //   if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('/')) {
  //     personaImageUrl = imageUrl;
  //   } else {
  //     personaImageUrl = `/${imageUrl}`;
  //   }
  // }

  // 미리 시작 상태일 때만 화살표 표시 (지금 시작 또는 이어서 몰입일 때는 표시 안함)
  const showArrow = !isUrgent && !isInProgress;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-[#1F2024] rounded-t-[20px] w-full animate-slide-up">
        <div className="flex justify-between items-center px-5 pt-10 mb-5 relative">
          <div className="absolute inset-x-0 text-center">
            <h3 className="t3 text-text-normal">{task.title}</h3>
          </div>
          <div className="w-6"></div>
          <button ref={buttonRef} className="px-2 z-10" onClick={handleMoreClick}>
            <Image
              src="/icons/home/dots-vertical.svg"
              alt="More"
              width={4}
              height={18}
            />
          </button>
          
          {showMenu && (
            <div 
              ref={menuRef}
              className="absolute right-[20px] top-[70px] bg-component-gray-tertiary rounded-[16px] drop-shadow-lg z-10 w-[190px]"
            >
              <div className="c2 p-5 pb-0 text-text-alternative">
                설정
              </div>
              <div 
                className="l3 px-5 py-3 flex justify-between items-center text-text-red"
                onClick={handleDelete}
              >
                삭제하기
                <Image 
                  src="/icons/home/trashcan.svg" 
                  alt="Delete" 
                  width={16} 
                  height={16}
                  className="ml-2" 
                />
              </div>
              <div 
                className="l3 px-5 pt-3 pb-[22px] flex justify-between items-center text-text-normal"
                onClick={handleEditTitle}
              >
                할일 이름 바꾸기
                <Image 
                  src="/icons/home/edit.svg" 
                  alt="Edit" 
                  width={16} 
                  height={16}
                  className="ml-2" 
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="px-5">
          <p className="b3 text-text-neutral text-center mb-5">
            '{task.persona?.taskKeywordsCombination?.taskType?.name || '일반'} {task.persona?.taskKeywordsCombination?.taskMode?.name || '모드'}' {formatNickname(personaName)}님!<br />
            미루지 말고 여유있게 시작해볼까요?
          </p>
          
          <div className="flex justify-center items-center mb-[27px]">
            <Image
              src={personaImageUrl}
              alt="Character"
              width={90}
              height={90}
            />
          </div>
          
          <div className="flex justify-center">
           <Button 
                variant="hologram" 
                size="sm"
                className="text-text-inverse z-10 rounded-[8px] w-auto h-auto py-[5px] px-[7px] mb-6"
            >
                <span className="l6 text-text-inverse">{personaName}</span>
            </Button>
          </div>
          
          <div>
            <div className="flex justify-between items-center py-2.5 pt-0">
              <div className="b2 text-text-alternative">마감일</div>
              <div className="flex items-center">
                <span className="b2 text-text-neutral mr-3">{formatDueDatetime()}</span>
                {showArrow && (
                  <Image
                    src="/icons/home/arrow-right.svg"
                    alt="Edit"
                    width={7}
                    height={12}
                  />
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center py-2.5">
              <div className="b2 text-text-alternative">작은 행동</div>
              <div className="flex items-center">
                <span className="b2 text-text-neutral mr-3">{personaTriggerAction}</span>
                {showArrow && (
                  <Image
                    src="/icons/home/arrow-right.svg"
                    alt="Edit"
                    width={7}
                    height={12}
                  />
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center py-2.5">
              <div className="b2 text-text-alternative">예상 소요시간</div>
              <div className="flex items-center">
                <span className="b2 text-text-neutral mr-3">{task.timeRequired || '-'}</span>
                {showArrow && (
                  <Image
                    src="/icons/home/arrow-right.svg"
                    alt="Edit"
                    width={7}
                    height={12}
                  />
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center py-2.5">
              <div className="b2 text-text-alternative">첫 알림</div>
              <div className="flex items-center">
                <span className="s2 text-text-neutral mr-[19px]">
                {task.triggerActionAlarmTime ? 
                  `${new Date(task.triggerActionAlarmTime).getMonth() + 1}월 ${new Date(task.triggerActionAlarmTime).getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][new Date(task.triggerActionAlarmTime).getDay()]}), ${new Date(task.triggerActionAlarmTime).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}`
                : '-'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              variant={isUrgent ? "hologram" : "primary"}
              size="default"
              className={`l2 w-full z-10 ${isUrgent ? 'text-text-inverse' : 'text-text-strong'} rounded-[20px] py-4`}
              onClick={handleStartTask}
            >
              {isInProgress ? '이어서 몰입' : isUrgent ? '지금 시작' : '미리 시작'}
            </Button>
          </div>
          
          <div className="mb-10">
            <div
              className="b2 flex justify-center w-full text-text-neutral py-4 bg-none"
              onClick={onClose}
            >
              닫기
            </div>
          </div>
        </div>

        <div className="w-full py-3">
          <div className="w-16 h-1 mx-auto bg-[#373A45] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailSheet;