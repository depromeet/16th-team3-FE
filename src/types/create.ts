export interface TimePickerType {
  meridiem: string;
  hour: string;
  minute: string;
  second?: string;
}

export interface BufferTimeDataType {
  task: string;
  deadlineDate: Date;
  deadlineTime: TimePickerType;
  smallAction: string;
  estimatedHour: string;
  estimatedMinute: string;
  estimatedDay: string;
}

export type SmallActionType = 'SitAtTheDesk' | 'TurnOnTheLaptop' | 'DrinkWater';
export type SmallActionKrType = '책상 앞에 앉기' | '노트북 켜기' | '물 마시기';

export enum TaskType {
  'STUDY' = 'study',
  'WRITING' = 'writing',
  'EXERCISE' = 'exercise',
  'PROGRAMMING' = 'programming',
  'DESIGN' = 'design',
  'ASSIGNMENT' = 'assignment',
}

export enum MoodType {
  'URGENT' = 'urgent',
  'EXCITED' = 'excited',
  'EMOTIONAL' = 'emotional',
  'CALM' = 'calm',
}

export interface ScheduledTaskType {
  name: string;
  dueDatetime: string;
  triggerAction: string;
  estimatedTime: number;
  triggerActionAlarmTime: string;
  taskType: string;
  taskMode: string;
}

export interface InstantTaskType {
  name: string;
  dueDatetime: string;
  taskType: string;
  taskMode: string;
}
