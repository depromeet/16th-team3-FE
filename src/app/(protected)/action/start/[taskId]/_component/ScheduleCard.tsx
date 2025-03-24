interface ScheduleCardProps {
	title?: string;
	dueDate?: string;
}

export default function ScheduleCard({ title, dueDate }: ScheduleCardProps) {
	return (
		<div className="w-full rounded-2xl bg-[#17191F]">
			<div className="flex w-full flex-col gap-3 rounded-2xl bg-[linear-gradient(180deg,_rgba(121,121,235,0.3)_0%,_rgba(121,121,235,0.1)_70%,_rgba(121,121,235,0)_100%)] py-4 pl-4">
				<div className="flex h-[26px] w-[37px] items-center justify-center overflow-hidden rounded-[8px] bg-component-accent-secondary py-[5px]">
					<div className="z-10 text-l6 font-semibold text-icon-accent">
						일정
					</div>
				</div>
				<div>
					<div className="flex gap-2.5">
						<div className="text-b2 text-gray-alternative">할일</div>
						<div className="text-s2 text-gray-normal">{title}</div>
					</div>
					<div className="flex gap-2.5">
						<div className="text-b2 text-gray-alternative">마감일</div>
						<div className="text-b2 text-gray-neutral">{dueDate}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
