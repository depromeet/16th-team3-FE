import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { BufferTimeDataType } from '@/types/create';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface BufferTimeProps {
  context: BufferTimeDataType;
  handleDeadlineModify: () => void;
  handleSmallActionModify: () => void;
  handleEstimatedTimeModify: () => void;
  onNext: () => void;
}

const BufferTime = ({
  context,
  handleDeadlineModify,
  handleSmallActionModify,
  handleEstimatedTimeModify,
  onNext,
}: BufferTimeProps) => {
  const {
    task,
    deadlineDate,
    deadlineTime,
    smallAction,
    estimatedHour,
    estimatedMinute,
    estimatedDay,
  } = context;

  const formattedDate = format(deadlineDate, 'M월 d일 (E)', { locale: ko });

  const getBufferTime = (
    estimatedHour: string,
    estimatedMinute: string,
    scale: number = 1.5,
  ) => {
    const hours = Number(estimatedHour);
    const minutes = Number(estimatedMinute);
    const totalMinutes = hours * 60 + minutes;

    const scaledMinutes = totalMinutes * scale;

    const finalHours = Math.floor(scaledMinutes / 60);
    const finalMinutes = Math.round(scaledMinutes % 60);

    return { finalHours, finalMinutes };
  };

  const { finalHours, finalMinutes } = getBufferTime(
    estimatedHour,
    estimatedMinute,
  );

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="relative mt-[30px]">
        <div className="flex flex-col items-center gap-3">
          <Image src="/icons/Bell.svg" alt="bell" width={60} height={60} />
          <div className="relative flex h-[26px] items-center justify-center overflow-hidden rounded-[8px] px-[7px] py-[6px] text-black before:absolute before:inset-0 before:-z-10 before:bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] before:[transform:scale(4,1)]">
            <span className="l6 text-inverse">1.5배의 여유시간 적용</span>
          </div>
        </div>
        <div className="bg-blur-purple absolute left-0 right-0 top-20 h-[240px] blur-[75px]" />
        <div className="mt-10 flex flex-col items-center">
          <div>
            <span className="t2 text-primary">
              {[
                finalHours > 0 && `${finalHours}시간`,
                finalMinutes > 0 && `${finalMinutes}분`,
              ]
                .filter(Boolean)
                .join(' ')}
            </span>
            <span className="t2 text-strong"> 전에는</span>
          </div>
          <span className="t2 text-strong">시작할 수 있게</span>
          <span className="t2 text-strong">작은 행동 알림을 보낼게요</span>
          <span className="b3 text-neutral mt-6">
            {`${formattedDate} ${deadlineTime.meridiem} ${deadlineTime.hour}:${deadlineTime.minute}`}{' '}
            첫 알림
          </span>
        </div>
      </div>
      <div className="pb-[46px] transition-all duration-300">
        <div className="mb-9 flex flex-col items-start gap-5">
          <span className="text-normal s2">{task}</span>
          <div className="flex w-full items-center justify-between">
            <span className="b2 text-alternative mt-[2px]">마감일</span>
            <div className="flex items-center" onClick={handleDeadlineModify}>
              <span className="b2 text-neutral mt-[2px]">
                {`${formattedDate}, ${deadlineTime.meridiem} ${deadlineTime.hour}:${deadlineTime.minute}`}
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
            <div
              className="flex items-center"
              onClick={handleSmallActionModify}
            >
              <span className="b2 text-neutral mt-[2px]">{smallAction}</span>
              <ChevronRight
                width={20}
                height={20}
                className="text-icon-secondary"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="b2 text-alternative mt-[2px]">예상 소요시간</span>
            <div
              className="flex items-center"
              onClick={handleEstimatedTimeModify}
            >
              <span className="b2 text-neutral mt-[2px]">
                {[
                  estimatedHour && `${estimatedHour}시간`,
                  estimatedMinute && `${estimatedMinute}분`,
                  estimatedDay && `${estimatedDay}일`,
                ]
                  .filter(Boolean)
                  .join(' ')}
              </span>
              <ChevronRight
                width={20}
                height={20}
                className="text-icon-secondary"
              />
            </div>
          </div>
        </div>
        <Button variant="primary" className="w-full" onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
};

export default BufferTime;
