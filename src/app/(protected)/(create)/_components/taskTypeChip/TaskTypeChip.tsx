import type { MoodType, TaskType } from "@/types/create";
import { ICON_MAP } from "@public/icons/index";
import Image from "next/image";
import { TYPE_LABELS } from "../../context";

interface TaskTypeChipProps<T extends TaskType | MoodType> {
	type: T;
	isSelected: boolean;
	onClick: (type: T) => void;
}

const TaskTypeChip = <T extends TaskType | MoodType>({
	type,
	isSelected,
	onClick,
}: TaskTypeChipProps<T>) => {
	const label = TYPE_LABELS[type];
	const src = ICON_MAP[type];

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className={`flex h-12 items-center gap-2 rounded-[10px] p-[14px] transition-colors duration-300 ${isSelected ? "bg-point-gradient" : "bg-component-gray-secondary"}`}
			onClick={() => onClick(type)}
		>
			<Image src={src} alt={type} width={24} height={24} priority />
			<span className={`l2 ${isSelected ? "text-inverse" : "text-normal"}`}>
				{label}
			</span>
		</div>
	);
};

export default TaskTypeChip;
