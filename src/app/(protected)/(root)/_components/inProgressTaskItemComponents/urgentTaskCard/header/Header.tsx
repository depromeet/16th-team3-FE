import { useFormatDueTime } from "@/hooks/useFormatDueTime";
import type { Task } from "@/types/task";
import Image from "next/image";
import React from "react";

interface HeaderProps {
	task: Task;
	personaImageUrl: string;
}

const Header = ({ task, personaImageUrl }: HeaderProps) => {
	const { formatDueTime } = useFormatDueTime(task);

	return (
		<>
			<div className="relative z-10">
				<h2 className="s1 mb-1 text-text-strong">{task.title}</h2>
				<p className="b3 text-text-neutral">{formatDueTime()}</p>
			</div>

			<div className="mt-[10px] mb-1 flex justify-center items-center relative">
				<div
					className="absolute top-1/2 left-1/2 w-1/2 h-1/2 transform -translate-x-1/2 -translate-y-1/2 mix-blend-color-dodge"
					style={{
						background:
							"conic-gradient(from 140deg at 50.42% 51.28%, rgba(182, 208, 247, 0.70) 0deg, rgba(238, 244, 225, 0.70) 82.50000178813934deg, rgba(226, 193, 249, 0.70) 155.6249964237213deg, rgba(191, 209, 249, 0.70) 209.30935621261597deg, rgba(250, 252, 254, 0.70) 252.6490044593811deg, rgba(186, 228, 226, 0.70) 288.7499928474426deg, rgba(140, 107, 227, 0.70) 341.2500071525574deg, rgba(192, 215, 243, 0.70) 360deg)",
						filter: "blur(37px)",
					}}
				/>
				<Image
					src={personaImageUrl}
					alt="Character"
					width={136}
					height={136}
					loading="eager"
					className="relative z-10"
				/>
			</div>
		</>
	);
};

export default Header;
