"use client";

import CustomBackHeader from "@/components/customBackHeader/CustomBackHeader";
import { useExpiredTaskStore } from "@/store/useTaskStore";
import { TaskOrigin, TaskWithRetrospection } from "@/types/myPage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/component/Badge";
import { useUserStore } from "@/store";
import { convertIsoToMonthDayTimeText, formatTimeFromMinutes } from "@/utils/dateFormat";

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

    const keys = [
        {
            name: "작은 행동",
            onlyComplete: false,
            content: task.triggerAction
        },
        {
            name: "예상 소요시간",
            onlyComplete: false,
            content: formatTimeFromMinutes(task.estimatedTime)
        },
        {
            name: "마감일",
            onlyComplete: false,
            content: convertIsoToMonthDayTimeText(task.dueDateTime)
        }
    ]

    const filtered = keys.filter((item) => {
        if (!item.onlyComplete) {
          return item.onlyComplete === false;
        }
        // onlyComplete === true 인 경우, 조건 함수까지 만족해야 함
        return item.onlyComplete === true && taskStatus === "COMPLETE";
      });

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
                            {task.name} <br />  {/* TODO: 이 task.name 이 새로고침 해야 나옴.. 뭔가 고쳐야 함*/}
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
                        <div className="flex flex-col gap-4 p-5 bg-component-gray-secondary rounded-[16px]">
                            {keys.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center w-full"
                                >
                                    <span className="b3 text-gray-alternative">{item.name}</span>
                                    <span className="b3 text-gray-normal">{item.content}</span>
                                </div>
                            ))}
                                {/* 완료일 정보는 따로 */}
                                {
                                    taskStatus === "COMPLETE" &&
                                    <div className="flex justify-between items-center w-full">
                                        <span className="b3 text-gray-alternative">완료 일</span>
                                        <div className="inline-flex gap-1 items-center">
                                            <Image
                                                src="/icons/mypage/clap.svg"
                                                alt="mypage-character"
                                                width={23}
                                                height={23}
                                            />
                                            <span className="b3 font-semibold text-component-accent-primary"> {/* TODO: text-component-accent-secondary가 없는듯.. + semibold 적용 안되는 듯*/}{convertIsoToMonthDayTimeText(task.updatedAt)}</span>
                                            <Image
                                                src="/icons/mypage/clap.svg"
                                                alt="mypage-character"
                                                width={23}
                                                height={23}
                                            />
                                        </div>
                                    </div>
                                }
                        
                        </div>
                    </div>
                </div>

                {/* Contents - 작업 회고 내용 */}
                <div className="flex flex-col">
                    {/* Contents - 작업 회고 내용 - 제목 문구 */}
                    <div >
                        <div className="t3 flex my-3 justify-start">
                            <p>나의 회고</p>
                        </div>
                    </div>

                    {/* Contents - 작업 회고 내용 - 회고 내용 */}
                    <div>

                    </div>
                </div>
            </div>
            
        </div>
    );

}