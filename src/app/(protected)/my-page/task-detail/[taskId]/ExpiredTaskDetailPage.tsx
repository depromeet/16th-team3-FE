"use client";

import RetrospectItem from "@/app/(protected)/retrospection/[taskId]/_components/RetrospectItem";
import { Badge } from "@/components/component/Badge";
import CustomBackHeader from "@/components/customBackHeader/CustomBackHeader";
import { useUserStore } from "@/store";
import type { TaskWithRetrospection } from "@/types/myPage";
import type { Task } from "@/types/task";
import {
	convertIsoToMonthDayTimeText,
	formatTimeFromMinutes,
} from "@/utils/dateFormat";
import { getPersonaImage } from "@/utils/getPersonaImage";
import Image from "next/image";

import Clap from "@public/icons/mypage/clap.svg";

interface TaskWithPersona extends Omit<Task, "persona" | "dueDatetime"> {
	persona: NonNullable<Task["persona"]>;
	dueDatetime: string;
	estimatedHours: number;
}

type Props = {
	task: TaskWithRetrospection;
	initialTask?: TaskWithPersona;
};

const retrospectItems: RetrospectItems = {
	result: {
		title: "몰입한 결과에 얼마나 만족하시나요?",
		required: true,
	},
	focus: {
		title: "몰입하는 동안 나의 집중력은?",
		required: true,
	},
	keepAndTry: {
		title: "이번 몰입의 좋았던 점과 개선할 점은?",
		required: false,
	},
};

const RESULT_CONTENT = [0, 1, 2, 3, 4] as const;
const FOCUS_STEPS = [0, 1, 2, 3, 4, 5] as const;
const BAR = {
	HEIGHT: 18,
	SLIDER_RADIUS: 9,
};

