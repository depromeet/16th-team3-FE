import RetrospectCard from './RetroSpectCard';

interface RetrospectSectionProps {
  satisfactionPercentage: number;
  concentrationPercentage: number;
}

export default function RetrospectSection({
  satisfactionPercentage,
  concentrationPercentage,
}: RetrospectSectionProps) {
  const SATISFACTION_RANGES = [
    { min: 81, max: 100, text: '완전 만족해요', style: 'text-hologram' },
    {
      min: 61,
      max: 80,
      text: '꽤 만족해요',
      style: 'text-component-accent-primary',
    },
    {
      min: 41,
      max: 60,
      text: '보통이에요',
      style: 'text-component-accent-primary',
    },
    {
      min: 21,
      max: 40,
      text: '조금 아쉬워요',
      style: 'text-component-accent-red',
    },
    {
      min: 0,
      max: 20,
      text: '많이 아쉬워요',
      style: 'text-component-accent-red',
    },
  ];

  const CONCENTRATION_RANGES = [
    { min: 81, max: 100, text: '완전 집중해요', style: 'text-hologram' },
    {
      min: 61,
      max: 80,
      text: '대체로 집중해요',
      style: 'text-component-accent-primary',
    },
    {
      min: 41,
      max: 60,
      text: '중간중간 산만해요',
      style: 'text-component-accent-primary',
    },
    {
      min: 21,
      max: 40,
      text: '거의 집중 못해요',
      style: 'text-component-accent-red',
    },
    {
      min: 0,
      max: 20,
      text: '전혀 집중 못해요',
      style: 'text-component-accent-red',
    },
  ];

  const getSatisfactionMessageWithStyle = (percentage: number) => {
    const range = SATISFACTION_RANGES.find(
      (r) => percentage >= r.min && percentage <= r.max,
    );
    return range || { text: '', style: '' };
  };

  const getConcentrationMessageWithStyle = (percentage: number) => {
    const range = CONCENTRATION_RANGES.find(
      (r) => percentage >= r.min && percentage <= r.max,
    );
    return range || { text: '', style: '' };
  };

  return (
    <div className="px-5">
      <div className="mb-4 text-s2 text-gray-normal">나의 회고</div>
      <div className="flex items-center justify-between gap-3">
        <RetrospectCard
          title="몰입 만족도"
          percentage={satisfactionPercentage}
          icon="♥"
          messageStyle={
            getSatisfactionMessageWithStyle(satisfactionPercentage).style
          }
          messageText={
            getSatisfactionMessageWithStyle(satisfactionPercentage).text
          }
        />
        <RetrospectCard
          title="몰입 집중도"
          percentage={concentrationPercentage}
          icon="✦"
          messageStyle={
            getConcentrationMessageWithStyle(concentrationPercentage).style
          }
          messageText={
            getConcentrationMessageWithStyle(concentrationPercentage).text
          }
        />
      </div>
    </div>
  );
}
