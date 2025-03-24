"use client";

import { useTaskProgressStore } from "@/store/useTaskStore";
import { formatKoreanDateTime } from "@/utils/dateFormat";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Badge } from "@/components/component/Badge";
import CharacterMotivation from "./_component/CharacterMotivation";
import Header from "./_component/Header";
import PhotoCard from "./_component/PhotoCard";
import StartButton from "./_component/StartButton";

export default function Complete() {
	const [capturedImage, setCapturedImage] = useState<string>("");
	const currentTask = useTaskProgressStore((state) => state.currentTask);

	useEffect(() => {
		setCapturedImage(localStorage.getItem("capturedImage") || "");
	}, []);

	return (
		<div className="flex h-full w-full flex-col gap-4 bg-background-primary">
			<Header />

			<PhotoCard
				capturedImage={capturedImage || ""}
				actionText={currentTask?.triggerAction || ""}
				time={formatKoreanDateTime(currentTask?.dueDatetime || "")}
			/>

			{/* 인증 사진 사각박스 */}
			{currentTask && <CharacterMotivation currentTask={currentTask} />}
			<div className="relative">
				<div className="absolute inset-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />

				<div className="relative flex h-[245px] flex-col items-center justify-center gap-[27px]">
					<Image
						src="/icons/immersion/study.png"
						alt="모래시계"
						width={48}
						height={48}
					/>
				</div>
			</div>
			<StartButton currentTaskId={currentTask?.id?.toString() ?? ""} />
		</div>
	);
}
