import { serverApi } from "@/lib/serverKy";
import { HTTPError } from "ky";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> },
) {
	const data = await request.json();
	const { taskId } = await params;

	const response = await serverApi
		.post(`v1/tasks/${taskId}/retrospectives`, {
			json: data,
		})
		.json()
		.catch(async (error) => {
			if (error instanceof HTTPError) {
				const errorRes = await error.response.json().then((data) => {
					console.error("Error response: ", data);
				});
				return NextResponse.json(errorRes);
			} else {
				console.error("Error : ", error.message);
				return NextResponse.json(
					{
						error: "서버 내부 오류가 발생했습니다.",
						details: error instanceof Error ? error.message : String(error),
						stack: error instanceof Error ? error.stack : undefined,
					},
					{ status: 500 },
				);
			}
		});

	return NextResponse.json(response);
}
//     try {

//         if (!response.ok) {
//             const errorData = await response.json();
//             return NextResponse.json(
//                 { error: "Failed to PATCH request", details: errorData },
//                 { status: response.status },
//             );
//         }

//             const text = await response.text();
//             const result = text ? JSON.parse(text) : {};
//             return  NextResponse.json(result);

//     } catch (error) {
//         return NextResponse.json(
//             {
//                 error: "서버 내부 오류가 발생했습니다.",
//                 details: error instanceof Error ? error.message : String(error),
//                 stack: error instanceof Error ? error.stack : undefined,
//             },
//             { status: 500 },
//         );
//     }
// }
