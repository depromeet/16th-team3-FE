import { useEffect, useRef, useState } from 'react';
import {
  KeenSliderOptions,
  TrackDetails,
  useKeenSlider,
} from 'keen-slider/react';
import './style.css';

const Wheel = (props: {
  initIdx?: number;
  label?: string;
  length: number;
  loop?: boolean;
  perspective?: 'left' | 'right' | 'center';
  width: number;
  setValue?: (relative: number, absolute: number) => string;
  onChange?: (currentValue: string | number) => void;
}) => {
  const perspective = 'center';
  const wheelSize = 20;
  const slides = props.length;
  const slideDegree = 360 / wheelSize;
  const slidesPerView = props.loop ? 9 : 1;
  const [sliderState, setSliderState] = useState<TrackDetails | null>(null);
  const size = useRef(0);
  const options = useRef<KeenSliderOptions>({
    slides: {
      number: slides,
      origin: 'center',
      perView: slidesPerView,
    },

    vertical: true,

    initial: props.initIdx || 0,
    loop: props.loop,
    dragSpeed: (val) => {
      const height = size.current;
      return (
        val *
        (height /
          ((height / 2) * Math.tan(slideDegree * (Math.PI / 180))) /
          slidesPerView)
      );
    },
    created: (s) => {
      size.current = s.size;
    },
    updated: (s) => {
      size.current = s.size;
    },
    detailsChanged: (s) => {
      const details = s.track.details;
      setSliderState(details);
      if (props.onChange) {
        const normalizedAbs =
          ((details.abs % props.length) + props.length) % props.length;
        const selected = props.setValue
          ? props.setValue(normalizedAbs, normalizedAbs)
          : normalizedAbs;
        props.onChange(selected);
      }
    },
    rubberband: !props.loop,
    mode: 'free-snap',
  });

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(options.current);

  const [radius, setRadius] = useState(0);

  useEffect(() => {
    if (slider.current) setRadius(slider.current.size / 2);
  }, [slider]);

  const slideValues = () => {
    if (!sliderState) return [];
    const offset = props.loop ? 1 / 2 - 1 / slidesPerView / 2 : 0;

    const values = [];
    for (let i = 0; i < slides; i++) {
      const distance = sliderState
        ? (sliderState.slides[i].distance - offset) * slidesPerView
        : 0;
      const rotate =
        Math.abs(distance) > wheelSize / 2
          ? 180
          : distance * (360 / wheelSize) * -1;
      const style = {
        transform: `rotateX(${rotate}deg) translateZ(${radius}px)`,
        WebkitTransform: `rotateX(${rotate}deg) translateZ(${radius}px)`,
      };
      const value = props.setValue
        ? props.setValue(
            i,
            (((sliderState.abs + Math.round(distance)) % props.length) +
              props.length) %
              props.length,
          )
        : i;
      values.push({ style, value });
    }
    return values;
  };

  return (
    <div
      className={'wheel keen-slider wheel--perspective-' + perspective}
      ref={sliderRef}
    >
      <div
        className="wheel__shadow-top text-disabled t2"
        style={{
          transform: `translateZ(${radius}px)`,
          WebkitTransform: `translateZ(${radius}px)`,
        }}
      />
      <div className="wheel__inner">
        <div className="wheel__slides t3" style={{ width: props.width + 'px' }}>
          {slideValues().map(({ style, value }, idx) => (
            <div className="wheel__slide text-strong" style={style} key={idx}>
              <span>{value}</span>
            </div>
          ))}
        </div>
        {props.label && (
          <div
            className="wheel__label text-strong"
            style={{
              transform: `translateZ(${radius}px)`,
              WebkitTransform: `translateZ(${radius}px)`,
            }}
          >
            {props.label}
          </div>
        )}
      </div>
      <div
        className="wheel__shadow-bottom text-disabled t3"
        style={{
          transform: `translateZ(${radius}px)`,
          WebkitTransform: `translateZ(${radius}px)`,
        }}
      />
    </div>
  );
};

export default Wheel;
