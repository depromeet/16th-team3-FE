"use client";

import { Button } from "@/components/ui/button";
import { useWebViewMessage } from "@/hooks/useWebViewMessage";
import { useUserStore } from "@/store";
import type { AppleAuthorizationResponse } from "@/types/auth";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

declare global {
	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		Kakao?: any;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		AppleID?: any;
	}
}

const COOKIE_OPTIONS = {
	expires: 30,
	path: "/",
	secure: false,
} as const;

const REDIRECT_URI_KAKAO =
	process.env.NODE_ENV === "production"
		? "https://spurt.site/oauth/callback/kakao"
		: "http://localhost:3000/oauth/callback/kakao";
const SCOPE_KAKAO = ["openid"].join(",");

const LoginPage = () => {
	const router = useRouter();
	const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
	const [socialType, setSocialType] = useState<"kakao" | "apple">("kakao");
	const { handleGetDeviceToken } = useWebViewMessage();

	const { setUser } = useUserStore();

	const handleKakaoLogin = useCallback(async () => {
		if (!isKakaoLoaded || !window.Kakao?.Auth) {
			console.error("Kakao SDK not loaded");
			return;
		}

		window.Kakao.Auth.authorize({
			redirectUri: REDIRECT_URI_KAKAO,
			scope: SCOPE_KAKAO,
		});
	}, [isKakaoLoaded]);

	const handleAppleLogin = useCallback(async () => {
		try {
			const response: AppleAuthorizationResponse =
				await window.AppleID.auth.signIn();

			const oauthResponse = await fetch("/api/oauth/callback/apple", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: JSON.stringify({
					...response,
					deviceId: Cookies.get("deviceId"),
					deviceType: Cookies.get("deviceType"),
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
		} catch (err) {
			console.error("Apple login error: ", err);
		}
	}, [router, setUser]);

	const executeSocialLogin = useCallback(() => {
		if (socialType === "kakao") {
			handleKakaoLogin();
		} else {
			handleAppleLogin();
		}
	}, [socialType, handleKakaoLogin, handleAppleLogin]);

	const saveDeviceToken = useCallback(
		(fcmToken: string, deviceType: string) => {
			Cookies.set("deviceId", fcmToken, COOKIE_OPTIONS);
			Cookies.set("deviceType", deviceType, COOKIE_OPTIONS);
		},
		[],
	);

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			try {
				const data =
					typeof event.data === "string" ? JSON.parse(event.data) : event.data;

				if (data.type === "GET_DEVICE_TOKEN" && data.payload.fcmToken) {
					saveDeviceToken(data.payload.fcmToken, data.payload.deviceType);
					executeSocialLogin();
				}
			} catch (error) {
				console.error("Failed to parse message:", error);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [executeSocialLogin, saveDeviceToken]);

	const handleSocialLogin = (type: "kakao" | "apple") => {
		setSocialType(type);

		const isWebView = () => {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			return !!(window as any).ReactNativeWebView;
		};
		if (isWebView()) {
			handleGetDeviceToken();
			// 웹뷰 환경이면 네이티브 쪽에서 디바이스 토큰을 받아오도록 처리
		} else {
			// 웹 환경이면 바로 소셜 로그인 함수를 실행
			if (type === "kakao") {
				saveDeviceToken("test_on_web", "IOS");
				handleKakaoLogin();
			} else {
				saveDeviceToken("test_on_web", "IOS");
				handleAppleLogin();
			}
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const { AppleID } = window as any;
			if (AppleID) {
				AppleID.auth.init({
					clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
					scope: "name email",
					redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "",
					usePopup: true,
				});
			}
		}
	}, []);

	useEffect(() => {
		const checkKakaoSDK = () => {
			if (window.Kakao) {
				if (!window.Kakao.isInitialized()) {
					window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
				}
				setIsKakaoLoaded(true);
			}
		};

		checkKakaoSDK();
	}, []);

	return (
		<div className="flex h-full flex-col justify-between bg-background-primary px-5 pt-20">
			<div
				className="absolute bottom-0 left-1/2 z-0 -translate-x-1/2"
				style={{
					width: "375px",
					height: "385px",
					backgroundColor: "rgba(65, 65, 137, 0.4)",
					filter: "blur(75px)",
					borderRadius: "50%",
				}}
			/>

			<div
				className="absolute bottom-10 left-1/2 z-0 -translate-x-1/2"
				style={{
					width: "376px",
					height: "149px",
					opacity: 0.4,
					background:
						"conic-gradient(from 210deg at 50% 50%, #CCE4FF 0deg, #C1A4E8 50.06deg, #B8E2FB 85.94deg, #F2EFE8 134.97deg, #CCE4FF 172.05deg, #BDAFE3 224.67deg, #C7EDEB 259.36deg, #E7F5EB 298.82deg, #F2F0E7 328.72deg)",
					mixBlendMode: "color-dodge",
					filter: "blur(62px)",
				}}
			/>

			<div className="t2 text-strong pb-5">
				<p>
					미루는 당신을 위한
					<br />
					<span className="bg-hologram bg-clip-text text-transparent">
						스퍼트
					</span>
					에 오신 걸<br />
					환영합니다!
				</p>
			</div>

			<div className="mt-5 flex flex-1 flex-col items-center justify-start">
				<Image
					src="/icons/login/login-character.png"
					alt="로그인 캐릭터"
					width={348}
					height={348}
					priority
				/>
			</div>

			<div className="b3 absolute bottom-[192px] right-4 z-10 rounded-[12px] bg-component-accent-primary px-4 py-3 text-text-strong shadow-lg">
				3초만에 바로 시작하기
				<div
					className="absolute h-0 w-0"
					style={{
						bottom: "-11px",
						right: "3rem",
						transform: "translateX(50%)",
						borderStyle: "solid",
						borderWidth: "12px 7px 0 7px",
						borderColor: "#6B6BE1 transparent transparent transparent",
					}}
				/>
			</div>

			<div className="z-10 mb-[40px] flex w-full flex-col gap-4">
				<Button
					variant="default"
					className="l2 gap-2 rounded-[16px] bg-[#FEE500] text-[#0f1114]"
					onClick={() => handleSocialLogin("kakao")}
				>
					<Image
						src="/icons/login/kakao.svg"
						alt="kakao"
						width={24}
						height={24}
					/>
					<span className="pt-0.5">카카오로 계속하기</span>
				</Button>

				<Button
					variant="default"
					className="l2 i gap-2 rounded-[16px] bg-[#e6edf8] text-[#0f1114]"
					onClick={() => handleSocialLogin("apple")}
				>
					<Image
						src="/icons/login/apple.svg"
						alt="apple"
						width={24}
						height={24}
					/>
					<span className="pt-1">Apple로 계속하기</span>
				</Button>
			</div>
		</div>
	);
};

export default LoginPage;
