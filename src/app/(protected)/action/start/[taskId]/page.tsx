export const dynamic = "force-dynamic";

import { fetchServerTask } from "@/lib/serverTask";
import { CurrentTimeProvider } from "@/provider/CurrentTimeProvider";
import type { TaskResponse } from "@/types/task";
import ActionStartPageClient from "./ActionStartPageClient";

export default async function Start({
	params,
}: {
	params: Promise<{ taskId: string }>;
}) {
	const { taskId } = await params;

	const task: TaskResponse = await fetchServerTask(taskId);
	return (
		<CurrentTimeProvider>
			<ActionStartPageClient initialTask={task} />
		</CurrentTimeProvider>
	);
}
