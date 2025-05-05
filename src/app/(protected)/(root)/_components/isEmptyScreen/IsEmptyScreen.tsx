import Image from "next/image";
import { memo } from "react";

import Rocket from "@public/icons/home/rocket.svg";

const IsEmptyScreen = () => {
	return (
		<div className="mt-[130px]">
			<div className="flex flex-col items-center px-4 text-center">
				<div className="mb-[40px]">
					<Image
						src={Rocket}
						alt="Rocket"
						width={142}
						height={80}
						className="mx-auto"
						priority
					/>
				</div>
				<h2 className="t3 mb-[8px] text-text-strong">
					마감 할 일을 추가하고
					<br />
					바로 시작해볼까요?
				</h2>
				<p className="b3 text-text-alternative">
					미루지 않도록 알림을 보내 챙겨드릴게요.
				</p>
			</div>
		</div>
	);
};

export default memo(IsEmptyScreen);
