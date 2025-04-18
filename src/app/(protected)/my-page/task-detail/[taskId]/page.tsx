import { serverApi } from "@/lib/serverKy";
import type { TaskWithRetrospection } from "@/types/myPage";
import { HTTPError } from "ky";
import ExpiredTaskDetailPage from "./ExpiredTaskDetailPage";

const fetchServerTaskWithRetrospection = async (
	taskId: string,
): Promise<TaskWithRetrospection> => {
	const response = await serverApi
		.get(`v1/tasks/${taskId}/retrospection`)
		.json()
		.catch((error) => {
			if (error instanceof HTTPError) {
				console.error(error.response);
				error.response.json().then((data) => {
					console.error("Error response: ", data);
				});
			} else {
				console.error("Error : ", error.message);
			}
		});
	return response as TaskWithRetrospection;
};

export default async function RetrospectPage({
	params,
}: {
	params: Promise<{ taskId: string }>;
}) {
	const { taskId } = await params;
	const task: TaskWithRetrospection =
		await fetchServerTaskWithRetrospection(taskId);

	return <ExpiredTaskDetailPage task={task} />;
}
