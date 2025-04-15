// TODO(prgmr99): Drawer 적용해야 함
const ExpiredTaskDrawer = () => {
	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
			<div className="flex w-full flex-col items-center rounded-t-[28px] bg-component-gray-secondary p-4 pt-10">
				<h2 className="t3 text-center text-text-strong">{expiredTask.title}</h2>
				<p className="t3 mb-2 text-center text-text-strong">
					작업이 끝났어요. 짧게 돌아볼까요?
				</p>
				<div className="flex w-full justify-between">
					<p className="b3 mb-7 text-text-neutral">마감일 </p>
					<p className="b3 mb-7 text-text-neutral">
						{new Date(expiredTask.dueDate).toLocaleDateString("ko-KR", {
							month: "long",
							day: "numeric",
						})}
						({expiredTask.dueDay}), {expiredTask.dueTime}
					</p>
				</div>
				<button
					type="button"
					className="l2 mb-3 w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
					onClick={() => handleGoToReflection(expiredTask.id)}
				>
					회고하기
				</button>

				<button
					type="button"
					className="l2 w-full py-4 text-text-neutral"
					onClick={handleCloseExpiredSheet}
				>
					닫기
				</button>
			</div>
		</div>
	);
};

export default ExpiredTaskDrawer;
