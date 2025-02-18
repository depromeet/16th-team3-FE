'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import DatePicker from '../datePicker/DatePicker';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';

interface SelectedComponentProps {
  selectedDate: Date | undefined;
  handleDateChange: (date: Date) => void;
}

const SelectedComponent = ({
  selectedDate,
  handleDateChange,
}: SelectedComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setIsFocused((prev) => !prev);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <button
            className="relative flex w-full flex-col items-start border-b border-gray-300 pb-2"
            onClick={handleToggle}
          >
            <span
              className={`absolute left-0 text-gray-500 transition-all duration-200 ${
                selectedDate !== undefined || isFocused
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

          {isOpen && (
            <DatePicker
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
            />
          )}
        </div>
      </PopoverTrigger>
    </Popover>
  );
};

export default SelectedComponent;
