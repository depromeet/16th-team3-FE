import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import type { Task } from "@/types/task";
import { calculateRemainingTime, parseDateAndTime } from "@/utils/dateFormat";
import { getPersonaImage } from "@/utils/getPersonaImage";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface InProgressTaskItemProps {
	task: Task;
	index: number;
	onShowDetails?: (task: Task) => void;
}

/**
 * 시간과 "이어서 몰입" 텍스트 전환 variants
 */
const buttonContentVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0, y: -10 },
};

const InProgressTaskItem: React.FC<InProgressTaskItemProps> = ({
	task,
	index,
	onShowDetails,
}) => {
	const router = useRouter();
	const [showRemaining, setShowRemaining] = useState(true);
	const [remainingTime, setRemainingTime] = useState("");
	const [isUrgent, setIsUrgent] = useState(false);
	const [timeLeftMs, setTimeLeftMs] = useState(0);
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const [isExpired, setIsExpired] = useState(false);
	const personaImageUrl = getPersonaImage(task.persona?.id);

	const isFirstVisit = sessionStorage.getItem("visited");

	// 남은 시간 계산 함수 개선
	const calculateRemainingTimeLocal = useCallback(() => {
		// 현재 시간 기준으로 계산
		const now = new Date().getTime();

		// dueDatetime이 있으면 사용, 없으면 dueDate와 dueTime에서 계산
		let dueDatetime;
		if (task.dueDatetime) {
			dueDatetime = new Date(task.dueDatetime);
		} else {
			dueDatetime = parseDateAndTime(task.dueDate, task.dueTime);
		}

		const timeLeft = dueDatetime.getTime() - now;

		// 남은 시간(ms) 저장
		setTimeLeftMs(timeLeft);

		// 마감 지났는지 확인
		setIsExpired(timeLeft < 0);

		// 1시간 이내인지 체크
		setIsUrgent(timeLeft <= 60 * 60 * 1000 && timeLeft > 0);

		return calculateRemainingTime(dueDatetime);
	}, [task]);

	// 카드 영역 클릭 시 - TaskDetailSheet 표시
	const handleCardClick = () => {
		if (onShowDetails) {
			onShowDetails(task);
		}
	};

	// 이어서 몰입 버튼 클릭 시 - 바로 몰입 화면으로 이동
	const handleContinueClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // 이벤트 버블링 방지
		router.push(`/immersion/${task.id}`);
	};

	const handleCloseBottomSheet = () => {
		setShowBottomSheet(false);
	};

	const handleContinueToFocus = () => {
		router.push(`/immersion/${task.id}`);
		setShowBottomSheet(false);
	};

	// 오늘 날짜 확인
	const isToday = () => {
		const today = new Date();
		const taskDate = new Date(task.dueDate);

		return (
			today.getDate() === taskDate.getDate() &&
			today.getMonth() === taskDate.getMonth() &&
			today.getFullYear() === taskDate.getFullYear()
		);
	};

	// 시간 표시 형식 수정
	const formatDueTime = () => {
		if (task.dueTime.includes("자정")) {
			return isToday() ? "오늘 자정까지" : task.dueTime;
		}

		// dueDatetime이 있는 경우 직접 계산
		if (task.dueDatetime) {
			const dueDate = new Date(task.dueDatetime);
			const hours = dueDate.getHours();
			const minutes = dueDate.getMinutes();
			const ampm = hours >= 12 ? "오후" : "오전";
			const hour12 = hours % 12 || 12;

			let formattedTime;
			if (minutes === 0) {
				formattedTime = `${ampm} ${hour12}시까지`;
			} else {
				formattedTime = `${ampm} ${hour12}시 ${minutes}분까지`;
			}

			return isToday() ? `오늘 ${formattedTime}` : formattedTime;
		}

		// "오후 n시" 형식인지 확인하고 "까지" 추가
		if (
			(task.dueTime.includes("오후") || task.dueTime.includes("오전")) &&
			!task.dueTime.includes("까지")
		) {
			const formattedTime = `${task.dueTime}까지`;
			return isToday() ? `오늘 ${formattedTime}` : formattedTime;
		}

		return isToday() ? `오늘 ${task.dueTime}` : task.dueTime;
	};

	useEffect(() => {
		const toggleInterval = setInterval(() => {
			setShowRemaining((prev) => !prev);
		}, 5000);

		return () => clearInterval(toggleInterval);
	}, []);

	// 1초마다 남은 시간 업데이트
	useEffect(() => {
		const updateRemainingTime = () => {
			setRemainingTime(calculateRemainingTimeLocal());
		};

		updateRemainingTime();

		const timeInterval = setInterval(updateRemainingTime, 1000);

		return () => clearInterval(timeInterval);
	}, [calculateRemainingTimeLocal]);

	useEffect(() => {
		if (!isFirstVisit) {
			setShowBottomSheet(true);
			sessionStorage.setItem("visited", "true");
		}
	}, [isFirstVisit]);

	// 마감 지난 경우 강조 표시
	const getTimeDisplay = () => {
		if (isExpired) {
			// 마감 지난 경우 빨간색 텍스트나 경고 표시 추가 가능
			return <span className="text-red-500">{remainingTime}</span>;
		}
		return <TimeDisplay time={remainingTime} />;
	};

	// 바텀시트 렌더링 (일반 및 긴급 케이스 모두 공통으로 사용)
	const renderBottomSheet = () => {
		return (
			<Drawer open={showBottomSheet} onOpenChange={setShowBottomSheet}>
				<DrawerContent className="w-auto border-0 bg-component-gray-secondary px-5 pb-[33px] pt-2">
					<DrawerHeader>
						<DrawerTitle className="t3 text-center text-text-strong">
							{task.title}
						</DrawerTitle>
						<DrawerDescription className="t3 text-center text-text-strong">
							하던 중이었어요. 이어서 몰입할까요?
						</DrawerDescription>
						<DrawerDescription
							className={`b3 ${isExpired ? "text-red-500" : "text-text-neutral"} mt-2 text-center`}
						>
							{isExpired
								? "마감 시간이 지났습니다"
								: `마감까지 ${remainingTime}`}
						</DrawerDescription>
					</DrawerHeader>
					<button
						className="l2 w-full rounded-[16px] bg-component-accent-primary py-4 mt-3 text-white"
						onClick={handleContinueToFocus}
					>
						이어서 몰입
					</button>

					<button
						className="l2 w-full py-4 text-text-neutral"
						onClick={handleCloseBottomSheet}
					>
						닫기
					</button>
				</DrawerContent>
			</Drawer>
		);
	};

	// 일반 진행 중 컴포넌트
	if (!isUrgent) {
		return (
			<>
				<div
					className="mb-5 rounded-[12px] bg-component-gray-secondary p-4"
					onClick={handleCardClick}
				>
					<div className="mb-5 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-component-gray-tertiary p-2">
							<Image src={personaImageUrl} alt="Task" width={32} height={32} />
						</div>
						<div className="flex-1">
							<p className="b3 text-text-neutral">{formatDueTime()}</p>
							<h3
								className="s1 t3 truncate text-text-strong"
								style={{ maxWidth: "240px" }}
							>
								{task.title}
							</h3>
						</div>
					</div>

					<button
						onClick={handleContinueClick}
						className="l1 flex h-[52px] w-full items-center justify-center rounded-[12px] bg-component-accent-primary p-3.5 text-center text-text-strong"
					>
						<AnimatePresence mode="wait">
							<motion.div
								key={showRemaining ? "timeDisplay" : "continue"}
								variants={buttonContentVariants}
								initial="initial"
								animate="animate"
								exit="exit"
								transition={{ duration: 0.3 }}
							>
								{showRemaining ? getTimeDisplay() : "이어서 몰입"}
							</motion.div>
						</AnimatePresence>
					</button>
				</div>

				{index === 0 && renderBottomSheet()}
			</>
		);
	}

	// 시간 임박 컴포넌트 (1시간 이내)
	return (
		<>
			<div
				className="bg-gradient-component-01 mb-5 flex h-auto flex-col justify-between rounded-[20px] p-4"
				onClick={handleCardClick}
			>
				<div>
					<h2 className="s1 mb-1 text-text-strong">{task.title}</h2>
					<p className="b3 text-text-neutral">{formatDueTime()}</p>
				</div>

				<div className="my-8 flex justify-center items-center relative">
					<div
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[103px] h-[105px] mix-blend-color-dodge"
						style={{
							background:
								"conic-gradient(from 140deg at 50.42% 51.28%, rgba(182, 208, 247, 0.70) 0deg, rgba(238, 244, 225, 0.70) 82.50000178813934deg, rgba(226, 193, 249, 0.70) 155.6249964237213deg, rgba(191, 209, 249, 0.70) 209.30935621261597deg, rgba(250, 252, 254, 0.70) 252.6490044593811deg, rgba(186, 228, 226, 0.70) 288.7499928474426deg, rgba(140, 107, 227, 0.70) 341.2500071525574deg, rgba(192, 215, 243, 0.70) 360deg)",
							filter: "blur(37px)",
						}}
					/>
					<Image
						src={personaImageUrl}
						alt="Character"
						width={136}
						height={136}
						loading="eager"
						className="relative z-10"
					/>
				</div>

				<Button
					variant="hologram"
					onClick={handleContinueClick}
					className="l1 z-10 w-full h-[52px] rounded-[12px] p-3.5 text-center text-text-inverse"
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={showRemaining ? "timeDisplay" : "continue"}
							variants={buttonContentVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							transition={{ duration: 0.3 }}
						>
							{showRemaining ? getTimeDisplay() : "이어서 몰입"}
						</motion.div>
					</AnimatePresence>
				</Button>
			</div>

			{index === 0 && renderBottomSheet()}
		</>
	);
};

