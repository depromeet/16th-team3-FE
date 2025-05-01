"use client";

import { usePatchTaskHoldOff } from "@/hooks/useTask";
import type { TaskResponse } from "@/types/task";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Modal from "@/components/modal/Modal";
import Toast from "@/components/toast/Toast";
import Image from "next/image";
import CompleteButton from "./_component/CompleteButton";
import CountSelector from "./_component/CountSelector";
import Header from "./_component/Header";
import RemindLeaveModalContent from "./_component/RemindLeaveModalContent";
import TaskDetails from "./_component/TaskDetails";
import TimesList from "./_component/TimesList";

const REMINDER_LIMITS = {
	MIN: 1,
	MAX: 3,
} as const;

const DEFAULT_VALUES = {
	INTERVAL: 15,
	COUNT: 0,
} as const;

interface ReminderTime {
	index: number;
	time: string;
}

interface ActionRemindPageClientProps {
	initialTask: TaskResponse;
}

const calculateReminderTimes = (
	count: number,
	interval: number,
	baseTime: Date,
): ReminderTime[] => {
	const now = new Date();
	return Array.from({ length: count }, (_, i) => {
		const time = new Date(baseTime.getTime() + interval * 60000 * (i + 1));
		const hours = time.getHours();
		const minutes = time.getMinutes();
		const period = hours >= 12 ? "오후" : "오전";
		const displayHours = hours > 12 ? hours - 12 : hours;

		return {
			index: i + 1,
			time: `${period} ${displayHours}:${minutes.toString().padStart(2, "0")}`,
		};
	});
};

// 리마인더 카운트 관리 커스텀 훅
const useReminderCount = (initialCount: number = DEFAULT_VALUES.COUNT) => {
	const [count, setCount] = useState(initialCount);
	const [toastMessage, setToastMessage] = useState<string>("");
	const [toggleForRepeatableToast, setToggleForRepeatableToast] =
		useState(false);

	const handleCountChange = (action: "increase" | "decrease") => {
		setCount((prev) => {
			if (action === "increase" && prev < REMINDER_LIMITS.MAX) return prev + 1;
			if (action === "decrease" && prev > REMINDER_LIMITS.MIN) return prev - 1;
			return prev;
		});
		if (action === "decrease" && count <= 1) {
			setToggleForRepeatableToast(!toggleForRepeatableToast);
			setToastMessage("최소 1회 이상 설정해주세요.");
		} else if (action === "increase" && count >= REMINDER_LIMITS.MAX) {
			setToggleForRepeatableToast(!toggleForRepeatableToast);
			setToastMessage("최대 3개까지만 설정할 수 있어요.");
		} else {
			setToastMessage("");
		}
	};

	return {
		count,
		setCount,
		handleCountChange,
		toastMessage,
		setToastMessage,
		toggleForRepeatableToast,
		setToggleForRepeatableToast,
	};
};

function formatTimestamp(timestamp: string): string {
	return timestamp.slice(0, 19).replace("T", " ");
	// return timestamp.replace('T', ' ');
}

export default function ActionRemindPageClient({
	initialTask,
}: ActionRemindPageClientProps) {
	const {
		count,
		setCount,
		handleCountChange,
		toastMessage,
		setToastMessage,
		toggleForRepeatableToast,
		setToggleForRepeatableToast,
	} = useReminderCount();
	const [selectedInterval, setSelectedInterval] = useState<number>(
		DEFAULT_VALUES.INTERVAL,
	);
	const { mutate } = usePatchTaskHoldOff();
	const router = useRouter();
	const [openLeaveModal, setOpenLeaveModal] = useState(false);
	const handlePatch = () => {
		if (count === 0) {
			setToggleForRepeatableToast(!toggleForRepeatableToast);
			setToastMessage("최소 1회 이상 설정해주세요.");
			return;
		}
		setToggleForRepeatableToast(!toggleForRepeatableToast);
		setToastMessage("");

		mutate({
			taskId: initialTask?.id.toString() ?? "",
			data: {
				remindInterval: selectedInterval,
				remindCount: count,
				remindBaseTime: formatTimestamp(new Date().toISOString()),
			},
		});
	};

	const reminderTimes = calculateReminderTimes(
		count,
		selectedInterval,
		new Date(),
	);

	const calculateRemainTime = () => {
		const now = new Date();
		const targetTime = new Date(initialTask.dueDatetime);
		const diff = targetTime.getTime() - now.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		if (hours <= 0) {
			return `${minutes}분`;
		}
		return `${hours}시간 ${minutes}분`;
	};

	const handleIncrease = () => {
		if (!validateNextReminderTime()) {
			return;
		}
		handleCountChange("increase");
	};

	const handleDecrease = () => {
		handleCountChange("decrease");
	};

	const validateNextReminderTime = () => {
		const baseTime = new Date();
		const dueDate = new Date(initialTask.dueDatetime);
		const nextReminderTime = new Date(
			baseTime.getTime() + selectedInterval * 60000 * (count + 1),
		);
		if (nextReminderTime.getTime() > dueDate.getTime()) {
			setToggleForRepeatableToast(!toggleForRepeatableToast);
			setToastMessage("선택한 주기가 마감 시간을 초과할 수 없어요.");
			return false;
		}
		return true;
	};

	const handleIntervalChange = (newInterval: number) => {
		setSelectedInterval(newInterval);
		setToggleForRepeatableToast(!toggleForRepeatableToast);
		setToastMessage("");
		setCount(0);
	};

	return (
		<div className="flex h-full flex-col bg-background-primary pb-[30px]">
			{/* TODO : 헤더 컴포넌트로 변경 예정 */}
			<div className="flex items-center px-5 py-[14px]">
				<Image
					src="/icons/common/arrow-left.svg"
					alt="왼쪽 화살표"
					width={24}
					height={24}
					onClick={() => {
						setToastMessage("");
						setOpenLeaveModal(true);
					}}
				/>
			</div>
			{openLeaveModal && (
				<Modal isOpen={openLeaveModal} onClose={() => setOpenLeaveModal(false)}>
					<RemindLeaveModalContent
						setOpenLeaveModal={setOpenLeaveModal}
						taskId={initialTask.id}
					/>
				</Modal>
			)}
			<div className="flex flex-col gap-12">
				{" "}
				{/* Header + Content */}
				<Header maxNotificationCount={REMINDER_LIMITS.MAX} />
				<div>
					{" "}
					{/* Content */}
					<TaskDetails
						taskName={initialTask?.name ?? ""}
						remainingTime={calculateRemainTime()}
						selectedInterval={selectedInterval}
						onIntervalChange={handleIntervalChange}
					/>
					<CountSelector
						count={count}
						onIncrease={handleIncrease}
						onDecrease={handleDecrease}
					/>
					<TimesList times={reminderTimes} />
				</div>
			</div>

			<CompleteButton onClick={handlePatch} disabled={count === 0} />
			{toastMessage && <Toast key={Date.now()} message={toastMessage} />}
		</div>
	);
}
