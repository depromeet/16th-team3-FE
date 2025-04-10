import type { Persona as PersonaType } from "@/types/myPage";
import Image from "next/image";
import Link from "next/link";
import Persona from "./Persona";

interface PersonaSectionProps {
	personas: PersonaType[];
	handlePersonaClick?: (id: number) => void;
}

const PersonaSection = ({
	personas,
	handlePersonaClick,
}: PersonaSectionProps) => {
	return (
		<div className="px-5 mt-2">
			<div className="flex items-center justify-between py-4">
				<div className="text-s2 text-gray-normal">역대 몰입 캐릭터</div>
				<Link href="/my-page/characters">
					<span className="c1 text-gray-neutral">전체 보기</span>
				</Link>
			</div>
			<div
				className="flex justify-between gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden"
				style={{
					scrollbarWidth: "none",
					msOverflowStyle: "none",
				}}
			>
				{personas.map((persona) => (
					<Persona
						key={persona.id}
						id={persona.id}
						name={persona.name}
						onClick={() => handlePersonaClick?.(persona.id)}
					/>
				))}

				{(personas?.length ?? 0) < 24 &&
					Array.from({
						length: 24 - (personas?.length ?? 0),
					}).map((_, idx) => (
						<div
							key={`lock-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								idx
							}`}
							className="flex flex-col items-center gap-3"
						>
							<div className="flex items-center justify-center w-[72px] h-[72px] rounded-[24px] bg-component-gray-secondary">
								<Image
									src="/icons/mypage/lock.svg"
									alt="lock"
									width={24}
									height={24}
								/>
							</div>
							<span className="text-gray-neutral c2">???</span>
						</div>
					))}
			</div>
		</div>
	);
};

export default PersonaSection;
