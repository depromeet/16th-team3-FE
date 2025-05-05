import Image from "next/image";
import { memo } from "react";

import Lock from "@public/icons/mypage/lock.svg";

const LockedPersona = ({ index }: { index: number }) => {
	return (
		<div key={`lock-${index}`} className="flex flex-col items-center gap-3">
			<div className="flex items-center justify-center w-[72px] h-[72px] rounded-[24px] bg-component-gray-secondary">
				<Image src={Lock} alt="lock" width={24} height={24} priority />
			</div>
			<span className="text-gray-neutral c2">???</span>
		</div>
	);
};

export default memo(LockedPersona);
