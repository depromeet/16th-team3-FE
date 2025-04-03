import React, { useState } from 'react';

const tasks = {
  completed: [
    { id: 1, title: '디프만 리서치 준비', due: '2월 5일 (수) 자정까지' },
    { id: 2, title: '디프만 리서치 준비', due: '2월 5일 (수) 자정까지' },
    { id: 3, title: '디프만 리서치 준비', due: '2월 5일 (수) 자정까지' },
  ],
  deferred: [
    { id: 4, title: '미룬 작업 예시', due: '2월 6일 (목) 자정까지' },
    { id: 5, title: '미룬 작업 예시', due: '2월 6일 (목) 자정까지' },
  ],
};

interface Task {
  id: number;
  title: string;
  due: string;
}

const TaskItem = ({ task }: { task: Task }) => (
  <div className="flex flex-col gap-2 py-4">
    <div className="text-s2">{task.title}</div>
    <div className="text-s3 text-gray-alternative">{task.due}</div>
  </div>
);

const TaskList = ({ tasks }: { tasks: Task[] }) => (
  <>
    {tasks.map((task) => (
      <TaskItem key={task.id} task={task} />
    ))}
  </>
);

const TaskContainer = () => {
  const [activeTab, setActiveTab] = useState('completed');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const activeTasks =
    activeTab === 'completed' ? tasks.completed : tasks.deferred;

  return (
    <div className="mt-8 px-5">
      <div className="flex items-center gap-4">
        <div
          className={`cursor-pointer text-t3 ${activeTab === 'completed' ? 'text-gray-normal' : 'text-gray-alternative'}`}
          onClick={() => handleTabClick('completed')}
        >
          완료한 일 {tasks.completed.length}
        </div>
        <div
          className={`cursor-pointer text-t3 ${activeTab === 'deferred' ? 'text-gray-normal' : 'text-gray-alternative'}`}
          onClick={() => handleTabClick('deferred')}
        >
          미룬 일 {tasks.deferred.length}
        </div>
      </div>
      <TaskList tasks={activeTasks} />
    </div>
  );
};

export default TaskContainer;
