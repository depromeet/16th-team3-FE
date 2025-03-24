interface ReminderCountSelectorProps {
	count: number;
	onIncrease: () => void;
	onDecrease: () => void;
	min?: number;
	max?: number;
}

export default function ReminderCountSelector({
	count,
	onIncrease,
	onDecrease,
	min = 1,
	max = 3,
}: ReminderCountSelectorProps) {
	return (
		<div className="flex items-center justify-between px-5 py-[20.5px]">
			<p>다음 리마인더</p>
			<div className="flex h-8 w-[96px] items-center">
				<div
					className={`flex h-full w-1/3 cursor-pointer items-center justify-center rounded-[8px] bg-gray-400 text-center text-base leading-[145%] text-gray-normal ${count === min ? "!bg-component-gray-secondary" : ""}`}
					onClick={onDecrease}
				>
					-
				</div>
				<div className="flex h-full w-1/3 items-center justify-center rounded-[8px] text-center text-s2 text-gray-normal">
					{count}
				</div>
				<div
					className={`flex h-full w-1/3 cursor-pointer items-center justify-center rounded-[8px] bg-gray-400 text-center text-base leading-[145%] text-gray-normal ${count === max ? "!bg-component-gray-secondary" : ""}`}
					onClick={onIncrease}
				>
					+
				</div>
			</div>
		</div>
	);
}
