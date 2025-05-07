"use client";

import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import CustomBackHeader from "@/components/customBackHeader/CustomBackHeader";
import ArrowLeft from "@public/icons/common/ArrowLeft.svg";
import ExternalLink from "@public/icons/mypage/external-link.svg";

export default function MyPage() {
	const router = useRouter();
	const userData = useUserStore((state) => state.userData);
	const clearUser = useUserStore((state) => state.clearUser);

	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [showWithdrawModal, setShowWithdrawModal] = useState(false);

	const handleLogout = () => {
		setShowLogoutModal(true);
	};

	const { mutate: confirmLogout, isIdle: isIdleLogout } = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				throw new Error(`Logout failed with status ${res.status}`);
			}

			const data = await res.json();
			return data;
		},
		onSuccess: (data) => {
			if (data.success) {
				clearUser();
				setShowLogoutModal(false);
				router.push("/login");
			}
		},
		onError: (error) => {
			// TODO(prgmr99): 토스트 메세지 추가
			console.error("로그아웃 중 오류 발생:", error);
			setShowLogoutModal(false);
		},
	});

	const { mutate: confirmWithdraw, isIdle: isIdleWithdraw } = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/auth/withdraw", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				throw new Error(`Withdraw failed with status ${res.status}`);
			}

			const text = await res.text();
			const response = text ? JSON.parse(text) : {};

			return response;
		},
		onSuccess: (response) => {
			if (response.success) {
				clearUser();
				setShowLogoutModal(false);
				router.push("/login");
			}
		},
		onError: (error) => {
			console.error("회원 탈퇴 중 오류 발생:", error);
			setShowWithdrawModal(false);
		},
	});

	const cancelLogout = () => {
		setShowLogoutModal(false);
	};

	const handleWithdraw = () => {
		setShowWithdrawModal(true);
	};

	const cancelWithdraw = () => {
		setShowWithdrawModal(false);
	};

	return (
		<div className="flex flex-col">
			{/* 헤더 부분 */}
			<CustomBackHeader title="설정" backRoute="/my-page" />

			<div className="px-5 mt-[65px]">
				<div className="l5 text-gray-alternative">서비스 관리</div>
				<div className="flex items-center justify-between py-4">
					<div className="b2 text-base text-gray-normal">로그인 정보</div>
					<div className="l5 text-gray-neutral">{userData?.email || ""}</div>
				</div>
				<div className="flex items-center justify-between pt-0 pb-4">
					<div className="b2 text-base text-gray-normal">앱 버전</div>
					<div className="l5 text-gray-neutral">v1.0.4 최신 버전</div>
				</div>

				<Link
					href="/personal-info"
					className="flex items-center justify-between py-4"
				>
					<div className="text-base">개인정보 처리 방침</div>
					<Image src={ExternalLink} alt="외부 링크" width={20} height={20} />
				</Link>

				<Link href="/terms" className="flex items-center justify-between py-4">
					<div className="text-base">이용약관</div>
					<Image src={ExternalLink} alt="외부 링크" width={20} height={20} />
				</Link>

				<Link
					href="https://docs.google.com/forms/d/e/1FAIpQLSewine18Gw4dpEeT-NwN2M9Cuw6hRUiKVd3g0wrNOazW58GWA/viewform"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center justify-between py-4"
				>
					<div className="text-base">문의사항</div>
					<Image src={ExternalLink} alt="외부 링크" width={20} height={20} />
				</Link>
			</div>

			<div className="h-[8px] bg-component-gray-primary" />

			{/* 로그아웃 */}
			<div className="px-5">
				<button
					type="button"
					className="b2 w-full pb-4 pt-5 text-left text-base text-gray-normal"
					onClick={handleLogout}
				>
					로그아웃
				</button>
			</div>

			{/* 탈퇴하기 */}
			<div className="px-5">
				<button
					type="button"
					className="b2 w-full pb-4 pt-6 text-left text-base text-gray-normal"
					onClick={handleWithdraw}
				>
					탈퇴하기
				</button>
			</div>

			<div className="h-12" />

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
									type="button"
									className="l1 flex-1 rounded-[12px] bg-component-gray-tertiary p-[13.5px] text-gray-neutral"
									onClick={cancelLogout}
								>
									닫기
								</button>
								<Button
									type="button"
									className="l1 flex-1 rounded-[12px] bg-component-accent-primary p-[13.5px] text-gray-strong"
									disabled={!isIdleLogout}
									onClick={() => confirmLogout()}
								>
									{isIdleLogout ? (
										"로그아웃"
									) : (
										<Loader width={24} height={24} />
									)}
								</Button>
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
									type="button"
									className="l1 flex-1 rounded-[12px] bg-component-gray-tertiary p-[13.5px] text-gray-neutral"
									onClick={cancelWithdraw}
								>
									닫기
								</button>
								<Button
									type="button"
									className="l1 flex-1 rounded-[12px] bg-component-accent-primary p-[13.5px] text-gray-strong"
									disabled={!isIdleWithdraw}
									onClick={() => confirmWithdraw()}
								>
									{isIdleWithdraw ? (
										"탈퇴하기"
									) : (
										<Loader width={24} height={24} />
									)}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
