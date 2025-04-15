import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import InProgressTaskItem from "../InProgressTaskItem";

const HasInProgressTasksOnlyScreen = () => {
	return (
		<>
			{/* 진행 중 섹션 */}
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
			{/* 진행 예정 섹션 */}
		</>
	);
};

export default memo(HasInProgressTasksOnlyScreen);
