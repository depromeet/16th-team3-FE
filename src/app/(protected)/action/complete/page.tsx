"use client";

import { useTaskProgressStore } from "@/store/useTaskStore";
import { useUserStore } from "@/store/useUserStore";
import { formatKoreanDateTime } from "@/utils/dateFormat";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/component/Badge";
import { api } from "@/lib/ky";
import type { User } from "@/types/user";
import { getPersonaImage } from "@/utils/getPersonaImage";
import CharacterMotivation from "./_component/CharacterMotivation";
import Header from "./_component/Header";
import PhotoCard from "./_component/PhotoCard";
import StartButton from "./_component/StartButton";

export default function Complete() {
	const userData = useUserStore((state) => state.userData);
	const [capturedImage, setCapturedImage] = useState<string>("");
	const currentTask = useTaskProgressStore((state) => state.currentTask);
	const personaImageSrc = getPersonaImage(currentTask?.persona.id);
	const setUser = useUserStore((state) => state.setUser);

	const loadUserProfile = useCallback(async () => {
		const response = await api.get("v1/members/me").json<User>();
		setUser(response);
	}, [setUser]);

	useEffect(() => {
		setCapturedImage(localStorage.getItem("capturedImage") || "");
		console.log("capturedImage", capturedImage);
	}, []);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				await loadUserProfile();
			} catch (error) {
				console.error("인증 확인 중 오류:", error);
			}
		};
		checkAuth();
	}, [loadUserProfile]);

	return (
		<div className="flex h-full w-full flex-col gap-4 bg-background-primary">
			<Header />

			<PhotoCard
				capturedImage={capturedImage || ""}
				actionText={currentTask?.triggerAction || ""}
				time={formatKoreanDateTime(currentTask?.dueDatetime || "")}
			/>

			{/* 인증 사진 사각박스 */}
			{currentTask && (
				<CharacterMotivation
					currentTask={currentTask}
					nickname={userData.nickname}
				/>
			)}
			<div className="relative">
				<div className="absolute inset-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />

				<div className="relative flex h-[245px] flex-col items-center justify-center gap-[27px]">
					<Image
						src={personaImageSrc}
						alt="페르소나 이미지"
						width={165}
						height={165}
					/>

					<Badge>{`${currentTask?.persona.name} ${userData.nickname}`}</Badge>
				</div>
			</div>
			<StartButton currentTaskId={currentTask?.id?.toString() ?? ""} />
		</div>
	);
}
