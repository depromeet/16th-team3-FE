"use client";

import ProfileImage from "@/components/ProfileImage";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPage() {
	const router = useRouter();

	const { loadUserProfile } = useAuth();
	const userData = useUserStore((state) => state.userData);
	const clearUser = useUserStore((state) => state.clearUser);

	const [appVersion] = useState("V.0.0.1");
	const [pageLoading, setPageLoading] = useState(true);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [showWithdrawModal, setShowWithdrawModal] = useState(false);

	const handleGoBack = () => {
		router.push("/");
	};

	const handleLogout = () => {
		setShowLogoutModal(true);
	};

	const confirmLogout = async () => {
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const text = await res.text();
			const response = text ? JSON.parse(text) : {};

			if (response.success) {
				clearUser();
				setShowLogoutModal(false);
				router.push("/login");
			}
		} catch (error) {
			// TODO(prgmr99): Toast 메시지 추가
			console.error("로그아웃 중 오류 발생:", error);
			setShowLogoutModal(false);
		}
	};

	const cancelLogout = () => {
		setShowLogoutModal(false);
	};

	const handleWithdraw = () => {
		setShowWithdrawModal(true);
	};

	// ! TODO(prgmr99): 회원 탈퇴 api routes 적용
	const confirmWithdraw = async () => {
		try {
			const res = await fetch("/api/auth/withdraw", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const text = await res.text();
			const response = text ? JSON.parse(text) : {};

			if (response.success) {
				clearUser();
				setShowLogoutModal(false);
				router.push("/login");
			}
		} catch (error) {
			console.error("회원 탈퇴 중 오류 발생:", error);
			setShowWithdrawModal(false);
		}
	};

	const cancelWithdraw = () => {
		setShowWithdrawModal(false);
	};

	useEffect(() => {
		const initPage = async () => {
			if (userData.memberId === -1) {
				try {
					await loadUserProfile();
				} catch (error) {
					console.error("사용자 정보 로드 실패:", error);
				}
			}

			setPageLoading(false);
		};

		initPage();
	}, [loadUserProfile, userData.memberId]);

	return (
		<div className="flex min-h-screen flex-col">
			{/* 헤더 부분 */}
			<div className="relative flex items-center px-5 py-[14px]">
				<button onClick={handleGoBack} className="absolute left-5">
					<Image
						src="/icons/ArrowLeft.svg"
						alt="뒤로가기"
						width={24}
						height={24}
					/>
				</button>
				<div className="s2 w-full text-center text-gray-normal">마이페이지</div>
			</div>

			{/* 프로필 정보 */}
			{pageLoading ? (
				<div className="mb-8 mt-[23px] flex flex-col items-center justify-center">
					<div className="mb-[14px] h-20 w-20 animate-pulse rounded-full bg-gray-200"></div>
					<div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
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

			<div className="h-[8px] bg-component-gray-primary"></div>

			<div className="px-5">
				<div className="l5 pb-4 pt-6 text-gray-alternative">서비스 관리</div>

				<div className="flex items-center justify-between py-4">
					<div className="b2 text-base text-gray-normal">앱 버전</div>
					<div className="l5 text-gray-neutral">{appVersion} 최신 버전</div>
				</div>

				<Link
					href="/personal-info"
					className="flex items-center justify-between py-4"
				>
					<div className="text-base">개인정보 처리 방침</div>
					<Image
						src="/icons/mypage/external-link.svg"
						alt="외부 링크"
						width={20}
						height={20}
					/>
				</Link>

				<Link href="/terms" className="flex items-center justify-between py-4">
					<div className="text-base">이용약관</div>
					<Image
						src="/icons/mypage/external-link.svg"
						alt="외부 링크"
						width={20}
						height={20}
					/>
				</Link>

				<Link
					href="/open-source"
					className="flex items-center justify-between py-4"
				>
					<div className="text-base">오픈소스 라이센스</div>
					<Image
						src="/icons/mypage/external-link.svg"
						alt="외부 링크"
						width={20}
						height={20}
					/>
				</Link>
			</div>

			<div className="h-[8px] bg-component-gray-primary"></div>

			{/* 로그아웃 */}
			<div className="px-5">
				<button
					onClick={handleLogout}
					className="b2 w-full pb-4 pt-6 text-left text-base text-gray-normal"
				>
					로그아웃
				</button>
			</div>

			{/* 탈퇴하기 */}
			<div className="px-5">
				<button
					onClick={handleWithdraw}
					className="b2 w-full pb-4 pt-6 text-left text-base text-gray-normal"
				>
					탈퇴하기
				</button>
			</div>

			<div className="h-12"></div>

			{/* 로그아웃 확인 모달 */}
			{showLogoutModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-[90%] max-w-md overflow-hidden rounded-[24px] bg-component-gray-secondary">
						<div className="p-4 pt-6 text-center">
							<h3 className="t3 text-gray-normal">로그아웃</h3>
							<p className="b3 mb-5 text-gray-neutral">
								정말 로그아웃 하시겠어요?
							</p>

							<div className="flex space-x-4">
								<button
									onClick={cancelLogout}
									className="l1 flex-1 rounded-[12px] bg-component-gray-tertiary p-[13.5px] text-gray-neutral"
								>
									닫기
								</button>
								<button
									onClick={confirmLogout}
									className="l1 flex-1 rounded-[12px] bg-component-accent-primary p-[13.5px] text-gray-strong"
								>
									로그아웃
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* 탈퇴하기 확인 모달 */}
			{showWithdrawModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-[90%] max-w-md overflow-hidden rounded-[24px] bg-component-gray-secondary">
						<div className="p-4 pt-6 text-center">
							<h3 className="t3 text-gray-normal">탈퇴하기</h3>
							<p className="b3 mb-5 text-gray-neutral">정말 탈퇴 하시겠어요?</p>

							<div className="flex space-x-4">
								<button
									onClick={cancelWithdraw}
									className="l1 flex-1 rounded-[12px] bg-component-gray-tertiary p-[13.5px] text-gray-neutral"
								>
									닫기
								</button>
								<button
									onClick={confirmWithdraw}
									className="l1 flex-1 rounded-[12px] bg-component-accent-primary p-[13.5px] text-gray-strong"
								>
									탈퇴하기
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
