import { serverApi } from "@/lib/serverKy";
import type { ScheduledTaskType } from "@/types/create";
import type { TaskResponse } from "@/types/task";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const data: ScheduledTaskType = await req.json();

		const apiResponse = await serverApi.post("v1/tasks/scheduled", {
			body: JSON.stringify(data),
		});

		if (!apiResponse.ok) {
			const errorData = await apiResponse.json();

			console.error("Error response:", errorData);

			return NextResponse.json(
				{ error: "Failed to POST request", details: errorData },
				{ status: apiResponse.status },
			);
		}

		const taskResponse: TaskResponse = await apiResponse.json();

		const personaName = taskResponse.persona.name;

		const nextResponse = NextResponse.json({
			success: true,
			personaName: personaName,
		});

		return nextResponse;
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
