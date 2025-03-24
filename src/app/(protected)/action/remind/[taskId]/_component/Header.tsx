interface RemindDescriptionProps {
	maxNotificationCount?: number;
}

export default function RemindDescription({
	maxNotificationCount = 3,
}: RemindDescriptionProps) {
	return (
		<div className="mt-10 px-5">
			<p className="text-[24px] font-semibold leading-[140%] text-white">
				작업을 시작할 때 까지
				<br />
				계속 리마인드 해드릴게요
			</p>
			<p className="text-b2 text-gray-neutral">
				선택하신 주기로 최대
				<span className="font-semibold text-component-accent-primary">
					{maxNotificationCount}번
				</span>
				의 알림을 드려요
			</p>
		</div>
	);
}
