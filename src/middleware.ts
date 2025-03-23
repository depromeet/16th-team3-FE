import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const accessToken = request.cookies.get("accessToken");
	const refreshToken = request.cookies.get("refreshToken");

	const openPaths = [
		"/login",
		"/api/oauth",
		"/api/oauth/callback/kakao",
		"/api/oauth/callback/apple",
		"/api/auth/members/me",
		"/firebase-messaging-sw.js",
		"/oauth/callback/kakao",
	];

	const isOpenPath = openPaths.some(
		(openPath) => path === openPath || path.startsWith(`${openPath}/`),
	);

	if (isOpenPath && accessToken) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (!isOpenPath && !refreshToken) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|public).*)"],
};

export const runtime = "nodejs";
