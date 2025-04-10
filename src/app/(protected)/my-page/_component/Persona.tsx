import Image from "next/image";

interface PersonaProps {
	id: number;
	name: string;
	selectedPersona?: boolean;
	onClick?: (id: number) => void;
}

const Persona = ({ id, name, selectedPersona, onClick }: PersonaProps) => {
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			key={id}
			className="flex flex-col items-center justify-between gap-3"
			onClick={() => onClick?.(id)}
		>
			<div
				className={`flex items-center justify-center w-[72px] h-[72px] rounded-[24px] bg-component-gray-secondary ${selectedPersona ? "border-2 border-point-gradient" : ""}`}
			>
				<Image
					src={`/icons/character/${id}.png`}
					alt={`persona-character-${id}`}
					width={72}
					height={72}
				/>
			</div>
			<span className="text-gray-neutral c2">{name}</span>
		</div>
	);
};

export default Persona;
