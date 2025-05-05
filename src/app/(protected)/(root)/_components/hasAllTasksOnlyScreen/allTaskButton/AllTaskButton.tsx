import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import ArrowRight from "@public/icons/home/arrow-right.svg";

const AllTaskButton = () => {
	return (
		<Link href="/?tab=all">
			<div>
				<button
					type="button"
					className="flex w-full items-center justify-between px-4 py-4"
				>
					<span className="s2 text-text-neutral">전체 할일 더보기</span>
					<Image
						src={ArrowRight}
						alt="Arrow Right"
						width={24}
						height={24}
						priority
					/>
				</button>
			</div>
		</Link>
	);
};

export default memo(AllTaskButton);
