import type { Task } from "@/types/task";
import { AnimatePresence, motion } from "framer-motion";
import TimeDisplaySection from "../../TimeDisplaySection";

interface TimeDisplaySectionProps {
	task: Task;
	showRemaining: boolean;
	handleContinueClick: (e: React.MouseEvent) => void;
}

const buttonContentVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0, y: -10 },
};

const Content = ({
	task,
	showRemaining,
	handleContinueClick,
}: TimeDisplaySectionProps) => {
	return (
		<button
			onClick={handleContinueClick}
			className="l1 flex h-[52px] w-full items-center justify-center rounded-[12px] bg-component-accent-primary p-3.5 text-center text-text-strong"
			type="button"
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
		</button>
	);
};

export default Content;
