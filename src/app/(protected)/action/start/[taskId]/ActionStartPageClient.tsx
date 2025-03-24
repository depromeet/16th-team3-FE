"use client";

import { useWebViewMessage } from "@/hooks/useWebViewMessage";
import type { TaskResponse } from "@/types/task";
import { formatKoreanDateTime } from "@/utils/dateFormat";
import { useRouter } from "next/navigation";

import { useTaskProgressStore } from "@/store";
import { useEffect } from "react";
import ActionCard from "./_component/ActionCard";
import ActionStartDrawer from "./_component/ActionStartDrawer";
import ActionStartHeader from "./_component/ActionStartHeader";
import ScheduleCard from "./_component/ScheduleCard";
interface Props {
	initialTask: TaskResponse;
}

export default function ActionStartPageClient({ initialTask }: Props) {
	const router = useRouter();
	const { handleTakePicture } = useWebViewMessage(router);
	const { setCurrentTask } = useTaskProgressStore();

	useEffect(() => {
		setCurrentTask(initialTask);
	}, [initialTask, setCurrentTask]);

	return (
		<div className="flex h-full flex-col gap-4 bg-background-primary">
			<ActionStartHeader />
			<div className="flex flex-col gap-4 px-5">
				<ActionCard title={initialTask?.triggerAction} />
				<ScheduleCard
					title={initialTask?.name}
					dueDate={formatKoreanDateTime(initialTask?.dueDatetime ?? "")}
				/>
			</div>

			<ActionStartDrawer
				onTakePicture={handleTakePicture}
				smallActionTitle={initialTask?.triggerAction}
				dueDate={initialTask?.dueDatetime}
				taskId={initialTask?.id?.toString()}
			/>
		</div>
	);
}
