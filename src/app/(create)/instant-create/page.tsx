"use client";

import BackHeader from "@/components/backHeader/BackHeader";
import useMount from "@/hooks/useMount";
import type { InstantTaskType, TimePickerType } from "@/types/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFunnelSteps, useFunnel } from "@use-funnel/browser";
import { useRouter } from "next/navigation";
import InstantTaskTypeInput from "../_components/instantTaskTypeInput/InstantTaskTypeInput";
import TaskInput from "../_components/taskInput/TaskInput";
import type { InstantTaskInputType, TaskInputType } from "../context";

type FormState = {
	task?: string;
	deadlineDate?: Date;
	deadlineTime?: TimePickerType;
	taskType?: string;
	moodType?: string;
};

const steps = createFunnelSteps<FormState>()
	.extends("taskForm")
	.extends("taskTypeInput", {
		requiredKeys: ["task", "deadlineDate", "deadlineTime"],
	})
	.build();

const InstantTaskCreate = () => {
	const funnel = useFunnel<{
		taskForm: TaskInputType;
		taskTypeInput: InstantTaskInputType;
	}>({
		id: "task-create-main",
		steps: steps,
		initial: {
			step: "taskForm",
			context: {
				task: "",
				deadlineDate: undefined,
				deadlineTime: undefined,
				taskType: "",
				moodType: "",
			},
		},
	});

	const router = useRouter();
	const queryClient = useQueryClient();
	const { isMounted } = useMount();

	const { mutate: instantTaskMutation, isIdle } = useMutation({
		mutationFn: async (data: InstantTaskType) => {
			const res = await fetch("/api/tasks/urgent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const text = await res.text();
			const response = text ? JSON.parse(text) : {};
			return response;
		},
		onSuccess: (response) => {
			if (response.success) {
				const { personaName, taskMode, taskType } = response;
				queryClient.invalidateQueries({ queryKey: ["tasks", "home"] });
				router.push(
					`/?dialog=success&task=${funnel.context.task}&personaName=${personaName}&taskMode=${taskMode}&taskType=${taskType}`,
				);
			}
		},
		onError: (error) => {
			console.error("Mutation failed:", error);
		},
	});

	const lastStep =
		funnel.historySteps.length > 1
			? funnel.historySteps[funnel.historySteps.length - 2].step
			: undefined;

	const handleHistoryBack = () => {
		if (funnel.step === "taskTypeInput") {
			funnel.history.replace("taskForm", {
				task: funnel.context.task,
				deadlineDate: funnel.context.deadlineDate,
				deadlineTime: funnel.context.deadlineTime,
			});
		} else {
			router.push("/");
		}
	};

	if (!isMounted) return null;

	return (
		<div className="background-primary flex h-[calc(100vh-80px)] w-full flex-col items-center justify-start overflow-y-auto px-5">
			<BackHeader onClick={handleHistoryBack} />
			<funnel.Render
				taskForm={({ history }) => (
					<TaskInput
						context={funnel.context}
						lastStep={lastStep}
						onNext={({ task, deadlineDate, deadlineTime }) =>
							history.push("taskTypeInput", {
								task: task,
								deadlineDate: deadlineDate,
								deadlineTime: deadlineTime,
							})
						}
					/>
				)}
				taskTypeInput={({ context }) => (
					<InstantTaskTypeInput
						context={context}
						isIdle={isIdle}
						onClick={(data) => instantTaskMutation(data)}
					/>
				)}
			/>
		</div>
	);
};

export default InstantTaskCreate;
