"use client";

import { Button } from "@/components/ui/button";
import { useStartTask } from "@/hooks/useTasks";
import { useRouter } from "next/navigation";

export default function StartButton({
	currentTaskId,
}: {
	currentTaskId: string;
}) {
	const router = useRouter();
	const { mutate: startTaskMutation } = useStartTask();

	const handleStart = async () => {
		try {
			startTaskMutation(Number(currentTaskId));
			router.push(`/immersion/${currentTaskId}`);
		} catch (error) {
			console.error("Failed to start immersion:", error);
		}
	};

	return (
		<div className="mt-auto flex w-full flex-col items-center px-5 py-6">
			<Button
				variant="primary"
				className="relative z-10 mb-4 w-full"
				onClick={handleStart}
			>
				몰입 시작하기
			</Button>
			<div className="fixed bottom-0 left-0 right-0 h-[245px]" />
		</div>
	);
}
