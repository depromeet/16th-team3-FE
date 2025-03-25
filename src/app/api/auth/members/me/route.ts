import { serverApi } from "@/lib/serverKy";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await serverApi.get("v1/members/me");

		if (!response.ok) {
			if (response.status === 404) {
				return NextResponse.json(
					{ error: "사용자 정보를 가져올 수 없습니다." },
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
				error: `사용자 정보를 가져오는 중 에러 발생: ${(error as Error).message || "알 수 없는 오류"}`,
			},
			{ status: (error as any).response?.status || 500 },
		);
	}
}