// 일 포맷 시간 표시 컴포넌트 (n일 n시간 n분 형식)
const DayFormatTimeDisplay = ({ time }: { time: string }) => {
	return (
		<span className="inline-flex items-center justify-center">{time}</span>
	);
};

// 시:분:초 포맷 시간 표시 컴포넌트
const HMSFormatTimeDisplay = ({
	time,
	isUrgent = false,
}: {
	time: string;
	isUrgent?: boolean;
}) => {
	const splitTime = time.split(" ");
	const timeString = splitTime[0] || "00:00:00";
	const timeParts = timeString.split(":");
	const suffix = splitTime.slice(1).join(" ");

	// 각 시간 단위를 개별 숫자로 분리해서 관리
	const hours = timeParts[0] || "00";
	const minutes = timeParts[1] || "00";
	const seconds = timeParts[2] || "00";

	// 각 자릿수 분리
	const [h1, h2] = hours.split("");
	const [m1, m2] = minutes.split("");
	const [s1, s2] = seconds.split("");

	// 이전 자릿수 값 저장을 위한 ref
	const prevDigitsRef = useRef({
		h1: h1,
		h2: h2,
		m1: m1,
		m2: m2,
		s1: s1,
		s2: s2,
	});

	// 변경된 값 감지
	const hasChangedH1 = h1 !== prevDigitsRef.current.h1;
	const hasChangedH2 = h2 !== prevDigitsRef.current.h2;
	const hasChangedM1 = m1 !== prevDigitsRef.current.m1;
	const hasChangedM2 = m2 !== prevDigitsRef.current.m2;
	const hasChangedS1 = s1 !== prevDigitsRef.current.s1;
	const hasChangedS2 = s2 !== prevDigitsRef.current.s2;

	// 이전 값 저장
	useEffect(() => {
		prevDigitsRef.current = {
			h1,
			h2,
			m1,
			m2,
			s1,
			s2,
		};
	}, [timeString, h1, h2, m1, m2, s1, s2]);

	if (isUrgent) {
		return (
			<div className="l1 text-text-strong">
				{timeString.replace(/\:/g, ":")}
				{suffix && <span className="ml-1">{suffix}</span>}
			</div>
		);
	}

	return (
		<span className="inline-flex items-center justify-center">
			{hasChangedH1 ? (
				<AnimatePresence mode="popLayout">
					<motion.span
						key={`h1-${h1}-${Date.now()}`}
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 10, opacity: 0 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
					>
						{h1}
					</motion.span>
				</AnimatePresence>
			) : (
				<span>{h1}</span>
			)}

			{hasChangedH2 ? (
				<AnimatePresence mode="popLayout">
					<motion.span
						key={`h2-${h2}-${Date.now()}`}
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 10, opacity: 0 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
					>
						{h2}
					</motion.span>
				</AnimatePresence>
			) : (
				<span>{h2}</span>
			)}

			<span>:</span>

			{hasChangedM1 ? (
				<AnimatePresence mode="popLayout">
					<motion.span
						key={`m1-${m1}-${Date.now()}`}
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 10, opacity: 0 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
					>
						{m1}
					</motion.span>
				</AnimatePresence>
			) : (
				<span>{m1}</span>
			)}

			{hasChangedM2 ? (
				<AnimatePresence mode="popLayout">
					<motion.span
						key={`m2-${m2}-${Date.now()}`}
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 10, opacity: 0 }}
						transition={{ duration: 0.2, ease: "linear" }}
					>
						{m2}
					</motion.span>
				</AnimatePresence>
			) : (
				<span>{m2}</span>
			)}

			<span>:</span>

			{hasChangedS1 ? (
				<AnimatePresence mode="popLayout">
					<motion.span
						key={`s1-${s1}-${Date.now()}`}
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 10, opacity: 0 }}
						transition={{ duration: 0.2, ease: "linear" }}
					>
						{s1}
					</motion.span>
				</AnimatePresence>
			) : (
				<span>{s1}</span>
			)}

			{hasChangedS2 ? (
				<AnimatePresence mode="popLayout">
					<motion.span
						key={`s2-${s2}-${Date.now()}`}
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 10, opacity: 0 }}
						transition={{ duration: 0.2, ease: "linear" }}
					>
						{s2}
					</motion.span>
				</AnimatePresence>
			) : (
				<span>{s2}</span>
			)}

			{suffix && <span className="ml-1">{suffix}</span>}
		</span>
	);
};

const TimeDisplay = ({
	time,
	isUrgent = false,
}: {
	time: string;
	isUrgent?: boolean;
}) => {
	if (time.includes("일")) {
		return <DayFormatTimeDisplay time={time} />;
	} else {
		return <HMSFormatTimeDisplay time={time} isUrgent={isUrgent} />;
	}
};

export default InProgressTaskItem;
