"use client";

import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import ProfileImage from "@/components/ProfileImage";
import type { MyData } from "@/types/myPage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import CustomBackHeader from "@/components/customBackHeader/CustomBackHeader";
import SpurtyLoader from "@/components/spurtyLoader/SpurtyLoader";
import PersonaSection from "./_component/PersonaSection";
import RetrospectSection from "./_component/RetroSpectSection";
import TaskContainer from "./_component/TaskContainer";

export default function MyPage() {
	const router = useRouter();
	const userData = useUserStore((state) => state.userData);
	const setUser = useUserStore((state) => state.setUser);

	const { data: myPageData, isFetching } = useQuery<MyData>({
		queryKey: ["my-page"],
		queryFn: async () => await fetch("/api/my-page").then((res) => res.json()),
		enabled: !!userData.memberId,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 60,
	});

	const handlePersonaClick = (id: number) => {
		router.push(`/my-page/characters?id=${id}`);
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				if (userData.memberId === -1) {
					const response = await fetch("/api/auth/members/me", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					});

					if (!response.ok) {
						setUser({});
						return;
					}

					const data = await response.json();

					setUser(data);
				}
			} catch (error) {
				console.error("사용자 정보 로드 실패:", error);
				setUser({});
			}
		};

		fetchUser();
	}, [userData.memberId, setUser]);

	return (
		<div className="flex min-h-screen flex-col pb-[34px]">
			{/* 헤더 부분 */}
			<CustomBackHeader title="마이페이지" backRoute="/">
				<Link href="/my-page/setting">
					<Image
						src="/icons/mypage/setting.svg"
						alt="설정"
						width={24}
						height={24}
					/>
				</Link>
			</CustomBackHeader>

			{/* 프로필 정보 */}
			{isFetching ? (
				<SpurtyLoader />
			) : (
				<>
					<div className="mb-8 mt-[65px] flex flex-col items-center justify-center">
						<div className="mb-[14px]">
							<ProfileImage imageUrl={userData.profileImageUrl} />
						</div>
						<div className="t3 text-gray-normal">
							{userData?.nickname || "사용자"}
						</div>
					</div>
				</>
			)}

			{/* 나의 회고 */}
			<RetrospectSection
				satisfactionPercentage={myPageData?.satisfactionAvg || 0}
				concentrationPercentage={myPageData?.concentrationAvg || 0}
			/>

			{myPageData && (
				<PersonaSection
					personas={myPageData.personas}
					handlePersonaClick={handlePersonaClick}
				/>
			)}

			{/* 완료한 일, 미룬 일 */}
			{myPageData && (
				<TaskContainer
					completedTasks={myPageData.completedTasks}
					postponedTasks={myPageData.procrastinatedTasks}
				/>
			)}
		</div>
	);
}
