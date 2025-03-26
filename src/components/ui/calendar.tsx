"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("mx-auto w-full p-0", className)}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4",
				caption: "flex justify-center pt-1 relative items-center",
				caption_label: "text-sm font-medium",
				nav: "space-x-4 flex items-center",
				nav_button: cn(
					"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				),
				nav_button_previous: "absolute left-1",
				nav_button_next: "absolute right-1",
				table: "w-full border-collapse space-y-1",
				head_row: "flex",
				head_cell: "text-muted-foreground rounded-md w-full text-[0.8rem]",
				row: "flex w-full mt-2",
				cell: "aspect-square w-full text-center text-sm p-0 relative",
				day: "aspect-square w-full p-0 aria-selected:opacity-100 text-[16px] font-normal",
				day_range_end: "day-range-end",
				day_selected: cn(
					buttonVariants({ variant: "point" }),
					"bg-primary text-inverse focus:bg-primary focus:text-primary-foreground",
					"aspect-square h-full p-0",
					"s2",
				),
				day_today: "bg-accent text-accent-foreground",
				day_outside:
					"day-outside text-muted-foreground aria-selected:bg-accent/50 opacity-50 aria-selected:text-muted-foreground",
				day_disabled: "text-muted-foreground opacity-50",
				day_range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				IconLeft: ({ className, ...props }) => (
					<ChevronLeft className={cn("h-4 w-4", className)} {...props} />
				),
				IconRight: ({ className, ...props }) => (
					<ChevronRight className={cn("h-4 w-4", className)} {...props} />
				),
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
