"use client";

import type { MyData } from "@/types/myPage";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import Persona from "../_component/Persona";

const CharactersPage = () => {
	const { data: myPageData } = useQuery<MyData>({
		queryKey: ["my-page"],
		queryFn: async () => await fetch("/api/my-page").then((res) => res.json()),
	});

	return (
		<div className="background-primary flex h-[calc(100vh-80px)] w-full flex-col items-center justify-start overflow-y-auto px-5">
			<div className="z-20 fixed top-0 w-[100vw] flex items-center justify-between px-5 py-[14px] bg-background-primary pt-[44px]">
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

			<div className="flex mt-[65px] w-full px-5 pb-5 gap-[2px]">
				<span className="t3 text-gray-strong">내 캐릭터</span>
				<Image
					src="/icons/info-circle.svg"
					width={20}
					height={20}
					alt="info-circle"
				/>
			</div>

			{myPageData && (
				<div className="grid grid-cols-3 justify-items-center gap-[32px]">
					{myPageData.personas.map((persona) => (
						<Persona key={persona.id} id={persona.id} name={persona.name} />
					))}

					{(myPageData.personas.length ?? 0) < 4 &&
						Array.from({
							length: 24 - (myPageData.personas?.length ?? 0),
						}).map((_, idx) => (
							<div
								key={`lock-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									idx
								}`}
								className="flex flex-col items-center justify-between gap-3"
							>
								<div className="flex items-center justify-center w-[72px] h-[72px] rounded-[24px] bg-component-gray-secondary">
									<Image
										src="/icons/mypage/lock.svg"
										alt="lock"
										width={24}
										height={24}
									/>
								</div>
								<span className="text-gray-neutral c2">???</span>
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default CharactersPage;
