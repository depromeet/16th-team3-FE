export type TaskForm = {
  task?: string;
  deadlineDate?: Date;
  deadlineTime?: string;
  smallAction?: string;
  estimatedHour?: string;
  estimatedMinute?: string;
  taskType?: string;
  moodType?: string;
};

export type SmallActionInput = {
  task: string;
  deadlineDate: Date;
  deadlineTime: string;
  smallAction?: string;
  estimatedHour?: string;
  estimatedMinute?: string;
  taskType?: string;
  moodType?: string;
};

export type EstimatedTimeInput = {
  task: string;
  deadlineDate: Date;
  deadlineTime: string;
  smallAction: string;
  estimatedHour?: string;
  estimatedMinute?: string;
  taskType?: string;
  moodType?: string;
};

export type BufferTime = {
  task: string;
  deadlineDate: Date;
  deadlineTime: string;
  smallAction: string;
  estimatedHour: string;
  estimatedMinute: string;
  taskType?: string;
  moodType?: string;
};

export type TaskTypeInput = {
  task: string;
  deadlineDate: Date;
  deadlineTime: string;
  smallAction: string;
  estimatedHour: string;
  estimatedMinute: string;
  taskType: string;
  moodType: string;
};
