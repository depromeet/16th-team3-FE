"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useWebViewMessage } from "@/hooks/useWebViewMessage";
import { useTaskProgressStore } from "@/store";
import type { TaskResponse } from "@/types/task";
import { formatKoreanDateTime } from "@/utils/dateFormat";
import ActionCard from "./_component/ActionCard";
import ActionDrawer from "./_component/ActionDrawer";
import CountdownTimer from "./_component/CountdownTimer";
import Header from "./_component/Header";
import ScheduleCard from "./_component/ScheduleCard";

const PushScreenState = {
	INITIAL: "initial",
	SECOND_CHANCE: "second",
	FINAL_WARNING: "final",
} as const;

type PushScreenStateType =
	(typeof PushScreenState)[keyof typeof PushScreenState];

const SCREEN_CONTENT = {
	[PushScreenState.INITIAL]: {
		icon: "/glasshour.svg",
		message: "이제 두 번의 기회만 남았어요!",
		subMessage: "미루기 전에 \n얼른 시작해보세요!",
	},
	[PushScreenState.SECOND_CHANCE]: {
		icon: "/glasshour.svg",
		message: "한 번만 더 알림이 오고 끝이에요!",
		subMessage: "작업을 더 미루기 전에\n얼른 시작해보세요!",
	},
	[PushScreenState.FINAL_WARNING]: {
		icon: "/dynamite.svg",
		message: "이제 마지막 기회에요",
		subMessage: "더 이상 미룰 수 없어요\n당장 시작하세요!",
	},
} as const;

interface ActionPushPageClientProps {
	task: TaskResponse;
	left?: string;
}

export default function ActionPushPageClient({
	task,
	left,
}: ActionPushPageClientProps) {
	const router = useRouter();
	const { handleTakePicture } = useWebViewMessage(router);

	const [screenState, setScreenState] = useState<PushScreenStateType>(
		getInitialState(left),
	);

	const { setCurrentTask } = useTaskProgressStore();

	useEffect(() => {
		setCurrentTask(task);
	}, [task, setCurrentTask]);

	return (
		<div className="flex h-full flex-col gap-4 bg-background-primary">
			<Header content={SCREEN_CONTENT[screenState]} />

			<div className="flex flex-col gap-4 px-5">
				<ActionCard
					badgeText="작은 행동"
					actionText={task?.triggerAction ?? ""}
				/>
				<ScheduleCard
					task={task?.name ?? ""}
					deadline={formatKoreanDateTime(task?.dueDatetime ?? "")}
				/>
			</div>

			<div className="relative mt-auto flex flex-col items-center px-5 pt-6">
				<div className="fixed bottom-0 left-0 right-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />
				{screenState === PushScreenState.FINAL_WARNING && (
					<div className="purple-blur-effect absolute inset-0" />
				)}
				<CountdownTimer timeLeft={task?.dueDatetime ?? ""} />

				<ActionDrawer
					screenState={screenState}
					task={task ?? task}
					onTakePicture={handleTakePicture}
				/>
			</div>

			{screenState !== PushScreenState.FINAL_WARNING && (
				<button
					className="relative mb-[34px] text-gray-neutral"
					onClick={() => router.push("/action/remind/" + task.id)}
				>
					나중에 할래요
				</button>
			)}
		</div>
	);
}

function getInitialState(left?: string): PushScreenStateType {
	switch (left) {
		case "2":
			return PushScreenState.INITIAL;
		case "1":
			return PushScreenState.SECOND_CHANCE;
		case "0":
			return PushScreenState.FINAL_WARNING;
		default:
			return PushScreenState.INITIAL;
	}
}
