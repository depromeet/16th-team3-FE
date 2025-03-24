import { Badge } from "@/components/component/Badge";
import IntervalSelector from "./IntervalSelector";

interface TaskDetailsProps {
	taskName: string;
	remainingTime: string;
	selectedInterval: number;
	onIntervalChange: (interval: number) => void;
}

export default function TaskDetails({
	taskName,
	remainingTime,
	selectedInterval,
	onIntervalChange,
}: TaskDetailsProps) {
	return (
		<div className="flex flex-col gap-3 p-5">
			<div className="flex items-center justify-between">
				<p>{taskName}</p>
				<Badge>마감까지 {remainingTime}</Badge>
			</div>
			<IntervalSelector
				selectedInterval={selectedInterval}
				onIntervalChange={onIntervalChange}
			/>
		</div>
	);
}
