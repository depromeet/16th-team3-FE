import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { X } from 'lucide-react';

interface ClearableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClearableInput = ({
  className,
  value,
  onChange,
  ...props
}: ClearableInputProps) => {
  return (
    <div className="relative w-full">
      <span>할 일 입력</span>
      <Input
        className={cn('pr-10', className)}
        value={value}
        onChange={onChange}
        {...props}
      />

      {value && (
        <button
          type="button"
          className="absolute right-3 top-1/2 translate-y-1/4 text-black hover:text-gray-600"
          onClick={() =>
            onChange({
              target: { value: '' },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ClearableInput;
