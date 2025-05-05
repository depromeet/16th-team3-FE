"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Check from "@public/icons/week/check.svg";

export type FilterOption = {
	id: string;
	label: string;
	icon?: string;
};

interface TaskFilterDropdownProps {
	options: FilterOption[];
	defaultOptionId?: string;
	onChange?: (selectedOption: FilterOption) => void;
	className?: string;
}

const TaskFilterDropdown: React.FC<TaskFilterDropdownProps> = ({
	options,
	defaultOptionId,
	onChange,
	className = "",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<FilterOption | null>(
		defaultOptionId
			? options.find((option) => option.id === defaultOptionId) || options[0]
			: options[0],
	);

	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleOptionClick = (option: FilterOption) => {
		setSelectedOption(option);
		setIsOpen(false);
		onChange?.(option);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			toggleDropdown();
			e.preventDefault();
		} else if (e.key === "Escape" && isOpen) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div ref={dropdownRef} className={`relative ${className}`}>
			<button
				type="button"
				className="c1 rounded-[8px] bg-component-gray-primary px-2 py-2 text-text-normal flex items-center"
				onClick={toggleDropdown}
				onKeyDown={handleKeyDown}
				aria-haspopup="true"
				aria-expanded={isOpen}
			>
				{selectedOption?.label}
				{isOpen ? (
					<ChevronUp
						className="ml-2 w-5 h-5 text-gray-normal"
						aria-hidden="true"
					/>
				) : (
					<ChevronDown
						className="ml-2 w-5 h-5 text-gray-normal"
						aria-hidden="true"
					/>
				)}
			</button>

			{isOpen && (
				<div
					className="absolute right-[0px] top-[52px] bg-component-gray-tertiary rounded-[16px] drop-shadow-lg z-10 w-[190px]"
					role="menu"
				>
					<div className="c2 p-5 pb-0 text-text-alternative">정렬 순</div>
					{options.map((option) => (
						<div
							key={option.id}
							className={`l3 px-5 py-[12.5px] flex justify-between items-center ${
								selectedOption?.id === option.id
									? "text-primary"
									: "text-text-normal"
							} cursor-pointer`}
							onClick={() => handleOptionClick(option)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleOptionClick(option);
									e.preventDefault();
								}
							}}
							role="menuitem"
							tabIndex={0}
						>
							{option.label}
							{selectedOption?.id === option.id && (
								<Image
									src={Check}
									alt="선택됨"
									width={20}
									height={20}
									className="ml-2"
								/>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default TaskFilterDropdown;
