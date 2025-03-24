import { Badge } from "@/components/component/Badge";

interface ActionCardProps {
	title?: string;
	isCompleted?: boolean;
	onClick?: () => void;
	variant?: "gradient1" | "gradient2";
}

export default function ActionCard({
	title,
	isCompleted = false,
	onClick,
	variant = "gradient1",
}: ActionCardProps) {
	return (
		<div
			className={`cursor-pointer rounded-2xl bg-[#17191F] ${
				variant === "gradient1"
					? "bg-gradient-component-01"
					: "bg-gradient-component-02"
			}`}
			onClick={onClick}
		>
			<div className="relative flex flex-col gap-3 rounded-2xl bg-[linear-gradient(180deg,_rgba(121,121,235,0.3)_0%,_rgba(121,121,235,0.1)_70%,_rgba(121,121,235,0)_100%)] py-4 pl-4">
				<Badge>작은 행동</Badge>
				<p
					className={`text-lg font-semibold ${isCompleted ? "text-gray-light" : "text-gray-normal"}`}
				>
					{title}
				</p>
			</div>
		</div>
	);
}
