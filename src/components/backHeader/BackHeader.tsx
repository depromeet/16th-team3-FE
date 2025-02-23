import Image from 'next/image';

const BackHeader = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="w-full py-[14px]">
      <Image
        src="/icons/ArrowLeft.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        onClick={onClick}
      />
    </div>
  );
};

export default BackHeader;
