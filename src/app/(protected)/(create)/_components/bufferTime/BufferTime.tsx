"use client";

import { Button } from "@/components/ui/button";
import type { BufferTimeDataType } from "@/types/create";
import {
	calculateTriggerActionAlarmTime,
	combineDeadlineDateTimeToDate,
} from "@/utils/dateFormat";
import formatBufferTime from "@/utils/formatBufferTime";
import getAvailableMultipliers from "@/utils/getAvailableMultipliers";
import getBufferTime from "@/utils/getBufferTime";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface BufferTimeProps {
	context: BufferTimeDataType;
	handleDeadlineModify: () => void;
	handleSmallActionModify: () => void;
	handleEstimatedTimeModify: () => void;
	onNext: () => void;
}

const BufferTime = ({
	context,
	handleDeadlineModify,
	handleSmallActionModify,
	handleEstimatedTimeModify,
	onNext,
}: BufferTimeProps) => {
	const {
		task,
		deadlineDate,
		deadlineTime,
		smallAction,
		estimatedHour,
		estimatedMinute,
		estimatedDay,
	} = context;

	const [isOpen, setIsOpen] = useState(false);
	const [currentRatio, setCurrentRatio] = useState(1.5);

	const formattedDate = format(deadlineDate, "M월 d일 (E)", { locale: ko });

	const deadlineDateTime = combineDeadlineDateTimeToDate({
		deadlineDate,
		deadlineTime,
	});

	const availableMultipliers = getAvailableMultipliers(
		deadlineDateTime,
		estimatedDay,
		estimatedHour,
		estimatedMinute,
	);

	const { finalDays, finalHours, finalMinutes } = getBufferTime(
		deadlineDateTime,
		estimatedDay,
		estimatedHour,
		estimatedMinute,
		currentRatio,
	);

	const calculatedTriggerActionAlarmTime = calculateTriggerActionAlarmTime(
		deadlineDate,
		deadlineTime,
		finalDays,
		finalHours,
		finalMinutes,
	);

	const formattedAlarmTime = format(
		calculatedTriggerActionAlarmTime,
		"M월 d일 (EEE) a hh:mm",
		{
			locale: ko,
		},
	);

	const timeString = formatBufferTime({
		days: finalDays,
		hours: finalHours,
		minutes: finalMinutes,
	});

	const handleToggle = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<div className="relative flex h-full w-full flex-col justify-between">
			<div className="relative mt-[0.1vh]">
				<div className="flex flex-col items-center gap-3">
					<Image src="/icons/Bell.svg" alt="bell" width={60} height={60} />
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className="relative flex h-[26px] items-center gap-1 overflow-hidden rounded-[8px] px-[7px] py-[6px] text-black before:absolute before:inset-0 before:-z-10 before:bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] before:[transform:scale(4,1)]"
						onClick={handleToggle}
					>
						<span className="l6 text-inverse">{`${currentRatio}배의 여유시간 적용`}</span>
						<Image
							src="/icons/edit-dark.svg"
							alt="edit"
							width={14}
							height={14}
						/>
					</div>
					{isOpen && (
						<div className="absolute left-20 top-28 w-[189px] pt-5 pb-[10px] px-5 bg-component-gray-tertiary rounded-[16px] shadow-[0px_0px_14px_2px_rgba(18,18,18,0.5)]">
							<span className="c2 text-gray-alternative">여유시간</span>
							{availableMultipliers.map((multiplier) => (
								// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
								<div
									key={multiplier}
									className={`flex items-center justify-between py-[10px] l3 ${currentRatio === multiplier ? "text-primary" : "text-gray-normal"}`}
									onClick={() => {
										setCurrentRatio(multiplier);
										setIsOpen(false);
									}}
								>
									<span>{`${multiplier}배`}</span>
									{currentRatio === multiplier && (
										<Image
											src="/check-primary.svg"
											alt="check"
											width={20}
											height={20}
										/>
									)}
								</div>
							))}
						</div>
					)}
				</div>
				<div className="bg-blur-purple absolute left-0 right-0 top-20 z-[-1] h-[240px] w-[100vw] blur-[75px]" />
				<div className="z-50 mt-[3vh] flex flex-col items-center">
					<div>
						<span className="t2 text-primary">{timeString}</span>
						<span className="t2 text-strong"> 전에는</span>
					</div>
					<span className="t2 text-strong">시작할 수 있게</span>
					<span className="t2 text-strong">작은 행동 알림을 보낼게요</span>
					<span className="b3 text-neutral mt-6">
						{formattedAlarmTime} 첫 알림
					</span>
				</div>
			</div>
			<div className="fixed bottom-10 w-[100%] pr-10 transition-all duration-300">
				<div className="mb-9 flex flex-col items-start gap-5">
					<span className="text-normal s2">{task}</span>
					<div className="flex w-full items-center justify-between">
						<span className="b2 text-alternative mt-[2px]">마감일</span>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div className="flex items-center" onClick={handleDeadlineModify}>
							<span className="b2 text-neutral mt-[2px]">
								{`${formattedDate}, ${deadlineTime.meridiem} ${deadlineTime.hour}:${deadlineTime.minute}`}
							</span>
							<ChevronRight
								width={20}
								height={20}
								className="text-icon-secondary"
							/>
						</div>
					</div>
					<div className="flex w-full items-center justify-between">
						<span className="b2 text-alternative mt-[2px]">작은 행동</span>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							className="flex items-center"
							onClick={handleSmallActionModify}
						>
							<span className="b2 text-neutral mt-[2px]">{smallAction}</span>
							<ChevronRight
								width={20}
								height={20}
								className="text-icon-secondary"
							/>
						</div>
					</div>
					<div className="flex w-full items-center justify-between">
						<span className="b2 text-alternative mt-[2px]">예상 소요시간</span>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							className="flex items-center"
							onClick={handleEstimatedTimeModify}
						>
							<span className="b2 text-neutral mt-[2px]">
								{[
									Number(estimatedHour) > 0 && `${Number(estimatedHour)}시간`,
									Number(estimatedMinute) > 0 && `${Number(estimatedMinute)}분`,
									Number(estimatedDay) > 0 && `${Number(estimatedDay)}일`,
								]
									.filter(Boolean)
									.join(" ")}
							</span>
							<ChevronRight
								width={20}
								height={20}
								className="text-icon-secondary"
							/>
						</div>
					</div>
				</div>
				<Button variant="primary" onClick={onNext}>
					다음
				</Button>
			</div>
		</div>
	);
};

export default BufferTime;
