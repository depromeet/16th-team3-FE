import Image from "next/image";
import { memo } from "react";

import XMan from "@public/icons/home/xman.svg";

interface NoTaskScreenProps {
	firstText: string;
	secondText: string;
	thirdText: string;
}

const NoTaskScreen = ({
	firstText,
	secondText,
	thirdText,
}: NoTaskScreenProps) => {
	return (
		<div className="mb-[40px]">
			<div className="flex flex-col items-center justify-center">
				<Image
					src={XMan}
					alt="Character"
					width={80}
					height={80}
					className="mb-[48px] mt-[60px]"
					priority
				/>
				<h2 className="t3 text-center text-text-strong">{firstText}</h2>
				<h2 className="t3 mb-2 text-center text-text-strong">{secondText}</h2>
				<p className="b3 text-center text-text-alternative">{thirdText}</p>
			</div>
		</div>
	);
};

export default memo(NoTaskScreen);
