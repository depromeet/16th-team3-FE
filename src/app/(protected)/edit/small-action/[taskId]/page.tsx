"use client";

import HeaderTitle from "@/app/(protected)/(create)/_components/headerTitle/HeaderTitle";
import SmallActionChip from "@/app/(protected)/(create)/_components/smallActionChip/SmallActionChip";
import ClearableInput from "@/components/clearableInput/ClearableInput";
import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { fetchSingleTask } from "@/services/taskService";
import type { TaskResponse } from "@/types/task";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import type { EditPageProps } from "../../context";

const MAX_SMALL_ACTION_LENGTH = 15;
const SMALL_ACTION_LIST = ["SitAtTheDesk", "TurnOnTheLaptop", "DrinkWater"];

const SmallActionEdit = ({ params }: EditPageProps) => {
	const { taskId } = use(params);

	const router = useRouter();
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [isFocused, setIsFocused] = useState(false);
	const [smallAction, setSmallAction] = useState<string>("");

	const { data: taskData, isFetching } = useQuery<TaskResponse>({
		queryKey: ["singleTask", taskId],
		queryFn: () => fetchSingleTask(taskId),
	});

	const handleSmallActionChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSmallAction(event.target.value);
	};

	const handleInputFocus = (value: boolean) => {
		setIsFocused(value);
	};

	const handleSmallActionClick = (action: string) => {
		setSmallAction(action);
	};

	const handleNextButtonClick = () => {
		const query = new URLSearchParams({
			triggerAction: smallAction,
		}).toString();

		router.push(`/edit/buffer-time/${taskId}?${query}&type=smallAction`);
	};

	useEffect(() => {
		if (taskData) {
			setSmallAction(taskData.triggerAction);
		}
	}, [taskData]);

	return (
		<div className="relative flex h-screen w-full flex-col justify-between">
			<div>
				<HeaderTitle title="어떤 작은 행동부터 시작할래요?" />
				{isFetching ? (
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
						<Loader />
					</div>
				) : (
					<div className="flex flex-col gap-6">
						<div>
							<ClearableInput
								value={smallAction}
								ref={inputRef}
								title="작은 행동 입력"
								isFocused={isFocused}
								onChange={handleSmallActionChange}
								handleInputFocus={handleInputFocus}
							/>
							{smallAction.length > MAX_SMALL_ACTION_LENGTH && (
								<p className="mt-2 text-sm text-red-500">
									최대 16자 이내로 입력할 수 있어요.
								</p>
							)}
							{smallAction.length === 0 && (
								<div className="mt-3 flex w-full gap-2 overflow-x-auto whitespace-nowrap">
									{SMALL_ACTION_LIST.map((action) => (
										<SmallActionChip
											key={action}
											smallAction={action}
											onClick={handleSmallActionClick}
										/>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
			<div
				className={`fixed bottom-10 w-[100%] mt-auto transition-all duration-300 pr-10 ${isFocused ? "mb-[36vh]" : ""}`}
			>
				<Button
					variant="primary"
					className="w-full"
					disabled={
						smallAction.length === 0 ||
						smallAction.length > MAX_SMALL_ACTION_LENGTH
					}
					onClick={handleNextButtonClick}
				>
					확인
				</Button>
			</div>
		</div>
	);
};

export default SmallActionEdit;
