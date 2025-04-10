import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function RetrospectionCompletePage() {
	return (
		<div className="flex h-full flex-col gap-4 bg-background-primary">
			<div className="mt-[180px] flex flex-col items-center gap-2">
				<div className="h-[180px] flex items-center justify-center">
					<Image
						src="/retro-complete.svg"
						alt="logo"
						width={142}
						height={80}
						priority
					/>
				</div>

				<div className="flex flex-col gap-1 text-center">
					<p className="text-t3">회고 작성 완료!</p>
					<p className="text-t3">오늘의 몰입 멋지게 정리했어요</p>
				</div>
			</div>
			<div className="relative mt-auto flex flex-col items-center px-5 py-6">
				<Link href="/" className="w-full">
					<Button variant="primary" className="relative mb-4 w-full">
						홈으로 이동하기
					</Button>
				</Link>
			</div>
		</div>
	);
}
