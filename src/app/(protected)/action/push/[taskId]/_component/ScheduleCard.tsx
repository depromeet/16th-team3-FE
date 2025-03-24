type ScheduleCardProps = {
	task: string;
	deadline: string;
};

export default function ScheduleCard({ task, deadline }: ScheduleCardProps) {
	return (
		<div className="w-full rounded-2xl bg-[#17191F]">
			<div className="flex w-full flex-col gap-3 rounded-2xl bg-[linear-gradient(180deg,rgba(121,121,235,0.3)_0%,rgba(121,121,235,0.1)_70%,rgba(121,121,235,0)_100%)] py-4 pl-4">
				<div className="bg-component-accent-secondary flex h-[26px] w-[37px] items-center justify-center overflow-hidden rounded-[8px] py-[5px]">
					<div className="text-l6 text-icon-accent z-10 font-semibold">
						일정
					</div>
				</div>
				<div>
					<div className="flex gap-2.5">
						<div className="text-b2 text-gray-alternative">할일</div>
						<div className="text-s2 text-gray-normal">{task}</div>
					</div>
					<div className="flex gap-2.5">
						<div className="text-b2 text-gray-alternative">마감일</div>
						<div className="text-b2 text-gray-neutral">{deadline}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
