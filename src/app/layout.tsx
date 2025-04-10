import type { Metadata } from "next";
import "./globals.css";
import * as gtag from "@/lib/gtag";
import { ViewTransitions } from "next-view-transitions";
import localFont from "next/font/local";
import Script from "next/script";

export const metadata: Metadata = {
	title: "Spurt",
	description: "Spurt is a task management app.",
	// viewport:
	//   'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
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
		<ViewTransitions>
			<html lang="ko" className={pretendard.variable}>
				<head>
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
					/>
				</head>
				<body
					className={`${pretendard.className} mt-[44px] h-[calc(100vh-44px)] antialiased bg-background-primary`}
				>
					{children}
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
					{/* Global Site Tag (gtag.js) - Google Analytics */}
					<Script
						strategy="afterInteractive"
						src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
					/>
					<Script
						id="gtag-init"
						strategy="afterInteractive"
						dangerouslySetInnerHTML={{
							__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
						}}
					/>
				</body>
			</html>
		</ViewTransitions>
	);
}
