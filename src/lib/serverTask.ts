import type { TaskResponse } from "@/types/task";
import { HTTPError } from "ky";
import { serverApi } from "./serverKy";

export const fetchServerTask = async (
	taskId: string,
): Promise<TaskResponse> => {
	const response = await serverApi
		.get(`v1/tasks/${taskId}`)
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
	return response as TaskResponse;
};
