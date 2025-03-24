"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(0);
	const { userData } = useUserStore();

	const formatNickname = (name: string) => {
		if (!name) return "";
		if (name.length > 9) {
			return name.substring(0, 9) + "...";
		}
		return name;
	};

	const userNickname = userData?.nickname || "";

	const onboardingPages = [
		{
			title: "여유 시간을 확보하고,\n후회 없이 끝내세요!",
			description:
				"여유 시간을 자동 추가하여 \n여유롭게 완료할 수 있도록 알림을 보낼게요",
			image: "/icons/onboarding/onboarding1.png",
			buttonText: "다음으로",
		},
		{
			title: "1분 안에 작은 행동을 시작하면,\n미루기는 이제 그만!",
			description:
				"미룬 일을 시작하는 데 1분만 투자해요\n완료할 때까지 진동이 울려 시작을 도와줄게요",
			image: "/icons/onboarding/onboarding2.png",
			buttonText: "다음으로",
		},
		{
			title: "캐릭터와 플레이리스트로\n몰입을 더 깊게!",
			description:
				"작업 키워드를 기반으로 몰입 캐릭터를 만들어\n맞춤 환경과 음악을 제공해요",
			image: "/icons/onboarding/onboarding3.svg",
			buttonText: "다음으로",
		},
		{
			title: "미루지 않는 하루,\n지금부터 만들어볼까요?",
			description:
				"지금 당장 시작할 일과, 여유롭게 준비할 일을\n구분해 추가해보세요!",
			image: "/icons/onboarding/onboarding4.png",
			buttonText: "시작하기",
		},
	];

	const handleNext = () => {
		if (currentPage < onboardingPages.length - 1) {
			setCurrentPage(currentPage + 1);
		} else {
			router.push("/");
		}
	};

	// 프로그레스 바는 모든 페이지에 공통으로 표시
	const ProgressBar = () => (
		<div className="relative z-10 flex w-full gap-1">
			{onboardingPages.map((_, index) => (
				<div
					key={index}
					className={`h-1 flex-1 rounded-full ${
						index <= currentPage ? "bg-hologram" : "bg-line-secondary"
					} transition-all duration-300`}
				/>
			))}
		</div>
	);

	const HologramTriangle = () => (
		<div className="absolute -bottom-[10px] left-[40px] z-0">
			<svg width="14" height="11" viewBox="0 0 14 11" fill="none">
				<title>홀로그램 삼각형</title>
				<path
					d="M5.73179 9.67742C6.32777 10.7097 7.8177 10.7097 8.41368 9.67742L14.0009 -8.53738e-07L0.14453 3.57628e-07L5.73179 9.67742Z"
					fill="url(#hologram-gradient)"
				/>
				<defs>
					<linearGradient
						id="hologram-gradient"
						x1="0"
						y1="0"
						x2="14"
						y2="11"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stopColor="#CCE4FF" />
						<stop offset="0.139054" stopColor="#BBBBF1" />
						<stop offset="0.238718" stopColor="#B8E2FB" />
						<stop offset="0.374927" stopColor="#F2EFE8" />
						<stop offset="0.477914" stopColor="#CCE4FF" />
						<stop offset="0.624089" stopColor="#BBBBF1" />
						<stop offset="0.720431" stopColor="#C7EDEB" />
						<stop offset="0.830062" stopColor="#E7F5EB" />
						<stop offset="0.913116" stopColor="#F2F0E7" />
						<stop offset="1" stopColor="#CCE4FF" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	);

	// 첫 번째 페이지 (여유 시간 확보)
	const FirstPage = () => (
		<div className="relative h-full flex flex-col justify-between">
			{/* 블러 효과 배경 */}
			<div className="bg-blur-purple absolute left-0 right-0 bottom-[120px] z-0 h-[240px] w-[100vw] blur-[75px]" />

			<div
				className="absolute bottom-[170px] left-[40%] -translate-x-1/2 z-0"
				style={{
					width: "376px",
					height: "149px",
					opacity: 0.4,
					background:
						"conic-gradient(from 210deg at 50% 50%, #CCE4FF 0deg, #C1A4E8 50.06deg, #B8E2FB 85.94deg, #F2EFE8 134.97deg, #CCE4FF 172.05deg, #BDAFE3 224.67deg, #C7EDEB 259.36deg, #E7F5EB 298.82deg, #F2F0E7 328.72deg)",
					mixBlendMode: "color-dodge",
					filter: "blur(62px)",
				}}
			/>

			{/* 타이틀과 설명 */}
			<div className="mt-[48px] flex flex-col z-10">
				<h1 className="t2 whitespace-pre-line text-gray-strong">
					{onboardingPages[0].title}
				</h1>
				<p className="b2 mt-3 whitespace-pre-line text-gray-neutral">
					{onboardingPages[0].description}
				</p>
			</div>

			{/* 이미지 영역 */}
			<div className="flex flex-1 flex-col justify-end z-10">
				{/* 메인 콘텐츠 영역 */}
				<div className="mb-5 relative flex justify-center">
					{/* 화면 중앙에 캐릭터 이미지 */}
					<div className="relative">
						<Image
							src={onboardingPages[0].image}
							alt="온보딩 이미지 1"
							width={292}
							height={292}
							priority
							className="relative z-10"
						/>

						{/* 불꽃 효과 이미지와 툴팁을 같은 위치에 배치 */}
						<div className="absolute top-[-60px] left-0 w-full flex justify-center">
							{/* 불꽃 이미지 */}
							<Image
								src="/icons/onboarding/firework.svg"
								alt="불꽃"
								width={292}
								height={292}
								priority
								className="relative z-10"
							/>

							{/* 툴팁 */}
							<div className="l4 absolute top-[20%] z-20 rounded-[12px] bg-hologram backdrop-blur-[7px] px-4 py-2 text-gray-inverse shadow-lg">
								<p className="flex flex-row items-center whitespace-nowrap">
									<span>1.5배 더 여유있어졌어!</span>&nbsp;
									<Image
										src="/icons/onboarding/clock.svg"
										alt="시계"
										width={20}
										height={20}
										priority
									/>
								</p>
								<HologramTriangle />
							</div>
						</div>
					</div>
				</div>

				{/* 버튼 */}
				<Button
					variant="primary"
					className="w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
					onClick={handleNext}
				>
					{onboardingPages[0].buttonText}
				</Button>
			</div>
		</div>
	);

	// 두 번째 페이지 (1분 안에 작은 행동)
	const SecondPage = () => (
		<div className="relative h-full flex flex-col justify-between">
			<div className="bg-blur-purple absolute left-0 right-0 bottom-[120px] z-0 h-[240px] w-[100vw] blur-[75px]" />
			<div className="mt-[48px] flex flex-col z-10">
				<h1 className="t2 whitespace-pre-line text-gray-strong">
					{onboardingPages[1].title}
				</h1>
				<p className="b2 mt-3 whitespace-pre-line text-gray-neutral">
					{onboardingPages[1].description}
				</p>
			</div>

			<div className="flex flex-1 flex-col justify-end z-10">
				<div className="mb-[30px] flex justify-center relative">
					<div className="absolute top-[-130px] w-full z-20 items-center flex justify-center">
						<Image
							src="/icons/onboarding/ox.svg"
							alt="OX 아이콘"
							width={350}
							height={200}
							priority
						/>
					</div>

					<Image
						src={onboardingPages[1].image}
						alt="온보딩 이미지 2"
						width={245}
						height={245}
						priority
					/>
				</div>

				<Button
					variant="primary"
					className="w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
					onClick={handleNext}
				>
					{onboardingPages[1].buttonText}
				</Button>
			</div>
		</div>
	);

	// 세 번째 페이지 (캐릭터와 플레이리스트)
	const ThirdPage = () => (
		<div className="relative h-full flex flex-col justify-between">
			<div className="bg-blur-purple absolute left-0 right-0 bottom-[120px] z-0 h-[240px] w-[100vw] blur-[75px]" />
			<div className="mt-[48px] flex flex-col z-10">
				<h1 className="t2 whitespace-pre-line text-gray-strong">
					{onboardingPages[2].title}
				</h1>
				<p className="b2 mt-3 whitespace-pre-line text-gray-neutral">
					{onboardingPages[2].description}
				</p>
			</div>

			<div className="flex flex-1 flex-col justify-end z-10">
				<div className="mb-[80px] flex flex-col justify-center items-center relative">
					{/* 메인 이미지 */}
					<div className="relative">
						<Image
							src={onboardingPages[2].image}
							alt="온보딩 이미지 3"
							width={230}
							height={292}
							priority
							className="relative z-10"
						/>

						{/* 툴팁 추가 */}
						<div className="absolute top-[-60px] left-1/2 -translate-x-1/2 z-20">
							<div
								className="l4 rounded-[24px] text-[#BDBDF5] flex items-center justify-center shadow-lg whitespace-nowrap px-6 py-3"
								style={{
									background: "rgba(107, 107, 225, 0.20)",
									backdropFilter: "blur(33.91713333129883px)",
								}}
							>
								<Image
									src="/icons/onboarding/clap.svg"
									alt="박수"
									width={20}
									height={20}
									className="mr-1"
									priority
								/>
								<span>과탑 DNA 깨어나는 중! 오늘도 앞서가요!</span>
							</div>
						</div>
					</div>

					<div className="flex justify-center mt-5">
						<Button
							variant="hologram"
							size="sm"
							className="z-10 mb-6 h-[26px] w-auto rounded-[8px] px-[7px] py-[6px] text-text-inverse"
						>
							<span className="l6 text-text-inverse">
								에너지 만랩 과탑&nbsp;{formatNickname(userNickname)}
							</span>
						</Button>
					</div>
				</div>

				<Button
					variant="primary"
					className="w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
					onClick={handleNext}
				>
					{onboardingPages[2].buttonText}
				</Button>
			</div>
		</div>
	);

	// 네 번째 페이지 (시작하기)
	const FourthPage = () => (
		<div className="relative h-full flex flex-col z-10">
			<div className="bg-blur-purple absolute left-0 right-0 bottom-[120px] z-0 h-[240px] w-[100vw] blur-[75px]" />

			<div
				className="absolute bottom-0 left-1/2 -translate-x-1/2 z-5"
				style={{
					width: "376px",
					height: "149px",
					opacity: 0.4,
					background:
						"conic-gradient(from 210deg at 50% 50%, #CCE4FF 0deg, #C1A4E8 50.06deg, #B8E2FB 85.94deg, #F2EFE8 134.97deg, #CCE4FF 172.05deg, #BDAFE3 224.67deg, #C7EDEB 259.36deg, #E7F5EB 298.82deg, #F2F0E7 328.72deg)",
					mixBlendMode: "color-dodge",
					filter: "blur(62px)",
				}}
			/>

			<div className="flex flex-1 flex-col items-center justify-center z-10">
				<Image
					src="/icons/onboarding/onboarding4.svg"
					alt="온보딩 이미지 4"
					width={142}
					height={80}
					className="mb-[40px]"
					priority
				/>

				<h1 className="t1 mb-3 text-center text-gray-strong">
					미루지 않는 하루,
					<br />
					지금부터 만들어볼까요?
				</h1>
				<p className="b2 text-center text-gray-neutral">
					지금 당장 시작할 일과, 여유롭게 준비할 일을
					<br />
					구분해 추가해보세요!
				</p>
			</div>

			<Button
				variant="hologram"
				className="w-full rounded-[16px] py-4 text-gray-inverse"
				onClick={handleNext}
			>
				시작하기
			</Button>
		</div>
	);

	// 현재 페이지에 따라 다른 컴포넌트 렌더링
	const renderPage = () => {
		switch (currentPage) {
			case 0:
				return <FirstPage />;
			case 1:
				return <SecondPage />;
			case 2:
				return <ThirdPage />;
			case 3:
				return <FourthPage />;
			default:
				return <FirstPage />;
		}
	};

	return (
		<div className="flex h-full flex-col bg-background-primary px-5 pb-[46px] pt-2 overflow-hidden">
			{/* 프로그레스 바 */}
			<ProgressBar />

			{/* 현재 페이지 컨텐츠 */}
			{renderPage()}
		</div>
	);
}
