import Countdown from '@/components/countdown/countdown';

interface TimerBadgeProps {
  dueDate: string;
}

export default function TimerBadge({ dueDate }: TimerBadgeProps) {
  return (
    <div className="relative mb-[22px] flex h-[45px] items-center justify-center overflow-hidden rounded-[12px] px-7 before:absolute before:inset-0 before:bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] before:[transform:scale(4,1)]">
      <div className="relative z-10 flex text-s3 text-gray-inverse">
        <p className="mr-1">마감까지 </p>
        <div className="relative inline-block">
          <span className="invisible tabular-nums">00000:00:00</span>
          <span className="absolute left-0 top-0 w-full text-center tabular-nums">
            <Countdown deadline={dueDate} />
          </span>
        </div>
        <p className="ml-1"> 남았어요</p>
      </div>
    </div>
  );
}
