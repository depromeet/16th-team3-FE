"use client";

import Modal from "@/components/modal/Modal";
import Toast from "@/components/toast/Toast";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TimePickerType } from "@/types/create";
import { getTimeRemaining } from "@/utils/dateFormat";
import { formatDistanceStrict, set } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { TaskInputType } from "../../context";
import EstimatedDayPicker from "../estimatedDayPicker/EstimatedDayPicker";
import EstimatedTimePicker from "../estimatedTimePicker/EstimatedTimePicker";
import HeaderTitle from "../headerTitle/HeaderTitle";
import LestThanFiveMinuteModalContent from "../lessThanFiveMinuteModalContent/LessThanFiveMinuteModalContent";

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
	onJumpToTaskTypeInput: () => void;
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
	onJumpToTaskTypeInput,
}: EstimatedTimeInputProps) => {
	const [estimatedHour, setEstimatedHour] = useState<string>(
		historyHourData || "",
	);
	const [estimatedMinute, setEstimatedMinute] = useState<string>(
		historyMinuteData || "",
	);
	const [estimatedDay, setEstimatedDay] = useState<string>(
		historyDayData || "",
	);

	const [tempEstimatedHour, setTempEstimatedHour] = useState<string>("");
	const [tempEstimatedMinute, setTempEstimatedMinute] = useState<string>("");
	const [tempEstimatedDay, setTempEstimatedDay] = useState<string>("");

	const [isOpenTime, setIsOpenTime] = useState<boolean>(false);
	const [isOpenDay, setIsOpenDay] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [currentTab, setCurrentTab] = useState(historyDayData ? "일" : "시간");
	const [toastMessage, setToastMessage] = useState<string>("");

	const isEmptyValue =
		(currentTab === "시간" &&
			estimatedHour.length === 0 &&
			estimatedMinute.length === 0) ||
		(currentTab === "일" && estimatedDay.length === 0);

	const handleToggle = () => {
		setIsOpenTime((prev) => !prev);
	};

	const convertDeadlineToDate = (date: Date, time: TimePickerType): Date => {
		let hour = Number.parseInt(time.hour, 10);
		const minute = Number.parseInt(time.minute, 10);

		if (time.meridiem === "오전" && hour === 12) {
			hour = 0;
		} else if (time.meridiem === "오후" && hour !== 12) {
			hour += 12;
		}

		return set(date, { hours: hour, minutes: minute, seconds: 59 });
	};

	const deadline = convertDeadlineToDate(
		deadlineDate as Date,
		deadlineTime as TimePickerType,
	);

	const { days, hours, minutes } = getTimeRemaining(deadline);

	const formattedDeadline = formatDistanceStrict(new Date(), deadline, {
		addSuffix: true,
		locale: ko,
		roundingMethod: "ceil",
	});

	const resetInputValues = () => {
		setEstimatedHour("");
		setEstimatedMinute("");
		setEstimatedDay("");
	};

	const handleHourSelect = (hour: string) => {
		setTempEstimatedHour(hour);
	};

	const handleMinuteSelect = (minute: string) => {
		setTempEstimatedMinute(minute);
	};

	const handleDaySelect = (day: string) => {
		setTempEstimatedDay(day);
	};

	const handleTimeConfirmButtonClick = () => {
		setEstimatedHour(tempEstimatedHour);
		setEstimatedMinute(tempEstimatedMinute);
		setTempEstimatedHour("");
		setTempEstimatedMinute("");
		setIsOpenTime(false);
	};

	const handleDayConfirmButtonClick = () => {
		setEstimatedDay(tempEstimatedDay);
		setTempEstimatedDay("");
		setIsOpenDay(false);
	};

	useEffect(() => {
		if (
			tempEstimatedHour === "00" &&
			tempEstimatedMinute === "00" &&
			currentTab === "시간"
		) {
			setToastMessage("올바른 시간을 설정해주세요.");
		} else if (tempEstimatedDay === "00" && currentTab === "일") {
			setToastMessage("올바른 시간을 설정해주세요.");
		} else {
			setToastMessage("");
		}
	}, [currentTab, tempEstimatedHour, tempEstimatedMinute, tempEstimatedDay]);

	useEffect(() => {
		if (minutes <= 5 && hours === 0 && days === 0) {
			setIsModalOpen(true);
		} else {
			setIsModalOpen(false);
		}
	}, [minutes, hours, days]);

	return (
		<>
			<div className="relative flex h-full w-full flex-col justify-between">
				<div>
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
						{days > 0 && (
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
						)}
						<TabsContent value="시간">
							<Drawer
								open={isOpenTime}
								closeThreshold={0.5}
								onOpenChange={setIsOpenTime}
							>
								<DrawerTrigger className="w-full" asChild>
									<div className="relative mt-6 w-full">
										{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
										<div
											className="relative flex w-full flex-col items-start border-b border-gray-300 pb-2"
											onClick={handleToggle}
										>
											<span
												className={`absolute left-0 text-gray-500 transition-all duration-200 ${
													estimatedHour === "" && estimatedMinute === ""
														? "t3 top-1"
														: "text-neutral b3 top-[-8px]"
												}`}
											>
												예상 소요시간 선택
											</span>
											<div className="flex w-full items-center justify-between pt-4">
												<span className="t3 text-base font-semibold">
													{`${Number(estimatedHour) > 0 ? `${Number(estimatedHour)}시간` : ""} 
											${Number(estimatedMinute) > 0 ? ` ${Number(estimatedMinute)}분` : ""}`}
												</span>

												<ChevronDown
													className={`h-4 w-4 icon-primary transition-transform duration-200 ${
														isOpenTime ? "rotate-180" : ""
													}`}
												/>
											</div>
										</div>
									</div>
								</DrawerTrigger>

								<DrawerContent className="w-auto border-0 bg-component-gray-secondary px-5 pb-[33px] pt-2">
									<DrawerHeader className="px-0 pb-10 pt-6">
										<DrawerTitle className="t3 text-left">
											예상 소요시간
										</DrawerTitle>
									</DrawerHeader>
									<EstimatedTimePicker
										leftHours={days > 0 ? 24 : hours}
										leftMinutes={minutes}
										handleHourSelect={handleHourSelect}
										handleMinuteSelect={handleMinuteSelect}
									/>
									{toastMessage && <Toast message={toastMessage} />}
									<DrawerFooter className="px-0">
										<Button
											variant="primary"
											className="mt-4 flex w-full items-center justify-center"
											disabled={!!toastMessage}
											onClick={handleTimeConfirmButtonClick}
										>
											확인
										</Button>
									</DrawerFooter>
								</DrawerContent>
							</Drawer>
						</TabsContent>
						<TabsContent value="일">
							<Drawer
								open={isOpenDay}
								closeThreshold={0.5}
								onOpenChange={setIsOpenDay}
							>
								<DrawerTrigger className="w-full" asChild>
									<div className="relative mt-6 w-full">
										{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
										<div
											className="relative flex w-full flex-col items-start border-b border-gray-300 pb-2"
											onClick={handleToggle}
										>
											<span
												className={`absolute left-0 text-gray-500 transition-all duration-200 ${
													estimatedDay === ""
														? "t3 top-1"
														: "text-neutral b3 top-[-8px]"
												}`}
											>
												예상 소요일 선택
											</span>
											<div className="flex w-full items-center justify-between pt-4">
												<span className="t3 text-base font-semibold">
													{`${Number(estimatedDay) > 0 ? `${Number(estimatedDay)}일` : ""}`}
												</span>
												<ChevronDown
													className={`h-4 w-4 icon-primary transition-transform duration-200 ${
														isOpenTime ? "rotate-180" : ""
													}`}
												/>
											</div>
										</div>
									</div>
								</DrawerTrigger>
								<DrawerContent className="w-auto border-0 bg-component-gray-secondary px-5 pb-[33px] pt-2">
									<DrawerHeader className="px-0 pb-10 pt-6">
										<DrawerTitle className="t3 text-left">
											예상 소요일
										</DrawerTitle>
									</DrawerHeader>
									<EstimatedDayPicker
										leftDays={days}
										handleDaySelect={handleDaySelect}
									/>
									<DrawerFooter className="px-0">
										<Button
											variant="primary"
											className="mt-4 flex w-full items-center justify-center"
											onClick={handleDayConfirmButtonClick}
										>
											확인
										</Button>
									</DrawerFooter>
								</DrawerContent>
							</Drawer>
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
						disabled={isEmptyValue}
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

			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<LestThanFiveMinuteModalContent onNext={onJumpToTaskTypeInput} />
			</Modal>
		</>
	);
};

export default EstimatedTimeInput;
