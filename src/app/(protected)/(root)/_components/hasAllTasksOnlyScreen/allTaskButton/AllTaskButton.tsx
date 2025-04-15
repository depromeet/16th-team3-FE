import Image from "next/image";
import { memo } from "react";

const AllTaskButton = ({
	setActiveTab,
}: { setActiveTab: (tab: "today" | "all") => void }) => {
	return (
		<div>
			<button
				type="button"
				className="flex w-full items-center justify-between px-4 py-4"
				onClick={() => setActiveTab("all")}
			>
				<span className="s2 text-text-neutral">전체 할일 더보기</span>
				<Image
					src="/icons/home/arrow-right.svg"
					alt="Arrow Right"
					width={24}
					height={24}
					priority
				/>
			</button>
		</div>
	);
};

export default memo(AllTaskButton);
