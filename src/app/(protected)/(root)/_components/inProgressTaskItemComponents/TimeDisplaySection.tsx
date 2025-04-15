import { useRemainingTime } from "@/hooks/useRemainingTime";
import type { Task } from "@/types/task";
import TimeDisplay from "./TimeDisplay";

interface TimeDisplaySectionProps {
	task: Task;
}

const TimeDisplaySection = ({ task }: TimeDisplaySectionProps) => {
	const { remainingTime, isExpired, isUrgent } = useRemainingTime(task);

	return isExpired ? (
		<span className="text-red-500">{remainingTime}</span>
	) : (
		<TimeDisplay time={remainingTime} isUrgent={isUrgent} />
	);
};

export default TimeDisplaySection;
