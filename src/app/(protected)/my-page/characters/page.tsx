"use client";

import Loader from "@/components/loader/Loader";
import {
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MyData } from "@/types/myPage";
import { Tooltip } from "@radix-ui/react-tooltip";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Persona from "../_component/Persona";

const CharactersPageContent = () => {
	const searchParams = useSearchParams();
	const characterId = searchParams.get("id");
	const pathname = usePathname();

	const { data: myPageData } = useQuery<MyData>({
		queryKey: ["my-page"],
		queryFn: async () => await fetch("/api/my-page").then((res) => res.json()),
	});

	return (
		<TooltipProvider>
			<div className="background-primary flex h-[calc(100vh-80px)] w-full flex-col items-center justify-start overflow-y-auto px-5">
				<div className="z-20 fixed top-0 w-[100vw] flex items-center justify-between px-5 py-[14px] bg-background-primary pt-[60px]">
					<Link href="/my-page" shallow={true}>
						<Image
							src="/icons/ArrowLeft.svg"
							alt="뒤로가기"
							width={24}
							height={24}
						/>
					</Link>
					<div className="s2 mr-[18px] w-full text-center text-gray-normal">
						역대 몰입 캐릭터
					</div>
				</div>

				<div className="flex mt-[65px] w-full pb-5 gap-1">
					<span className="t3 text-gray-strong">내 캐릭터</span>
					<Tooltip>
						<TooltipTrigger>
							<Image
								src="/icons/info-circle.svg"
								width={20}
								height={20}
								alt="info-circle"
							/>
						</TooltipTrigger>
						{/* <TooltipContent className="bg-component-gray-tertiary text-gray-strong">
							<p>
								할 일 추가 시, 마감 유형과 분위기에 맞춘 캐릭터가 만들어져요
							</p>
						</TooltipContent> */}
					</Tooltip>
				</div>

				{myPageData && (
					<div className="grid grid-cols-3 justify-items-center gap-[32px]">
						{myPageData.personas.map((persona) => (
							<Persona
								key={persona.id}
								id={persona.id}
								name={persona.name}
								isCharacterPage={pathname.includes("characters")}
								selectedPersona={Boolean(persona.id === Number(characterId))}
							/>
						))}

						{(myPageData.personas.length ?? 0) < 24 &&
							Array.from({
								length: 24 - (myPageData.personas?.length ?? 0),
							}).map((_, idx) => (
								<div
									key={`lock-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										idx
									}`}
									className="flex flex-col items-center gap-3"
								>
									<div className="flex items-center justify-center w-[72px] h-[72px] rounded-[24px] bg-component-gray-secondary">
										<Image
											src="/icons/mypage/lock.svg"
											alt="lock"
											width={24}
											height={24}
											priority
										/>
									</div>
									<span className="text-gray-neutral c2">???</span>
								</div>
							))}
					</div>
				)}
			</div>
		</TooltipProvider>
	);
};

const CharactersPage = () => (
	<Suspense fallback={<Loader />}>
		<CharactersPageContent />
	</Suspense>
);

export default CharactersPage;
