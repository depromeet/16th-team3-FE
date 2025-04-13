"use client";

import { useEffect } from "react";

const PinchZoomPreventer = () => {
	useEffect(() => {
		const handler = (event: TouchEvent) => {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			if ((event as any).scale && (event as any).scale !== 1) {
				event.preventDefault();
			}
		};

		document.addEventListener("touchmove", handler, { passive: false });

		return () => {
			document.removeEventListener("touchmove", handler);
		};
	}, []);

	return null;
};

export default PinchZoomPreventer;
