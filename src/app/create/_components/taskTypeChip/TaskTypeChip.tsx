import { MoodType, TaskType } from '@/types/create';
import Image from 'next/image';

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

const TaskTypeChip = ({ type }: { type: TaskType | MoodType }) => {
  const label = TYPE_LABELS[type];

  return (
    <div className="flex h-12 gap-2 rounded-[10px] bg-component-gray-secondary p-[14px]">
      <Image src={`/icons/${type}.svg`} alt={`type`} width={24} height={24} />
      <span className="l2 text-normal">{label}</span>
    </div>
  );
};

export default TaskTypeChip;
