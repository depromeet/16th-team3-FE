"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
} from "@/components/ui/drawer";
import { useTask } from "@/hooks/useTasks";
import { useUserStore } from "@/store/useUserStore";
import type { Task } from "@/types/task";
import { calculateRemainingTime, parseDateAndTime } from "@/utils/dateFormat";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type TaskDetailSheetProps = {
	isOpen: boolean;
	task: Task;
	onClose: () => void;
	onDelete?: (taskId: number) => void;
	onStart?: (taskId: number) => void;
};

const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({
	isOpen,
	task,
	onClose,
	onDelete,
	onStart,
}) => {
	const router = useRouter();
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [remainingTime, setRemainingTime] = useState("");
	const [isUrgent, setIsUrgent] = useState(false);
	const { userData } = useUserStore();

	// const { data: taskDetail, isLoading } = useTask(task.id);

	// 남은 시간 계산 함수
	const calculateRemainingTimeLocal = useCallback(() => {
		if (!task.dueDate) return "";

		// dueDatetime이 있으면 사용, 없으면 dueDate와 dueTime에서 계산
		let dueDatetime;
		if (task.dueDatetime) {
			dueDatetime = new Date(task.dueDatetime);
		} else if (task.dueDate && task.dueTime) {
			dueDatetime = parseDateAndTime(task.dueDate, task.dueTime || "");
		} else {
			return "";
		}

		const now = new Date();
		const diffMs = dueDatetime.getTime() - now.getTime();

		// 1시간 이내인지 체크 또는 ignoredAlerts가 3 이상인지 확인 또는 status가 procrastinating인지 확인
		setIsUrgent(
			(diffMs <= 60 * 60 * 1000 && diffMs > 0) ||
				(task.ignoredAlerts || 0) >= 3 ||
				task.status === "procrastinating",
		);

		return calculateRemainingTime(dueDatetime);
	}, [task]);

	// 남은 시간 업데이트
	useEffect(() => {
		if (isOpen) {
			setRemainingTime(calculateRemainingTimeLocal());

			const interval = setInterval(() => {
				setRemainingTime(calculateRemainingTimeLocal());
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [isOpen, calculateRemainingTimeLocal]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setShowMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// 닉네임 문자열 처리 (9자 초과시 말줄임표)
	const formatNickname = (name: string) => {
		if (!name) return "";
		if (name.length > 9) {
			return name.substring(0, 9) + "...";
		}
		return name;
	};

	const handleStartTask = () => {
		if (task.id && onStart) {
			onStart(task.id);
		}

		router.push(`/immersion/${task.id}`);
		onClose();
	};

	const handleMoreClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowMenu((prev) => !prev);
	};

	const handleEditTitle = () => {
		if (!isInProgress) {
			router.push(`/edit/deadline-date/${task.id}`);
		}

		setShowMenu(false);
	};

	const handleDelete = () => {
		if (onDelete && task.id) {
			onDelete(task.id);
		}
		setShowMenu(false);
		onClose();
	};

	const formatDueDatetime = () => {
		if (!task.dueDate) return "-";

		// Date 객체로 변환해서 새롭게 포맷팅
		const dueDate = new Date(task.dueDate);
		const month = dueDate.getMonth() + 1;
		const day = dueDate.getDate();
		const dayOfWeek = task.dueDay || "";

		// 시간 처리
		let timeDisplay = "";

		if (task.dueDatetime) {
			const dueDateObj = new Date(task.dueDatetime);
			const hours = dueDateObj.getHours();
			const minutes = dueDateObj.getMinutes();
			const amPm = hours >= 12 ? "오후" : "오전";
			const hour12 = hours % 12 || 12;

			// 자정인 경우
			if (hours === 0 && minutes === 0) {
				timeDisplay = "자정";
			}
			// 그 외의 경우는 'nn:nn' 형식으로 표시
			else {
				// 시와 분을 모두 두 자리 숫자로 포맷팅
				const formattedHour = hour12.toString().padStart(2, "0");
				const formattedMinutes = minutes.toString().padStart(2, "0");
				timeDisplay = `${amPm} ${formattedHour}:${formattedMinutes}`;
			}
		} else if (task.dueTime) {
			timeDisplay = task.dueTime.replace("까지", "");
		}

		return `${month}월 ${day}일 ${dayOfWeek}, ${timeDisplay}`;
	};

	// 진행 중인 태스크인지 확인
	const isInProgress = task.status === "inProgress";
	const personaName = task.persona?.name || "페르소나 없음";
	const personaTriggerAction = task.triggerAction || "노트북 켜기";
	const userNickname = userData?.nickname || "";

	// 이미지 URL 처리
	const personaImageUrl = "/icons/home/happy-character.png";

	// 미리 시작 상태일 때만 화살표 표시 (지금 시작 또는 이어서 몰입일 때는 표시 안함)
	const showArrow = !isInProgress;

	return (
		<Drawer open={isOpen} onDrag={onClose} onAnimationEnd={() => onClose()}>
			<DrawerContent className="w-full rounded-t-[20px] border-0 bg-component-gray-secondary pb-[33px] pt-2">
				<div className="relative mb-[30px] flex items-center justify-between pt-10">
					<DialogHeader className="absolute inset-x-0 text-center">
						<DialogTitle className="t3 text-text-normal">
							{task.title}
						</DialogTitle>
					</DialogHeader>
					<div className="w-6" />
					<button
						ref={buttonRef}
						className="z-10 px-5"
						onClick={handleMoreClick}
					>
						<Image
							src="/icons/home/dots-vertical.svg"
							alt="More"
							width={4}
							height={18}
						/>
					</button>

					{showMenu && (
						<div
							ref={menuRef}
							className="absolute right-[20px] top-[70px] z-10 w-[190px] rounded-[16px] bg-component-gray-tertiary drop-shadow-lg"
						>
							<div className="c2 p-5 pb-0 text-text-alternative">편집</div>
							<div
								className="l3 flex items-center justify-between px-5 py-3 text-text-red"
								onClick={handleDelete}
							>
								삭제하기
								<Image
									src="/icons/home/trashcan.svg"
									alt="Delete"
									width={16}
									height={16}
									className="ml-2"
								/>
							</div>
							<div
								className="l3 flex items-center justify-between px-5 pb-[22px] pt-3 text-text-normal"
								onClick={handleEditTitle}
							>
								할일 이름 바꾸기
								<Image
									src="/icons/home/edit.svg"
									alt="Edit"
									width={16}
									height={16}
									className="ml-2"
								/>
							</div>
						</div>
					)}
				</div>

				<div className="px-5">
					<p className="b3 mb-5 text-center text-text-neutral">
						{personaName}&nbsp;
						{formatNickname(userNickname)}님!
						<br />
						미루지 말고 여유있게 시작해볼까요?
					</p>

					<div className="mb-[12px] flex items-center justify-center">
						<Image
							src={personaImageUrl}
							alt="Character"
							width={120}
							height={120}
						/>
					</div>

					<div className="flex justify-center">
						<Button
							variant="hologram"
							size="sm"
							className="z-10 mb-6 h-[26px] w-auto rounded-[8px] px-[7px] py-[6px] text-text-inverse"
						>
							<span className="l6 text-text-inverse">
								{personaName}&nbsp;{formatNickname(userNickname)}
							</span>
						</Button>
					</div>

					<div>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							className="flex items-center justify-between py-2.5 pt-0"
							onClick={() => {
								if (!isInProgress) {
									router.push(`/edit/deadline-date/${task.id}`);
								}
							}}
						>
							<div className="b2 text-text-alternative">마감일</div>
							<div className="flex items-center">
								<span className="b2 mr-1 text-text-neutral">
									{formatDueDatetime()}
								</span>
								{showArrow && (
									<Image
										src="/icons/home/detail-arrow-right.svg"
										alt="Edit"
										width={20}
										height={20}
									/>
								)}
							</div>
						</div>
					</div>

					<div>
						<div
							className="flex items-center justify-between py-2.5"
							onClick={() => {
								if (!isInProgress) {
									router.push(`/edit/small-action/${task.id}`);
								}
							}}
						>
							<div className="b2 text-text-alternative">작은 행동</div>
							<div className="flex items-center">
								<span className="b2 mr-1 text-text-neutral">
									{personaTriggerAction}
								</span>
								{showArrow && (
									<Image
										src="/icons/home/detail-arrow-right.svg"
										alt="Edit"
										width={20}
										height={20}
									/>
								)}
							</div>
						</div>
					</div>

					<div>
						<div
							className="flex items-center justify-between py-2.5"
							onClick={() => {
								if (!isInProgress) {
									router.push(`/edit/estimated-time/${task.id}`);
								}
							}}
						>
							<div className="b2 text-text-alternative">예상 소요시간</div>
							<div className="flex items-center">
								<span className="b2 mr-1 text-text-neutral">
									{task.timeRequired || "-"}
								</span>
								{showArrow && (
									<Image
										src="/icons/home/detail-arrow-right.svg"
										alt="Edit"
										width={20}
										height={20}
									/>
								)}
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between py-2.5">
						<div className="b2 text-text-alternative">첫 알림</div>
						<div className="flex items-center justify-end">
							<span className={`s2 text-text-neutral mr-1`}>
								{task.triggerActionAlarmTime
									? `${new Date(task.triggerActionAlarmTime).getMonth() + 1}월 ${new Date(task.triggerActionAlarmTime).getDate()}일 (${["일", "월", "화", "수", "목", "금", "토"][new Date(task.triggerActionAlarmTime).getDay()]}), ${new Date(
											task.triggerActionAlarmTime,
										).toLocaleTimeString("ko-KR", {
											hour: "2-digit",
											minute: "2-digit",
											hour12: true,
										})}`
									: "-"}
							</span>
							{showArrow && <span className="mr-5"></span>}
						</div>
					</div>

					<DrawerFooter className="px-0">
						<DrawerClose className="mt-1">
							<Button
								variant={isUrgent ? "hologram" : "primary"}
								size="default"
								className={`l2 w-full ${isUrgent ? "text-text-inverse" : "text-text-strong"} rounded-[16px] py-4`}
								onClick={handleStartTask}
							>
								{isInProgress
									? "이어서 몰입"
									: isUrgent
										? "지금 시작"
										: "미리 시작"}
							</Button>
						</DrawerClose>
						<DrawerClose>
							<button
								className="b2 flex w-full justify-center bg-none pt-4 text-text-neutral"
								onClick={onClose}
							>
								닫기
							</button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default TaskDetailSheet;
