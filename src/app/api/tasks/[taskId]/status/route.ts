import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> },
) {
	const { taskId } = await params;

	try {
		const body = await request.json();

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const response = await serverApi.patch(`v1/tasks/${taskId}/status`, {
			json: body,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			if (response.status === 404) {
				return NextResponse.json(
					{ error: "해당 할일을 찾을 수 없습니다." },
					{ status: 404 },
				);
			}

			const errorData = (await response
				.json()
				.catch(() => ({ message: "오류 내용을 읽을 수 없습니다" }))) as {
				message: string;
			};

			throw new Error(`API 요청 실패: ${errorData.message}`);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			return NextResponse.json(
				{ error: "요청 시간이 초과되었습니다." },
				{ status: 408 },
			);
		}

		return NextResponse.json(
			{ error: "할일 상태를 변경하는 중 오류가 발생했습니다." },
			{ status: 500 },
		);
	}
}
