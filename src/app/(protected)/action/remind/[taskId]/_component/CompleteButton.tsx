"use client";

import { Button } from "@/components/ui/button";

export default function CompleteButton({ onClick }: { onClick: () => void }) {
	return (
		<div className="mt-auto items-center px-5">
			<Button variant="primary" className="w-full" onClick={onClick}>
				완료
			</Button>
		</div>
	);
}
