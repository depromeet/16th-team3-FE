"use client";

import CustomBackHeader from "@/components/customBackHeader/CustomBackHeader";
import { useExpiredTaskStore } from "@/store/useTaskStore";
import { TaskOrigin, TaskWithRetrospection } from "@/types/myPage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/component/Badge";
import { useUserStore } from "@/store";

type Props = {
    task: TaskWithRetrospection;
};

export default function ExpiredTaskDetailPage({task} :Props) {
    const router = useRouter();
    const { userData } = useUserStore();
    console.log(task);
    console.log(userData);

    const taskStatus = task.status === "COMPLETE" ? "COMPLETE" : "FAIL";

    const PHRASE = {
        COMPLETE : {
            topBar : "완료한 일",
            main: "잘 완료하셨어요!"
        },
        FAIL : {
            topBar : "미룬 일",
            main: "완료를 안하셨네요. 다음엔 꼭 완료해요!"
        }
    }

    return (
        <div className="flex min-h-screen flex-col pb-[34px] bg-background-primary">
            {/* 헤더 부분 */}
            <CustomBackHeader title={PHRASE[taskStatus].topBar} backRoute="/my-page">
            </CustomBackHeader>

            {/* Contents 부분 */}
            <div className="mb-8 mt-[54px] flex flex-col gap-5 mx-5 justify-center">
                {/* Contents - 작업 개요 */}
                <div className="flex flex-col">
                    {/* Contents - 작업 개요 - 문구*/}
                    <div className="t3 flex mt-4 mb-5 justify-start">
                        <p>
                            {task.name} <br />
                            {PHRASE[taskStatus].main}
                        </p>
                    </div>

                    {/* Contents - 작업 개요 - 작업 정보 */}
                    <div className="flex flex-col gap-6">
                        {/* Contents - 작업 개요 - 작업 정보 - 페르소나 */}
                        <div className="flex flex-col gap-3 justify-center">
                            <div className="relative flex w-full h-[120px] overflow-visible justify-center items-center">
                                <div className="absolute top-1/2 -translate-y-1/2 items-center">
                                    <Image
                                        src="/icons/mypage/mypage-character.png"
                                        alt="mypage-character"
                                        width={335}
                                        height={254}
                                    />
                                </div>
                            </div>
                            <div className="flex w-full justify-center">
                                <Badge>{task.personaName} {userData.nickname}</Badge>
                            </div>
                        </div>

                        {/* Contents - 작업 개요 - 작업 정보 - 페르소나 제외 작업 정보 */}
                        <div>

                        
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );

}