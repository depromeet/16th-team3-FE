import { serverApi } from "@/lib/serverKy";
import { NextResponse } from "next/server";

export async function GET() {
	const response = await serverApi.get("v1/members/me");

	if (!response.ok) {
		if (response.status === 404) {
			return NextResponse.json(
				{ error: "해당 할일을 찾을 수 없습니다." },
				{ status: 404 },
			);
		}
		throw new Error(`API 요청 실패: ${response.status}`);
	}

	console.log("server response", response);

	const data = await response.json();

	console.log("data", data);

	const nextResponse = NextResponse.json(data);

	return nextResponse;
}
