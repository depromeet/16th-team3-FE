export type TaskStatus =
	| "pending"
	| "completed"
	| "reflected"
	| "procrastinating"
	| "inProgress"
	| "PENDING"
	| "COMPLETE"
	| "REFLECTED"
	| "PROCRASTINATING"
	| "INPROGRESS"
	| "BEFORE";
export type TaskType = "today" | "weekly" | "future";

export interface Task {
	id: number;
	title: string;
	name?: string;
	dueDate: string;
	dueDay: string;
	dueTime: string;
	dueDatetime: string;
	timeRequired: string;
	dDayCount: number;
	description: string;
	type: TaskType;
	status: TaskStatus;
	ignoredAlerts?: number;
	startedAt?: string;
	persona?: {
		id: number;
		name: string;
		personalImageUrl: string;
		taskKeywordsCombination: {
			taskType: {
				id: number;
				name: string;
			};
			taskMode: {
				id: number;
				name: string;
			};
		};
	};
	triggerAction?: string;
	triggerActionAlarmTime?: string;
	estimatedTime?: number;
	createdAt?: string;
	estimatedHour?: string;
	estimatedMinute?: string;
	estimatedDay?: string;
	taskType?: string;
	moodType?: string;
}

export interface TaskResponse {
	id: number;
	name: string;
	category: string;
	dueDatetime: string;
	triggerAction: string;
	triggerActionAlarmTime: string;
	estimatedTime: number;
	status: string;
	persona: {
		id: number;
		name: string;
		personaImageUrl: string;
		personalImageUrl?: string;
		taskKeywordsCombination: {
			taskType: {
				id: number;
				name: string;
			};
			taskMode: {
				id: number;
				name: string;
			};
		};
	};
	createdAt: string;
}

export interface TaskWithPersona extends Omit<Task, "persona" | "dueDatetime"> {
	persona: NonNullable<Task["persona"]>;
	dueDatetime: string;
}

