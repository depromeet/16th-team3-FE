import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import type { TaskResponse } from "@/types/task";
import { useEffect, useState } from "react";
import ActionCard from "./ActionCard";

const PushScreenState = {
	INITIAL: "initial",
	SECOND_CHANCE: "second",
	FINAL_WARNING: "final",
} as const;

type PushScreenStateType =
	(typeof PushScreenState)[keyof typeof PushScreenState];

export default function PushActionDrawer({
	screenState,
	task,
	onTakePicture,
}: {
	screenState: PushScreenStateType;
	task: TaskResponse;
	onTakePicture: () => void;
}) {
	const [countdown, setCountdown] = useState(60);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const handleTriggerClick = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Drawer open={open} onOpenChange={setOpen} modal={false}>
				<DrawerTrigger asChild>
					<Button
						variant={
							screenState === PushScreenState.FINAL_WARNING
								? "point"
								: "primary"
						}
						className={`relative w-full ${
							screenState === PushScreenState.FINAL_WARNING ? "mb-[34px]" : ""
						}`}
						onClick={handleTriggerClick}
					>
						시작하기
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle className="flex flex-col gap-2">
							<p className="text-t3">작은 행동을 사진으로 찍어주세요</p>
							<p className="text-sm text-gray-neutral">
								<span className="font-semibold text-component-accent-primary">
									{countdown}초
								</span>
								내에 사진 촬영을 하지 않으면
								<br />
								진동이 계속 울려요
							</p>
						</DrawerTitle>
					</DrawerHeader>
					<div className="px-5 pb-[30px]">
						<ActionCard
							variant="drawer"
							badgeText="작은 행동"
							actionText={task.triggerAction}
						/>
						<Button
							variant="primary"
							className="relative mb-4 mt-7 w-full"
							onClick={onTakePicture}
						>
							사진찍기
						</Button>
					</div>
				</DrawerContent>
			</Drawer>
			{/* Drawer가 열릴 때 직접 추가한 오버레이 */}
			{open && (
				<div className="fixed inset-0 z-40 bg-black/80" onClick={handleClose} />
			)}
		</>
	);
}
