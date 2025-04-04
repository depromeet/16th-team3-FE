import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LestThanFiveMinuteModalContentProps {
	onNext: () => void;
}

const LestThanFiveMinuteModalContent = ({
	onNext,
}: LestThanFiveMinuteModalContentProps) => {
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-1 text-center">
				<p className="t3 text-normal whitespace-pre-line">
					{"잠시만요! \n마감시간이 5분도 채 남지 않았어요."}
				</p>
				<p className="b3 text-neutral whitespace-pre-line">
					{
						"이제는 고민보다 바로 시작할 시간이에요.\n '즉시 시작 모드'로 전환할게요."
					}
				</p>
			</div>

			<div className="flex gap-2">
				<Link href="/" className="flex w-full flex-1">
					<Button variant="default" className="l1 text-neutral">
						홈으로
					</Button>
				</Link>

				<Button
					variant="primary"
					className="flex w-full flex-1 l1"
					onClick={onNext}
				>
					즉시 시작
				</Button>
			</div>
		</div>
	);
};

export default LestThanFiveMinuteModalContent;
