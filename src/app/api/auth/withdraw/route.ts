import { serverApi } from "@/lib/serverKy";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		const apiResponse = await serverApi.post("v1/auth/withdraw");

		if (!apiResponse.ok) {
			const errorData = await apiResponse.json();
			return NextResponse.json(
				{ error: "Failed to POST request", details: errorData },
				{ status: apiResponse.status },
			);
		}

		const cookieStore = await cookies();

		cookieStore.delete("accessToken");
		cookieStore.delete("refreshToken");

		const nextResponse = NextResponse.json({
			success: true,
		});

		return nextResponse;
	} catch (error) {
		return NextResponse.json(
			{ error: "Error creating scheduled task" },
			{ status: 500 },
		);
	}
}
