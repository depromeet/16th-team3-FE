import ArrowRight from "@public/icons/home/arrow-right.svg";
import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";

const ThisWeekLeftTaskButton = () => {
	return (
		<Link href="/weekly-tasks">
			<button
				type="button"
				className="flex w-full items-center justify-between px-4 py-4"
			>
				<span className="s2 text-text-neutral">이번주 할일 더보기</span>
				<Image
					src={ArrowRight}
					alt="Arrow Right"
					width={24}
					height={24}
					priority
				/>
			</button>
		</Link>
	);
};

export default memo(ThisWeekLeftTaskButton);
