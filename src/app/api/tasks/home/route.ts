import { serverApi } from "@/lib/serverKy";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		// ! AbortController를 사용하여 요청 시간이 10초를 초과하면 요청을 취소합니다. - 이거 필요할까?
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const response = await serverApi.get("v1/tasks/home");

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorText = await response.text();

			return NextResponse.json(
				{ error: `API 요청 실패 (${response.status}): ${errorText}` },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error: any) {
		if (error instanceof Error && error.name === "AbortError") {
			return NextResponse.json(
				{ error: "요청 시간이 초과되었습니다." },
				{ status: 408 },
			);
		}

		return NextResponse.json(
			{
				error: `홈 화면 데이터를 가져오는 중 오류가 발생했습니다: ${error.message || "알 수 없는 오류"}`,
			},
			{ status: 500 },
		);
	}
}
