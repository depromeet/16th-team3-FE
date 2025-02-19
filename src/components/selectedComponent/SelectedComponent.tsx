'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import DatePicker from '../datePicker/DatePicker';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';

interface SelectedComponentProps {
  selectedDate: Date | undefined;
  handleDateChange: (date: Date) => void;
}

const SelectedComponent = ({
  selectedDate,
  handleDateChange,
}: SelectedComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [temporaryDate, setTemporaryDate] = useState<Date | undefined>(
    selectedDate,
  );

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleTemporaryDate = (date: Date) => {
    setTemporaryDate(date);
  };

  return (
    <Drawer open={isOpen}>
      <DrawerTrigger>
        <div className="relative w-full">
          <button
            className="relative flex w-full flex-col items-start border-b border-gray-300 pb-2"
            onClick={handleToggle}
          >
            <span
              className={`absolute left-0 text-gray-500 transition-all duration-200 ${
                selectedDate !== undefined
                  ? 'top-[-14px] text-xs opacity-80'
                  : 'top-2 text-sm'
              }`}
            >
              마감일 선택
            </span>
            <div className="flex w-full items-center justify-between pt-4">
              <span className="text-base font-semibold">
                {selectedDate
                  ? format(selectedDate, 'M월 d일 (E)', { locale: ko })
                  : ''}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>
          <DrawerContent className="w-auto p-3">
            <DrawerHeader>
              <DrawerTitle>마감일을 선택해주세요</DrawerTitle>
            </DrawerHeader>
            <DatePicker
              selectedDate={temporaryDate}
              handleDateChange={handleTemporaryDate}
            />
            <DrawerFooter>
              <DrawerClose>
                <button
                  className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-[#1E2235] text-sm text-white"
                  onClick={() => {
                    if (temporaryDate) {
                      handleDateChange(temporaryDate);
                      setIsOpen(false);
                    }
                  }}
                >
                  확인
                </button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </div>
      </DrawerTrigger>
    </Drawer>
  );
};

export default SelectedComponent;
