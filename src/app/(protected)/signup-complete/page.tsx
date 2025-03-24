"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignupCompletePage() {
	const router = useRouter();

	const handleContinue = () => {
		router.push("/onboarding");
	};

	return (
		<div className="flex h-screen flex-col items-center justify-between bg-background-primary px-5 py-12">
			<div></div>

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

			<Button
				variant="primary"
				className="w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
				onClick={handleContinue}
			>
				핵심 기능 둘러보기
			</Button>
		</div>
	);
}
