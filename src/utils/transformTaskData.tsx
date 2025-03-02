import {
  InstantTaskInputType,
  TaskTypeInputType,
  TYPE_LABELS,
} from '@/app/(create)/context';
import { InstantTaskType, ScheduledTaskType } from '@/types/create';
import { format, set, subMinutes } from 'date-fns';

export const transformScheduledTaskData = (
  data: TaskTypeInputType,
): ScheduledTaskType => {
  const deadlineDateObj = new Date(data.deadlineDate);
  let hour = Number(data.deadlineTime.hour);
  const minute = Number(data.deadlineTime.minute);

  if (data.deadlineTime.meridiem === '오후' && hour < 12) {
    hour += 12;
  } else if (data.deadlineTime.meridiem === '오전' && hour === 12) {
    hour = 0;
  }
  const dueDateTime = set(deadlineDateObj, {
    hours: hour,
    minutes: minute,
    seconds: 0,
  });
  const dueDatetimeStr = format(dueDateTime, 'yyyy-MM-dd HH:mm:ss');

  const days = data.estimatedDay ? Number(data.estimatedDay) : 0;
  const hours = data.estimatedHour ? Number(data.estimatedHour) : 0;
  const minutes = data.estimatedMinute ? Number(data.estimatedMinute) : 0;
  const totalEstimatedMinutes = days * 1440 + hours * 60 + minutes;
  const scaledEstimatedMinutes = totalEstimatedMinutes * 1.5;
  const alarmDateTime = subMinutes(dueDateTime, scaledEstimatedMinutes);
  const triggerActionAlarmTimeStr = format(
    alarmDateTime,
    'yyyy-MM-dd HH:mm:ss',
  );

  return {
    name: data.task,
    dueDatetime: dueDatetimeStr,
    triggerAction: data.smallAction,
    estimatedTime: totalEstimatedMinutes,
    triggerActionAlarmTime: triggerActionAlarmTimeStr,
    taskType: TYPE_LABELS[data.taskType.toLowerCase()] || data.taskType,
    taskMode: TYPE_LABELS[data.moodType.toLowerCase()] || data.moodType,
  };
};

export const transformInstantScheduledTaskData = (
  data: InstantTaskInputType,
): InstantTaskType => {
  const deadlineDateObj = new Date(data.deadlineDate);
  let hour = Number(data.deadlineTime.hour);
  const minute = Number(data.deadlineTime.minute);

  if (data.deadlineTime.meridiem === '오후' && hour < 12) {
    hour += 12;
  } else if (data.deadlineTime.meridiem === '오전' && hour === 12) {
    hour = 0;
  }
  const dueDateTime = set(deadlineDateObj, {
    hours: hour,
    minutes: minute,
    seconds: 0,
  });
  const dueDatetimeStr = format(dueDateTime, 'yyyy-MM-dd HH:mm:ss');

  return {
    name: data.task,
    dueDatetime: dueDatetimeStr,
    taskType: data.taskType
      ? TYPE_LABELS[data.taskType.toLowerCase()] || data.taskType
      : '',
    taskMode: data.moodType
      ? TYPE_LABELS[data.moodType.toLowerCase()] || data.moodType
      : '',
  };
};
