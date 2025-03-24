import { Badge } from "@/components/component/Badge";

type ActionCardProps = {
	badgeText: string;
	actionText: string;
	variant?: "default" | "drawer";
};

export default function ActionCard({
	badgeText,
	actionText,
	variant = "default",
}: ActionCardProps) {
	const cardContent = (
		<div className="flex flex-col gap-3 rounded-2xl bg-[linear-gradient(180deg,rgba(121,121,235,0.3)_0%,rgba(121,121,235,0.1)_70%,rgba(121,121,235,0)_100%)] py-4 pl-4">
			<Badge>{badgeText}</Badge>
			<p className="text-gray-normal text-lg font-semibold">{actionText}</p>
		</div>
	);

	return variant === "default" ? (
		<div className="rounded-2xl bg-[#17191F]">{cardContent}</div>
	) : (
		cardContent
	);
}
