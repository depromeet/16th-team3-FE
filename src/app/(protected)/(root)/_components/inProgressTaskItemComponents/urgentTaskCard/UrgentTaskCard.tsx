import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";
import { AnimatePresence, motion } from "framer-motion";
import TimeDisplaySection from "../TimeDisplaySection";
import Header from "./header/Header";

interface UrgentTaskCardProps {
	task: Task;
	showRemaining: boolean;
	personaImageUrl: string;
	handleContinueClick: (e: React.MouseEvent) => void;
	handleCardClick: (e: React.MouseEvent) => void;
}

const buttonContentVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0, y: -10 },
};

const UrgentTaskCard = ({
	task,
	showRemaining,
	personaImageUrl,
	handleContinueClick,
	handleCardClick,
}: UrgentTaskCardProps) => {
	return (
		<button
			className="bg-gradient-component-01 mb-5 flex h-[282px] w-full flex-col justify-between rounded-[20px] p-4 text-left"
			onClick={handleCardClick}
			type="button"
			aria-label="태스크 상세 보기"
		>
			<Header task={task} personaImageUrl={personaImageUrl} />

			<Button
				variant="hologram"
				onClick={handleContinueClick}
				className="l1 z-10 w-full h-[52px] rounded-[12px] p-3.5 text-center text-text-inverse"
				aria-label="이어서 몰입하기"
			>
				<AnimatePresence mode="wait">
					<motion.div
						key={showRemaining ? "timeDisplay" : "continue"}
						variants={buttonContentVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{ duration: 0.3 }}
					>
						{showRemaining ? <TimeDisplaySection task={task} /> : "이어서 몰입"}
					</motion.div>
				</AnimatePresence>
			</Button>
		</button>
	);
};

export default UrgentTaskCard;
