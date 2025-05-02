"use client";

import SpurtyLoader from "@/components/spurtyLoader/SpurtyLoader";
import { useUserStore } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect } from "react";

const AppleLoginContent = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const responseStr = searchParams.get("response");

	const { setUser } = useUserStore();

	const loginMutation = useCallback(
		async (responseStr: string) => {
			const response = JSON.parse(decodeURIComponent(responseStr));

			const oauthResponse = await fetch("/api/oauth/callback/apple", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: JSON.stringify({
					...response,
				}),
			});

			if (!oauthResponse.ok) {
				const errorText = await oauthResponse.text();
				console.error("Error oauthResponse:", errorText);
				return;
			}
			const responseText = await oauthResponse.text();
			const oauthData = JSON.parse(responseText);

			if (oauthData.success) {
				setUser(oauthData.userData);

				if (oauthData.isNewUser) {
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
		if (responseStr) {
			loginMutation(responseStr);
		}
	}, [responseStr, loginMutation]);

	return (
		<div className="flex h-screen items-center justify-center bg-background-primary px-5 py-12">
			<SpurtyLoader />
		</div>
	);
};

const AppleLoginPage = () => {
	return (
		<Suspense>
			<AppleLoginContent />
		</Suspense>
	);
};

export default AppleLoginPage;
