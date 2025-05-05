import ArrowRight from "@public/icons/home/arrow-right.svg";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

const ThisWeekTaskButton = () => {
	return (
		<Link href="/weekly-tasks">
			<button
				type="button"
				className="flex w-full items-center justify-between rounded-[20px] bg-component-gray-secondary px-4 py-4"
			>
				<span className="s2 text-text-neutral">이번주 할일</span>
				<Image src={ArrowRight} alt="Arrow Right" width={24} height={24} />
			</button>
		</Link>
	);
};

export default memo(ThisWeekTaskButton);
