'use client";';

import { getPersonaImage } from "@/utils/getPersonaImage";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const slogans = [
	"지금 바로 시작하세요: \n스퍼트가 미뤄둔 당신의 첫걸음을 응원합니다",
	"집중의 순간을 만들어드립니다 \n스퍼트와 함께 몰입을 경험해보세요",
	"마감 직전? 걱정 마세요 \n스퍼트가 벼락치기를 도와드립니다",
	"해야 할 일을 시작할 때까지 \n친절하게 알려주는 시간 관리 비서, 스퍼트",
	"몰입했던 순간을 기록하고 \n 나만의 성장 궤적을 확인해보세요",
	"작은 한 걸음이 큰 성과로 \n 스퍼트와 함께 행동을 현실로 만드세요",
	"시작이 반입니다 \n스퍼트와 함께 당신의 스퍼트를 만들어보세요",
];

const SpurtyLoader = () => {
	const [mounted, setMounted] = useState(false);
	const [personaId] = useState(() => Math.floor(Math.random() * 24) + 1);
	const personaImageSrc = getPersonaImage(personaId);

	// ! 임시 보류
	const randomText = useMemo(
		() => slogans[Math.floor(Math.random() * slogans.length)],
		[],
	);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div
			className={`
			flex flex-col justify-center items-center h-screen
			transition-opacity transition-transform duration-500 ease-out
			${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
		  `}
		>
			<div className="floating-persona">
				<Image
					src={personaImageSrc}
					alt="페르소나 이미지"
					width={165}
					height={165}
					priority
				/>
			</div>
			<div
				className="s3 flex items-center justify-center whitespace-nowrap rounded-[999px] px-[14px] py-[10px] text-[#BDBDF5]"
				style={{
					background: "var(--Elevated-PointPriamry, rgba(107, 107, 225, 0.20))",
					backdropFilter: "blur(30px)",
				}}
			>
				<span>잠시만 기다려주세요</span>
			</div>
		</div>
	);
};

export default SpurtyLoader;
