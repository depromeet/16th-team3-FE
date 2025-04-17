"use client";

import CustomBackHeader from "@/components/customBackHeader/CustomBackHeader";
import Loader from "@/components/loader/Loader";
import type { MyData } from "@/types/myPage";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import LockedPersona from "../_component/LockedPersona";
import Persona from "../_component/Persona";

const tooltipVariants = {
	hidden: { opacity: 0, y: -10 },
	visible: { opacity: 1, y: 0 },
};

const CharactersPageContent = () => {
	const searchParams = useSearchParams();
	const characterId = searchParams.get("id");
	const pathname = usePathname();

	const tooltipWrapperRef = useRef<HTMLDivElement>(null);

	const { data: myPageData } = useQuery<MyData>({
		queryKey: ["my-page"],
		queryFn: async () => await fetch("/api/my-page").then((res) => res.json()),
	});

	const [isOpenTooltip, setIsOpenTooltip] = useState<boolean>(false);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const trigger = (event.target as HTMLElement).closest(
				"[data-tooltip-trigger='true']",
			);
			if (trigger) return;

			if (
				tooltipWrapperRef.current &&
				!tooltipWrapperRef.current.contains(event.target as Node)
			) {
				setIsOpenTooltip(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="background-primary flex h-[calc(100vh-80px)] w-full flex-col items-center justify-start overflow-y-auto px-5">
			<CustomBackHeader title="역대 몰입 캐릭터" backRoute="/my-page" />

			<div className="relative flex mt-[65px] w-full pb-5 gap-1">
				<span className="t3 text-gray-strong">내 캐릭터</span>

				<Image
					src="/icons/info-circle.svg"
					width={20}
					height={20}
					alt="info-circle"
					data-tooltip-trigger="true"
					onClick={() => setIsOpenTooltip((prev) => !prev)}
				/>

				{isOpenTooltip && (
					<AnimatePresence>
						{isOpenTooltip && (
							<motion.div
								initial="hidden"
								animate="visible"
								exit="hidden"
								variants={tooltipVariants}
								transition={{ duration: 0.3 }}
								ref={tooltipWrapperRef}
								className="absolute w-full"
							>
								<Image
									src="/icons/mypage/polygon.svg"
									alt="polygon"
									width={13}
									height={12}
									className="absolute top-8 left-[81px]"
									priority
								/>
								<p className="absolute b2 text-white top-10 left-0 px-4 py-3 rounded-[12px] bg-component-gray-tertiary backdrop-blur-[7px]">
									할 일 추가 시, 마감 유형과 분위기에 맞춘 캐릭터가 만들어져요
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				)}
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
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						}).map((_, index) => <LockedPersona key={index} index={index} />)}
				</div>
			)}
		</div>
	);
};

const CharactersPage = () => (
	<Suspense fallback={<Loader />}>
		<CharactersPageContent />
	</Suspense>
);

export default CharactersPage;