export default function ExpiredTaskDetailPage({ task, initialTask }: Props) {
	const effectiveTask = initialTask || {
		persona: task.personaId
			? { id: task.personaId, name: task.personaName || "기본 페르소나" }
			: undefined,
		dueDatetime: task.dueDateTime,
		estimatedHours: task.estimatedTime ? task.estimatedTime / 60 : 0,
	};
	const { userData } = useUserStore();
	const personaId = effectiveTask.persona?.id;
	const personaImageSrc = personaId
		? getPersonaImage(personaId)
		: "/icons/character/default.png";

	const satisfaction = task.satisfaction / 20 - 1;

	const taskStatus = task.status === "COMPLETE" ? "COMPLETE" : "FAIL";

	const PHRASE = {
		COMPLETE: {
			topBar: "완료한 일",
			main: "잘 완료하셨어요!",
		},
		FAIL: {
			topBar: "미룬 일",
			main: "완료를 안하셨네요. 다음엔 꼭 완료해요!",
		},
	};

	const keys = [
		{
			name: "작은 행동",
			onlyComplete: false,
			content: task.triggerAction,
		},
		{
			name: "예상 소요시간",
			onlyComplete: false,
			content: formatTimeFromMinutes(task.estimatedTime),
		},
		{
			name: "마감일",
			onlyComplete: false,
			content: convertIsoToMonthDayTimeText(task.dueDateTime),
		},
	];

	const filtered = keys.filter((item) => {
		if (!item.onlyComplete) {
			return item.onlyComplete === false;
		}
		// onlyComplete === true 인 경우, 조건 함수까지 만족해야 함
		return item.onlyComplete === true && taskStatus === "COMPLETE";
	});

	return (
		<div className="flex min-h-screen flex-col pb-[34px] bg-background-primary">
			{/* 헤더 부분 */}
			<CustomBackHeader
				title={PHRASE[taskStatus].topBar}
				backRoute="/my-page"
			/>

			{/* Contents 부분 */}
			<div className="mb-8 mt-[54px] flex flex-col gap-5 mx-5 justify-center">
				{/* Contents - 작업 개요 */}
				<div className="flex flex-col">
					{/* Contents - 작업 개요 - 문구*/}
					<div className="t3 flex mt-4 mb-5 justify-start">
						<p>
							{task.name} <br />{" "}
							{/* TODO: 이 task.name 이 새로고침 해야 나옴.. 뭔가 고쳐야 함*/}
							{PHRASE[taskStatus].main}
						</p>
					</div>

					{/* Contents - 작업 개요 - 작업 정보 */}
					<div className="flex flex-col gap-6">
						{/* Contents - 작업 개요 - 작업 정보 - 페르소나 */}
						<div className="flex flex-col gap-3 justify-center">
							<div className="relative flex w-full h-[120px] overflow-visible justify-center items-center">
								<div className="absolute top-1/2 -translate-y-1/2 items-center">
									<Image
										src={personaImageSrc}
										alt="페르소나 이미지"
										width={165}
										height={165}
									/>
								</div>
							</div>
							<div className="flex w-full justify-center">
								<Badge>
									{task.personaName || "기본 페르소나"}{" "}
									{userData?.nickname || ""}
								</Badge>
							</div>
						</div>

						{/* Contents - 작업 개요 - 작업 정보 - 페르소나 제외 작업 정보 */}
						<div className="flex flex-col gap-4 p-5 bg-component-gray-secondary rounded-[16px]">
							{filtered.map((item, index) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									className="flex justify-between items-center w-full"
								>
									<span className="b3 text-gray-alternative">{item.name}</span>
									<span className="b3 text-gray-normal">{item.content}</span>
								</div>
							))}
							{/* 완료일 정보는 따로 */}
							{taskStatus === "COMPLETE" && (
								<div className="flex justify-between items-center w-full">
									<span className="b3 text-gray-alternative">완료 일</span>
									<div className="inline-flex gap-1 items-center">
										<Image
											src={Clap}
											alt="mypage-character"
											width={23}
											height={23}
										/>
										<span className="b3Bold text-primary">
											{" "}
											{convertIsoToMonthDayTimeText(task.updatedAt)}
										</span>
										<Image
											src={Clap}
											alt="mypage-character"
											width={23}
											height={23}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Contents - 작업 회고 내용 */}
				<div className="flex flex-col">
					{/* Contents - 작업 회고 내용 - 제목 문구 */}
					<div>
						<div className="t3 flex my-3 justify-start">
							<p>나의 회고</p>
						</div>
					</div>

					{/* Contents - 작업 회고 내용 - 회고 내용 */}
					<div className="flex flex-col gap-5">
						{" "}
						{/* 실제 유저 회고 부분 */}
						{/* 몰입 결과 회고 */}
						<RetrospectItem
							title={retrospectItems.result.title}
							required={retrospectItems.result.required}
						>
							<div className="flex gap-[18px]">
								{RESULT_CONTENT.map((num, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<div key={index}>
										<Image
											src={`/icons/retro/retro1-${num}-${satisfaction === num ? 1 : 0}.svg`}
											alt="retro content index"
											width={40}
											height={40}
											priority
										/>
									</div>
								))}
							</div>
						</RetrospectItem>
						{/* 몰입하는 동안 나의 집중력 */}
						<RetrospectItem
							title={retrospectItems.focus.title}
							required={retrospectItems.focus.required}
						>
							<div className="w-full mx-2 mt-1">
								<div
									className="relative flex items-center"
									style={{
										height: `${BAR.HEIGHT}px`,
									}}
								>
									{/* 전체 바 배경 */}
									<div
										className="absolute rounded-full bg-line-tertiary"
										style={{
											height: `${BAR.HEIGHT}px`,
											width: `calc(100% + ${BAR.SLIDER_RADIUS * 2}px)`,
											left: `-${BAR.SLIDER_RADIUS}px`,
										}}
									/>

									{/* 선택된 채워진 부분 */}
									<div
										className="absolute rounded-full bg-gradient-to-r from-blue-200 to-purple-200 transition-all duration-200"
										style={{
											height: `${BAR.HEIGHT}px`,
											width: `calc(${task.concentration}% + ${BAR.SLIDER_RADIUS * 2}px)`,
											left: `-${BAR.SLIDER_RADIUS}px`,
										}}
									/>

									{/* 점들 */}
									<div className="relative z-10 flex justify-between w-full">
										{FOCUS_STEPS.map((step, i) => (
											<div
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												key={i}
												className={`w-[6px] h-[6px] rounded-full transition-all duration-200 ${
													task.concentration >= step
														? "bg-background-skyblue opacity-90"
														: "bg-background-skyblue opacity-30"
												}`}
											/>
										))}
									</div>

									{/* 슬라이더 핸들 */}
									<div
										className="absolute m-3 z-30 rounded-full border-2 border-white bg-white shadow"
										style={{
											width: `${BAR.SLIDER_RADIUS * 2}px`,
											height: `${BAR.SLIDER_RADIUS * 2}px`,
											left: `calc(${task.concentration}% - ${BAR.SLIDER_RADIUS * 2}px)`,
											transition: "left 0.2s ease",
										}}
									/>
								</div>

								{/* 아래 숫자 레이블 */}
								<div className="mt-1.5 flex justify-between c3 text-gray-alternative font-medium">
									{FOCUS_STEPS.map((step, i) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<div key={i} className="w-[6px] flex justify-center">
											<span
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												key={i}
												className={
													task.concentration === step
														? "text-gray-alternative"
														: ""
												}
											>
												{`${step * 20}`}
											</span>
										</div>
									))}
								</div>
							</div>
						</RetrospectItem>
						{/* 몰입 회고 텍스트 */}
						<RetrospectItem
							title={retrospectItems.keepAndTry.title}
							required={retrospectItems.keepAndTry.required}
						>
							<div className="flex flex-col w-full gap-3 px-4 py-3 bg-component-gray-tertiary rounded-[11.25px]">
								<textarea
									value={task.comment}
									placeholder="좋았던 점과 개선할 점을 간단히 작성해주세요."
									className="w-full h-20 bg-component-gray-tertiary b3 text-gray-normal placeholder-text-gray-normal 
                     resize-none focus:outline-none"
								/>
							</div>
						</RetrospectItem>
					</div>
				</div>
			</div>
		</div>
	);
}
