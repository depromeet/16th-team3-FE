import Image from "next/image";

interface PersonaProps {
	id: number;
	name: string;
}

const Persona = ({ id, name }: PersonaProps) => {
	return (
		<div key={id} className="flex flex-col items-center justify-between gap-3">
			<div className="flex items-center justify-center w-[72px] h-[72px] rounded-[24px] bg-component-gray-secondary">
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
