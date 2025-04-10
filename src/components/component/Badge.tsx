type BadgeProps = {
	styleSet?: "default" | "required" | "notRequired";
	children: React.ReactNode;
};

export function Badge({ styleSet = "default", children }: BadgeProps) {
	const styles = {
		default:
			"relative whitespace-nowrap z-20 flex h-[26px] items-center justify-center rounded-[8px] bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] px-[7px] text-l6 font-semibold text-black",
		required:
			"relative whitespace-nowrap z-20 flex w-[48px] h-[22px] items-center justify-center rounded-[6px] bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] text-l6 font-semibold text-black",
		notRequired:
			"relative whitespace-nowrap z-20 flex w-[48px] h-[22px] items-center justify-center rounded-[6px] bg-component-gray-tertiary text-l6 font-semibold text-neutral",
	};

	return (
		<div className="inline-flex">
			<span className={styles[styleSet]}>{children}</span>
		</div>
	);
}
