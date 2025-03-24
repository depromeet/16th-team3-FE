"use client";

import { useUserStore } from "@/store/useUserStore";
import type { TaskResponse } from "@/types/task";
import { calculateRemainingTime } from "@/utils/dateFormat";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/component/Badge";
import { Button } from "@/components/ui/button";
import { useCompleteTask } from "@/hooks/useTasks";
import Link from "next/link";

interface Props {
	initialTask: TaskResponse;
}

export default function ImmersionPageClient({ initialTask }: Props) {
	const router = useRouter();
	const [remainingTime, setRemainingTime] = useState("");

	const nickname = useUserStore((state) => state.userData.nickname);
	// const { data, error, isLoading } = useTask(initialTask.id.toString(), {
	//   initialData: initialTask,
	// });

	const { mutate: completeTask } = useCompleteTask();
	// 남은 시간을 계산하고 상태 업데이트하는 함수
	useEffect(() => {
		const updateRemainingTime = () => {
			if (initialTask?.dueDatetime) {
				const targetDate = new Date(initialTask.dueDatetime);
				// 원래 계산된 시간 문자열을 가져옴
				const timeStr = calculateRemainingTime(targetDate);

				// '남음' 텍스트를 완전히 제거
				const formattedTime = timeStr.replace(" 남음", "");

				setRemainingTime(formattedTime);
			}
		};

		// 초기 업데이트
		updateRemainingTime();

		// 1초마다 업데이트
		const intervalId = setInterval(updateRemainingTime, 1000);

		// 컴포넌트 언마운트 시 인터벌 정리
		return () => clearInterval(intervalId);
	}, [initialTask?.dueDatetime]);

	const handleComplete = () => {
		completeTask(Number(initialTask.id));
		router.push("/immersion/complete");
	};

	return (
		<div className="flex h-full flex-col bg-background-primary">
			{/* TODO : 헤더 컴포넌트로 변경 예정 */}
			<Link href="/">
				<div className="flex items-center px-5 py-[14px]">
					<Image
						src="/arrow-left.svg"
						alt="왼쪽 화살표"
						width={24}
						height={24}
					/>
				</div>
			</Link>
			<div className="mt-[120px] flex flex-col items-center justify-center">
				<div className="text-s2">{initialTask.name} 마감까지</div>
				<div className="whitespace-pre-line bg-hologram bg-clip-text text-center text-h2 text-transparent">
					{remainingTime}
				</div>
			</div>

			<div className="relative mt-5 flex flex-col items-center justify-center gap-4">
				<div className="fixed left-0 right-0 top-[290px] h-[190px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />

				<div className="relative z-10 flex items-center gap-2">
					<Image
						src="/icons/immersion/study.png"
						alt="경고 아이콘"
						width={140}
						height={140}
					/>
				</div>
				<Badge>
					{initialTask.persona?.name} {nickname}
				</Badge>
			</div>

			<div className="relative mt-auto flex flex-col items-center px-5 py-6">
				<Button
					variant="primary"
					className="relative mb-4 w-full"
					onClick={handleComplete}
				>
					다했어요!
				</Button>
			</div>
		</div>
	);
}
