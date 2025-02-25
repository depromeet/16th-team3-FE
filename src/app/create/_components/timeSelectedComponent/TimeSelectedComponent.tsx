'use client';

import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../../../components/ui/drawer';
import { Button } from '@/components/ui/button';
import TimePicker from '@/components/timePicker/TimePicker';
import { TimePickerType } from '@/types/time';
import Toast from '@/components/toast/Toast';

interface TimeSelectedComponentProps {
  selectedTime: TimePickerType | undefined;
  handleTimeChange: (time: TimePickerType) => void;
}

const TimeSelectedComponent = ({
  selectedTime,
  handleTimeChange,
}: TimeSelectedComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [temporaryTime, setTemporaryTime] = useState<
    TimePickerType | undefined
  >(selectedTime);
  const [isFirstTouched, setIsFirstTouched] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleTemporaryTime = (time: TimePickerType) => {
    const now = new Date();

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToastMessage(null);

    setTemporaryTime(time);

    const selectedHour = parseInt(time.hour, 10);
    const selectedMinute = parseInt(time.minute, 10);
    let selected24Hour = selectedHour;

    if (time.meridiem === '오후' && selectedHour !== 12) {
      selected24Hour += 12;
    }
    if (time.meridiem === '오전' && selectedHour === 12) {
      selected24Hour = 0;
    }

    const selectedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      selected24Hour,
      selectedMinute,
      0,
    );

    if (selectedDate < now) {
      setToastMessage('현재 시간보다 이전 시간을 선택할 수 없어요.');
      setTimeout(() => {
        setToastMessage(null);
        toastTimeoutRef.current = null;
      }, 3000);
      return;
    }

    setIsFirstTouched(false);
  };

  const handleConfirmButtonClick = () => {
    if (temporaryTime === undefined) return;

    if (toastMessage) return;

    handleTimeChange(temporaryTime);
    setIsOpen(false);
    setIsFirstTouched(false);
  };

  const deadlineTime = selectedTime
    ? `${selectedTime.meridiem} ${selectedTime.hour}:${selectedTime.minute}`
    : '';

  return (
    <>
      <Drawer open={isOpen} dismissible={false}>
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
                마감시간 선택
              </span>
              <div className="flex w-full items-center justify-between pt-4">
                <span className="t3 text-base font-semibold">
                  {isFirstTouched ? '' : deadlineTime}
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
              마감시간을 선택해주세요
            </DrawerTitle>
          </DrawerHeader>
          <TimePicker time={temporaryTime} handleTime={handleTemporaryTime} />
          {toastMessage && <Toast message={toastMessage} />}
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
    </>
  );
};

export default TimeSelectedComponent;
