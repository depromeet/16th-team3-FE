"use client";

import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import ProfileImage from "@/components/ProfileImage";
import Loader from "@/components/loader/Loader";
import type { MyData } from "@/types/myPage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Persona from "./_component/Persona";
import RetrospectSection from "./_component/RetroSpectSection";
import TaskContainer from "./_component/TaskContainer";

export default function MyPage() {
	const router = useRouter();
	const userData = useUserStore((state) => state.userData);
	const setUser = useUserStore((state) => state.setUser);

	const [pageLoading, setPageLoading] = useState(true);

	const { data: myPageData } = useQuery<MyData>({
		queryKey: ["my-page"],
		queryFn: async () => await fetch("/api/my-page").then((res) => res.json()),
		enabled: !!userData.memberId,
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

			setPageLoading(false);
		};

		fetchUser();
	}, [userData.memberId, setUser]);

	return (
		<div className="flex min-h-screen flex-col pb-[34px]">
			{/* 헤더 부분 */}
			<div className="z-20 fixed top-0 w-[100vw] flex items-center justify-between px-5 py-[14px] pt-[44px] bg-background-primary">
				<Link href="/">
					<Image
						src="/icons/ArrowLeft.svg"
						alt="뒤로가기"
						width={24}
						height={24}
					/>
				</Link>
				<div className="s2 w-full text-center text-gray-normal">마이페이지</div>
				{/* TODO : 설정 버튼 링크 추가 */}
				<Link href="/my-page/setting">
					<Image
						src="/icons/mypage/setting.svg"
						alt="설정"
						width={24}
						height={24}
					/>
				</Link>
			</div>

			{/* 프로필 정보 */}
			{pageLoading ? (
				<Loader />
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
					<div className="flex flex-col items-start justify-start px-5 py-4">
						<div className="b2 text-gray-normal">
							로그인 정보 : {userData?.email || ""}
						</div>
					</div>
				</>
			)}
			{/* 나의 회고 */}
			<RetrospectSection
				satisfactionPercentage={myPageData?.satisfactionAvg || 0}
				concentrationPercentage={myPageData?.concentrationAvg || 0}
			/>

			<div className="px-5 mt-2">
				<div className="flex items-center justify-between py-4">
					<div className="text-s2 text-gray-normal">역대 몰입 캐릭터</div>
					<Link href="/my-page/characters">
						<span className="c1 text-gray-neutral">전체 보기</span>
					</Link>
				</div>
				<div
					className="flex items-center justify-between gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden"
					style={{
						scrollbarWidth: "none",
						msOverflowStyle: "none",
					}}
				>
					{myPageData?.personas.map((persona) => (
						<Persona
							key={persona.id}
							id={persona.id}
							name={persona.name}
							onClick={() => handlePersonaClick(persona.id)}
						/>
					))}

					{(myPageData?.personas?.length ?? 0) < 4 &&
						Array.from({
							length: 24 - (myPageData?.personas?.length ?? 0),
						}).map((_, idx) => (
							<div
								key={`lock-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									idx
								}`}
								className="flex flex-col items-center justify-between gap-3"
							>
								<div className="flex items-center justify-center w-[72px] h-[72px] rounded-[24px] bg-component-gray-secondary">
									<Image
										src="/icons/mypage/lock.svg"
										alt="lock"
										width={24}
										height={24}
									/>
								</div>
								<span className="text-gray-neutral c2">???</span>
							</div>
						))}
				</div>
			</div>

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
