import { type NextRequest, NextResponse } from "next/server";

const REFRESH_ENDPOINT = "/v1/auth/token/refresh";

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

	if (!isOpenPath && !refreshToken) {
		return NextResponse.redirect(new URL("/login", request.url), 302);
	}

	// if (!isOpenPath && !accessToken && refreshToken) {
	// 	const cookieStore = request.cookies;
	// 	const oldRefreshToken = cookieStore.get("refreshToken")?.value;

	// 	const response = await fetch(
	// 		`${process.env.NEXT_PUBLIC_API_URL}${REFRESH_ENDPOINT}`,
	// 		{
	// 			method: "POST",
	// 			headers: { "Content-Type": "application/json" },
	// 			body: JSON.stringify({ refreshToken: oldRefreshToken }),
	// 		},
	// 	);

	// 	if (!response.ok) {
	// 		const resp = NextResponse.redirect(new URL("/login", request.url), 307);
	// 		resp.cookies.delete("accessToken");
	// 		resp.cookies.delete("refreshToken");
	// 		return resp;
	// 	}

	// 	const { accessToken, refreshToken: newRefreshToken } =
	// 		(await response.json()) as {
	// 			accessToken: string;
	// 			refreshToken: string;
	// 		};

	// 	const nextResponse = NextResponse.next();

	// 	nextResponse.cookies.set("accessToken", accessToken, {
	// 		httpOnly: true,
	// 		secure: true,
	// 		sameSite: "none",
	// 		path: "/",
	// 		maxAge: 60 * 60,
	// 	});

	// 	nextResponse.cookies.set("refreshToken", newRefreshToken, {
	// 		httpOnly: true,
	// 		secure: true,
	// 		sameSite: "none",
	// 		path: "/",
	// 		maxAge: 60 * 60 * 24 * 7,
	// 	});

	// 	return nextResponse;
	// }

	if (isOpenPath && accessToken) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|public).*)"],
};

export const runtime = "nodejs";
