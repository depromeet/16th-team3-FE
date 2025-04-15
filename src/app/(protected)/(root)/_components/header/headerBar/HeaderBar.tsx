import Image from "next/image";
import Link from "next/link";

const HeaderBar = () => {
	return (
		<div className="flex items-center justify-between px-[20px] py-[15px] h-[60px]">
			<Image
				src="/icons/home/spurt.svg"
				alt="SPURT"
				width={54}
				height={20}
				priority
				className="w-[54px]"
			/>
			<Link href="/my-page">
				<button type="button">
					<Image
						src="/icons/home/mypage.svg"
						alt="마이페이지"
						width={20}
						height={20}
					/>
				</button>
			</Link>
		</div>
	);
};

export default HeaderBar;
