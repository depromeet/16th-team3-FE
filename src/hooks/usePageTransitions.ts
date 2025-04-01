"use client";

import { TransitionsContext } from "@/context/transitionContext";
import { FlowType } from "@/types/flowType";
import { useContext } from "react";

export function usePageTransitions() {
	const transitionContext = useContext(TransitionsContext);

	if (!transitionContext) {
		throw new Error(
			"You are attempting to use usePageTransitions outside of a TransitionContext.",
		);
	}

	const context = transitionContext;

	/**
	 * Triggers the animation to hide the page.
	 *
	 * @param {FlowType} [flowType] - The flow direction (`Next` or `Previous`).
	 * @returns {Promise<void>} A promise that resolves when the animation completes.
	 */
	function hide(flowType: FlowType): Promise<void> {
		return new Promise((resolve) => {
			const className = getHideAnimation(flowType);
			context.setClassName(className);
			context.flowType.current = flowType;

			// Wait for the animation to be completed before resolving the promise
			setTimeout(resolve, context.animationDuration);
		});
	}

	/** Triggers the animation to show the page. */
	function show() {
		if (context.flowType.current) {
			const animation = getShowAnimation(context.flowType.current);
			context.setClassName(animation);
		}
	}

	return { hide, show };
}

// Private helper functions

/** Gets the CSS class required to hide the page. */
function getHideAnimation(flowType: FlowType) {
	return flowType === FlowType.Next ? "slide-left-out" : "slide-right-out";
}

/** Gets the CSS class required to show the page. */
function getShowAnimation(flowType: FlowType) {
	return flowType === FlowType.Next ? "slide-left-in" : "slide-right-in";
}
