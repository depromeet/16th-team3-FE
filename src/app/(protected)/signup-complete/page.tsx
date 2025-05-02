"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import Link from "next/link";

export default function SignupCompletePage() {
	const { userData } = useUserStore();

	const userNickname = userData?.nickname || "";

	const formatNickname = (name: string) => {
		if (!name) return "";
		if (name.length > 9) {
			return `${name.substring(0, 9)}...`;
		}
		return name;
	};

	return (
		<div className="relative h-full flex flex-col items-center justify-center bg-background-primary px-5 py-12">
			<div className="bg-blur-purple absolute bottom-[120px] left-0 right-0 z-0 h-[240px] w-[100vw] blur-[75px]" />
			<div className="flex flex-col items-center justify-center text-center mb-[100px]">
				<Image
					src="/icons/signup/clap.svg"
					alt="환영 손 아이콘"
					width={142}
					height={80}
					className="mb-[60px]"
				/>

				<h1 className="mb-3 t1 text-gray-strong">
					<span className="text-[#8484E6]">{formatNickname(userNickname)}</span>
					님 반가워요!
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
