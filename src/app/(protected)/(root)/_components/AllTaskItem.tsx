import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";

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
		task.title.length > 16 ? task.title.substring(0, 16) + "..." : task.title;

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
		let dDayCount = task.dDayCount;
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

		let dDayText;
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
		let taskType = task.type;
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
					className="text-text-inverse z-10 rounded-[6px] px-[15px] py-[3px] h-auto flex items-center justify-center"
				>
					<span className="c2 flex items-center justify-center">D-DAY</span>
				</Button>
			);
		} else if (taskType === "weekly") {
			return (
				<div className="bg-component-accent-secondary text-text-primary rounded-[6px] px-[15px] py-[3px] flex items-center justify-center">
					<span className="c2 flex items-center justify-center">
						{dDayText}
					</span>
				</div>
			);
		} else {
			return (
				<div className="bg-component-gray-tertiary text-text-neutral rounded-[6px] px-[15px] py-[3px] flex items-center justify-center">
					<span className="c2 flex items-center justify-center">
						{dDayText}
					</span>
				</div>
			);
		}
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
		} else {
			const month = Number(dueDate.substring(5, 7)).toString();
			const day = Number(dueDate.substring(8, 10)).toString();
			return `${month}월 ${day}일 ${dueDay || ""} ${timeDisplay}`;
		}
	};

	return (
		<div
			className="bg-component-gray-secondary rounded-[20px] p-4 mb-4 relative"
			onClick={handleTaskClick}
		>
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<div className="flex items-center mb-2">{renderDayChip()}</div>
					<div className="c3 flex items-center text-text-primary">
						<span>{formatDateTime()}</span>
						<span className="c3 text-text-neutral mx-1">•</span>
						<Image
							src="/icons/home/clock.svg"
							alt="Clock"
							width={14}
							height={14}
							className="mr-[4px]"
						/>
						<span className="c3 text-text-neutral">{task.timeRequired}</span>
					</div>
					<div className="s2 mt-[3px] text-text-strong">{truncatedTitle}</div>
				</div>
				<button ref={buttonRef} className="mt-1 px-2" onClick={handleMoreClick}>
					<Image
						src="/icons/home/dots-vertical.svg"
						alt="More"
						width={4}
						height={18}
					/>
				</button>
			</div>

			{showMenu && (
				<div
					ref={menuRef}
					className="absolute right-[0px] top-[57px] bg-component-gray-tertiary rounded-[16px] drop-shadow-lg z-10 w-[190px]"
				>
					<div className="c2 p-5 pb-0 text-text-alternative">편집</div>
					<div
						className="l3 p-5 pt-3 flex justify-between items-center text-text-red"
						onClick={handleDeleteClick}
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
				</div>
			)}
		</div>
	);
};

export default AllTaskItem;
