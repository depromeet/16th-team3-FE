import { TimePickerType } from '@/types/create';

export type TaskInputType = {
  task?: string;
  deadlineDate?: Date;
  deadlineTime?: TimePickerType;
  smallAction?: string;
  estimatedHour?: string;
  estimatedMinute?: string;
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
  taskType: string;
  moodType: string;
};
