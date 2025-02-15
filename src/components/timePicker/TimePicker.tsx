'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { cn } from '@/lib/utils';

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0'),
);
const periods = ['오전', '오후'];

export function TimePicker() {
  const [isClient, setIsClient] = useState(false);
  const [selectedTime, setSelectedTime] = useState({
    period: '오전',
    hour: 1,
    minute: '00',
  });

  const handleTimeChange = useCallback(
    (type: 'period' | 'hour' | 'minute', value: string | number) => {
      setSelectedTime((prev) => ({
        ...prev,
        [type]: value,
      }));
    },
    [],
  );

  const [periodSliderRef] = useKeenSlider<HTMLDivElement>({
    vertical: true,
    loop: true,
    mode: 'free-snap',
    slides: { origin: 'auto', perView: 2, spacing: 1 },
    slideChanged(slider) {
      handleTimeChange('period', periods[slider.track.details.rel]);
    },
  });

  const [hourSliderRef] = useKeenSlider<HTMLDivElement>({
    vertical: true,
    loop: true,
    mode: 'free-snap',
    slides: { origin: 'auto', perView: 12, spacing: 1 },
    slideChanged(slider) {
      handleTimeChange('hour', hours[slider.track.details.rel]);
    },
  });

  const [minuteSliderRef] = useKeenSlider<HTMLDivElement>({
    vertical: true,
    loop: true,
    mode: 'free-snap',
    slides: { origin: 'auto', perView: 60, spacing: 1 },
    slideChanged(slider) {
      handleTimeChange('minute', minutes[slider.track.details.rel]);
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="text-gray flex items-center justify-center gap-4 rounded-lg bg-white px-4 py-8 shadow-lg">
      {/* AM/PM Picker */}
      <div className="h-32 w-16 overflow-hidden">
        <div ref={periodSliderRef} className="wheel keen-slider flex flex-col">
          {periods.map((period, idx) => (
            <div
              key={idx}
              className={cn(
                'keen-slider__slide flex items-center justify-center text-lg font-bold',
                selectedTime.period === period
                  ? 'scale-110 font-bold text-blue-500'
                  : 'scale-90 text-gray-400 opacity-60',
              )}
            >
              {period}
            </div>
          ))}
        </div>
      </div>

      {/* Hour Picker */}
      <div className="h-32 w-16 overflow-hidden">
        <div ref={hourSliderRef} className="keen-slider flex flex-col">
          {hours.map((hour, idx) => (
            <div
              key={idx}
              className={cn(
                'keen-slider__slide flex items-center justify-center text-lg font-bold',
                selectedTime.hour === hour
                  ? 'scale-110 font-bold text-blue-500'
                  : 'scale-90 text-gray-400 opacity-60',
              )}
            >
              {hour}
            </div>
          ))}
        </div>
      </div>

      {/* Minute Picker */}
      <div className="h-32 w-16 overflow-hidden">
        <div ref={minuteSliderRef} className="keen-slider flex flex-col">
          {minutes.map((minute, idx) => (
            <div
              key={idx}
              className={cn(
                'keen-slider__slide flex items-center justify-center text-lg font-bold',
                selectedTime.minute === minute
                  ? 'scale-110 font-bold text-blue-500'
                  : 'scale-90 text-gray-400 opacity-60',
              )}
            >
              {minute}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
