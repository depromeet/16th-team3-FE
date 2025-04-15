import ExpiredTaskDrawer from "../expiredTaskDrawer/ExpiredTaskDrawer";
import HasAllTasksOnlyScreen from "../hasAllTasksOnlyScreen/HasAllTasksOnlyScreen";
import HasInProgressTasksOnlyScreen from "../hasInProgressTasksOnlyScreen/HasInProgressTasksOnlyScreen";
import HasTodayAndInProgressTasksScreen from "../hasTodayAndInProgressTasksScreen/HasTodayAndInProgressTasksScreen";
import HasTodayTasksOnlyScreen from "../hasTodayTasksOnlyScreen/HasTodayTasksOnlyScreen";
import HasWeeklyTasksOnlyScreen from "../hasWeeklyTasksOnlyScreen/HasWeeklyTasksOnlyScreen";
import IsEmptyScreen from "../isEmptyScreen/IsEmptyScreen";

interface TodayTaskTabWrapperProps {}

const TodayTaskTabWrapper = ({}: TodayTaskTabWrapperProps) => {
	return (
		<>
			{isTotallyEmpty && <IsEmptyScreen />}

			{/* 진행 중인 일이 있고 오늘 할 일도 있는 경우 */}
			{hasTodayAndInProgressTasks && <HasTodayAndInProgressTasksScreen />}

			{/* 진행 중인 일만 있고 오늘 할 일은 없는 경우 */}
			{hasInProgressTasksOnly && <HasInProgressTasksOnlyScreen />}

			{/* 진행 중인 일은 없고 오늘 진행 예정인 일만 있는 경우 */}
			{hasTodayTasksOnly && <HasTodayTasksOnlyScreen />}

			{hasWeeklyTasksOnly && <HasWeeklyTasksOnlyScreen />}

			{hasAllTasksOnly && <HasAllTasksOnlyScreen />}

			{showExpiredTaskSheet && expiredTask && <ExpiredTaskDrawer />}
		</>
	);
};

export default TodayTaskTabWrapper;
