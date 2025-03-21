import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type CreateTaskSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateTaskSheet: React.FC<CreateTaskSheetProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-70">
      <div className="animate-slide-up w-full rounded-t-[28px] bg-[#1F2024]">
        <div className="flex items-center justify-start p-5 pb-6 pt-12">
          <h3 className="t3 text-text-strong">마감할 일 추가하기</h3>
        </div>

        <div className="px-5">
          {/* 여유있게 시작 옵션 */}
          <Link href="/scheduled-create">
            <div
              className="mb-3 flex items-center overflow-hidden rounded-[20px]"
              onClick={onClose}
            >
              <div className="flex h-[32px] w-[32px] items-center justify-start">
                <Image
                  src="/icons/home/gp-clock.svg"
                  alt="Clock"
                  width={30}
                  height={30}
                />
              </div>
              <div className="flex h-[64px] flex-1 items-center justify-between pl-3">
                <div>
                  <h4 className="s1 font-medium text-text-normal">
                    여유있게 시작
                  </h4>
                </div>
                <div className="flex items-center">
                  <p className="b3 mr-3 text-text-neutral">
                    알림 받고 나중에 시작
                  </p>
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
          </Link>

          {/* 즉시 시작 옵션 */}
          <Link href="/instant-create">
            <div
              className="mb-8 flex items-center overflow-hidden rounded-[20px]"
              onClick={onClose}
            >
              <div className="flex h-[32px] w-[32px] items-center justify-start">
                <Image
                  src="/icons/home/heartfire.svg"
                  alt="Heart"
                  width={30}
                  height={30}
                />
              </div>
              <div className="flex h-[64px] flex-1 flex-row items-center justify-between pl-3">
                <div>
                  <h4 className="s1 font-medium text-text-normal">즉시 시작</h4>
                </div>
                <div className="flex items-center">
                  <p className="b3 mr-3 text-text-neutral">
                    알림 없이 바로 몰입
                  </p>
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
          </Link>

          {/* 닫기 버튼 */}
          <div className="my-6">
            <Button
              variant="primary"
              size="default"
              className="l2 z-10 w-full rounded-[16px] bg-component-accent-primary py-4 font-medium text-gray-strong"
              onClick={handleClose}
            >
              닫기
            </Button>
          </div>
        </div>

        <div className="w-full py-3">
          <div className="mx-auto h-1 w-16 rounded-full bg-[#373A45]"></div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskSheet;
