'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import DatePicker from '../../../../components/datePicker/DatePicker';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../../../components/ui/drawer';
import { Button } from '@/components/ui/button';

interface DateSelectedComponentProps {
  deadlineDate: Date | undefined;
  handleDateChange: (date: Date) => void;
}

const DateSelectedComponent = ({
  deadlineDate,
  handleDateChange,
}: DateSelectedComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [temporaryDate, setTemporaryDate] = useState<Date | undefined>(
    deadlineDate,
  );
  const [isFirstTouched, setIsFirstTouched] = useState(true);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleTemporaryDate = (date: Date) => {
    setTemporaryDate(date || new Date());
    setIsFirstTouched(false);
  };

  const handleConfirmButtonClick = () => {
    if (temporaryDate === undefined) return;

    handleDateChange(temporaryDate);
    setIsOpen(false);
    setIsFirstTouched(false);
  };

  return (
    <Drawer open={isOpen} onDrag={() => setIsOpen(false)}>
      <DrawerTrigger>
        <div className="relative mt-2 w-full">
          <div
            className="relative flex w-full flex-col items-start border-b border-gray-300 pb-2"
            onClick={handleToggle}
          >
            <span
              className={`absolute left-0 text-gray-500 transition-all duration-200 ${
                isFirstTouched ? 't3 top-1' : 'text-neutral b3 top-[-8px]'
              }`}
            >
              마감일 선택
            </span>
            <div className="flex w-full items-center justify-between pt-4">
              <span className="t3 text-base font-semibold">
                {isFirstTouched || !deadlineDate
                  ? ''
                  : format(deadlineDate, 'M월 d일 (E)', { locale: ko })}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="w-auto border-0 bg-component-gray-secondary px-5 pb-[33px] pt-2">
        <DrawerHeader className="px-0 pb-10 pt-6">
          <DrawerTitle className="t3 text-left">
            마감일을 선택해주세요
          </DrawerTitle>
        </DrawerHeader>
        <DatePicker
          deadlineDate={temporaryDate}
          handleDateChange={handleTemporaryDate}
        />
        <DrawerFooter className="px-0">
          <Button
            variant="primary"
            className="mt-4 flex w-full items-center justify-center"
            onClick={handleConfirmButtonClick}
          >
            확인
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DateSelectedComponent;
