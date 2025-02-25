'use client';

import { useEffect, useRef, useState } from 'react';

interface PickerProps {
  list: string[];
  onSelectedChange?: (selected: string) => void;
}

const ITEM_HEIGHT = 50;
const DRAG_SENSITIVITY = 1.5;

const Picker = ({ list, onSelectedChange }: PickerProps) => {
  const newList = ['', ...list, ''];
  const ref = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const animationFrame = useRef<number | null>(null);

  const [selected, setSelected] = useState(0);
  const isInitialLoad = useRef(true);

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !ref.current) return;

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = requestAnimationFrame(() => {
      const deltaY = startY.current - e.touches[0].clientY;
      ref.current!.scrollTop += deltaY * DRAG_SENSITIVITY;
      startY.current = e.touches[0].clientY;
    });
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (!ref.current) return;

    let index = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
    index = Math.max(0, Math.min(index, newList.length - 2));

    setSelected(index);

    setTimeout(() => {
      ref.current?.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: 'smooth',
      });
    }, 10);

    if (onSelectedChange) {
      onSelectedChange(newList[index + 1]);
    }
  };

  useEffect(() => {
    if (ref.current && isInitialLoad.current) {
      isInitialLoad.current = false;
      ref.current.scrollTop = selected * ITEM_HEIGHT;

      setTimeout(() => {
        ref.current?.scrollTo({
          top: selected * ITEM_HEIGHT,
          behavior: 'smooth',
        });
      }, 10);
    }
  }, [selected]);

  return (
    <ul
      ref={ref}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="scrollbar-hide relative m-0 h-[150px] w-full list-none overflow-hidden p-0"
    >
      {newList.map((item, index) => (
        <li
          key={index}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className={`flex h-[50px] items-center justify-center transition-colors ${
            index === selected + 1
              ? 't3 font-bold text-white opacity-100'
              : 'opacity-40'
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default Picker;
