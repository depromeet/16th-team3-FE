'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setShowTooltip(false);
    } else {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      <header className="fixed top-0 left-0 right-0 bg-background-primary z-10">
        <div className="flex justify-between items-center px-[20px] py-[15px]">
          <Image
            src="/icons/home/spurt.svg"
            alt="SPURT"
            width={50}
            height={20}
            priority
            className="w-[50px]"
          />
          <Image
            src="/icons/home/mypage.svg"
            alt="My Page"
            width={20}
            height={20}
            className="w-[20px] h-[19px]"
          />
        </div>
        <div className="px-[20px] py-[11px]">
          <div className="flex space-x-4">
            <div>
              <span className="t3 text-text-normal">오늘 할일</span>{" "}
              <span className="s1 text-text-primary">0</span>
            </div>
            <div>
              <span className="t3 text-text-disabled">전체 할일</span>{" "}
              <span className="s1 text-text-disabled">0</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-24 mb-40 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-[50px] mt-[50px]">
            <Image
              src="/icons/home/rocket.svg"
              alt="Rocket"
              width={64}
              height={64}
              className="mx-auto w-auto h-auto"
            />
          </div>
          <h2 className="t3 mt-[8px] mb-[8px] text-text-strong">마감 할 일을 추가하고<br />바로 시작해볼까요?</h2>
          <p className="b3 text-text-alternative">
            미루지 않도록 알림을 보내 챙겨드릴게요.
          </p>
        </div>
      </main>

      <footer className="fixed bottom-8 left-0 right-0 bg-background-primary z-10">
        <div className="p-5 flex justify-end">
          {showTooltip && (
            <div className="b3 text-text-normal absolute bottom-24 right-4 bg-component-gray-tertiary rounded-lg px-6 py-3 b3">
              지금 바로 할 일을 추가해보세요!
            </div>
          )}
          <Button 
            variant="point" 
            size="md"
            className="l2 text-text-inverse flex items-center gap-2 rounded-full py-[16.5px]"
          >
            <Image
              src="/icons/home/plus.svg"
              alt="Add Task"
              width={16}
              height={16}
            />
            할일
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;