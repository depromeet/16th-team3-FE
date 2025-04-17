import { useState } from "react";

const RetrospectCommentContent = ({
	retrospectContent,
	setRetrospectContent,
}: RetrospectContentProps) => {
	const MAX_LENGTH = 100;

	const [isFocused, setIsFocused] = useState(false);
	const [isOverMaxLength, setIsOverMaxLength] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		if (value.length <= MAX_LENGTH) {
			setRetrospectContent((prev) => ({
				...prev,
				comment: value,
			}));
			setIsOverMaxLength(false);
		} else {
			setIsOverMaxLength(true);
		}
	};

	const setUnfocused = () => {
		setIsFocused(false);
		setIsOverMaxLength(false);
	};

	const commentBoxBorder = () => {
		if (isOverMaxLength) {
			return commentBoxBorders.error;
		}
		if (isFocused) {
			return commentBoxBorders.focused;
		}
		return commentBoxBorders.default;
	};
	const commentBoxBorders = {
		default: "",
		focused: "outline outline-line-accent",
		error: "outline outline-line-error",
	};

	const commentBoxInfoTextColor = () => {
		if (isOverMaxLength) {
			return "text-component-accent-red";
		}
		return "text-gray-alternative";
	};

	return (
		<div
			className={`flex flex-col w-full gap-3 px-4 py-3 bg-component-gray-tertiary rounded-[11.25px] ${commentBoxBorder()}`}
		>
			<textarea
				value={retrospectContent.comment}
				onChange={handleChange}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setUnfocused()}
				placeholder="좋았던 점과 개선할 점을 간단히 작성해주세요."
				className="w-full h-20 bg-component-gray-tertiary b2 text-gray-normal placeholder-text-gray-normal 
                     resize-none focus:outline-none"
			/>

			<div
				className={`flex justify-between c2 text-right ${commentBoxInfoTextColor()}`}
			>
				<span>{isOverMaxLength ? "100자 이내로 입력할 수 있어요." : ""}</span>
				<span>
					{retrospectContent.comment.length} / {MAX_LENGTH}자
				</span>
			</div>
		</div>
	);
};

export default RetrospectCommentContent;
