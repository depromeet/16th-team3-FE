import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ReactNode } from 'react';

interface ToastProps {
  icon?: ReactNode;
  message: string;
  className?: string;
}

const Toast = ({ icon, message, className }: ToastProps) => {
  return (
    <div
      className={cn(
        'absolute bottom-[120px] flex items-center gap-2 rounded-xl bg-component-gray-tertiary px-4 py-3 text-white',
        'mx-auto w-96 max-w-[90%]',
        className,
      )}
    >
      {icon || (
        <Image src="/icons/Error.svg" alt="error" width={20} height={20} />
      )}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default Toast;
