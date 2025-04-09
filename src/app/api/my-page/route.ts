import { serverApi } from "@/lib/serverKy";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await serverApi.get("v1/mypage");

		if (!response.ok) {
			if (response.status === 404) {
				return NextResponse.json(
					{ error: "마이페이지 404 에러 발생" },
					{ status: 404 },
				);
			}
			throw new Error(`API 요청 실패: ${response.status}`);
		}

		const data = await response.json();
		const nextResponse = NextResponse.json(data);

		return nextResponse;
	} catch (error) {
		return NextResponse.json(
			{
				error: `마이페이지 에러: ${(error as Error).message || "알 수 없는 오류"}`,
			},
			{
				status:
					(error as Error & { response?: { status: number } }).response
						?.status || 500,
			},
		);
	}
}
