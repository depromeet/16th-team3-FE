import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function SignupCompletePage() {
	return (
		<div className="relative h-full flex flex-col items-center justify-between bg-background-primary px-5 py-12">
			<div className="flex flex-col items-center justify-center text-center mb-20">
				<Image
					src="/icons/signup/wave.svg"
					alt="환영 손 아이콘"
					width={38}
					height={36}
					className="mb-6"
				/>

				<h1 className="mb-3 t1 text-gray-strong">
					<span className="text-[#8484E6]">미룬이</span>님 반가워요!
				</h1>

				<p className="b2 text-center text-gray-normal">
					이제, 스퍼트와 함께 당신의
					<br />
					시간을 완벽하게 공략해볼까요?
				</p>
			</div>
			<div className="absolute bottom-10 w-full left-0 right-0 px-5">
				<Link href="/onboarding">
					<Button
						variant="primary"
						className="w-full rounded-[16px] bg-component-accent-primary text-white"
					>
						핵심 기능 둘러보기
					</Button>
				</Link>
			</div>
		</div>
	);
}
