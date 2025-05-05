import type { SmallActionKrType } from "@/types/create";
import Image from "next/image";

import { SMALL_ACTION_ICON_MAP } from "@public/icons/smallActionType";

interface SmallActionChipProps {
	smallAction: string;
	onClick: (action: string) => void;
}

const SMALL_ACTION_LABELS: Record<string, SmallActionKrType> = {
	SitAtTheDesk: "책상 앞에 앉기",
	TurnOnTheLaptop: "노트북 켜기",
	DrinkWater: "물 마시기",
};

const SmallActionChip = ({ smallAction, onClick }: SmallActionChipProps) => {
	const src = SMALL_ACTION_ICON_MAP[smallAction];

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className="flex flex-shrink-0 items-center gap-2 rounded-[6px] bg-component-gray-secondary px-3 py-2"
			onClick={() => onClick(SMALL_ACTION_LABELS[smallAction])}
		>
			<Image src={src} alt={smallAction} width={24} height={24} priority />
			<span className="l4">{SMALL_ACTION_LABELS[smallAction]}</span>
		</div>
	);
};

export default SmallActionChip;
