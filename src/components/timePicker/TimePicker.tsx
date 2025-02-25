'use client';

import Picker from './Picker';
import { TimePickerType } from '@/types/time';

const hours = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, '0'),
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0'),
);
const meridiem = ['오전', '오후'];

const TimePicker = ({
  handleTemporaryTime,
}: {
  handleTemporaryTime: (time: (prev: TimePickerType) => TimePickerType) => void;
}) => {
  const handleSelectedMeridiem = (time: string) => {
    handleTemporaryTime((prev) => ({ ...prev, meridiem: time }));
  };

  const handleSelectedHour = (time: string) => {
    handleTemporaryTime((prev) => ({ ...prev, hour: time }));
  };

  const handleSelectedMinute = (time: string) => {
    handleTemporaryTime((prev) => ({ ...prev, minute: time }));
  };

  return (
    <div className="background-primary flex justify-center gap-6 p-4">
      <Picker list={meridiem} onSelectedChange={handleSelectedMeridiem} />
      <Picker list={hours} onSelectedChange={handleSelectedHour} />
      <Picker list={minutes} onSelectedChange={handleSelectedMinute} />
    </div>
  );
};

export default TimePicker;
