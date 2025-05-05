"use client";

import type { Task } from "@/types/task";
import { convertEstimatedTime } from "@/utils/dateFormat";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import Clock from "@public/icons/home/clock.svg";
import DotsVertical from "@public/icons/home/dots-vertical.svg";
import Trashcan from "@public/icons/home/trashcan.svg";

type WeeklyTaskItemProps = {
	task: Task;
	onClick: (task: Task) => void;
	onDelete: (taskId: number) => void;
};

const WeeklyTaskItem: React.FC<WeeklyTaskItemProps> = ({
	task,
	onClick,
	onDelete,
}) => {
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	// 템플릿 리터럴로 수정
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

	// 날짜 및 시간 표시 형식 수정
	const formatDateTime = () => {
		const month = Number.parseInt(task.dueDate.substring(5, 7), 10).toString();
		const day = Number.parseInt(task.dueDate.substring(8, 10), 10).toString();

		// 시간 형식 처리
		let timeDisplay = task.dueTime;
		if (
			!timeDisplay.includes("까지") &&
			(timeDisplay.includes("오후") || timeDisplay.includes("오전"))
		) {
			timeDisplay = `${timeDisplay}까지`;
		}

		return `${month}월 ${day}일 ${task.dueDay} ${timeDisplay}`;
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
			type="button"
			className="relative mb-4 w-full text-left rounded-[20px] bg-component-gray-secondary p-4"
			onClick={handleTaskClick}
			onKeyUp={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					handleTaskClick();
				}
			}}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="mb-2 flex items-center">
						<div className="rounded-[6px] bg-component-accent-secondary px-[15px] py-[0px] text-text-primary">
							<span className="c2">D-{task.dDayCount}</span>
						</div>
					</div>
					<div className="c3 flex items-center text-text-primary">
						<span>{formatDateTime()}</span>
						<span className="c3 mx-1 text-text-neutral">•</span>
						<Image
							src={Clock}
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
					type="button"
					ref={buttonRef}
					className="mt-1 px-2"
					onClick={handleMoreClick}
				>
					<Image src={DotsVertical} alt="More" width={4} height={18} />
				</button>
			</div>

			{showMenu && (
				<div
					ref={menuRef}
					className="absolute right-[0px] top-[57px] z-10 w-[190px] rounded-[16px] bg-component-gray-tertiary drop-shadow-lg"
				>
					<div className="c2 p-5 pb-0 text-text-alternative">편집</div>
					<button
						type="button"
						className="l3 w-full flex items-center justify-between p-5 pt-3 text-text-red"
						onClick={handleDeleteClick}
						onKeyUp={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								handleDeleteClick(e as unknown as React.MouseEvent);
							}
						}}
					>
						삭제하기
						<Image
							src={Trashcan}
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

export default WeeklyTaskItem;
