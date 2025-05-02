"use client";

import SpurtyLoader from "@/components/spurtyLoader/SpurtyLoader";
import { useUserStore } from "@/store/useUserStore";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Suspense } from "react";

const KakaoTalk = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const authCode = searchParams.get("code");

	const { setUser } = useUserStore();

	const loginMutation = useCallback(
		async (authCode: string) => {
			const response = await fetch("/api/oauth/callback/kakao", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					authCode,
					deviceId: Cookies.get("deviceId"),
					deviceType: Cookies.get("deviceType"),
				}),
			}).then((res) => res.json());

			if (response.success) {
				setUser(response.userData);

				if (response.isNewUser) {
					router.push("/signup-complete");
					return;
				}

				router.push("/");
			} else {
				console.error("Failed to login");
			}
		},
		[router, setUser],
	);

	useEffect(() => {
		if (authCode) {
			loginMutation(authCode);
		}
	}, [authCode, loginMutation]);

	return (
		<div className="flex h-screen items-center justify-center bg-background-primary px-5 py-12">
			<SpurtyLoader />
		</div>
	);
};

const KakaoTalkPage = () => {
	return (
		<Suspense>
			<KakaoTalk />
		</Suspense>
	);
};

export default KakaoTalkPage;
