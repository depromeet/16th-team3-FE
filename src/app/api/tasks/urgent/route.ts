import { serverApi } from "@/lib/serverKy";
import type { InstantTaskType } from "@/types/create";
import type { TaskResponse } from "@/types/task";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const data: InstantTaskType = await req.json();

		const apiResponse = await serverApi.post("v1/tasks/urgent", {
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

		const personaName = taskResponse.persona.name;
		const personaId = taskResponse.persona.id;
		const taskId = taskResponse.id;

		const nextResponse = NextResponse.json({
			success: true,
			personaName: personaName,
			personaId: personaId,
			taskId: taskId,
		});

		return nextResponse;
	} catch (error) {
		return NextResponse.json(
			{ error: "Error creating scheduled task" },
			{ status: 500 },
		);
	}
}
