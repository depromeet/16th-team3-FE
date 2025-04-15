import { useRemainingTime } from "@/hooks/useRemainingTime";
import type { Task } from "@/types/task";
import Content from "./content/Content";
import Header from "./header/Header";

interface NotUrgentTaskCardProps {
	task: Task;
	showRemaining: boolean;
	personaImageUrl: string;
	handleContinueClick: (e: React.MouseEvent) => void;
	handleCardClick: (e: React.MouseEvent) => void;
}

const NotUrgentTaskCard = ({
	task,
	showRemaining,
	personaImageUrl,
	handleContinueClick,
	handleCardClick,
}: NotUrgentTaskCardProps) => {
	const { remainingTime, isExpired, isUrgent } = useRemainingTime(task);

	return (
		<>
			<button
				className="mb-5 rounded-[20px] bg-component-gray-secondary p-4 w-full text-left"
				onClick={handleCardClick}
				type="button"
				aria-label="태스크 상세 보기"
			>
				<Header task={task} personaImageUrl={personaImageUrl} />

				<Content
					task={task}
					showRemaining={showRemaining}
					handleContinueClick={handleContinueClick}
				/>
			</button>
		</>
	);
};

export default NotUrgentTaskCard;
