import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { parseDateAndTime, calculateRemainingTime } from '@/utils/dateFormat';

type TaskDetailSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id?: number;
    title: string;
    dueDate?: string;
    dueDay?: string;
    dueTime?: string;
    timeRequired?: string;
    description?: string;
    status?: string;
    dueDateTime?: string;
    ignoredAlerts?: number;
  };
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
  
  // 남은 시간 계산 함수
  const calculateRemainingTimeLocal = () => {
    if (!task.dueDate) return '';
    
    // dueDateTime이 있으면 사용, 없으면 dueDate와 dueTime에서 계산
    let dueDateTime;
    if (task.dueDateTime) {
      dueDateTime = new Date(task.dueDateTime);
    } else if (task.dueDate && task.dueTime) {
      dueDateTime = parseDateAndTime(task.dueDate, task.dueTime || '');
    } else {
      return '';
    }
    
    const now = new Date();
    const diffMs = dueDateTime.getTime() - now.getTime();
    
    // 1시간 이내인지 체크 또는 ignoredAlerts가 3 이상인지 확인
    setIsUrgent(diffMs <= 60 * 60 * 1000 && diffMs > 0 || (task.ignoredAlerts || 0) >= 3);
    
    return calculateRemainingTime(dueDateTime);
  };
  
  // 남은 시간 업데이트
  useEffect(() => {
    if (isOpen) {
      setRemainingTime(calculateRemainingTimeLocal());
      
      const interval = setInterval(() => {
        setRemainingTime(calculateRemainingTimeLocal());
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, task]);
  
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
  const formatNickname = (title: string) => {
    if (title.length > 9) {
      return title.substring(0, 9) + '...';
    }
    return title;
  };

  const handleStartTask = () => {
    console.log('태스크 시작:', task);
    
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
    console.log('할일 이름 바꾸기:', task.title);
    setShowMenu(false);
    // 이름 변경 로직 추가
  };

  const handleDelete = () => {
    console.log('삭제하기:', task);
    if (onDelete && task.id) {
      onDelete(task.id);
    }
    setShowMenu(false);
    onClose();
  };

  const formatDueDateTime = () => {
    if (!task.dueDate) return '-';
    
    // Date 객체로 변환해서 새롭게 포맷팅
    const dueDate = new Date(task.dueDate);
    const month = dueDate.getMonth() + 1;
    const day = dueDate.getDate();
    
    // 요일을 직접 계산
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[dueDate.getDay()];
    
    // 시간 처리
    let timeDisplay = task.dueTime || '';
    timeDisplay = timeDisplay.replace('까지', '');
    
    return `${month}월 ${day}일 (${dayOfWeek}), ${timeDisplay}`;
  };

  // 진행 중인 태스크인지 확인
  const isInProgress = task.status === 'inProgress';

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
            '발등에 불떨어진 소설가' {formatNickname('일이삼사오육칠팔구...')}님!<br />
            미루지 말고 여유있게 시작해볼까요?
          </p>
          
          <div className="flex justify-center items-center mb-[27px]">
            <Image
              src="/icons/home/happy-character.svg"
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
                <span className="l6 text-text-inverse">고독한 운동러 이일여</span>
            </Button>
            </div>
          
          <div>
            <div className="flex justify-between items-center py-2.5 pt-0">
              <div className="b2 text-text-alternative">마감일</div>
              <div className="flex items-center">
                <span className="b2 text-text-neutral mr-3">{formatDueDateTime()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center py-2.5">
              <div className="b2 text-text-alternative">작은 행동</div>
              <div className="flex items-center">
                <span className="b2 text-text-neutral mr-3">노트북 켜기</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center py-2.5">
              <div className="b2 text-text-alternative">예상 소요시간</div>
              <div className="flex items-center">
                <span className="b2 text-text-neutral mr-3">{task.timeRequired || '-'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center py-2.5">
              <div className="b2 text-text-alternative">첫 알림</div>
              <div className="flex items-center">
                <span className="s2 text-text-neutral mr-3">
                  {task.dueDate ? formatDueDateTime().replace(task.dueTime?.replace('까지', '') || '', '오후 07:30') : '-'}
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