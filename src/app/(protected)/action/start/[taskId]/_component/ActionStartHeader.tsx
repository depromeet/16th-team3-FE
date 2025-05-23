import GlassHour from "@public/icons/common/glasshour.svg";
import Image from "next/image";

export default function ActionStartHeader() {
	return (
		<div className="mt-[30px] flex flex-col items-center justify-center gap-3 px-5 pb-6 pt-5">
			<Image src={GlassHour} alt="모래시계" width={40} height={40} />
			<p className="text-center text-t2 text-white">
				작은 행동과 함께
				<br />
				할일을 시작해보세요!
			</p>
			<p className="b2 text-base text-[#eeeeee]">시작하기 좋은 타이밍이에요</p>
		</div>
	);
}
