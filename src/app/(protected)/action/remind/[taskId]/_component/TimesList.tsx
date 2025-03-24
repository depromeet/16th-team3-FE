interface ReminderTimesListProps {
	times: { index: number; time: string }[];
}

export default function ReminderTimesList({ times }: ReminderTimesListProps) {
	return (
		<div className="flex flex-col gap-3 px-[19.5px]">
			{times.map((item) => (
				<div key={item.index} className="text-t2 text-gray-neutral px-5 py-4">
					<span className="text-component-accent-primary mr-2.5">
						{item.index}
					</span>
					{item.time}
				</div>
			))}
		</div>
	);
}
