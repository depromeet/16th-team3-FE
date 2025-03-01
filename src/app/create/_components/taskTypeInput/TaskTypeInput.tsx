import { Button } from '@/components/ui/button';
import Image from 'next/image';
import TaskTypeChip from '../taskTypeChip/TaskTypeChip';
import { MoodType, TaskType } from '@/types/create';

const TASK_TYPE_LIST = [
  TaskType.STUDY,
  TaskType.WRITING,
  TaskType.EXERCISE,
  TaskType.PROGRAMMING,
  TaskType.DESIGN,
  TaskType.ASSIGNMENT,
];

const MOOD_TYPE_LIST = [
  MoodType.URGENT,
  MoodType.EXCITED,
  MoodType.EMOTIONAL,
  MoodType.CALM,
];

const TaskTypeInput = () => {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div>
        <div className="flex flex-col gap-3 pb-6 pt-4">
          <div className="flex h-[26px] w-auto items-center gap-1 self-start rounded-[8px] bg-component-accent-secondary px-[7px] py-[6px]">
            <Image
              src="/icons/clock-stopwatch.svg"
              alt="clock-stopwatch"
              width={14}
              height={14}
            />
            <span className="text-primary l6 mt-[2px]">10초 소요</span>
          </div>
          <span className="text-strong t2 mt-1">정말 마지막단계에요!</span>
          <div className="flex flex-col">
            <span className="b2 text-neutral">
              3시간 30분 동안, 몰입을 도울
            </span>
            <span className="b2 text-neutral">
              캐릭터와 플레이리스트를 만들어 드릴게요.
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-[14px]">
            <div className="flex items-center gap-2">
              <span className="b3 text-normal">마감 유형</span>
              <span className="b3 text-primary">(1개 선택)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TASK_TYPE_LIST.map((type) => (
                <TaskTypeChip key={type} type={type} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[14px]">
            <div className="flex items-center gap-2">
              <span className="b3 text-normal">어떤 분위기로 집중할까요?</span>
              <span className="b3 text-primary">(1개 선택)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MOOD_TYPE_LIST.map((type) => (
                <TaskTypeChip key={type} type={type} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="pb-[46px] transition-all duration-300">
        <Button variant="primary" className="w-full">
          확인
        </Button>
      </div>
    </div>
  );
};

export default TaskTypeInput;
