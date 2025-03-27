/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import Image from "next/image";
import Link from "next/link";

interface CreateTaskSheetProps {
	isOpen: boolean;
	onClose: () => void;
}

const CreateTaskSheet = ({ isOpen, onClose }: CreateTaskSheetProps) => {
	return (
		<Drawer open={isOpen} onOpenChange={onClose}>
			<DrawerContent className="w-auto border-0 bg-component-gray-secondary pb-[33px] pt-2">
				<DrawerHeader className="flex items-center justify-start p-5 pb-6 pt-10">
					<DrawerTitle className="t3 text-text-strong">
						마감할 일 추가하기
					</DrawerTitle>
				</DrawerHeader>

				<div className="px-5">
					{/* 여유있게 시작 옵션 */}
					<Link href="/scheduled-create">
						<div className="mb-3 flex items-center overflow-hidden rounded-[20px]">
							<div className="flex h-[32px] w-[32px] items-center justify-start">
								<img
									src="/icons/home/gp-clock.svg"
									alt="Clock"
									width={30}
									height={30}
								/>
							</div>
							<div className="flex h-[64px] flex-1 items-center justify-between pl-3">
								<div>
									<h4 className="s1 font-medium text-text-normal">
										여유있게 시작
									</h4>
								</div>
								<div className="flex items-center">
									<p className="b3 mr-3 text-text-neutral">
										알림 받고 나중에 시작
									</p>
									<div className="text-text-neutral">
										<img
											src="/icons/home/arrow-right.svg"
											alt="Arrow"
											width={7}
											height={12}
										/>
									</div>
								</div>
							</div>
						</div>
					</Link>

					{/* 즉시 시작 옵션 */}
					<Link href="/instant-create">
						<div className="mb-8 flex items-center overflow-hidden rounded-[20px]">
							<div className="flex h-[32px] w-[32px] items-center justify-start">
								<img
									src="/icons/home/heartfire.svg"
									alt="Heart"
									width={30}
									height={30}
								/>
							</div>
							<div className="flex h-[64px] flex-1 flex-row items-center justify-between pl-3">
								<div>
									<h4 className="s1 font-medium text-text-normal">즉시 시작</h4>
								</div>
								<div className="flex items-center">
									<p className="b3 mr-3 text-text-neutral">
										알림 없이 바로 몰입
									</p>
									<div className="text-text-neutral">
										<img
											src="/icons/home/arrow-right.svg"
											alt="Arrow"
											width={7}
											height={12}
										/>
									</div>
								</div>
							</div>
						</div>
					</Link>

					{/* 닫기 버튼 */}
					<div className="my-6">
						<Button
							variant="primary"
							size="default"
							className="l2 z-10 w-full rounded-[16px] bg-component-accent-primary py-4 font-medium text-gray-strong"
							onClick={onClose}
						>
							닫기
						</Button>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default CreateTaskSheet;
