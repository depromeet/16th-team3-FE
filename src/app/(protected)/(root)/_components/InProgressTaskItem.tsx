"use client";

import { useRemainingTime } from "@/hooks/useRemainingTime";
import type { Task } from "@/types/task";
import { getPersonaImage } from "@/utils/getPersonaImage";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import TaskDetailBottomSheet from "./inProgressTaskItemComponents/TaskDetailBottomSheet";
import NotUrgentTaskCard from "./inProgressTaskItemComponents/notUrgentTaskCard/NotUrgentTaskCard";
import UrgentTaskCard from "./inProgressTaskItemComponents/urgentTaskCard/UrgentTaskCard";

interface InProgressTaskItemProps {
	task: Task;
	index: number;
	taskType: string;
	onShowDetails?: (task: Task) => void;
}

const InProgressTaskItem: React.FC<InProgressTaskItemProps> = ({
	task,
	index,
	taskType,
	onShowDetails,
}) => {
	const router = useRouter();
	const [showRemaining, setShowRemaining] = useState(true);
	const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);
	const personaImageUrl = getPersonaImage(task.persona?.id);

	const { isUrgent } = useRemainingTime(task);

	const isFirstVisit =
		typeof sessionStorage !== "undefined"
			? sessionStorage.getItem("visited")
			: null;

	/**
	 * * 카드 영역 클릭 시 - TaskDetailSheet 표시
	 */
	const handleCardClick = () => {
		if (onShowDetails) {
			onShowDetails(task);
		}
	};

	/**
	 * * 이어서 몰입 버튼 클릭 시 - 바로 몰입 화면으로 이동
	 * @param e
	 */
	const handleContinueClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/immersion/${task.id}`);
	};

	const handleCloseBottomSheet = () => {
		setShowBottomSheet(false);
	};

	const handleContinueToFocus = useCallback(() => {
		router.push(`/immersion/${task.id}`);
		setShowBottomSheet(false);
	}, [router, task.id]);

	useEffect(() => {
		const toggleInterval = setInterval(() => {
			setShowRemaining((prev) => !prev);
		}, 5000);

		return () => clearInterval(toggleInterval);
	}, []);

	useEffect(() => {
		if (!isFirstVisit && taskType !== "instant") {
			setShowBottomSheet(true);
			if (typeof sessionStorage !== "undefined") {
				sessionStorage.setItem("visited", "true");
			}
		}
	}, [isFirstVisit, taskType]);

	return (
		<>
			{isUrgent ? (
				<UrgentTaskCard
					task={task}
					showRemaining={showRemaining}
					personaImageUrl={personaImageUrl}
					handleContinueClick={handleContinueClick}
					handleCardClick={handleCardClick}
				/>
			) : (
				<NotUrgentTaskCard
					task={task}
					showRemaining={showRemaining}
					personaImageUrl={personaImageUrl}
					handleContinueClick={handleContinueClick}
					handleCardClick={handleCardClick}
				/>
			)}
			{index === 0 && (
				<TaskDetailBottomSheet
					task={task}
					showBottomSheet={showBottomSheet}
					setShowBottomSheet={setShowBottomSheet}
					handleContinueToFocus={handleContinueToFocus}
					handleCloseBottomSheet={handleCloseBottomSheet}
				/>
			)}
		</>
	);
};

export default InProgressTaskItem;
