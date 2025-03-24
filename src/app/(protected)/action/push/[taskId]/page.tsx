import { fetchServerTask } from "@/lib/serverTask";
import type { TaskResponse } from "@/types/task";

import { CurrentTimeProvider } from "@/provider/CurrentTimeProvider";
import ActionPushPageClient from "./ActionPushPageClient";

export default async function Push({
	params,
	searchParams,
}: {
	params: Promise<{ taskId: string }>;
	searchParams: Promise<{ left?: string }>;
}) {
	const { taskId } = await params;
	const { left } = await searchParams;

	const task: TaskResponse = await fetchServerTask(taskId);

	return (
		<CurrentTimeProvider>
			<ActionPushPageClient task={task} left={left} />
		</CurrentTimeProvider>
	);
}
