import { EditTaskInputType } from "@/app/(protected)/(create)/context";
import type { Task as TaskType } from "@/types/task";
import { create } from "zustand";

// ! TODO: task.ts 파일에 Task 타입 활용/통일 필요
interface Task {
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

interface TaskProgressStore {
	currentTask: Task | null;
	setCurrentTask: (task: Task) => void;
}

type TaskStore = {
	currentTask: TaskType | null;
	setCurrentTask: (task: TaskType) => void;
};

export const useTaskProgressStore = create<TaskProgressStore>((set) => ({
	currentTask: null,
	setCurrentTask: (task) => set({ currentTask: task }),
}));

export const useThisWeekTaskStore = create<TaskStore>((set) => ({
	currentTask: null,
	setCurrentTask: (task) => set({ currentTask: task }),
}));
