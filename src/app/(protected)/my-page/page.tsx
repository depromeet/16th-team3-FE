"use client";

import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import ProfileImage from "@/components/ProfileImage";
import RetrospectSection from "./_component/RetroSpectSection";
import TaskContainer from "./_component/TaskContainer";

export default function MyPage() {
	const userData = useUserStore((state) => state.userData);
	const setUser = useUserStore((state) => state.setUser);

	const [pageLoading, setPageLoading] = useState(true);

	const mockTasks = {
		completed: [
			{ id: 1, title: "디프만 리서치 준비", due: "2월 5일 (수) 자정까지" },
			{ id: 2, title: "디프만 리서치 준비", due: "2월 5일 (수) 자정까지" },
			{ id: 3, title: "디프만 리서치 준비", due: "2월 5일 (수) 자정까지" },
		],
		postponed: [
			{ id: 4, title: "미룬 작업 예시", due: "2월 6일 (목) 자정까지" },
			{ id: 5, title: "미룬 작업 예시", due: "2월 6일 (목) 자정까지" },
		],
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
		<div className="flex min-h-screen flex-col">
			{/* 헤더 부분 */}
			<div className="relative flex items-center justify-between px-5 py-[14px]">
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
				<div className="mb-8 mt-[23px] flex flex-col items-center justify-center">
					<div className="mb-[14px] h-20 w-20 animate-pulse rounded-full bg-gray-200" />
					<div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
				</div>
			) : (
				<>
					<div className="mb-8 mt-[23px] flex flex-col items-center justify-center">
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
				satisfactionPercentage={50}
				concentrationPercentage={30}
			/>

			{/* 완료한 일, 미룬 일 */}
			<TaskContainer
				completedTasks={mockTasks.completed}
				postponedTasks={mockTasks.postponed}
			/>
		</div>
	);
}
