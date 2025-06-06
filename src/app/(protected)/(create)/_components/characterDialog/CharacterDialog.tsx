"use client";

import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from "@/store";
import { getPersonaImage } from "@/utils/getPersonaImage";
import Image from "next/image";

interface CharacterDialogProps {
	isOpen: boolean;
	task: string;
	taskType: string;
	personaName: string;
	personaId?: number;
	isLoading: boolean;
	onClick: () => void;
}

const CharacterDialog = ({
	isOpen,
	task,
	taskType,
	personaName,
	personaId,
	isLoading,
	onClick,
}: CharacterDialogProps) => {
	const { userData } = useUserStore();
	const personaImageSrc = getPersonaImage(personaId);

	return (
		<Dialog open={isOpen} onOpenChange={onClick} modal>
			<DialogContent className="w-[328px] rounded-[24px] border-none bg-component-gray-secondary px-4 py-6">
				<DialogHeader>
					<DialogTitle className="text-normal t3 mb-1">
						{taskType === "instant"
							? "지금 바로 시작할까요?"
							: "할일 등록 완료!"}
					</DialogTitle>
					<DialogDescription className="max-w-[190px] flex-wrap self-center">
						{`‘${personaName}’ ${userData.nickname}님!`}
					</DialogDescription>
					<DialogDescription className="max-w-[190px] flex-wrap self-center font-semibold">
						{task}
					</DialogDescription>
					<DialogDescription className="max-w-[190px] flex-wrap self-center">
						완료까지 도와드릴게요
					</DialogDescription>
				</DialogHeader>
				<div className="mb-1 flex flex-col items-center gap-5">
					<div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-component-gray-tertiary">
						<Image
							src={personaImageSrc}
							alt={`${personaName}-character`}
							width={80}
							height={80}
							priority
						/>
					</div>
					<div className="relative flex h-[26px] items-center justify-center overflow-hidden rounded-[8px] px-[7px] py-[6px] text-black before:absolute before:inset-0 before:-z-10 before:bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] before:[transform:scale(4,1)]">
						<span className="l6 text-inverse">{`${personaName} ${userData.nickname}`}</span>
					</div>
				</div>
				<Button
					variant="primary"
					className="w-full"
					disabled={isLoading}
					onClick={onClick}
				>
					{isLoading && <Loader width={24} height={24} />}
					{taskType === "instant" ? "시작" : "확인"}
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default CharacterDialog;
