import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type CreateTaskSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateTaskSheet: React.FC<CreateTaskSheetProps> = ({
  isOpen,
  onClose
}) => {
  const router = useRouter();
  
  if (!isOpen) return null;

  const handleLeisurelyStart = () => {
    router.push('/scheduled-create');
    onClose();
  };

  const handleImmediateStart = () => {
    router.push('/instant-create');
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-end">
      <div className="bg-[#1F2024] rounded-t-[28px] w-full animate-slide-up">
        <div className="flex justify-start items-center p-5 pb-6 pt-12">
          <h3 className="t3 text-text-strong">마감할 일 추가하기</h3>
        </div>
        
        <div className="px-5">
          {/* 여유있게 시작 옵션 */}
          <div 
            className="flex items-center mb-3 rounded-[20px] overflow-hidden"
            onClick={handleLeisurelyStart}
          >
            <div className="w-[32px] h-[32px] flex items-center justify-start">
              <Image
                src="/icons/home/gp-clock.svg"
                alt="Clock"
                width={30}
                height={30}
              />
            </div>
            <div className="flex-1 h-[64px] pl-3 flex items-center justify-between">
              <div>
                <h4 className="s1 text-text-normal font-medium">여유있게 시작</h4>
              </div>
              <div className="flex items-center">
                <p className="b3 text-text-neutral mr-3">알림 받고 나중에 시작</p>
                <div className="text-text-neutral">
                  <Image
                    src="/icons/home/arrow-right.svg"
                    alt="Arrow"
                    width={7}
                    height={12}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* 즉시 시작 옵션 */}
          <div 
            className="flex items-center mb-8 rounded-[20px] overflow-hidden"
            onClick={handleImmediateStart}
          >
            <div className="w-[32px] h-[32px] flex items-center justify-start">
              <Image
                src="/icons/home/heartfire.svg"
                alt="Heart"
                width={30}
                height={30}
              />
            </div>
            <div className="flex-1 h-[64px] pl-3 flex items-center justify-between flex-row">
              <div>
                <h4 className="s1 text-text-normal font-medium">즉시 시작</h4>
              </div>
              <div className="flex items-center">
                <p className="b3 text-text-neutral mr-3">알림 없이 바로 몰입</p>
                <div className="text-text-neutral">
                  <Image
                    src="/icons/home/arrow-right.svg"
                    alt="Arrow"
                    width={7}
                    height={12}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* 닫기 버튼 */}
          <div className="my-6">
            <Button 
              variant="primary"
              size="default"
              className="l2 w-full z-10 text-gray-strong bg-component-accent-primary rounded-[16px] py-4 font-medium"
              onClick={handleClose}
            >
              닫기
            </Button>
          </div>
        </div>

        <div className="w-full py-3">
          <div className="w-16 h-1 mx-auto bg-[#373A45] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskSheet;