import Link from "next/link";
import { memo } from "react";
import HeaderBar from "./headerBar/HeaderBar";

interface HeaderProps {
	activeTab: string;
	numberOfTodayTasks: number;
	numberOfAllTasks: number;
	handleTabChange: (tab: "today" | "all") => void;
}

const Header = ({
	activeTab,
	numberOfTodayTasks,
	numberOfAllTasks,
	handleTabChange,
}: HeaderProps) => {
	return (
		<header className="z-20 fixed top-0 w-[100vw] bg-background-primary pt-[44px]">
			<HeaderBar />

			<div className="px-[20px] py-[11px]">
				<div className="flex space-x-4">
					<Link href="/?tab=today" scroll={false}>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							onClick={() => {
								handleTabChange("today");
							}}
						>
							<span
								className={`t3 ${activeTab === "today" ? "text-text-normal" : "text-text-disabled"}`}
							>
								오늘 할일
							</span>
							<span
								className={`s1 ml-1 ${activeTab === "today" ? "text-text-primary" : "text-text-disabled"}`}
							>
								{numberOfTodayTasks}
							</span>
						</div>
					</Link>

					<Link href="/?tab=all" scroll={false}>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							onClick={() => {
								handleTabChange("all");
							}}
						>
							<span
								className={`t3 ${activeTab === "all" ? "text-text-normal" : "text-text-disabled"}`}
							>
								전체 할일
							</span>
							<span
								className={`s1 ml-1 ${activeTab === "all" ? "text-text-primary" : "text-text-disabled"}`}
							>
								{numberOfAllTasks}
							</span>
						</div>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default memo(Header);