// API 응답을 Task 타입으로 변환하는 함수
export function convertApiResponseToTask(response: TaskResponse): Task {
	try {
		// dueDatetime이 없는 경우 기본값 설정
		if (!response.dueDatetime) {
			console.warn("dueDatetime이 없는 태스크:", response.id);
			return {
				id: response.id,
				title: response.name || "제목 없음",
				dueDate: "날짜 미정",
				dueDay: "",
				dueTime: "",
				dueDatetime: new Date().toISOString(),
				timeRequired: "시간 미정",
				dDayCount: 0,
				description: response.category || "",
				type: "future",
				status: "pending",
				ignoredAlerts: 0,
				persona: response.persona
					? {
							...response.persona,
							personalImageUrl:
								response.persona.personalImageUrl ||
								response.persona.personaImageUrl ||
								"",
						}
					: undefined,
				triggerAction: response.triggerAction,
				triggerActionAlarmTime: response.triggerActionAlarmTime,
				estimatedTime: response.estimatedTime,
				createdAt: response.createdAt,
			};
		}

		// dueDatetime에서 날짜 및 요일 계산
		const dueDate = new Date(response.dueDatetime);
		const year = dueDate.getFullYear();
		const month = String(dueDate.getMonth() + 1).padStart(2, "0");
		const day = String(dueDate.getDate()).padStart(2, "0");
		const formattedDate = `${year}-${month}-${day}`;

		// 요일 계산
		const days = ["일", "월", "화", "수", "목", "금", "토"];
		const dayOfWeek = days[dueDate.getDay()];
		const dueDay = `(${dayOfWeek})`;

		// 시간 형식 변환 (예: "오후 6시까지")
		const hours = dueDate.getHours();
		const minutes = dueDate.getMinutes();
		const amPm = hours >= 12 ? "오후" : "오전";
		const hour12 = hours % 12 || 12;

		// 분이 0인 경우는 시간만, 아닌 경우는 분까지 표시
		const dueTime =
			minutes === 0
				? `${amPm} ${hour12}시까지`
				: `${amPm} ${hour12}시 ${minutes}분까지`;

		// D-Day 계산 및 마감 지난 경우 D+1 형식으로 표시
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const dueDay0 = new Date(dueDate);
		dueDay0.setHours(0, 0, 0, 0);
		const diffTime = dueDay0.getTime() - today.getTime();
		const dDayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		// 태스크 타입 결정 (오늘, 이번주, 이후)
		let type: TaskType = "future";
		if (dDayCount === 0) {
			type = "today";
		} else if (dDayCount > 0 && dDayCount <= 7) {
			type = "weekly";
		}

		// 상태 변환
		let status: TaskStatus = "pending";
		if (response.status === "FOCUSED") {
			status = "inProgress";
		} else if (response.status === "COMPLETE") {
			status = "completed";
		} else if (response.status === "REFLECTED") {
			status = "reflected";
		} else if (response.status === "PROCRASTINATING") {
			status = "procrastinating";
		} else if (response.status === "BEFORE") {
			status = "pending";
		}

		// 예상 소요시간 변환
		// 예상 소요시간 변환
		let timeRequired = "1시간 소요"; // 기본값

		if (response.estimatedTime) {
			// 사용자가 직접 지정한 소요시간이 있는 경우
			const hours = Math.floor(response.estimatedTime / 60);
			const minutes = response.estimatedTime % 60;
			if (hours > 0 && minutes > 0) {
				timeRequired = `${hours}시간 ${minutes}분 소요`;
			} else if (hours > 0) {
				timeRequired = `${hours}시간 소요`;
			} else if (minutes > 0) {
				timeRequired = `${minutes}분 소요`;
			}
		} else if (response.createdAt && response.dueDatetime) {
			// 소요시간이 지정되지 않았지만 생성 시간과 마감 시간이 모두 있는 경우
			const createdDate = new Date(response.createdAt);
			const dueDate = new Date(response.dueDatetime);

			const diffMinutes = Math.round(
				(dueDate.getTime() - createdDate.getTime()) / (1000 * 60),
			);

			const positiveMinutes = Math.max(diffMinutes, 0);

			const calculatedHours = Math.floor(positiveMinutes / 60);
			const calculatedMinutes = positiveMinutes % 60;

			if (calculatedHours > 0 && calculatedMinutes > 0) {
				timeRequired = `${calculatedHours}시간 ${calculatedMinutes}분 소요`;
			} else if (calculatedHours > 0) {
				timeRequired = `${calculatedHours}시간 소요`;
			} else if (calculatedMinutes > 0) {
				timeRequired = `${calculatedMinutes}분 소요`;
			} else {
				timeRequired = "잠시 소요";
			}
		}

		const personaObj = response.persona
			? {
					...response.persona,
					personalImageUrl:
						response.persona.personalImageUrl ||
						response.persona.personaImageUrl ||
						"",
				}
			: undefined;

		return {
			id: response.id,
			title: response.name,
			dueDate: formattedDate,
			dueDay,
			dueTime,
			dueDatetime: response.dueDatetime,
			timeRequired,
			dDayCount,
			description: response.category,
			type,
			status,
			ignoredAlerts: 0,
			startedAt: status === "inProgress" ? new Date().toISOString() : undefined,
			persona: personaObj,
			triggerAction: response.triggerAction,
			triggerActionAlarmTime: response.triggerActionAlarmTime,
			estimatedTime: response.estimatedTime,
			createdAt: response.createdAt,
		};
	} catch (error) {
		console.error("태스크 변환 중 오류 발생:", error);
		// 최소한의 기본 태스크 반환
		return {
			id: response.id,
			title: response.name || "오류 발생",
			dueDate: "",
			dueDay: "",
			dueTime: "",
			dueDatetime: "",
			timeRequired: "",
			dDayCount: 0,
			description: "",
			type: "future",
			status: "pending",
			ignoredAlerts: 0,
		};
	}
}
