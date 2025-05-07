import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const accessToken = request.cookies.get("accessToken");
	const refreshToken = request.cookies.get("refreshToken");

	const openPaths = [
		"/login",
		"/firebase-messaging-sw.js",
		"/oauth/callback/kakao",
		"/oauth/callback/apple",
	];

	const isOpenPath = openPaths.some(
		(openPath) => path === openPath || path.startsWith(`${openPath}/`),
	);

	if (!isOpenPath && (!refreshToken || !refreshToken.value)) {
		return NextResponse.redirect(new URL("/login", request.url), 302);
	}

	if (isOpenPath && accessToken && accessToken.value) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|public).*)"],
};
