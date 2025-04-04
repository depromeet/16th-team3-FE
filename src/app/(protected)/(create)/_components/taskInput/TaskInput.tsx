"use client";

import ClearableInput from "@/components/clearableInput/ClearableInput";
import { Button } from "@/components/ui/button";
import useInitialTime from "@/hooks/useInitialTime";
import type { TimePickerType } from "@/types/create";
import { useEffect, useRef, useState } from "react";
import type { TaskInputType } from "../../context";
import DateSelectedComponent from "../dateSelectedComponent/DateSelectedComponent";
import HeaderTitle from "../headerTitle/HeaderTitle";
import TimeSelectedComponent from "../timeSelectedComponent/TimeSelectedComponent";

interface TaskInputProps {
	context: TaskInputType;
	lastStep?: string;
	onNext: ({
		task,
		deadlineDate,
		deadlineTime,
	}: {
		task: string;
		deadlineDate: Date;
		deadlineTime: TimePickerType;
	}) => void;
	onEdit?: ({
		task,
		deadlineDate,
		deadlineTime,
	}: {
		task: string;
		deadlineDate: Date;
		deadlineTime: TimePickerType;
	}) => void;
}

const MAX_TASK_LENGTH = 16;
const WAITING_TIME = 200;

const TaskInput = ({ context, lastStep, onNext, onEdit }: TaskInputProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const {
		meridiem: meridiemString,
		hour: hourString,
		minute: minuteString,
	} = useInitialTime();

	const [task, setTask] = useState<string>("");
	const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
	const [deadlineTime, setDeadlineTime] = useState<TimePickerType>({
		meridiem: meridiemString,
		hour: hourString,
		minute: minuteString,
	});
	const [isFocused, setIsFocused] = useState(true);
	const [isTimePickerFirstTouched, setIsTimePickerFirstTouched] = useState(
		!lastStep,
	);

	const isInvalid =
		task.length > MAX_TASK_LENGTH ||
		task.length === 0 ||
		!deadlineDate ||
		isTimePickerFirstTouched;

	const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTask(event.target.value);
	};

	const handleDateChange = (date: Date) => {
		setDeadlineDate(date);
	};

	const handleTimeChange = (time: TimePickerType) => {
		setDeadlineTime(time);
	};

	const handleInputFocus = (value: boolean) => {
		setIsFocused(value);
	};

	const handleFirstTouchToFalse = () => {
		setIsTimePickerFirstTouched(false);
	};

	useEffect(() => {
		if (inputRef.current)
			setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
					setIsFocused(true);
				}
			}, WAITING_TIME);
	}, []);

	useEffect(() => {
		if (context.task) {
			setTask(context.task);
		}
		if (context.deadlineDate) {
			setDeadlineDate(context.deadlineDate);
		}
		if (context.deadlineTime) {
			setDeadlineTime(context.deadlineTime);
		}
	}, [context]);

	return (
		<div className="flex h-full w-full flex-col">
			<div>
				<HeaderTitle title="어떤 일의 마감이 급하신가요?" />
				<div className="flex flex-col gap-6">
					<div>
						<ClearableInput
							value={task}
							ref={inputRef}
							title="할 일 입력"
							isFocused={isFocused}
							onChange={handleTaskChange}
							handleInputFocus={handleInputFocus}
						/>
						{task.length > MAX_TASK_LENGTH && (
							<p className="mt-2 text-sm text-line-error">
								최대 16자 이내로 입력할 수 있어요.
							</p>
						)}
					</div>

					<DateSelectedComponent
						deadlineDate={deadlineDate}
						handleDateChange={handleDateChange}
					/>

					{deadlineDate !== undefined && (
						<TimeSelectedComponent
							deadlineTime={deadlineTime}
							deadlineDate={deadlineDate}
							isTimePickerFirstTouched={isTimePickerFirstTouched}
							handleTimeChange={handleTimeChange}
							handleFirstTouchToFalse={handleFirstTouchToFalse}
						/>
					)}
				</div>
			</div>

			<div className="mt-auto">
				<Button
					variant="primary"
					className="mt-6"
					onClick={
						lastStep === "bufferTime"
							? () =>
									onEdit?.({
										task,
										deadlineDate: deadlineDate as Date,
										deadlineTime: deadlineTime as TimePickerType,
									})
							: () =>
									onNext({
										task,
										deadlineDate: deadlineDate as Date,
										deadlineTime: deadlineTime as TimePickerType,
									})
					}
					disabled={isInvalid}
				>
					{lastStep === "bufferTime" ? "확인" : "다음"}
				</Button>
			</div>
		</div>
	);
};

export default TaskInput;
