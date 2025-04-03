"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CompleteContent() {
	const searchParams = useSearchParams();
	const taskId = searchParams.get("taskId");

	const reflectionUrl = taskId ? `/retrospection/${taskId}` : "/reflection";

	return (
		<div className="flex h-full flex-col gap-4 bg-background-primary">
			<div className="mt-[220px] flex flex-col items-center">
				<Image
					src="/icons/immersion/fireheart.svg"
					alt="logo"
					width={60}
					height={60}
					className="mb-4"
				/>
				<p className="text-t3 text-gray-strong">고생하셨어요!</p>
				<p className="text-t3 text-gray-strong mb-2">
					오늘도 끝내주게 몰입하셨군요!
				</p>
				<p className="text-b3 text-gray-alternative">
					미루지 않도록 알림을 보내 챙겨드릴게요.
				</p>
			</div>
			<div className="relative mt-auto flex flex-col items-center px-5 py-6">
				<Link href={reflectionUrl} className="w-full">
					<Button variant="primary" className="relative mb-4 w-full">
						회고하기
					</Button>
				</Link>
			</div>
		</div>
	);
}
