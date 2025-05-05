"use client";

import {
	type TimeMessageType,
	determineMessageType,
	getPersonaMessage,
} from "@/utils/personaMessages";
import Image from "next/image";
import { useEffect, useState } from "react";

import Clap from "@public/icons/onboarding/clap.svg";

interface PersonaMessageProps {
	personaId: string;
	dueDatetime: string;
	estimatedHours: number;
}

export default function PersonaMessage({
	personaId,
	dueDatetime,
	estimatedHours,
}: PersonaMessageProps) {
	const [messageType, setMessageType] = useState<TimeMessageType>("start");
	const [message, setMessage] = useState<string>("");
	const [isAnimated, setIsAnimated] = useState(false);

	useEffect(() => {
		const updateMessage = () => {
			const now = new Date();
			const dueDate = new Date(dueDatetime);

			// 메시지 타입 결정
			const type = determineMessageType(dueDate, estimatedHours, now);
			setMessageType(type);

			// 페르소나 ID와 메시지 타입에 따라 메시지 가져오기
			const personaMessage = getPersonaMessage(personaId, type);
			setMessage(personaMessage);
		};

		// 초기 메시지 설정
		updateMessage();

		// 애니메이션 시작
		setIsAnimated(true);

		// 1분마다 메시지 업데이트 (필요에 따라 주기 조정)
		const intervalId = setInterval(updateMessage, 60 * 1000);

		return () => clearInterval(intervalId);
	}, [personaId, dueDatetime, estimatedHours]);

	// 긴급 여부 확인 (1시간 이내)
	const isUrgent = () => {
		const now = new Date();
		const dueDate = new Date(dueDatetime);
		const diffInHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		return diffInHours <= 1;
	};

	return (
		<>
			<div
				className={`s3 flex items-center justify-center whitespace-nowrap rounded-[999px] px-[14px] py-[10px] text-[#BDBDF5] float-up-animation ${isAnimated ? "animated" : ""}`}
				style={{
					background: "var(--Elevated-PointPriamry, rgba(107, 107, 225, 0.20))",
					backdropFilter: "blur(30px)",
				}}
			>
				<Image
					src={Clap}
					alt="박수"
					width={16}
					height={15}
					className="mr-1"
					priority
				/>
				<span>{message}</span>
			</div>

			{/* 애니메이션 스타일 */}
			<style jsx>{`
				@keyframes floatUp {
					0% {
						opacity: 0;
						transform: translateY(100px);
					}
					100% {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.float-up-animation {
					opacity: 0;
					transform: translateY(100px);
				}

				.float-up-animation.animated {
					animation: floatUp 1s ease-out forwards;
				}
			`}</style>
		</>
	);
}
