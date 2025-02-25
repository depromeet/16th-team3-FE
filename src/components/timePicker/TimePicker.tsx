'use client';

import Picker from './Picker';
import { TimePickerType } from '@/types/time';

interface TimePickerProps {
  time: TimePickerType | undefined;
  handleTime: (time: TimePickerType) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, '0'),
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0'),
);
const MERIDIEM = ['오전', '오후'];

const TimePicker = ({ time, handleTime }: TimePickerProps) => {
  const handleSelectedMeridiem = (selectedTime: string) => {
    handleTime({
      meridiem: selectedTime,
      hour: time?.hour || '01',
      minute: time?.minute || '00',
    });
  };

  const handleSelectedHour = (selectedTime: string) => {
    handleTime({
      meridiem: time?.meridiem || '오전',
      hour: selectedTime,
      minute: time?.minute || '00',
    });
  };

  const handleSelectedMinute = (selectedTime: string) => {
    handleTime({
      meridiem: time?.meridiem || '오전',
      hour: time?.hour || '01',
      minute: selectedTime,
    });
  };

  return (
    <div className="background-primary flex justify-center gap-6">
      <Picker list={MERIDIEM} onSelectedChange={handleSelectedMeridiem} />
      <Picker list={HOURS} onSelectedChange={handleSelectedHour} />
      <Picker list={MINUTES} onSelectedChange={handleSelectedMinute} />
    </div>
  );
};

export default TimePicker;
