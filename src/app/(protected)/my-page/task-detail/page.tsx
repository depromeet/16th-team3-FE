"use client";

import CustomBackHeader from "@/components/customBackHeader/CustomBackHeader";
import { useExpiredTaskStore } from "@/store/useTaskStore";
import { TaskOrigin } from "@/types/myPage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ExpiredTaskDetailPage() {
    const router = useRouter();
    const currentTask = useExpiredTaskStore((state) => state.currentTask);
    // if (!currentTask) {
    //     router.push("/my-page");
    // }
    const task = currentTask as TaskOrigin;
    console.log(task)


    return (
        <div className="flex min-h-screen flex-col pb-[34px]">
            {/* 헤더 부분 */}
			<CustomBackHeader title={task.status === "COMPLETE" ? "완료한 일" : "미룬 일"} backRoute="/my-page">
			</CustomBackHeader>
            <div className="mb-8 mt-[65px] flex flex-col items-center justify-center bg-background-purple">
                {task.name}
            </div>
            
        </div>
    );

}