import { Badge } from "@/components/component/Badge";
import { getPersonaImage } from "@/utils/getPersonaImage";
import Image from "next/image";
import { memo } from "react";

interface PersonaProps {
	id: number;
	name: string;
	selectedPersona?: boolean;
	isCharacterPage?: boolean;
	onClick?: (id: number) => void;
}

const Persona = ({
	id,
	name,
	selectedPersona,
	isCharacterPage,
	onClick,
}: PersonaProps) => {
	const imgUrl = getPersonaImage(id);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			key={id}
			className="flex flex-col items-center gap-3"
			onClick={() => onClick?.(id)}
		>
			<div
				className={`flex items-center justify-center w-[72px] h-[72px] rounded-[24px] bg-component-gray-secondary ${selectedPersona ? "border-2 border-point-gradient" : ""}`}
			>
				<Image
					src={imgUrl}
					alt={`persona-character-${id}`}
					width={72}
					height={72}
					priority
				/>
			</div>
			{isCharacterPage ? (
				<Badge>{name}</Badge>
			) : (
				<span className="text-gray-neutral c2">{name}</span>
			)}
		</div>
	);
};

export default memo(Persona);
