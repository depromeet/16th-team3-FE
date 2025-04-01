"use client";

import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TimePickerType } from "@/types/create";
import { formatDistanceStrict, set } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TaskInputType } from "../../context";
import EstimatedTimePicker from "../estimatedTimePicker/EstimatedTimePicker";
import HeaderTitle from "../headerTitle/HeaderTitle";

interface EstimatedTimeInputProps {
	context: TaskInputType;
	lastStep?: string;
	onNext: ({
		estimatedHour,
		estimatedMinute,
		estimatedDay,
	}: {
		estimatedHour: string;
		estimatedMinute: string;
		estimatedDay: string;
	}) => void;
	onEdit: ({
		estimatedHour,
		estimatedMinute,
		estimatedDay,
	}: {
		estimatedHour: string;
		estimatedMinute: string;
		estimatedDay: string;
	}) => void;
}

// TODO(prgmr99): MUST be refactored
const EstimatedTimeInput = ({
	context: {
		task,
		deadlineDate,
		deadlineTime,
		estimatedHour: historyHourData,
		estimatedMinute: historyMinuteData,
		estimatedDay: historyDayData,
	},
	lastStep,
	onNext,
	onEdit,
}: EstimatedTimeInputProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const hourInputRef = useRef<HTMLInputElement>(null);
	const minuteInputRef = useRef<HTMLInputElement>(null);
	const dayInputRef = useRef<HTMLInputElement>(null);

	const [estimatedHour, setEstimatedHour] = useState<string>(
		historyHourData || "",
	);
	const [estimatedMinute, setEstimatedMinute] = useState<string>(
		historyMinuteData || "",
	);
	const [estimatedDay, setEstimatedDay] = useState<string>(
		historyDayData || "",
	);

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [focusedTab, setFocusedTab] = useState<string | null>("시간");
	const [currentTab, setCurrentTab] = useState(historyDayData ? "일" : "시간");
	const [isOnlyMinute, setIsOnlyMinute] = useState(false);

	const [hourError, setHourError] = useState<{
		isValid: boolean;
		message: string;
	}>({
		isValid: true,
		message: "",
	});

	const [minuteError, setMinuteError] = useState<{
		isValid: boolean;
		message: string;
	}>({
		isValid: true,
		message: "",
	});

	const [dayError, setDayError] = useState<{
		isValid: boolean;
		message: string;
	}>({
		isValid: true,
		message: "",
	});

	const isEmptyValue =
		(currentTab === "시간" &&
			estimatedHour.length === 0 &&
			estimatedMinute.length === 0) ||
		(currentTab === "일" && estimatedDay.length === 0);

	const isInvalidValue =
		!hourError.isValid || !minuteError.isValid || !dayError.isValid;

	const handleToggle = () => {
		setIsOpen((prev) => !prev);
	};

	const convertDeadlineToDate = (date: Date, time: TimePickerType): Date => {
		let hour = Number.parseInt(time.hour, 10);
		const minute = Number.parseInt(time.minute, 10);

		if (time.meridiem === "오전" && hour === 12) {
			hour = 0;
		} else if (time.meridiem === "오후" && hour !== 12) {
			hour += 12;
		}

		return set(date, { hours: hour, minutes: minute, seconds: 0 });
	};

	const formattedDeadline = formatDistanceStrict(
		new Date(),
		convertDeadlineToDate(deadlineDate as Date, deadlineTime as TimePickerType),
		{ addSuffix: true, locale: ko },
	);

	const handleHourChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		type: string,
	) => {
		const numericValue = event.target.value.replace(/[^0-9]/g, "");

		if (type === "시간") {
			setEstimatedHour(numericValue);
		} else if (type === "분") {
			setEstimatedMinute(numericValue);
		} else if (type === "일") {
			setEstimatedDay(numericValue);
		}
	};

	const resetInputValues = () => {
		setEstimatedHour("");
		setEstimatedMinute("");
		setEstimatedDay("");
		setHourError({ isValid: true, message: "" });
		setMinuteError({ isValid: true, message: "" });
		setDayError({ isValid: true, message: "" });
	};

	const handleConfirmButtonClick = () => {
		setIsOpen(false);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const hour = Number.parseInt(estimatedHour, 10) || 0;
		const minute = Number.parseInt(estimatedMinute, 10) || 0;

		const now = new Date();
		const deadlineDateTime = convertDeadlineToDate(
			deadlineDate as Date,
			deadlineTime as TimePickerType,
		);
		const estimatedDurationMs = hour * 3600000 + minute * 60000;

		if (now.getTime() + estimatedDurationMs > deadlineDateTime.getTime()) {
			setHourError({
				isValid: false,
				message: "예상 소요시간이 마감 시간보다 길어요.",
			});
			setMinuteError({ isValid: false, message: "" });

			return;
		}

		if (hour > 23 && minute > 60) {
			setHourError({
				isValid: false,
				message: "시간과 분을 다시 입력해주세요.",
			});
			setMinuteError({ isValid: false, message: "" });
		} else if (hour > 23 && (minute < 61 || minute >= 0)) {
			setHourError({ isValid: false, message: "24시간 이하로 입력해주세요." });
			setMinuteError({ isValid: true, message: "" });
		} else if (minute > 60 && (hour < 24 || hour >= 0)) {
			setHourError({ isValid: true, message: "" });
			setMinuteError({ isValid: false, message: "60분 이하로 입력해주세요." });
		} else {
			setHourError({ isValid: true, message: "" });
			setMinuteError({ isValid: true, message: "" });
		}
	}, [estimatedHour, estimatedMinute, deadlineDate, deadlineTime]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const now = new Date();
		const deadlineDateTime = convertDeadlineToDate(
			deadlineDate as Date,
			deadlineTime as TimePickerType,
		);
		const estimatedDurationMs = Number.parseInt(estimatedDay, 10) * 86400000;

		if (now.getTime() + estimatedDurationMs > deadlineDateTime.getTime()) {
			setDayError({
				isValid: false,
				message: "예상 소요시간이 마감 시간보다 길어요.",
			});
		} else {
			setDayError({ isValid: true, message: "" });
		}
	}, [estimatedDay, deadlineDate, deadlineTime]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setFocusedTab(null);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// TODO(prgmr99): 일 탭 선택 시, 일 Input 바로 focus 되도록

	return (
		<div className="relative flex h-full w-full flex-col justify-between">
			<div ref={containerRef}>
				<HeaderTitle title={`${task} \n얼마나 걸릴 것 같나요?`} />
				<div className="mt-[-28px]">
					<div className="flex gap-1">
						<span className="b2 text-text-alternative">마감:</span>
						<span className="text-text-neutral">{formattedDeadline}</span>
					</div>
				</div>
				<Tabs
					defaultValue="시간"
					value={currentTab}
					onValueChange={(value) => {
						setCurrentTab(value);
						resetInputValues();
					}}
					className="mt-6 w-full p-1"
				>
					<TabsList className="w-full rounded-[10px] bg-component-gray-primary p-1">
						<TabsTrigger
							value="시간"
							className={`l4 w-full p-[10px] ${currentTab === "시간" ? "bg-component-gray-tertiary" : ""} rounded-[8px] h-[32px]`}
						>
							시간
						</TabsTrigger>
						<TabsTrigger
							value="일"
							className={`l4 w-full p-[10px] ${currentTab === "일" ? "bg-component-gray-tertiary" : ""} rounded-[8px] h-[32px]`}
						>
							일
						</TabsTrigger>
					</TabsList>
					<TabsContent value="시간">
						<Drawer
							open={isOpen}
							onDrag={() => setIsOpen(false)}
							onOpenChange={setIsOpen}
						>
							<div className="relative mt-6 w-full">
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<div
									className="relative flex w-full flex-col items-start border-b border-gray-300 pb-2"
									onClick={handleToggle}
								>
									<span
										className={`absolute left-0 text-gray-500 transition-all duration-200 ${
											!estimatedHour && !estimatedMinute
												? "t3 top-1"
												: "text-neutral b3 top-[-8px]"
										}`}
									>
										예상 소요시간 선택
									</span>
									<div className="flex w-full items-center justify-between pt-4">
										<span className="t3 text-base font-semibold">
											{estimatedHour}
											{estimatedMinute}
										</span>
										<ChevronDown
											className={`h-4 w-4 icon-primary transition-transform duration-200 ${
												isOpen ? "rotate-180" : ""
											}`}
										/>
									</div>
								</div>
							</div>

							<DrawerContent className="w-auto border-0 bg-component-gray-secondary px-5 pb-[33px] pt-2">
								<DrawerHeader className="px-0 pb-10 pt-6">
									<DrawerTitle className="t3 text-left">
										예상 소요시간
									</DrawerTitle>
								</DrawerHeader>
								<EstimatedTimePicker />
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
					</TabsContent>
					<TabsContent value="일">
						<div className="relative mt-3 flex w-full flex-col gap-2">
							<span
								className={`b3 ${
									!dayError.isValid
										? "text-red"
										: focusedTab === "일"
											? "text-primary"
											: "text-neutral"
								}`}
							>
								일
							</span>
							{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<div
								className={`focus:border-primary relative flex items-center border-0 border-b transition-colors focus:border-b-component-accent-primary focus:outline-none ${
									!dayError.isValid
										? "border-b-2 border-line-error"
										: focusedTab === "일"
											? "border-b-2 border-b-component-accent-primary"
											: "border-gray-300"
								}`}
								onClick={() => {
									dayInputRef.current?.focus();
									setFocusedTab("일");
								}}
							>
								<Input
									type="text"
									inputMode="decimal"
									className="t3 text-normal border-0 bg-transparent p-0"
									style={{
										minWidth: "1ch",
										width: `${Math.max(estimatedDay.length, 2)}ch`,
										caretColor: "transparent",
									}}
									ref={dayInputRef}
									value={estimatedDay}
									maxLength={2}
									onChange={(event) => handleHourChange(event, "일")}
								/>
								{estimatedDay.length > 0 && (
									<span
										className={`t3 text-normal ${estimatedDay.length === 1 ? "ml-[-14px]" : "ml-[-2px]"} transform`}
									>
										일
									</span>
								)}
							</div>
							{!dayError.isValid && (
								<span className="text-red s3 absolute bottom-[-28px]">
									{dayError.message}
								</span>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>

			<div
				className={
					"fixed flex flex-col w-[100%] bottom-10 pr-10 transition-all duration-300 gap-4"
				}
			>
				<Button
					variant="primary"
					className="w-full"
					disabled={isEmptyValue || isInvalidValue}
					onClick={
						lastStep === "bufferTime"
							? () => onEdit({ estimatedHour, estimatedMinute, estimatedDay })
							: () => onNext({ estimatedHour, estimatedMinute, estimatedDay })
					}
				>
					{lastStep === "bufferTime" ? "확인" : "다음"}
				</Button>
			</div>
		</div>
	);
};

export default EstimatedTimeInput;
