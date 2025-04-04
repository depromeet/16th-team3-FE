"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import TimePicker from "@/components/timePicker/TimePicker";
import Toast from "@/components/toast/Toast";
import { Button } from "@/components/ui/button";
import type { TimePickerType } from "@/types/create";
import Image from "next/image";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../../../../../components/ui/drawer";

interface TimeSelectedComponentProps {
	deadlineTime: TimePickerType;
	deadlineDate: Date;
	isTimePickerFirstTouched?: boolean;
	handleTimeChange: (time: TimePickerType) => void;
	handleFirstTouchToFalse?: () => void;
}

const TimeSelectedComponent = ({
	deadlineTime,
	deadlineDate,
	isTimePickerFirstTouched,
	handleTimeChange,
	handleFirstTouchToFalse,
}: TimeSelectedComponentProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [temporaryTime, setTemporaryTime] =
		useState<TimePickerType>(deadlineTime);
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const [isMidnight, setIsMidnight] = useState<boolean>(false);
	// ! TODO fix: 마감 시간 undefined 속성 복원시키기 -> isFirstTouched 상태 제거

	const handleToggle = () => {
		setIsOpen((prev) => !prev);

		if (handleFirstTouchToFalse) {
			handleFirstTouchToFalse();
		}
	};

	const handleMeridiem = (newMeridiem: string) => {
		setTemporaryTime((prev) => ({
			...prev,
			meridiem: newMeridiem,
		}));
	};

	const handleHour = (newHour: string) => {
		setTemporaryTime((prev) => ({
			...prev,
			hour: newHour,
		}));
	};

	const handleMinute = (newMinute: string) => {
		setTemporaryTime((prev) => ({
			...prev,
			minute: newMinute,
		}));
	};

	const handleConfirmButtonClick = () => {
		if (temporaryTime === undefined) return;

		handleTimeChange(temporaryTime);
		setIsOpen(false);
	};

	const handleMidnightButtonClick = () => {
		setIsMidnight(true);
		setTemporaryTime({
			hour: "11",
			minute: "59",
			meridiem: "오후",
			second: "59",
		});
		handleTimeChange({
			hour: "11",
			minute: "59",
			meridiem: "오후",
			second: "59",
		});
	};

	const displayedTime = deadlineTime
		? `${deadlineTime.meridiem} ${deadlineTime.hour}:${deadlineTime.minute}`
		: "";

	useEffect(() => {
		const selectedHour12 = Number.parseInt(temporaryTime.hour, 10);
		let selected24Hour = selectedHour12;

		if (temporaryTime.meridiem === "오후" && selectedHour12 !== 12) {
			selected24Hour = selectedHour12 + 12;
		} else if (temporaryTime.meridiem === "오전" && selectedHour12 === 12) {
			selected24Hour = 0;
		}

		const selectedMinute = Number.parseInt(temporaryTime.minute, 10);

		const selectedDate = new Date(
			deadlineDate.getFullYear(),
			deadlineDate.getMonth(),
			deadlineDate.getDate(),
			selected24Hour,
			selectedMinute,
			0,
		);

		if (selectedDate < new Date()) {
			setToastMessage("현재 시간보다 이전 시간을 선택할 수 없어요.");
		} else {
			setToastMessage(null);
		}
	}, [temporaryTime, deadlineDate]);

	return (
		<Drawer open={isOpen} closeThreshold={0.5} onOpenChange={setIsOpen}>
			<DrawerTrigger>
				<div className="relative mt-2 w-full">
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className="relative flex w-full flex-col items-start border-b border-gray-300 pb-2"
						onClick={handleToggle}
					>
						<span
							className={`absolute left-0 text-gray-500 transition-all duration-200 ${
								isTimePickerFirstTouched
									? "t3 top-1"
									: "text-neutral b3 top-[-8px]"
							}`}
						>
							마감시간 선택
						</span>
						<div className="flex w-full items-center justify-between pt-4">
							<span className="t3 text-base font-semibold">
								{isTimePickerFirstTouched ? "" : displayedTime}
							</span>
							<ChevronDown
								className={`h-4 w-4 icon-primary transition-transform duration-200 ${
									isOpen ? "rotate-180" : ""
								}`}
							/>
						</div>
					</div>
				</div>
			</DrawerTrigger>
			<DrawerContent className="w-auto border-0 bg-component-gray-secondary px-5 pb-[33px] pt-2">
				<DrawerHeader className="px-0 pb-10 pt-6">
					<DrawerTitle className="t3 text-left">
						마감시간을 선택해주세요
					</DrawerTitle>
				</DrawerHeader>
				<TimePicker
					time={temporaryTime}
					handleMeridiem={handleMeridiem}
					handleHour={handleHour}
					handleMinute={handleMinute}
				/>
				{toastMessage && <Toast message={toastMessage} />}
				<DrawerFooter className="px-0">
					<div className="flex items-center justify-center space-x-2">
						<label
							htmlFor="midnight"
							className="s2 text-strong mt-0.5 rounded-[2px] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							자정 마감 (11시 59분 59초)
						</label>
						{isMidnight ? (
							<Image
								src="/icons/CheckedBox.svg"
								alt="checkedBox"
								width={20}
								height={20}
								onClick={() => {
									setIsMidnight(false);
									setTemporaryTime(deadlineTime);
								}}
								priority
							/>
						) : (
							<Image
								src="/icons/UnCheckedBox.svg"
								alt="uncheckedBox"
								width={20}
								height={20}
								onClick={handleMidnightButtonClick}
								priority
							/>
						)}
					</div>
					<Button
						variant="primary"
						className="mt-4 flex w-full items-center justify-center"
						disabled={!!toastMessage}
						onClick={handleConfirmButtonClick}
					>
						확인
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default TimeSelectedComponent;
