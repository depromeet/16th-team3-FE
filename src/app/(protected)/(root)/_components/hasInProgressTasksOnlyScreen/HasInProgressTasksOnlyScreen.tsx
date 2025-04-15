import useTaskFiltering from "@/hooks/useTaskFilter";
import { useHomeData } from "@/hooks/useTasks";
import type { Task } from "@/types/task";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import InProgressTaskItem from "../InProgressTaskItem";

interface HasInProgressTasksOnlyScreenProps {
	taskType: string;
	handleDetailTask: (task: Task) => void;
}

const HasInProgressTasksOnlyScreen = ({
	taskType,
	handleDetailTask,
}: HasInProgressTasksOnlyScreenProps) => {
	const { data: homeData } = useHomeData();

	const { inProgressTasks } = useTaskFiltering(homeData);

	return (
		<>
			<div className="mb-7">
				<h3 className="s3 mb-2 text-text-neutral">진행 중</h3>
				{inProgressTasks.map((task, index) => (
					<InProgressTaskItem
						key={task.id}
						task={task}
						index={index}
						taskType={taskType}
						onShowDetails={() => handleDetailTask(task)}
					/>
				))}
			</div>

			<Link href="/weekly-tasks">
				<button
					type="button"
					className="flex w-full items-center justify-between rounded-[20px] bg-component-gray-secondary px-4 py-4"
				>
					<span className="s2 text-text-neutral">이번주 할일</span>
					<Image
						src="/icons/home/arrow-right.svg"
						alt="Arrow Right"
						width={24}
						height={24}
						priority
					/>
				</button>
			</Link>
		</>
	);
};

export default memo(HasInProgressTasksOnlyScreen);
