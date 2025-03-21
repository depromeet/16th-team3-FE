'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ImmersionCompletePage() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col gap-4 bg-background-primary">
      <div className="mt-[220px] flex flex-col items-center gap-2">
        <Image src="/check.png" alt="logo" width={60} height={60} />
        <p className="text-t3">고생하셨어요!</p>
        <p className="text-t3">오늘도 끝내주게 몰입하셨군요!</p>
      </div>
      <div className="relative mt-auto flex flex-col items-center px-5 py-6">
        <Button
          variant="primary"
          className="relative mb-4 w-full"
          onClick={() => router.push('/')}
        >
          홈으로 이동하기
        </Button>
      </div>
    </div>
  );
}
