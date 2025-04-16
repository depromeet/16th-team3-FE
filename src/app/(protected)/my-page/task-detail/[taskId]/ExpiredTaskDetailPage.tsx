"use client";

import CustomBackHeader from "@/components/customBackHeader/CustomBackHeader";
import { useExpiredTaskStore } from "@/store/useTaskStore";
import { TaskOrigin, TaskWithRetrospection } from "@/types/myPage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Props = {
    task: TaskWithRetrospection;
};

export default function ExpiredTaskDetailPage({task} :Props) {
    const router = useRouter();
    const currentTask = useExpiredTaskStore((state) => state.currentTask);
    // if (!currentTask) {
    //     router.push("/my-page");
    // }
    // const task = currentTask as TaskOrigin;
    // console.log(task)

    return (
        <div className="flex min-h-screen flex-col pb-[34px]">
            {/* 헤더 부분 */}
            <CustomBackHeader title={task.status === "COMPLETE" ? "완료한 일" : "미룬 일"} backRoute="/my-page">
            </CustomBackHeader>

            {/* Contents 부분 */}
            <div className="mb-8 mt-[65px] flex flex-col gap-5 items-center justify-center">
                {task.name}
                {/* Contents - 작업 개요 */}
                <div className="flex flex-col">
                    {/* Contents - 작업 개요 - 문구*/}
                    <div>
                        문구
                    </div>


                    {/* Contents - 작업 개요 - 작업 정보 */}
                    <div>
                        작업 정보
                    </div>
                </div>
            </div>
            
        </div>
    );

}