import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import MyPage from "@public/icons/home/mypage.svg";
import Logo from "@public/icons/home/spurt.svg";

const HeaderBar = () => {
	return (
		<div className="flex items-center justify-between px-[20px] py-[15px] h-[60px]">
			<Image
				src={Logo}
				alt="SPURT"
				width={54}
				height={20}
				className="w-[54px]"
				priority
			/>
			<Link href="/my-page" className="flex items-center">
				<button type="button">
					<Image
						src={MyPage}
						alt="마이페이지"
						width={20}
						height={20}
						priority
					/>
				</button>
			</Link>
		</div>
	);
};

export default memo(HeaderBar);
