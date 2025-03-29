"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import BackHeader from "@/components/backHeader/BackHeader";

const EditLayout = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const pathname = usePathname();

	const handleBackButtonClick = () => {
		if (pathname.includes("estimated-time")) {
			router.push("/tab=all");
		}

		router.back();
	};

	return (
		<div className="background-primary flex h-full w-full flex-col items-center justify-start overflow-y-auto px-5">
			<BackHeader onClick={handleBackButtonClick} />
			{children}
		</div>
	);
};

export default EditLayout;
