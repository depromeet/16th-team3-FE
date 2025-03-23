"use client";

import ClearableInput from "@/components/clearableInput/ClearableInput";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import HeaderTitle from "../headerTitle/HeaderTitle";
import SmallActionChip from "../smallActionChip/SmallActionChip";

interface SmallActionInputProps {
	smallAction?: string;
	lastStep?: string;
	onNext: (smallAction: string) => void;
	onEdit: (smallAction: string) => void;
}

const WAITING_TIME = 200;
const MAX_SMALL_ACTION_LENGTH = 15;
const SMALL_ACTION_LIST = ["SitAtTheDesk", "TurnOnTheLaptop", "DrinkWater"];

const SmallActionInput = ({
	smallAction: smallActionHistoryData,
	lastStep,
	onNext,
	onEdit,
}: SmallActionInputProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [isFocused, setIsFocused] = useState(true);
	const [smallAction, setSmallAction] = useState<string>(
		smallActionHistoryData || "",
	);

	const handleSmallActionChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSmallAction(event.target.value);
	};

	const handleInputFocus = (value: boolean) => {
		setIsFocused(value);
	};

	const handleSmallActionClick = (action: string) => {
		setSmallAction(action);
	};

	useEffect(() => {
		if (inputRef.current)
			setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
					setIsFocused(true);
				}
			}, WAITING_TIME);
	}, []);

	return (
		<div className="flex h-full w-full flex-col justify-between">
			<div>
				<HeaderTitle title="어떤 작은 행동부터 시작할래요?" />
				<div className="flex flex-col gap-6">
					<div>
						<ClearableInput
							value={smallAction}
							ref={inputRef}
							title="작은 행동 입력"
							isFocused={isFocused}
							onChange={handleSmallActionChange}
							handleInputFocus={handleInputFocus}
						/>
						{smallAction.length > MAX_SMALL_ACTION_LENGTH && (
							<p className="mt-2 text-sm text-red-500">
								최대 16자 이내로 입력할 수 있어요.
							</p>
						)}
						{smallAction.length === 0 && (
							<div className="mt-3 flex w-full gap-2 overflow-x-auto whitespace-nowrap">
								{SMALL_ACTION_LIST.map((action, index) => (
									<SmallActionChip
										key={index}
										smallAction={action}
										onClick={handleSmallActionClick}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
			<div
				className={`mt-auto transition-all duration-300 ${isFocused ? "mb-[48vh]" : ""}`}
			>
				<Button
					variant="primary"
					className="w-full"
					disabled={
						smallAction.length === 0 ||
						smallAction.length > MAX_SMALL_ACTION_LENGTH
					}
					onClick={
						lastStep === "bufferTime"
							? () => onEdit(smallAction)
							: () => onNext(smallAction)
					}
				>
					{lastStep === "bufferTime" ? "확인" : "다음"}
				</Button>
			</div>
		</div>
	);
};

export default SmallActionInput;
