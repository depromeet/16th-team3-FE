import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CheckboxWithGradientBorder } from "./Checkbox";
import { constants } from "./constants";
import { handleTextareaInput } from "./utils";

import XCircle from "@public/icons/x-circle.svg";

interface SubtaskItemProps {
	goal: {
		id: number;
		name: string;
		isCompleted: boolean;
	};
	isSubmitting: boolean;
	onToggleComplete: (id: number) => void;
	onUpdate: (id: number, name: string) => void;
	onDelete: (id: number) => void;
	onError?: (type: "length" | "maxCount") => void;
}

export const SubtaskItem = ({
	goal,
	isSubmitting,
	onToggleComplete,
	onUpdate,
	onDelete,
	onError,
}: SubtaskItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editingText, setEditingText] = useState(goal.name);
	const editInputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (isEditing && editInputRef.current) {
			const timer = setTimeout(() => {
				if (editInputRef.current) {
					editInputRef.current.focus();
				}
			}, 50);

			return () => clearTimeout(timer);
		}
	}, [isEditing]);

	const handleStartEditing = () => {
		if (isSubmitting) return;

		setIsEditing(true);
		setEditingText(goal.name);

		setTimeout(() => {
			if (editInputRef.current) {
				editInputRef.current.focus();
				editInputRef.current.click();
			}
		}, 100);
	};

	const handleFinishEditing = () => {
		if (
			editingText.trim().length >= 1 &&
			editingText.length <= constants.MAX_DETAIL_GOAL_LENGTH &&
			!isSubmitting
		) {
			onUpdate(goal.id, editingText);
			setIsEditing(false);
		}
	};

	return (
		<li className="flex items-center py-2">
			<div className="mr-3">
				<CheckboxWithGradientBorder
					checked={goal.isCompleted}
					onChange={() => onToggleComplete(goal.id)}
					disabled={isSubmitting}
				/>
			</div>

			{isEditing ? (
				<div className="relative flex-grow">
					<div className="relative w-full flex items-center min-w-0">
						<textarea
							value={editingText}
							onChange={(e) =>
								handleTextareaInput(
									e,
									setEditingText,
									constants.MAX_DETAIL_GOAL_LENGTH,
									onError,
								)
							}
							className={`text-b2 flex-grow min-w-0 break-words border-none bg-transparent p-0 outline-none resize-none overflow-hidden w-4/5 ${
								goal.isCompleted ? "text-gray-neutral" : "text-gray-normal"
							}`}
							style={{
								wordBreak: "break-word",
								display: "block",
								caretColor: "#5D6470",
								height: "auto",
								minHeight: "1.5rem",
							}}
							enterKeyHint="done"
							ref={editInputRef}
							aria-label="세부 목표 수정"
							rows={1}
							disabled={isSubmitting}
						/>
						{editingText && (
							<div className="flex-shrink-0 flex items-center">
								<button
									onClick={handleFinishEditing}
									disabled={
										editingText.trim().length === 0 ||
										editingText.length > constants.MAX_DETAIL_GOAL_LENGTH ||
										isSubmitting
									}
									className="text-s2 text-[#8484E6] mr-4"
									type="button"
									aria-label="세부 목표 수정 완료"
								>
									완료
								</button>
								<button
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
										onDelete(goal.id);
									}}
									className="flex-shrink-0"
									type="button"
									aria-label="세부 목표 삭제"
									disabled={isSubmitting}
								>
									<Image src={XCircle} alt="삭제" width={24} height={24} />
								</button>
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="relative flex-grow">
					<button
						type="button"
						className={`text-b2 break-words cursor-text text-left w-full ${goal.isCompleted ? "text-gray-neutral" : "text-gray-normal"}`}
						style={{
							wordBreak: "break-word",
							display: "block",
							background: "transparent",
							border: "none",
							padding: 0,
							margin: 0,
						}}
						onClick={handleStartEditing}
						aria-label={`${goal.name} 편집하기`}
						disabled={isSubmitting}
					>
						{goal.name}
					</button>
				</div>
			)}
		</li>
	);
};
