'use client';

import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { isBefore, startOfDay } from 'date-fns';
import Toast from '../toast/Toast';

interface DatePickerProps {
  selectedDate: Date | undefined;
  handleDateChange: (date: Date) => void;
}

const DatePicker = ({ selectedDate, handleDateChange }: DatePickerProps) => {
  const [showToast, setShowToast] = useState(false);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;

    if (isBefore(date, startOfDay(new Date()))) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    handleDateChange(date);
  };

  return (
    <>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelectDate}
        initialFocus
        locale={ko}
        classNames={{
          nav_button: cn(
            'h-7 w-7 bg-transparent p-0 hover:opacity-100 text-[#5981fa]',
          ),
        }}
        components={{
          IconLeft: () => (
            <ChevronLeft className="text-[#5981fa] opacity-100" />
          ),
          IconRight: () => (
            <ChevronRight className="text-[#5981fa] opacity-100" />
          ),
        }}
      />

      {showToast && (
        <div className="absolute bottom-[70px] left-1/2 -translate-x-1/2">
          <Toast message="마감일은 오늘 날짜 이후로 설정할 수 있어요." />
        </div>
      )}
    </>
  );
};

export default DatePicker;
