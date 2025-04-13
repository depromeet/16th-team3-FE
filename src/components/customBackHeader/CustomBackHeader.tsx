import Image from "next/image";
import Link from "next/link";
import { type ReactNode, memo } from "react";

interface CustomBackHeaderProps {
	title: string;
	backRoute: string;
	children?: ReactNode;
}

const CustomBackHeader = ({
	title,
	backRoute,
	children,
}: CustomBackHeaderProps) => {
	return (
		<div className="z-30 fixed top-0 w-[100vw] flex items-center justify-between px-5 py-[14px] bg-background-primary pt-[60px]">
			<Link href={backRoute} shallow={true}>
				<Image
					src="/icons/ArrowLeft.svg"
					alt="뒤로가기"
					width={24}
					height={24}
					priority
				/>
			</Link>
			<div
				className={`s2 ${children ? "" : "mr-[18px]"} w-full text-center text-gray-normal`}
			>
				{title}
			</div>
			{children}
		</div>
	);
};

export default memo(CustomBackHeader);
