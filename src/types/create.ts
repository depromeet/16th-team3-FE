export interface TimePickerType {
  meridiem: string;
  hour: string;
  minute: string;
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
