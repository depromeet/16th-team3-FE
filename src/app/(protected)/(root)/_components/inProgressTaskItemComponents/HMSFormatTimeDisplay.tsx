"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * 시:분:초 포맷 시간 표시 컴포넌트
 * @param time: string
 * @param isUrgent: boolean
 */
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
		h1,
		h2,
		m1,
		m2,
		s1,
		s2,
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
	}, [h1, h2, m1, m2, s1, s2]);

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

export default HMSFormatTimeDisplay;
