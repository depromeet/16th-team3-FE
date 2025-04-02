"use client";

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header/Header";

export default function MyPage() {
    const router = useRouter();
    const userData = useUserStore((state) => state.userData);
    console.log(userData)

    return (
        <div className = "flex flex-col min-h-screen bg-backgroud-primary mx-5 mb-[34px]">
            {/* 헤더 부분 */}
            <Header 
                leftButton={{
                    icon: "home/arrow-left.svg",
                    isBack: true,
                }}
                title="마이페이지"
                rightButton={{
                    icon: "mypage/settings.svg",
                    isBack: false,
                    link: "/my-page/settings"
                }}
            />
            <div>마이 페이지</div>
        </div>
        
    )
}