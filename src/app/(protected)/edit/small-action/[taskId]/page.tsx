"use client";

import HeaderTitle from "@/app/(protected)/(create)/_components/headerTitle/HeaderTitle";
import SmallActionChip from "@/app/(protected)/(create)/_components/smallActionChip/SmallActionChip";
import ClearableInput from "@/components/clearableInput/ClearableInput";
import { Button } from "@/components/ui/button";
import { fetchSingleTask } from "@/services/taskService";
import type { TaskResponse } from "@/types/task";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, use, useEffect, useRef, useState } from "react";
import type { EditPageProps } from "../../context";

const MAX_SMALL_ACTION_LENGTH = 15;
const SMALL_ACTION_LIST = ["SitAtTheDesk", "TurnOnTheLaptop", "DrinkWater"];

const SmallActionEdit = ({ params }: EditPageProps) => {
	const { taskId } = use(params);

	const router = useRouter();
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [isFocused, setIsFocused] = useState(true);
	const [smallAction, setSmallAction] = useState<string>("");

	const { data: taskData } = useQuery<TaskResponse>({
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

	if (!taskData) {
		return <Loader />;
	}

	return (
		<div className="flex h-screen w-full flex-col justify-between">
			<div>
				<HeaderTitle title="어떤 작은 행동부터 시작할래요?" />
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
								{SMALL_ACTION_LIST.map((action, index) => (
									<SmallActionChip
										key={index}
										smallAction={action}
										onClick={handleSmallActionClick}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
			<div
				className={`transition-all duration-300 ${isFocused ? "mb-[48vh]" : "pb-[46px]"}`}
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

const SmallActionEditPage = (props: EditPageProps) => {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center bg-background-primary px-5 py-12">
					<Loader />
				</div>
			}
		>
			<SmallActionEdit {...props} />
		</Suspense>
	);
};

export default SmallActionEditPage;
