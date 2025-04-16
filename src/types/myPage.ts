export interface Persona {
	id: number;
	name: string;
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
}

export interface TaskOrigin {
	id: number;
	name: string;
	category: "URGENT" | "SCHEDULED";
	dueDatetime: string;
	triggerAction: string;
	estimatedTime: number;
	triggerActionAlarmTime: string;
	status:
		| "BEFORE"
		| "WARMING_UP"
		| "PROCRASTINATING"
		| "HOLDING_OFF"
		| "FOCUSED"
		| "COMPLETE"
		| "FAIL";
	member: {
		id: number;
		nickname: string;
		email: string;
		profileImageUrl: string;
		oAuthProviderInfo: {
			oauthProvider: "KAKAO" | "APPLE";
			subject: string;
		};
		isDeleted: true;
		oauthProviderInfo: {
			oauthProvider: "KAKAO" | "APPLE";
			subject: string;
		};
	};
	persona: Persona;
	isDeleted: true;
}

export interface MyData {
	satisfactionAvg: number;
	concentrationAvg: number;
	personas: Persona[];
	completedTasks: TaskOrigin[];
	procrastinatedTasks: TaskOrigin[];
	completedTaskCount: number;
	procrastinatedTaskCount: number;
}

export interface TaskWithRetrospection {
	id: number,
	name: string,
	personaId: number,
	personaName: string,
	triggerAction: string,
	estimatedTime: number,
	dueDateTime: string,
	status: string,
	updatedAt: string,
	satisfaction: number,
	concentration: number,
	comment: string
}
