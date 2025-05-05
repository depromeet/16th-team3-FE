import { useFormatDueTime } from "@/hooks/useFormatDueTime";
import type { Task } from "@/types/task";
import Image, { type StaticImageData } from "next/image";
import React, { memo } from "react";

interface HeaderProps {
	task: Task;
	personaImageUrl: StaticImageData | string;
}

const Header = ({ task, personaImageUrl }: HeaderProps) => {
	const { formatDueTime } = useFormatDueTime(task);

	return (
		<div className="mb-5 flex items-center gap-4">
			<div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-component-gray-tertiary p-2">
				<Image
					src={personaImageUrl}
					alt="Task"
					width={32}
					height={32}
					priority
				/>
			</div>
			<div className="flex-1">
				<p className="b3 text-text-neutral">{formatDueTime()}</p>
				<h3
					className="s1 t3 truncate text-text-strong"
					style={{ maxWidth: "240px" }}
				>
					{task.title}
				</h3>
			</div>
		</div>
	);
};

export default memo(Header);
