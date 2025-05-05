import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GradientCheckbox } from "./Checkbox";
import { constants } from "./constants";
import { handleTextareaInput } from "./utils";

import Delete from "@public/icons/immersion/delete.svg";

interface NewSubtaskFormProps {
	onSave: (title: string) => void;
	onCancel: () => void;
	isSubmitting: boolean;
	onError?: (type: "length" | "maxCount") => void;
}

export const NewSubtaskForm = ({
	onSave,
	onCancel,
	isSubmitting,
	onError,
}: NewSubtaskFormProps) => {
	const [newGoalTitle, setNewGoalTitle] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			const timer = setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
				}
			}, 50);

			return () => clearTimeout(timer);
		}
	}, []);

	return (
		<div className="flex items-start py-2">
			<div className="mr-3 mt-[1px] items-center">
				<GradientCheckbox />
			</div>
			<div className="relative flex-grow">
				<div className="relative w-full flex justify-between items-center min-w-0">
					<textarea
						value={newGoalTitle}
						onChange={(e) =>
							handleTextareaInput(
								e,
								setNewGoalTitle,
								constants.MAX_DETAIL_GOAL_LENGTH,
								onError,
							)
						}
						placeholder="세부 목표를 적어주세요"
						className="b2 flex-grow min-w-0 rounded border-none bg-transparent p-0 text-gray-normal outline-none resize-none overflow-hidden w-4/5"
						style={{
							caretColor: "#5D6470",
							height: "auto",
							minHeight: "1.5rem",
						}}
						ref={inputRef}
						enterKeyHint="done"
						aria-label="세부 목표 입력"
						rows={1}
						autoComplete="off"
						autoCorrect="off"
						spellCheck="false"
						disabled={isSubmitting}
					/>
					{newGoalTitle && (
						<div className="flex-shrink-0 flex items-center">
							<button
								onClick={() => onSave(newGoalTitle)}
								disabled={
									newGoalTitle.trim().length === 0 ||
									newGoalTitle.length > constants.MAX_DETAIL_GOAL_LENGTH ||
									isSubmitting
								}
								className="text-s2 text-[#8484E6] mr-4"
								type="button"
								aria-label="세부 목표 생성"
							>
								완료
							</button>
							<button
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setNewGoalTitle("");
									onCancel();
								}}
								className="flex-shrink-0"
								type="button"
								aria-label="추가 취소"
								disabled={isSubmitting}
							>
								<Image src={Delete} alt="취소" width={24} height={24} />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
