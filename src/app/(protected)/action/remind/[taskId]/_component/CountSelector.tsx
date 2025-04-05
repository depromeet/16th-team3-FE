import Image from 'next/image';

interface ReminderCountSelectorProps {
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

export default function ReminderCountSelector({
  count,
  onIncrease,
  onDecrease,
  min = 1,
  max = 3,
}: ReminderCountSelectorProps) {
  return (
    <div className="flex items-center justify-between px-5 py-[20.5px]">
      <p>다음 리마인더</p>
      <div className="flex h-8 w-[96px] items-center">
        <div
          className={`flex h-full w-1/3 cursor-pointer items-center justify-center rounded-[8px] text-center text-base leading-[145%] text-gray-normal bg-component-gray-secondary ${count === min || count === 0 ? 'opacity-40' : ''}`}
          onClick={onDecrease}
        >
          <Image
            src="/icons/remind/minus.svg"
            alt="왼쪽 화살표"
            width={16}
            height={16}
          />
        </div>
        <div className="flex h-full w-1/3 items-center justify-center rounded-[8px] text-center text-s2 text-gray-normal">
          {count}
        </div>
        <div
          className={`flex h-full w-1/3 cursor-pointer items-center justify-center rounded-[8px] text-center text-base leading-[145%] text-gray-normal bg-component-gray-secondary  ${count === max ? 'opacity-40' : ''}`}
          onClick={onIncrease}
        >
          <Image
            src="/icons/remind/plus.svg"
            alt="왼쪽 화살표"
            width={16}
            height={16}
          />
        </div>
      </div>
    </div>
  );
}
