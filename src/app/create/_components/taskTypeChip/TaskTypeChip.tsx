import { MoodType, TaskType } from '@/types/create';
import Image from 'next/image';

interface TaskTypeChipProps<T extends TaskType | MoodType> {
  type: T;
  isSelected: boolean;
  onClick: (type: T) => void;
}

const TYPE_LABELS: { [key: string]: string } = {
  study: '공부',
  writing: '글쓰기',
  exercise: '운동',
  programming: '프로그래밍',
  design: '그림ㆍ디자인',
  assignment: '과제',
  urgent: '긴급한',
  excited: '신나는',
  emotional: '감성적인',
  calm: '조용한',
};

const TaskTypeChip = <T extends TaskType | MoodType>({
  type,
  isSelected,
  onClick,
}: TaskTypeChipProps<T>) => {
  const label = TYPE_LABELS[type];

  return (
    <div
      className={`flex h-12 items-center gap-2 rounded-[10px] p-[14px] transition-colors duration-300 ${isSelected ? 'bg-point-gradient' : 'bg-component-gray-secondary'}`}
      onClick={() => onClick(type)}
    >
      <Image src={`/icons/${type}.svg`} alt={`type`} width={24} height={24} />
      <span className={`l2 ${isSelected ? 'text-inverse' : 'text-normal'}`}>
        {label}
      </span>
    </div>
  );
};

export default TaskTypeChip;
