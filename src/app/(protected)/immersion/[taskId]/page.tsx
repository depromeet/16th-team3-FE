import { fetchServerTask } from "@/lib/serverTask";
import type { TaskResponse } from "@/types/task";

import { CurrentTimeProvider } from "@/provider/CurrentTimeProvider";
import ImmersionPageClient from "./ImmersionPageClient";

export default async function Immersion({
	params,
}: {
	params: Promise<{ taskId: string }>;
}) {
	const { taskId } = await params;
	const task: TaskResponse = await fetchServerTask(taskId);

	return (
		<CurrentTimeProvider>
			<ImmersionPageClient initialTask={task} />
		</CurrentTimeProvider>
	);
}
