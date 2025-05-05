import assignmentIcon from "@public/icons/assignment.svg";
import designIcon from "@public/icons/design.svg";
import exerciseIcon from "@public/icons/exercise.svg";
import programmingIcon from "@public/icons/programming.svg";
import studyIcon from "@public/icons/study.svg";
import writingIcon from "@public/icons/writing.svg";

import calmIcon from "@public/icons/calm.svg";
import emotionalIcon from "@public/icons/emotional.svg";
import excitedIcon from "@public/icons/excited.svg";
import urgentIcon from "@public/icons/urgent.svg";

import { MoodType, TaskType } from "@/types/create";
import type { StaticImageData } from "next/image";

/**
 * ICON_MAP maps each TaskType and MoodType enum value
 * to its corresponding static image import.
 */
export const ICON_MAP: Record<TaskType | MoodType, StaticImageData> = {
	[TaskType.STUDY]: studyIcon,
	[TaskType.WRITING]: writingIcon,
	[TaskType.EXERCISE]: exerciseIcon,
	[TaskType.PROGRAMMING]: programmingIcon,
	[TaskType.DESIGN]: designIcon,
	[TaskType.ASSIGNMENT]: assignmentIcon,

	[MoodType.URGENT]: urgentIcon,
	[MoodType.EXCITED]: excitedIcon,
	[MoodType.EMOTIONAL]: emotionalIcon,
	[MoodType.CALM]: calmIcon,
};
