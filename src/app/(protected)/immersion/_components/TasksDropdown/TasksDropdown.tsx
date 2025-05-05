"use client";

import type { Task } from "@/types/task";
import { calculateRemainingTime } from "@/utils/dateFormat";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";

import Emergency2 from "@public/icons/immersion/emergency.png";
import Emergency from "@public/icons/immersion/emergency.svg";

interface TasksDropdownProps {
	inProgressTasks: Task[];
	currentTaskId: number;
}

export default function TasksDropdown({
	inProgressTasks,
	currentTaskId,
}: TasksDropdownProps) {
	const router = useRouter();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// 텍스트 길이 제한 함수
	const truncateText = (text: string | undefined, maxLength = 9) => {
		if (!text) return "";
		return text.length > maxLength
			? `${text.substring(0, maxLength)}...`
			: text;
	};

	// 남은 시간 포맷팅 함수
	const formatTime = (task: Task) => {
		if (!task.dueDatetime) return "";

		const targetDate = new Date(task.dueDatetime);
		const timeStr = calculateRemainingTime(targetDate);

		let formattedTime = timeStr.replace(" 남음", "");

		if (formattedTime.includes("일")) {
			const parts = formattedTime.split(" ");
			if (parts.length >= 3) {
				formattedTime = `${parts[0]} ${parts[1]}`;
			}
		}

		if (isUrgent(task) && formattedTime.startsWith("00:")) {
			formattedTime = formattedTime.substring(3);
		}

		return formattedTime;
	};

	// 시간 칩 너비 결정 함수
	const getTimeChipWidth = (task: Task) => {
		if (!task.dueDatetime) return "60px";

		const targetDate = new Date(task.dueDatetime);
		const timeStr = calculateRemainingTime(targetDate);

		if (timeStr.includes("일")) {
			return "72px";
		}

		return "60px";
	};

	// 긴급 작업 판단 함수
	const isUrgent = (task: Task) => {
		if (!task.dueDatetime) return false;

		const now = new Date();
		const dueDate = new Date(task.dueDatetime);
		const diffInHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		// 마감이 1시간 미만으로 남은 경우 긴급으로 처리
		return diffInHours < 1 && diffInHours > 0;
	};

	// 전체 작업 중 긴급 작업이 있는지 확인하는 함수
	const hasUrgentTask = () => {
		return inProgressTasks.some((task) => isUrgent(task));
	};

	// 작업 클릭 핸들러
	const handleTaskClick = (taskId: number) => {
		router.push(`/immersion/${taskId}`);
		setIsDropdownOpen(false);
	};

	// 키보드 이벤트 핸들러
	const handleKeyDown = (
		e: KeyboardEvent<HTMLButtonElement>,
		callback: () => void,
	) => {
		if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
			e.preventDefault();
			callback();
		}
	};

	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

	// 화면 클릭 시 드롭다운 닫기
	useEffect(() => {
		if (!isDropdownOpen) return;

		const handleClickOutside = (e: MouseEvent) => {
			const dropdownContainer = document.getElementById("dropdown-container");
			if (dropdownContainer && !dropdownContainer.contains(e.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isDropdownOpen]);

	return (
		<div id="dropdown-container" className="relative">
			{/* 드롭다운 버튼 */}
			<div
				className={`bg-component-gray-tertiary rounded-t-[8px] ${!isDropdownOpen ? "rounded-b-[8px]" : "rounded-t-[8px]"} overflow-hidden`}
				style={{
					width: isDropdownOpen ? "243px" : hasUrgentTask() ? "200px" : "178px",
					transition: "width 0.3s ease-out",
				}}
			>
				<button
					className="flex w-full items-center justify-center px-[25px] py-[8px] cursor-pointer"
					onClick={toggleDropdown}
					onKeyDown={(e) => handleKeyDown(e, toggleDropdown)}
					aria-expanded={isDropdownOpen}
					aria-haspopup="menu"
					type="button"
					name="진행 중인 일 화살표"
					style={{ display: "flex", alignItems: "center" }}
				>
					<span className="flex items-center gap-1">
						<span className="l4 text-gray-strong">진행 중인 일</span>
						<span
							className={`l5 ${hasUrgentTask() ? "c1 text-component-accent-red" : "text-gray-neutral"}`}
						>
							총 {inProgressTasks.length}개
						</span>
					</span>
					{hasUrgentTask() && (
						<Image
							src={Emergency2}
							alt="긴급"
							width={16}
							height={16}
							className="ml-1"
						/>
					)}
					{isDropdownOpen ? (
						<ChevronUp className="ml-1 w-4 h-4 text-gray-disabled" />
					) : (
						<ChevronDown className="ml-1 w-4 h-4 text-gray-disabled" />
					)}
				</button>
			</div>

			{/* 드롭다운 리스트 */}
			{isDropdownOpen && (
				<div
					className="absolute bg-component-gray-tertiary rounded-b-[8px] overflow-hidden z-50"
					style={{
						width: "243px",
						left: "50%",
						transform: "translateX(-50%)",
						animation:
							"expandListWidth 0.3s ease-out forwards, expandDown 0.2s ease-out forwards",
					}}
				>
					<div className="max-h-[300px] overflow-y-auto">
						{inProgressTasks.map((task, index) => (
							<button
								key={task.id}
								className={`flex w-full items-center justify-between px-5 py-3 text-left ${
									task.id === currentTaskId
										? "bg-component-gray-secondary"
										: "hover:bg-component-gray-tertiary"
								} ${index !== inProgressTasks.length - 1 ? "" : ""}`}
								onClick={() => handleTaskClick(task.id)}
								onKeyDown={(e) =>
									handleKeyDown(e, () => handleTaskClick(task.id))
								}
								role="menuitem"
								type="button"
							>
								<span
									className={`${
										task.id === currentTaskId
											? "s3 text-gray-normal"
											: "b3 text-gray-normal"
									}`}
								>
									{truncateText(task.title)}
								</span>
								<div
									className={`flex items-center px-[4px] py-[3px] rounded-[8px] ml-2 justify-center ${
										isUrgent(task)
											? "c2 text-gray-strong"
											: "c2 bg-component-gray-primary text-gray-neutral"
									}`}
									style={
										isUrgent(task)
											? {
													background:
														"linear-gradient(180deg, #DD6875 0%, #ED98A2 100%)",
													width: getTimeChipWidth(task),
												}
											: {
													width: getTimeChipWidth(task),
												}
									}
								>
									{isUrgent(task) && (
										<Image
											src={Emergency}
											alt="긴급"
											width={14}
											height={14}
											className="mr-1"
										/>
									)}
									{formatTime(task)}
								</div>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
