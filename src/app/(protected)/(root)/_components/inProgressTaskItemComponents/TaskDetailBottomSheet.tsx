import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { useRemainingTime } from "@/hooks/useRemainingTime";
import type { Task } from "@/types/task";
import type React from "react";
import { memo } from "react";

interface TaskDetailBottomSheetProps {
	task: Task;
	showBottomSheet: boolean;
	setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
	handleContinueToFocus: (e: React.MouseEvent) => void;
	handleCloseBottomSheet: () => void;
}

const TaskDetailBottomSheet = ({
	task,
	showBottomSheet,
	setShowBottomSheet,
	handleContinueToFocus,
	handleCloseBottomSheet,
}: TaskDetailBottomSheetProps) => {
	const { remainingTime, isExpired } = useRemainingTime(task);

	return (
		<Drawer open={showBottomSheet} onOpenChange={setShowBottomSheet}>
			<DrawerContent className="w-auto border-0 bg-component-gray-secondary px-5 pb-[33px] pt-2">
				<DrawerHeader>
					<DrawerTitle className="t3 text-center text-text-strong">
						{task.title}
					</DrawerTitle>
					<DrawerDescription className="t3 text-center text-text-strong">
						하던 중이었어요. 이어서 몰입할까요?
					</DrawerDescription>
					<DrawerDescription
						className={`b3 ${isExpired ? "text-red-500" : "text-text-neutral"} mt-2 text-center`}
					>
						{`마감까지 ${remainingTime}`}
					</DrawerDescription>
				</DrawerHeader>
				<button
					className="l2 w-full rounded-[16px] bg-component-accent-primary py-4 mt-3 text-white"
					onClick={handleContinueToFocus}
					type="button"
					aria-label="이어서 몰입하기"
				>
					이어서 몰입
				</button>

				<button
					className="l2 w-full py-4 text-text-neutral"
					onClick={handleCloseBottomSheet}
					type="button"
					aria-label="닫기"
				>
					닫기
				</button>
			</DrawerContent>
		</Drawer>
	);
};

export default memo(TaskDetailBottomSheet);
