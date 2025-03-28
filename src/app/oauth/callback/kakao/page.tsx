"use client";

import Loader from "@/components/loader/Loader";
import { useUserStore } from "@/store/useUserStore";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";

const KakaoTalk = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const authCode = searchParams.get("code");
	const platform = searchParams.get("platform");

	const { setUser } = useUserStore();

	const loginMutation = async (authCode: string) => {
		const response = await fetch("/api/oauth/callback/kakao", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ authCode }),
		}).then((res) => res.json());

		if (response.success) {
			setUser(response.userData);

			if (response.isNewUser) {
				router.push("/onboarding");
				return;
			}
			router.push("/");
		} else {
			console.error("Failed to login");
		}
	};

	useEffect(() => {
		if (authCode) {
			if (platform === "mobile") {
				// 모바일 로그인: 커스텀 스킴으로 리다이렉트해서, RN 쪽 InAppBrowser.openAuth()에서 감지
				window.location.href = `spurt://callback?code=${authCode}`;
			} else {
				// 웹 로그인: 기존 방식대로 처리
				loginMutation(authCode);
			}
		}
	}, [authCode, platform]);

	return (
		<div className="flex h-screen items-center justify-center bg-background-primary px-5 py-12">
			<Loader />
		</div>
	);
};

const KakaoTalkPage = () => {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center bg-background-primary px-5 py-12">
					<Loader />
				</div>
			}
		>
			<KakaoTalk />
		</Suspense>
	);
};

export default KakaoTalkPage;
