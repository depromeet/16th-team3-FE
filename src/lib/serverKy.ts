import ky, { type KyResponse } from "ky";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const REFRESH_ENDPOINT = "/v1/auth/token/refresh";
const UNAUTHORIZED_CODE = 401;

let refreshPromise: Promise<{
	accessToken: string;
	refreshToken: string;
}> | null = null;

export const serverApi = ky.create({
	prefixUrl: process.env.NEXT_PUBLIC_API_URL,
	credentials: "include",
	headers: { "Content-Type": "application/json" },
	retry: {
		limit: 2,
		methods: ["get", "post"],
		statusCodes: [408, 413, 429, 500, 502, 503, 504],
	},
	hooks: {
		beforeRequest: [
			async (request) => {
				const cookieStore = await cookies();
				const accessToken = cookieStore.get("accessToken")?.value;
				if (accessToken) {
					request.headers.set("Authorization", `Bearer ${accessToken}`);
				}
			},
		],
		afterResponse: [
			async (request, options, response) => {
				if (response.status !== UNAUTHORIZED_CODE) {
					return response;
				}

				if (!refreshPromise) {
					refreshPromise = (async () => {
						const cookieStore = await cookies();
						const oldRefreshToken = cookieStore.get("refreshToken")?.value;

						const refreshRes = await fetch(
							`${process.env.NEXT_PUBLIC_API_URL}${REFRESH_ENDPOINT}`,
							{
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({ refreshToken: oldRefreshToken }),
							},
						);

						if (!refreshRes.ok) {
							cookieStore.delete("accessToken");
							cookieStore.delete("refreshToken");
							throw new Error("Refresh failed");
						}

						const { accessToken, refreshToken: newRefreshToken } =
							await refreshRes.json();

						cookieStore.set("accessToken", accessToken, {
							httpOnly: true,
							secure: true,
							sameSite: "none",
							path: "/",
							maxAge: 60 * 60,
						});
						cookieStore.set("refreshToken", newRefreshToken, {
							httpOnly: true,
							secure: true,
							sameSite: "none",
							path: "/",
							maxAge: 60 * 60 * 24 * 7,
						});

						return { accessToken, refreshToken: newRefreshToken };
					})();
				}

				try {
					const { accessToken, refreshToken: newRefreshToken } =
						await refreshPromise;
					request.headers.set("Authorization", `Bearer ${accessToken}`);

					// ! 이 코드가 의미가 있을까..?
					const cookieStore = await cookies();

					cookieStore.set("accessToken", accessToken, {
						httpOnly: true,
						secure: true,
						sameSite: "none",
						path: "/",
						maxAge: 60 * 60,
					});
					cookieStore.set("refreshToken", newRefreshToken, {
						httpOnly: true,
						secure: true,
						sameSite: "none",
						path: "/",
						maxAge: 60 * 60 * 24 * 7,
					});

					return serverApi(request, options);
				} catch (err) {
					return NextResponse.redirect(new URL("/login", request.url));
				} finally {
					refreshPromise = null;
				}
			},
		],
	},
});
