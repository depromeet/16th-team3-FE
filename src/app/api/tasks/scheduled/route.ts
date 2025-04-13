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
			return NextResponse.json(
				{ error: "Failed to POST request", details: errorData },
				{ status: apiResponse.status },
			);
		}

		const taskResponse: TaskResponse = await apiResponse.json();
		const personaId = taskResponse.persona.id;
		const personaName = taskResponse.persona.name;

		const nextResponse = NextResponse.json({
			success: true,
			personaId: personaId,
			personaName: personaName,
		});

		return nextResponse;
	} catch (error) {
		console.error("Error creating scheduled task:", error);

		return NextResponse.json(
			{ error: "Error creating scheduled task" },
			{ status: 500 },
		);
	}
}
