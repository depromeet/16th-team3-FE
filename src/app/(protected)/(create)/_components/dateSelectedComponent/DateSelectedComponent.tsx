"use client";

import Toast from "@/components/toast/Toast";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "../../../../../components/datePicker/DatePicker";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../../../../../components/ui/drawer";

interface DateSelectedComponentProps {
	deadlineDate: Date | undefined;
	isLastStepBufferTime?: boolean;
	handleDateChange: (date: Date) => void;
}

const DateSelectedComponent = ({
	deadlineDate,
	isLastStepBufferTime,
	handleDateChange,
}: DateSelectedComponentProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [temporaryDate, setTemporaryDate] = useState<Date>(
		deadlineDate ?? new Date(),
	);
	const [toastMessage, setToastMessage] = useState<string | null>(null);

	const today = new Date();
	const todayStart = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	);

	const handleToggle = () => {
		setIsOpen((prev) => !prev);
	};

	const handleTemporaryDate = (date: Date) => {
		if (date < todayStart) {
			if (!toastMessage) {
				setToastMessage("마감일은 오늘 날짜 이후로 설정할 수 있어요.");
			}
			return;
		}

		setTemporaryDate(date || new Date());
		setToastMessage(null);
	};

	const handleConfirmButtonClick = () => {
		if (temporaryDate === undefined) return;

		handleDateChange(temporaryDate);
		setIsOpen(false);
		setToastMessage(null);
	};

	useEffect(() => {
		if (toastMessage) {
			const timer = setTimeout(() => {
				setToastMessage(null);
			}, 2500);
			return () => clearTimeout(timer);
		}
	}, [toastMessage]);

	useEffect(() => {
		if (isLastStepBufferTime) {
			setIsOpen(true);
		}
	}, [isLastStepBufferTime]);

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
								!deadlineDate ? "t3 top-1" : "text-neutral b3 top-[-8px]"
							}`}
						>
							마감일 선택
						</span>
						<div className="flex w-full items-center justify-between pt-4">
							<span className="t3 text-base font-semibold">
								{!deadlineDate
									? ""
									: format(deadlineDate, "M월 d일 (E)", { locale: ko })}
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
						마감일을 선택해주세요
					</DrawerTitle>
				</DrawerHeader>
				<DatePicker
					deadlineDate={temporaryDate}
					handleDateChange={handleTemporaryDate}
				/>
				{toastMessage && <Toast message={toastMessage} />}
				<DrawerFooter className="px-0">
					<Button
						variant="primary"
						className="mt-4 flex w-full items-center justify-center"
						onClick={handleConfirmButtonClick}
					>
						확인
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default DateSelectedComponent;
