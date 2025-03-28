"use client";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import { useState } from "react";

interface DatePickerProps {
	deadlineDate: Date | undefined;
	handleDateChange: (date: Date) => void;
}

const DatePicker = ({ deadlineDate, handleDateChange }: DatePickerProps) => {
	const [displayMonth, setDisplayMonth] = useState(new Date());

	const isPrevDisabled =
		displayMonth.getFullYear() === new Date().getFullYear() &&
		displayMonth.getMonth() === new Date().getMonth();

	return (
		<Calendar
			mode="single"
			selected={deadlineDate ?? new Date()}
			onSelect={(date) => date && handleDateChange(date)}
			onMonthChange={(month) => setDisplayMonth(month)}
			initialFocus
			locale={ko}
			disabled={{ before: new Date() }}
			captionLayout="dropdown"
			classNames={{
				caption: "flex justify-between items-center mb-5",
				caption_label: "text-lg font-semibold",
				nav_button_previous: cn(
					isPrevDisabled && "opacity-30 pointer-events-none",
				),
				nav_button_next: "",
				nav_button: cn(
					"h-7 w-7 bg-transparent p-0 hover:opacity-100 text-[#6B6BE1]",
				),
			}}
			components={{
				IconLeft: () => (
					<Image
						src="/icons/CalendarLeft.svg"
						alt="left"
						width={11.275}
						height={18.155}
					/>
				),
				IconRight: () => (
					<Image
						src="/icons/CalendarRight.svg"
						alt="right"
						width={11.275}
						height={18.155}
					/>
				),
			}}
			formatters={{
				formatCaption: (date) => format(date, "yyyy MMM", { locale: ko }), // ✅ "2025 2월" 형식
			}}
		/>
	);
};

export default DatePicker;
