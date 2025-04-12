"use client";

import Loader from "@/components/loader/Loader";
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
					router.push("/onboarding");
					return;
				}

				router.push("/"); // TODO: Redirect to the home page('/')
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
