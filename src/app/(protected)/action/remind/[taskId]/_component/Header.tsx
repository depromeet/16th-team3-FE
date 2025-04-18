interface RemindDescriptionProps {
	maxNotificationCount?: number;
}

export default function RemindDescription({
	maxNotificationCount = 3,
}: RemindDescriptionProps) {
	return (
		<div className="flex flex-col gap-3 mt-[30px] px-5">
			<p className="text-t2 text-gray-strong">
				작업을 시작할 때 까지
				<br />
				계속 리마인드 해드릴게요
			</p>
			<p className="text-b2 text-gray-neutral">
				선택하신 주기로 최대{"\u00A0"}
				<span className="text-component-accent-primary">
					{maxNotificationCount}
				</span>
				번의 알림을 드려요
			</p>
		</div>
	);
}
