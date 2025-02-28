import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface BufferTimeProps {
  onClick: () => void;
}

const BufferTime = ({ onClick }: BufferTimeProps) => {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="relative mt-[30px]">
        <div className="flex flex-col items-center gap-3">
          <Image src="/icons/Bell.svg" alt="bell" width={60} height={60} />
          <div className="flex h-[26px] items-center justify-center rounded-[8px] bg-hologram px-[7px] py-[6px]">
            <span className="l6 text-inverse">1.5배의 여유시간 적용</span>
          </div>
        </div>
        <div className="bg-blur-purple absolute left-0 right-0 top-20 h-[240px] blur-[75px]" />
        <div className="mt-10 flex flex-col items-center">
          <div>
            <span className="t2 text-primary">{'3시간 30분 '}</span>
            <span className="t2 text-strong">전에는</span>
          </div>
          <span className="t2 text-strong">시작할 수 있게</span>
          <span className="t2 text-strong">작은 행동 알림을 보낼게요</span>
          <span className="b3 text-neutral mt-6">
            {'2월 10일 (토) 오후 7:30 '}첫 알림
          </span>
        </div>
      </div>
      <div className="pb-[46px] transition-all duration-300">
        <div className="mb-9 flex flex-col items-start gap-5">
          <span className="text-normal s2">{'PPT 만들고 대본 작성'}</span>
          <div className="flex w-full items-center justify-between">
            <span className="b2 text-alternative mt-[2px]">마감일</span>
            <div className="flex items-center">
              <span className="b2 text-neutral mt-[2px]">
                {'2월 10일 (월), 오후 09:00'}
              </span>
              <ChevronRight
                width={20}
                height={20}
                className="text-icon-secondary"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="b2 text-alternative mt-[2px]">작은 행동</span>
            <div className="flex items-center">
              <span className="b2 text-neutral mt-[2px]">{'노트북 켜기'}</span>
              <ChevronRight
                width={20}
                height={20}
                className="text-icon-secondary"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="b2 text-alternative mt-[2px]">예상 소요시간</span>
            <div className="flex items-center">
              <span className="b2 text-neutral mt-[2px]">{'2시간'}</span>
              <ChevronRight
                width={20}
                height={20}
                className="text-icon-secondary"
              />
            </div>
          </div>
        </div>
        <Button variant="primary" className="w-full" onClick={onClick}>
          다음
        </Button>
      </div>
    </div>
  );
};

export default BufferTime;
