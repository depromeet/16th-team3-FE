import type { FlowType } from "@/types/flowType";
import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

/**
 * This serves as a contract for the context.
 */
interface TransitionsContext {
	flowType: React.MutableRefObject<FlowType | null>;
	className: string;
	setClassName: Dispatch<SetStateAction<string>>;
	animationDuration: number;
}

/**
 * This will manage and provide the transition-related state across components.
 */
const TransitionsContext = createContext<TransitionsContext | null>(null);

export { TransitionsContext };
