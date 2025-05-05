"use client";

import {
	useCreateSubtask,
	useDeleteSubtask,
	useSubtasks,
	useUpdateSubtask,
} from "@/hooks/useSubtasks";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { NewSubtaskForm } from "./NewSubtaskForm";
import { SubtaskItem } from "./SubtaskItem";
import { constants } from "./constants";

import Plus from "@public/icons/immersion/plus.svg";

interface DetailGoalsProps {
	taskId: number;
	onError: (type: "length" | "maxCount") => void;
	onDeleteClick?: () => void;
	handleInputFocus?: (value: boolean) => void;
}

export default function DetailGoals({ taskId, onError }: DetailGoalsProps) {
	const [isAddingGoal, setIsAddingGoal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// API 연동 훅 사용
	const { data: subtasks = [], isLoading } = useSubtasks(taskId);
	const { mutate: createSubtaskMutation } = useCreateSubtask();
	const { mutate: updateSubtaskMutation } = useUpdateSubtask();
	const { mutate: deleteSubtaskMutation } = useDeleteSubtask();

	// 로컬 상태로 서브태스크 관리 (삭제 즉시 UI 반영)
	const [localSubtasks, setLocalSubtasks] = useState<typeof subtasks>([]);

	// 이전 subtasks 값을 저장할 ref
	const prevSubtasksRef = useRef<typeof subtasks>([]);

	// subtasks가 업데이트되면 localSubtasks도 업데이트 (깊은 비교를 통해 무한 루프 방지)
	useEffect(() => {
		// subtasks가 실제로 변경되었는지 확인
		const subtasksChanged =
			JSON.stringify(prevSubtasksRef.current) !== JSON.stringify(subtasks);

		// 실제 변경이 있을 때만 localSubtasks 업데이트
		if (subtasksChanged) {
			setLocalSubtasks(subtasks);
			prevSubtasksRef.current = subtasks;
		}
	}, [subtasks]);

	// 세부 목표 추가 핸들러
	const handleAddGoal = () => {
		if (subtasks.length >= constants.MAX_DETAIL_GOALS_COUNT) {
			if (onError) {
				onError("maxCount");
			}
			return;
		}
		setIsAddingGoal(true);
	};

	// 새 목표 저장 핸들러
	const handleSaveGoal = (title: string) => {
		const trimmedTitle = title.trim();
		if (
			trimmedTitle.length >= 1 &&
			trimmedTitle.length <= constants.MAX_DETAIL_GOAL_LENGTH &&
			!isSubmitting
		) {
			setIsSubmitting(true);

			createSubtaskMutation(
				{ taskId, name: trimmedTitle },
				{
					onSuccess: () => {
						setIsAddingGoal(false);
						setIsSubmitting(false);
					},
					onError: () => {
						setIsSubmitting(false);
					},
				},
			);
		}
	};

	// 완료 상태 토글 핸들러
	const handleToggleComplete = (goalId: number) => {
		if (isSubmitting) return;

		const goal = subtasks.find((subtask) => subtask.id === goalId);
		if (goal) {
			setIsSubmitting(true);

			updateSubtaskMutation(
				{
					id: goalId,
					taskId,
					isCompleted: !goal.isCompleted,
				},
				{
					onSuccess: () => {
						setIsSubmitting(false);
					},
					onError: () => {
						setIsSubmitting(false);
					},
				},
			);
		}
	};

	// 목표 업데이트 핸들러
	const handleUpdateSubtask = (goalId: number, name: string) => {
		if (
			name.trim().length >= 1 &&
			name.length <= constants.MAX_DETAIL_GOAL_LENGTH &&
			!isSubmitting
		) {
			setIsSubmitting(true);

			updateSubtaskMutation(
				{
					id: goalId,
					taskId,
					name,
				},
				{
					onSuccess: () => {
						setIsSubmitting(false);
					},
					onError: () => {
						setIsSubmitting(false);
					},
				},
			);
		}
	};

	// 세부 목표 삭제 핸들러
	const handleDeleteSubtask = (goalId: number) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		// UI에서 즉시 항목 제거 (낙관적 업데이트)
		setLocalSubtasks((prev) => prev.filter((goal) => goal.id !== goalId));

		deleteSubtaskMutation(
			{ id: goalId, taskId },
			{
				onSuccess: () => {
					setIsSubmitting(false);
				},
				onError: () => {
					setIsSubmitting(false);
				},
			},
		);
	};

	// 완료되지 않은 목표와 완료된 목표를 분리하여 정렬
	const sortedGoals = [...localSubtasks].sort((a, b) =>
		a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1,
	);

	const backgroundStyle = {
		borderRadius: "var(--16, 16px)",
		background:
			"linear-gradient(180deg, rgba(121, 121, 235, 0.30) 0%, rgba(121, 121, 235, 0.10) 29.17%, rgba(121, 121, 235, 0.00) 100%), var(--Component-Gray-Primary, #17191F)",
	};

	if (isLoading) {
		return (
			<div className="w-full p-4" style={backgroundStyle}>
				<div className="py-4 text-center text-gray-disabled">로딩 중...</div>
			</div>
		);
	}

	return (
		<div className="w-full p-4" style={backgroundStyle}>
			<div className="flex items-center justify-between mb-4">
				<h2 className="s1 text-gray-strong">세부 목표</h2>
				<button
					onClick={handleAddGoal}
					aria-label="세부 목표 추가"
					className="flex items-center justify-center"
					type="button"
					disabled={isSubmitting}
				>
					<Image src={Plus} alt="추가" width={24} height={24} />
				</button>
			</div>

			{localSubtasks.length === 0 && !isAddingGoal ? (
				<button
					type="button"
					className="py-2 text-start text-gray-disabled cursor-pointer w-full"
					onClick={handleAddGoal}
					aria-label="세부 목표 추가하기"
					disabled={isSubmitting}
				>
					<p className="text-b2">세부 목표를 추가하세요</p>
				</button>
			) : (
				<ul className="flex flex-col">
					{sortedGoals.map((goal) => (
						<SubtaskItem
							key={goal.id}
							goal={goal}
							isSubmitting={isSubmitting}
							onToggleComplete={handleToggleComplete}
							onUpdate={handleUpdateSubtask}
							onDelete={handleDeleteSubtask}
							onError={onError}
						/>
					))}
				</ul>
			)}

			{isAddingGoal && (
				<NewSubtaskForm
					onSave={handleSaveGoal}
					onCancel={() => setIsAddingGoal(false)}
					isSubmitting={isSubmitting}
					onError={onError}
				/>
			)}
		</div>
	);
}
