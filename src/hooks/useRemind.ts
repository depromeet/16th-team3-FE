import { useMutation } from "@tanstack/react-query";

interface RemindData {
	remindInterval: number;
	remindCount: number;
	remindBaseTime: string;
}

export const useRemindMutation = () => {
	return useMutation({
		mutationFn: async ({
			taskId,
			data,
		}: {
			taskId: string;
			data: RemindData;
		}) => {
			const response = await fetch(`/v1/tasks/${taskId}/hold-off`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiaWF0IjoxNzQwMzA3MjAwLCJleHAiOjE3NDc5OTMyMDB9.wzUeK94JGyNnC0iyZpWjdJppD66R3dI4jBD8sdWdT44`,
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("리마인드 설정에 실패했습니다");
			}

			return response.json();
		},
	});
};
