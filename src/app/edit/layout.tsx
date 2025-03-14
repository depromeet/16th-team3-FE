'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import BackHeader from '@/components/backHeader/BackHeader';

const EditLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  return (
    <div className="background-primary flex h-screen w-full flex-col items-center justify-start overflow-y-auto px-5">
      <BackHeader onClick={() => router.back()} />
      {children}
    </div>
  );
};

export default EditLayout;
