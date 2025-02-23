import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
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
        'flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white',
        'mx-auto w-96 max-w-[90%]',
        className,
      )}
    >
      {icon || <AlertCircle className="h-5 w-5 text-red-400" />}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default Toast;
