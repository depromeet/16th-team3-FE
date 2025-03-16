'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie';

export default function SplashPage() {
  const router = useRouter();
  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (accessToken) {
        router.push('/home-page');
        return;
      }
      router.push('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, accessToken]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background-primary">
      <div className="fixed bottom-0 left-0 right-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />
      <div className="z-10 flex flex-col items-center justify-center gap-6 text-center text-white">
        <div className="text-center">
          <p className="t2">
            <span className="bg-hologram bg-clip-text text-transparent">
              미루는 당신을 위한
            </span>
          </p>
          <p className="t2">
            <span className="bg-hologram bg-clip-text text-transparent">
              마지막 스퍼트
            </span>
          </p>
        </div>
        <Image
          src="/icons/splash/splash-logo.svg"
          alt="SPURT"
          width={108}
          height={41}
          priority
          className="mb-40"
        />
      </div>
    </div>
  );
}
