import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ActionCard from "./ActionCard";
import TimerBadge from "./TimerBadge";

interface ActionStartDrawerProps {
	onTakePicture: () => void;
	smallActionTitle?: string;
	dueDate?: string;
	taskId?: string;
}

export default function ActionStartDrawer({
	onTakePicture,
	smallActionTitle,
	dueDate,
	taskId,
}: ActionStartDrawerProps) {
	const router = useRouter();
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

	return (
		<div className="relative mt-auto flex flex-col items-center px-5 py-6">
			<div className="fixed bottom-0 left-0 right-0 h-[245px] bg-component-gray-secondary blur-[75px]" />
			<TimerBadge dueDate={dueDate ?? ""} />
			<>
				<Drawer open={open} onOpenChange={setOpen} modal={false}>
					<DrawerTrigger asChild>
						<Button
							variant="primary"
							className="relative mb-4 w-full"
							onClick={() => setOpen(true)}
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
						<div className="px-5">
							<ActionCard title={smallActionTitle} variant="gradient2" />
							<Button
								variant="primary"
								className="relative mb-[50px] mt-7 w-full"
								onClick={onTakePicture}
							>
								사진찍기
							</Button>
						</div>
					</DrawerContent>
				</Drawer>
				{/* Drawer가 열릴 때 오버레이 렌더링 */}
				{open && (
					<div
						className="fixed inset-0 z-40 bg-black/80"
						onClick={() => setOpen(false)}
					/>
				)}
			</>
			<Link
				href={`/action/remind/${taskId}`}
				className="relative mb-[30px] text-gray-neutral"
			>
				나중에 할래요
			</Link>
		</div>
	);
}
