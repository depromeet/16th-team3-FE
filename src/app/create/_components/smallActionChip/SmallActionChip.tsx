import { SmallActionKrType } from '@/types/create';
import Image from 'next/image';

interface SmallActionChipProps {
  smallAction: string;
}

const SMALL_ACTION_LABELS: Record<string, SmallActionKrType> = {
  SitAtTheDesk: '책상 앞에 앉기',
  TurnOnTheLaptop: '노트북 켜기',
  DrinkWater: '물 마시기',
};

const SmallActionChip = ({ smallAction }: SmallActionChipProps) => {
  return (
    <div className="box-border flex items-center gap-2 rounded-[6px] bg-component-gray-secondary px-3 py-2">
      <Image
        src={`/icons/${smallAction}.svg`}
        alt={smallAction}
        width={20}
        height={20}
        className="mt-[2px]"
      />
      <span className="l4">{SMALL_ACTION_LABELS[smallAction]}</span>
    </div>
  );
};

export default SmallActionChip;
