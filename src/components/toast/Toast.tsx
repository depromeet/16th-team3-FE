import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ReactNode } from "react";

interface ToastProps {
	icon?: ReactNode;
	message: string;
	className?: string;
}

const Toast = ({ icon, message, className }: ToastProps) => {
	return (
		<div
			className={cn(
				"absolute bottom-[120px] left-1/2 transform -translate-x-1/2 flex items-center gap-2 rounded-xl bg-component-gray-tertiary px-4 py-4 text-white",
				"w-[calc(100vw-32px)]",
				className,
			)}
		>
			{icon || (
				<Image src="/icons/Error.svg" alt="error" width={20} height={20} />
			)}
			<span className="text-sm">{message}</span>
		</div>
	);
};

export default Toast;
