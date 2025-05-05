import { cn } from "@/lib/utils";
import XButton from "@public/icons/x-circle.svg";
import Image from "next/image";
import type { RefObject } from "react";
import { Input } from "../ui/input";

interface ClearableInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	ref?: RefObject<HTMLInputElement | null>;
	value: string;
	title: string;
	isFocused?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleInputFocus?: (value: boolean) => void;
}

const MAX_TASK_LENGTH = 16;

const ClearableInput = ({
	className,
	ref,
	value,
	title,
	isFocused,
	onChange,
	handleInputFocus,
	...props
}: ClearableInputProps) => {
	const isInvalid = value.length > MAX_TASK_LENGTH;

	return (
		<div className="relative w-full">
			<span
				className={cn(
					"b3 transition-colors",
					isFocused ? "text-primary" : "text-neutral",
					isInvalid && "text-line-error",
				)}
			>
				{title}
			</span>

			<Input
				className={cn(
					"t3 w-full border-0 border-b bg-transparent pl-0 pr-10 transition-colors focus:border-b-2",
					isInvalid
						? "text-line-error border-line-error"
						: "focus:border-b-component-accent-primary",
					className,
				)}
				value={value}
				ref={ref}
				onFocus={() => handleInputFocus?.(true)}
				onBlur={() => handleInputFocus?.(false)}
				onChange={onChange}
				{...props}
			/>

			{value && (
				<button
					type="button"
					className="absolute right-0 top-[24px] translate-y-1/4 text-black hover:text-gray-600"
					onClick={() =>
						onChange({
							target: { value: "" },
						} as React.ChangeEvent<HTMLInputElement>)
					}
				>
					<Image src={XButton} alt="제거" width={24} height={24} />
				</button>
			)}
		</div>
	);
};

export default ClearableInput;
