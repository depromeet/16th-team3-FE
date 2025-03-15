export interface EditPageProps {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{
    task?: string;
    deadlineDate?: string;
    meridiem?: string;
    hour?: string;
    minute?: string;
    triggerAction?: string;
    estimatedTime?: number;
    triggerActionAlarmTime?: string;
  }>;
}
