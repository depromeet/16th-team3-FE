import { RETRO_ICON_MAP } from "@public/icons/retro";
import Image from "next/image";

const RetrospectResultContent = ({
	retrospectContent,
	setRetrospectContent,
}: RetrospectContentProps) => {
	const NOT_SELECTED = -1;
	const RESULT_CONTENT = [0, 1, 2, 3, 4] as const;

	const handleResultContentClick = (selected: number) => {
		const selectedResult = selected as ResultContent;
		setRetrospectContent((prev) => ({
			...prev,
			satisfaction:
				prev.satisfaction === selectedResult ? NOT_SELECTED : selectedResult,
		}));
	};

	return (
		<div className="flex gap-[18px]">
			{RESULT_CONTENT.map((num, index) => {
				const { off, on } = RETRO_ICON_MAP[num];
				const isOn = retrospectContent.satisfaction === num;
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
					<div key={index} onClick={() => handleResultContentClick(num)}>
						<Image
							src={isOn ? on : off}
							alt={`retro content ${num}`}
							width={40}
							height={40}
							priority
						/>
					</div>
				);
			})}
		</div>
	);
};

export default RetrospectResultContent;
