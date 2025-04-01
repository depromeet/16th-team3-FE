"use client";

import { TransitionsContext } from "@/context/transitionContext";
import type { FlowType } from "@/types/flowType";
import type React from "react";
import { useRef, useState } from "react";

/**
 * This component initializes the context with default values
 * and renders the content of the different pages
 * that will use these page transitions.
 *
 * It’s responsible for adding the CSS class that triggers the animation around the pages.
 * @param children
 * @param wrapperClassName
 */
export function PageTransitionsProvider({
	children,
	wrapperClassName,
}: React.PropsWithChildren<{
	wrapperClassName: string;
}>) {
	const [className, setClassName] = useState("");
	const flowType = useRef<FlowType | null>(null);

	return (
		<TransitionsContext.Provider
			value={{
				className,
				setClassName,
				flowType,
				animationDuration: 2000,
			}}
		>
			<div className={`${className} ${wrapperClassName}`}>{children}</div>
		</TransitionsContext.Provider>
	);
}
