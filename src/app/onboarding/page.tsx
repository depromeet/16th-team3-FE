'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const onboardingPages = [
    {
      title: '여유 시간을 1.5배 확보하고,\n후회 없이 끝내세요!',
      description:
        '1.5배 여유 시간을 자동 추가하여\n여유롭게 완료할 수 있도록 도와드립니다.',
      image: '/icons/onboarding/onboarding1.svg',
      buttonText: '다음으로',
    },
    {
      title: '1분 안에 작은 행동을 시작하면,\n미루기는 이제 그만!',
      description:
        '작은 행동을 시작하는 데 1분이면 충분해요.\n완료할 때까지 진동이 울려 시작을 도와드립니다.',
      image: '/icons/onboarding/onboarding2.svg',
      buttonText: '다음으로',
    },
    {
      title: '캐릭터와 플레이리스트로\n몰입을 더 깊게!',
      description:
        '작업 카워드를 기반으로 몰입 캐릭터를 활성화하여\n맞춤 환경과 음악을 제공합니다.',
      image: '/icons/onboarding/onboarding3.svg',
      buttonText: '다음으로',
    },
    {
      title: '미루지 않는 하루,\n지금부터 만들어볼까요?',
      description:
        '지금 당장 시작할 일과, 여유롭게 준비할 일을\n구분해 추가해보세요!',
      image: '/icons/onboarding/onboarding4.png',
      buttonText: '시작하기',
    },
  ];

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      router.push('/');
    }
  };

  const currentData = onboardingPages[currentPage];
  const isLastPage = currentPage === onboardingPages.length - 1;

  return (
    <div
      className={`flex h-full flex-col justify-between bg-background-primary px-5 pb-12 pt-[18.5px] ${
        isLastPage ? 'relative overflow-hidden' : ''
      }`}
    >
      {isLastPage && (
        <>
          <div className="fixed bottom-0 left-0 right-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />
        </>
      )}

      <div className="relative z-10 flex w-full gap-1">
        {onboardingPages.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full ${
              index <= currentPage ? 'bg-hologram' : 'bg-line-secondary'
            } transition-all duration-300`}
          />
        ))}
      </div>

      {isLastPage ? (
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center">
            <Image
              src="/icons/onboarding/onboarding4.png"
              alt="온보딩 이미지 4"
              width={142}
              height={80}
              className="mb-[60px]"
              priority
            />

            <h1 className="t1 mb-3 text-center text-gray-strong">
              미루지 않는 하루,
              <br />
              지금부터 만들어볼까요?
            </h1>
            <p className="b2 text-center text-gray-neutral">
              지금 당장 시작할 일과, 여유롭게 준비할 일을
              <br />
              구분해 추가해보세요!
            </p>
          </div>

          <Button
            variant="hologram"
            className="w-full rounded-[16px] py-4 text-gray-inverse"
            onClick={handleNext}
          >
            시작하기
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-[60px] flex flex-col">
            <h1 className="t2 whitespace-pre-line text-gray-strong">
              {currentData.title}
            </h1>
            <p className="b2 mt-3 whitespace-pre-line text-gray-neutral">
              {currentData.description}
            </p>
          </div>

          <div className="flex flex-1 flex-col justify-end">
            <div className="mb-3 flex justify-center">
              <Image
                src={currentData.image}
                alt={`온보딩 이미지 ${currentPage + 1}`}
                width={240}
                height={500}
                priority
              />
            </div>

            <Button
              variant="primary"
              className="w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
              onClick={handleNext}
            >
              {currentData.buttonText}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
