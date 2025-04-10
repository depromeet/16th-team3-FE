import Image from "next/image";

const RetrospectResultContent = ({
	retrospectContent,
	setRetrospectContent,
}: RetrospectContentProps) => {
	const NOT_SELECTED = -1;
	const RESULT_CONTENT = [0, 1, 2, 3, 4];

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
			{RESULT_CONTENT.map((num, index) => (
				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<div key={index} onClick={() => handleResultContentClick(num)}>
					<Image
						src={`/retro1-${num}-${retrospectContent.satisfaction === num ? 1 : 0}.svg`}
						alt="retro content index"
						width={40}
						height={40}
						priority
					/>
				</div>
			))}
		</div>
	);
};

export default RetrospectResultContent;
