import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";
import AuthProvider from "./authProvider";
import Providers from "./providers";

export const metadata: Metadata = {
	title: "Spurt",
	description: "Spurt is a task management app.",
};

const pretendard = localFont({
	src: "../static/fonts/PretendardVariable.woff2",
	display: "swap",
	weight: "45 920",
	variable: "--font-pretendard",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" className={pretendard.variable}>
			<body
				className={`${pretendard.className} mt-[44px] h-screen overflow-hidden antialiased`}
			>
				<Providers>
					<AuthProvider>{children}</AuthProvider>
				</Providers>
				<Script
					src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
					integrity={process.env.NEXT_PUBLIC_KAKAO_INTEGRITY}
					crossOrigin="anonymous"
					strategy="beforeInteractive"
				/>
				<Script
					src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
					strategy="beforeInteractive"
				/>
			</body>
		</html>
	);
}
