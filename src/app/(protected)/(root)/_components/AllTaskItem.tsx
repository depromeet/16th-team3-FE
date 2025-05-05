import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";
import { convertEstimatedTime } from "@/utils/dateFormat";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import HomeClock from "@public/icons/home/clock.svg";
import HomeDotVertical from "@public/icons/home/dots-vertical.svg";
import TrashCan from "@public/icons/home/trashcan.svg";

type AllTaskItemProps = {
	task: Task;
	onClick: (task: Task) => void;
	onDelete: (taskId: number) => void;
};

const AllTaskItem: React.FC<AllTaskItemProps> = ({
	task,
	onClick,
	onDelete,
}) => {
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const truncatedTitle =
		task.title.length > 16 ? `${task.title.substring(0, 16)}...` : task.title;

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

	const handleMoreClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowMenu((prev) => !prev);
	};

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowMenu(false);
		onDelete(task.id);
	};

	const handleTaskClick = () => {
		if (!showMenu) {
			onClick(task);
		}
	};

	const renderDayChip = () => {
		// D-Day 계산 - dDayCount가 없는 경우 직접 계산
		let dDayCount: number | undefined = task.dDayCount;
		if (dDayCount === undefined) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const dueDate = task.dueDatetime
				? new Date(task.dueDatetime)
				: task.dueDate
					? new Date(task.dueDate)
					: null;

			if (dueDate) {
				const dueDay = new Date(dueDate);
				dueDay.setHours(0, 0, 0, 0);

				// 날짜 차이를 일 단위로 계산
				const diffTime = dueDay.getTime() - today.getTime();
				dDayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			} else {
				// 날짜 정보가 없는 경우 기본값 설정
				dDayCount = 0;
			}
		}

		let dDayText: string;
		if (dDayCount > 0) {
			// 미래 날짜 (D-Day)
			dDayText = dDayCount > 99 ? "D-99+" : `D-${dDayCount}`;
		} else if (dDayCount < 0) {
			// 지난 날짜 (D+Day) - 음수값을 양수로 변환
			const daysPassed = Math.abs(dDayCount);
			dDayText = daysPassed > 99 ? "D+99+" : `D+${daysPassed}`;
		} else {
			// 오늘인 경우
			dDayText = "D-DAY";
		}

		// 타입이 없는 경우 날짜 기반으로 타입 추론
		let taskType: string | undefined = task.type;
		if (!taskType) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const dueDate = task.dueDatetime
				? new Date(task.dueDatetime)
				: task.dueDate
					? new Date(task.dueDate)
					: null;

			if (dueDate) {
				const dueDay = new Date(dueDate);
				dueDay.setHours(0, 0, 0, 0);

				if (dueDay.getTime() === today.getTime()) {
					taskType = "today";
				} else {
					// 월요일~일요일 주간 범위 계산
					const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
					const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

					const mondayOfThisWeek = new Date(today);
					mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);

					const sundayOfThisWeek = new Date(mondayOfThisWeek);
					sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
					sundayOfThisWeek.setHours(23, 59, 59, 999);

					if (dueDay > today && dueDay <= sundayOfThisWeek) {
						taskType = "weekly";
					}
				}
			}
		}

		if (taskType === "today") {
			return (
				<Button
					variant="hologram"
					size="sm"
					className="z-10 flex h-auto items-center justify-center rounded-[6px] px-[15px] py-[3px] text-text-inverse"
					type="button"
				>
					<span className="c2 flex items-center justify-center">D-DAY</span>
				</Button>
			);
		}

		if (taskType === "weekly") {
			return (
				<div className="flex items-center justify-center rounded-[6px] bg-component-accent-secondary px-[15px] py-[3px] text-text-primary">
					<span className="c2 flex items-center justify-center">
						{dDayText}
					</span>
				</div>
			);
		}

		return (
			<div className="flex items-center justify-center rounded-[6px] bg-component-gray-tertiary px-[15px] py-[3px] text-text-neutral">
				<span className="c2 flex items-center justify-center">{dDayText}</span>
			</div>
		);
	};

	// 날짜 및 시간 표시 형식 수정
	const formatDateTime = () => {
		// dueDatetime에서 날짜와 시간 정보 추출
		let dueDate = task.dueDate;
		let dueTime = task.dueTime;
		let dueDay = task.dueDay;

		// dueDatetime이 있고 dueDate가 없는 경우 변환
		if (task.dueDatetime && !dueDate) {
			const date = new Date(task.dueDatetime);
			// YYYY-MM-DD 형식으로 변환
			dueDate = date.toISOString().split("T")[0];

			// 요일 설정 (없는 경우)
			if (!dueDay) {
				const days = ["일", "월", "화", "수", "목", "금", "토"];
				dueDay = `(${days[date.getDay()]})`;
			}

			// 시간 설정 (없는 경우) - 분 정보 포함
			if (!dueTime) {
				const hours = date.getHours();
				const minutes = date.getMinutes();
				const ampm = hours >= 12 ? "오후" : "오전";
				const hour12 = hours % 12 || 12;

				dueTime =
					minutes === 0
						? `${ampm} ${hour12}시까지`
						: `${ampm} ${hour12}시 ${minutes}분까지`;
			}
		}

		if (!dueDate) {
			if (task.dueDatetime) {
				const date = new Date(task.dueDatetime);
				return `${date.getMonth() + 1}월 ${date.getDate()}일 ${dueDay || ""} ${dueTime || ""}`;
			}
			return "날짜 정보 없음";
		}

		// 오늘 날짜와 비교
		const today = new Date();
		const taskDate = new Date(dueDate);
		const isToday =
			today.getDate() === taskDate.getDate() &&
			today.getMonth() === taskDate.getMonth() &&
			today.getFullYear() === taskDate.getFullYear();

		// 시간 형식 처리
		let timeDisplay = dueTime || "";
		if (timeDisplay) {
			if (timeDisplay.includes("자정")) {
				timeDisplay = isToday ? "오늘 자정까지" : "자정까지";
			} else if (timeDisplay.includes("오후") || timeDisplay.includes("오전")) {
				// "오후 n시까지" 또는 "오전 n시까지" 형식인지 확인
				if (!timeDisplay.includes("까지")) {
					timeDisplay = `${timeDisplay}까지`;
				}
			}
		}

		// 오늘 날짜는 "오늘"로만 표시, 그 외 날짜는 "n월 n일 (요일)"로 표시
		if (isToday) {
			return `오늘 ${timeDisplay}`;
		}

		const month = Number.parseInt(dueDate.substring(5, 7), 10).toString();
		const day = Number.parseInt(dueDate.substring(8, 10), 10).toString();
		return `${month}월 ${day}일 ${dueDay || ""} ${timeDisplay}`;
	};

	const formatTimeRequired = (timeRequired: string | undefined): string => {
		if (!timeRequired) return "시간 미정";

		// "n시간 소요" 형식에서 시간 추출
		const hourMatch = timeRequired.match(/(\d+)시간/);
		const minuteMatch = timeRequired.match(/(\d+)분/);

		if (!hourMatch) return timeRequired;

		const hours = Number.parseInt(hourMatch[1], 10);
		const minutes = minuteMatch ? Number.parseInt(minuteMatch[1], 10) : 0;

		// 24시간 이상인 경우에만 변환
		if (hours >= 24) {
			const totalMinutes = hours * 60 + minutes;
			const { estimatedDay, estimatedHour, estimatedMinute } =
				convertEstimatedTime(totalMinutes);

			let result = "";
			if (estimatedDay > 0) {
				result += `${estimatedDay}일 `;
			}

			if (estimatedHour > 0) {
				result += `${estimatedHour}시간 `;
			}

			if (estimatedMinute > 0) {
				result += `${estimatedMinute}분 `;
			}

			result += "소요";
			return result;
		}

		return timeRequired;
	};

	return (
		<button
			className="relative mb-4 rounded-[20px] bg-component-gray-secondary p-4 w-full text-left"
			onClick={handleTaskClick}
			type="button"
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="mb-2 flex items-center">{renderDayChip()}</div>
					<div className="c3 flex items-center text-text-primary">
						<span>{formatDateTime()}</span>
						<span className="c3 mx-1 text-text-neutral">•</span>
						<Image
							src={HomeClock}
							alt="Clock"
							width={14}
							height={14}
							className="mr-[4px]"
						/>
						<span className="c3 text-text-neutral">
							{formatTimeRequired(task.timeRequired)}
						</span>
					</div>
					<div className="s2 mt-[3px] text-text-strong">{truncatedTitle}</div>
				</div>
				<button
					ref={buttonRef}
					className="mt-1 px-2"
					onClick={handleMoreClick}
					type="button"
					aria-label="더 많은 옵션"
				>
					<Image src={HomeDotVertical} alt="More" width={4} height={18} />
				</button>
			</div>

			{showMenu && (
				<div
					ref={menuRef}
					className="absolute right-[0px] top-[57px] z-10 w-[190px] rounded-[16px] bg-component-gray-tertiary drop-shadow-lg"
				>
					<div className="c2 p-5 pb-0 text-text-alternative">편집</div>
					<button
						className="l3 flex w-full items-center justify-between p-5 pt-3 text-text-red"
						onClick={handleDeleteClick}
						type="button"
					>
						삭제하기
						<Image
							src={TrashCan}
							alt="Delete"
							width={16}
							height={16}
							className="ml-2"
						/>
					</button>
				</div>
			)}
		</button>
	);
};

export default AllTaskItem;
