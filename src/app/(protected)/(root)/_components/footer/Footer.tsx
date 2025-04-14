import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

const Footer = ({ onClick }: { onClick: () => void }) => {
	const [showTooltip, setShowTooltip] = useState(true);

	useEffect(() => {
		const hasVisited = localStorage.getItem("hasVisitedBefore");

		if (hasVisited) {
			setShowTooltip(false);
		} else {
			localStorage.setItem("hasVisitedBefore", "true");
		}
	}, []);

	return (
		<footer className="fixed bottom-0 left-0 right-0 z-10">
			{/* 투명에서 검정색으로 페이드되는 그라디언트 오버레이 */}
			<div
				className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
				style={{
					background:
						"linear-gradient(to bottom, rgba(15, 17, 20, 0) 0%, rgba(15, 17, 20, 1) 100%)",
				}}
			/>

			{/* 버튼 컨테이너 */}
			<div className="relative flex justify-end p-5 pb-[47px]">
				{showTooltip && (
					<div className="b3 absolute bottom-[130px] right-4 rounded-[12px] bg-component-accent-primary px-4 py-3 text-text-strong shadow-lg">
						지금 바로 할 일을 추가해보세요!
						<div
							className="absolute h-0 w-0"
							style={{
								bottom: "-11px",
								right: "3rem",
								transform: "translateX(50%)",
								borderStyle: "solid",
								borderWidth: "12px 7px 0 7px",
								borderColor: "#6B6BE1 transparent transparent transparent",
							}}
						/>
					</div>
				)}
				<Button
					variant="point"
					size="md"
					className="l2 flex h-[52px] w-[130px] items-center gap-2 rounded-full py-[16.5px] text-text-inverse"
					onClick={onClick}
				>
					<Image
						src="/icons/home/plus.svg"
						alt="할일 추가"
						width={16}
						height={16}
						priority
					/>
					할일 추가
				</Button>
			</div>
		</footer>
	);
};

export default Footer;
