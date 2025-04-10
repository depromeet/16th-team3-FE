import { fetchServerTask } from "@/lib/serverTask";
import type { TaskResponse } from "@/types/task";
import RetrospectionPageClient from "./RetrospectionPageClient";

// 회고 화면
// 회고 화면으로 이동할까요? 에서 이동하므로 taskId를 받거나 task 정보 자체를 어디선가 가지고 있음.
// 화면에 task name이 있어서 가져와야 함.

export default async function RetrospectPage({
	params,
}: {
	params: Promise<{ taskId: string }>;
}) {
	const { taskId } = await params;
	const task: TaskResponse = await fetchServerTask(taskId);

	return <RetrospectionPageClient task={task} />;
}
