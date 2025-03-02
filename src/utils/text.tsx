import { TaskTypeInputType, TYPE_LABELS } from '@/app/create/context';
import { ScheduledTaskType } from '@/types/create';
import { format, set, subMinutes } from 'date-fns';

const transformScheduledTaskData = (
  front: TaskTypeInputType,
): ScheduledTaskType => {
  const deadlineDateObj = new Date(front.deadlineDate);
  let hour = Number(front.deadlineTime.hour);
  const minute = Number(front.deadlineTime.minute);

  if (front.deadlineTime.meridiem === '오후' && hour < 12) {
    hour += 12;
  } else if (front.deadlineTime.meridiem === '오전' && hour === 12) {
    hour = 0;
  }
  const dueDateTime = set(deadlineDateObj, {
    hours: hour,
    minutes: minute,
    seconds: 0,
  });
  const dueDatetimeStr = format(dueDateTime, 'yyyy-MM-dd HH:mm:ss');

  const days = front.estimatedDay ? Number(front.estimatedDay) : 0;
  const hours = front.estimatedHour ? Number(front.estimatedHour) : 0;
  const minutes = front.estimatedMinute ? Number(front.estimatedMinute) : 0;
  const totalEstimatedMinutes = days * 1440 + hours * 60 + minutes;
  const scaledEstimatedMinutes = totalEstimatedMinutes * 1.5;
  const alarmDateTime = subMinutes(dueDateTime, scaledEstimatedMinutes);
  const triggerActionAlarmTimeStr = format(
    alarmDateTime,
    'yyyy-MM-dd HH:mm:ss',
  );

  return {
    name: front.task,
    dueDatetime: dueDatetimeStr,
    triggerAction: front.smallAction,
    estimatedTime: totalEstimatedMinutes,
    triggerActionAlarmTime: triggerActionAlarmTimeStr,
    taskType: TYPE_LABELS[front.taskType.toLowerCase()] || front.taskType,
    taskMode: TYPE_LABELS[front.moodType.toLowerCase()] || front.moodType,
  };
};

export default transformScheduledTaskData;
