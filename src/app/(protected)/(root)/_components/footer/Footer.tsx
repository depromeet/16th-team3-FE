import { memo, useEffect, useState } from "react";
import TaskAddButton from "./taskAddButton/TaskAddButton";

const Footer = ({ onClick }: { onClick: () => void }) => {
	const [showTooltip, setShowTooltip] = useState(true);

	useEffect(() => {
		const hasVisited = localStorage.getItem("hasVisitedBefore");

		if (hasVisited) {
			setShowTooltip(false);
		} else {
			localStorage.setItem("hasVisitedBefore", "true");
		}
	}, []);

	return (
		<footer className="fixed bottom-0 left-0 right-0 z-10">
			<div
				className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
				style={{
					background:
						"linear-gradient(to bottom, rgba(15, 17, 20, 0) 0%, rgba(15, 17, 20, 1) 100%)",
				}}
			/>

			<TaskAddButton showTooltip={showTooltip} onClick={onClick} />
		</footer>
	);
};

export default memo(Footer);
