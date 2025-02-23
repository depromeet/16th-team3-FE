import { cn } from '@/lib/utils';
import { InputHTMLAttributes, RefObject } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: RefObject<HTMLInputElement | null>;
}

const Input = ({ className, type, ref, ...props }: InputProps) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  );
};
Input.displayName = 'Input';

export { Input };
