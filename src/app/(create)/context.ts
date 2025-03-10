import { TimePickerType } from '@/types/create';

export type TaskInputType = {
  task?: string;
  deadlineDate?: Date;
  deadlineTime?: TimePickerType;
  smallAction?: string;
  estimatedHour?: string;
  estimatedMinute?: string;
  estimatedDay?: string;
  taskType?: string;
  moodType?: string;
};

export type SmallActionInputType = {
  task: string;
  deadlineDate: Date;
  deadlineTime: TimePickerType;
  smallAction?: string;
  estimatedHour?: string;
  estimatedMinute?: string;
  estimatedDay?: string;
  taskType?: string;
  moodType?: string;
};

export type EstimatedTimeInputType = {
  task: string;
  deadlineDate: Date;
  deadlineTime: TimePickerType;
  smallAction: string;
  estimatedHour?: string;
  estimatedMinute?: string;
  estimatedDay?: string;
  taskType?: string;
  moodType?: string;
};

export type BufferTimeType = {
  task: string;
  deadlineDate: Date;
  deadlineTime: TimePickerType;
  smallAction: string;
  estimatedHour: string;
  estimatedMinute: string;
  estimatedDay: string;
  taskType?: string;
  moodType?: string;
};

export type TaskTypeInputType = {
  task: string;
  deadlineDate: Date;
  deadlineTime: TimePickerType;
  smallAction: string;
  estimatedHour: string;
  estimatedMinute: string;
  estimatedDay?: string;
  taskType: string;
  moodType: string;
};

export type InstantTaskInputType = {
  task: string;
  deadlineDate: Date;
  deadlineTime: TimePickerType;
  taskType?: string;
  moodType?: string;
};

export const TYPE_LABELS: { [key: string]: string } = {
  study: '공부',
  writing: '글쓰기',
  exercise: '운동',
  programming: '프로그래밍',
  design: '그림∙디자인',
  assignment: '과제',
  urgent: '긴급한',
  excited: '신나는',
  emotional: '감성적인',
  calm: '조용한',
};
