import ky from "ky";

import { cookies } from "next/headers";

const REFRESH_ENDPOINT = "/v1/auth/token/refresh";
const UNAUTHORIZED_CODE = 401;

export const serverApi = ky.create({
	prefixUrl: process.env.NEXT_PUBLIC_API_URL,
	credentials: "include",
	headers: {
		"Content-Type": "application/json",
	},
	retry: {
		limit: 2,
		methods: ["get", "post"],
		statusCodes: [401, 408, 413, 429, 500, 502, 503, 504],
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
				const cookieStore = await cookies();
				const currentAccessToken = cookieStore.get("accessToken")?.value;
				const refreshToken = cookieStore.get("refreshToken")?.value;

				if (response.status === UNAUTHORIZED_CODE || !currentAccessToken) {
					const refreshResponse = await fetch(
						`${process.env.NEXT_PUBLIC_API_URL}${REFRESH_ENDPOINT}`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								refreshToken: refreshToken,
							}),
						},
					);

					const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
						(await refreshResponse.json()) as {
							accessToken: string;
							refreshToken: string;
						};

					cookieStore.set("accessToken", newAccessToken, {
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
				}

				return response;
			},
		],
	},
});
