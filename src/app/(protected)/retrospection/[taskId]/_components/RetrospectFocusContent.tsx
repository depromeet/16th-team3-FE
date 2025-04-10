import { useRef } from "react";

const BAR = {
	HEIGHT: 18,
	SLIDER_RADIUS: 9,
};

const RetrospectFocusContent = ({
	retrospectContent,
	setRetrospectContent,
}: RetrospectContentProps) => {
	const FOCUS_STEPS = [0, 1, 2, 3, 4, 5];

	const trackRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);

	const setFocusContent = (selected: number) => {
		const selectedFocus = selected as FocusContent;
		setRetrospectContent((prev) => ({
			...prev,
			concentration: selectedFocus as FocusContent,
		}));
	};

	const getClosestIndex = (x: number): number => {
		const track = trackRef.current;

		if (!track) return retrospectContent.concentration;

		const MAX_INDEX = FOCUS_STEPS.length - 1;
		const rect = track.getBoundingClientRect();
		const offsetX = x - rect.left;
		const ratio = offsetX / rect.width;
		const rawIndex = Math.round(ratio * MAX_INDEX);

		return Math.min(Math.max(rawIndex, 0), MAX_INDEX);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDragging.current) return;

		const idx = getClosestIndex(e.clientX);
		setFocusContent(idx);
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		const idx = getClosestIndex(e.clientX);

		setFocusContent(idx);
		isDragging.current = true;

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseUp = () => {
		isDragging.current = false;
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
	};

	const handleTouch = (e: React.TouchEvent) => {
		const touch = e.touches[0];
		const idx = getClosestIndex(touch.clientX);
		setFocusContent(idx);
		isDragging.current = true;

		const handleMove = (e: TouchEvent) => {
			if (!isDragging.current) return;
			const touch = e.touches[0];
			const idx = getClosestIndex(touch.clientX);
			setFocusContent(idx);
		};

		const handleEnd = () => {
			isDragging.current = false;
			window.removeEventListener("touchmove", handleMove);
			window.removeEventListener("touchend", handleEnd);
		};

		window.addEventListener("touchmove", handleMove);
		window.addEventListener("touchend", handleEnd);
	};

	return (
		<div className="w-full mx-2 mt-1">
			<div
				ref={trackRef}
				className="relative flex items-center"
				style={{
					height: `${BAR.HEIGHT}px`,
				}}
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouch}
			>
				{/* 전체 바 배경 */}
				<div
					className="absolute rounded-full bg-line-tertiary"
					style={{
						height: `${BAR.HEIGHT}px`,
						width: `calc(100% + ${BAR.SLIDER_RADIUS * 2}px)`, // 16px 양쪽 추가
						left: `-${BAR.SLIDER_RADIUS}px`, // 왼쪽으로 16px 이동
					}}
				/>

				{/* 선택된 채워진 부분 */}
				<div
					className="absolute rounded-full bg-gradient-to-r from-blue-200 to-purple-200 transition-all duration-200"
					style={{
						height: `${BAR.HEIGHT}px`,
						width: `calc(${(retrospectContent.concentration / 5) * 100}% + ${BAR.SLIDER_RADIUS * 2}px)`,
						left: `-${BAR.SLIDER_RADIUS}px`,
					}}
				/>

				{/* 점들 */}
				<div className="relative z-10 flex justify-between w-full">
					{FOCUS_STEPS.map((step, i) => (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={i}
							className={`w-[6px] h-[6px] rounded-full transition-all duration-200 ${
								retrospectContent.concentration >= step
									? "bg-background-skyblue opacity-90"
									: "bg-background-skyblue opacity-30"
							}`}
							onClick={() => setFocusContent(i)}
						/>
					))}
				</div>

				{/* 슬라이더 핸들 */}
				<div
					className="absolute m-3 z-30 rounded-full border-2 border-white bg-white shadow"
					style={{
						width: `${BAR.SLIDER_RADIUS * 2}px`,
						height: `${BAR.SLIDER_RADIUS * 2}px`,
						left: `calc(${(retrospectContent.concentration / 5) * 100}% - ${BAR.SLIDER_RADIUS * 2}px)`,
						transition: "left 0.2s ease",
					}}
				/>
			</div>

			{/* 아래 숫자 레이블 */}
			<div className="mt-1.5 flex justify-between c3 text-gray-alternative font-medium">
				{FOCUS_STEPS.map((step, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<div key={i} className="w-[6px] flex justify-center">
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={i}
							className={
								retrospectContent.concentration === step
									? "text-gray-alternative"
									: ""
							}
						>
							{`${step * 20}`}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default RetrospectFocusContent;
