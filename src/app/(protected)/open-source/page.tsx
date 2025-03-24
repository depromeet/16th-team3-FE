"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TermsPage() {
	const router = useRouter();

	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className="flex flex-col min-h-screen">
			<div className="px-5 py-[14px] relative flex items-center">
				<button onClick={handleGoBack} className="absolute left-5">
					<Image
						src="/icons/ArrowLeft.svg"
						alt="뒤로가기"
						width={24}
						height={24}
					/>
				</button>
				<div className="s2 w-full text-center text-gray-normal">
					오픈소스 라이센스
				</div>
			</div>
		</div>
	);
}
