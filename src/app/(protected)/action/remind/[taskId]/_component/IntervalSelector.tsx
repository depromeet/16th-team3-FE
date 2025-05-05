"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import CheckPrimary from "@public/icons/common/check-primary.svg";
import Repeat from "@public/icons/common/repeat.svg";

interface IntervalSelectorProps {
	selectedInterval: number;
	onIntervalChange: (interval: number) => void;
}

export default function IntervalSelector({
	selectedInterval,
	onIntervalChange,
}: IntervalSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const intervals = [
		{ label: "15분 마다", value: 15 },
		{ label: "30분 마다", value: 30 },
		{ label: "1시간 마다", value: 60 },
	];

	return (
		<div className="flex items-center gap-3.5">
			<div className="w-5">
				<Image src={Repeat} alt="반복" width={24} height={24} />
			</div>
			<div className="relative w-full" onClick={() => setIsOpen(!isOpen)}>
				<div className="flex items-center justify-between rounded-[10px] bg-component-gray-secondary px-4 py-[11px]">
					<div className="text-s1">{selectedInterval}분 마다</div>
					<ChevronDown
						className={`h-6 w-6 icon-primary transition-transform duration-200 ${
							isOpen ? "rotate-180" : ""
						}`}
					/>
				</div>
				<div
					className={`absolute right-0 top-full mt-3 w-[189px] transform flex-col rounded-2xl bg-component-gray-tertiary pb-2.5 pt-5 transition-all duration-200 ease-in-out ${
						isOpen
							? "translate-y-0 opacity-100"
							: "pointer-events-none -translate-y-2 opacity-0"
					}`}
				>
					<p className="px-5 text-c2 text-gray-alternative">타이틀</p>
					{intervals.map((item, index) => (
						<div
							key={index}
							className="flex cursor-pointer items-center justify-between px-5 py-3"
							onClick={() => {
								onIntervalChange(item.value);
								setIsOpen(false);
							}}
						>
							<p
								className={`text-l3 ${selectedInterval === item.value ? "text-component-accent-primary" : "text-gray-normal"}`}
							>
								{item.label}
							</p>
							{selectedInterval === item.value && (
								<Image src={CheckPrimary} alt="체크" width={20} height={20} />
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
