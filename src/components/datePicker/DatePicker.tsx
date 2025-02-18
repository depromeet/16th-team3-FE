'use client';

import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { PopoverContent } from '@/components/ui/popover';

interface DatePickerProps {
  selectedDate: Date | undefined;
  handleDateChange: (date: Date) => void;
}

const DatePicker = ({ selectedDate, handleDateChange }: DatePickerProps) => {
  return (
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && handleDateChange(date)}
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
    </PopoverContent>
  );
};

export default DatePicker;
