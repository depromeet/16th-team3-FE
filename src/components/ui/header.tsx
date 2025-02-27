'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background-primary z-10 flex items-center px-5 py-[14.5px]">
      <button onClick={() => router.back()}>
        <Image src="/icons/home/arrow-left.svg" alt="Back" width={18} height={16} />
      </button>
      <h1 className="s2 flex-1 text-center text-lg font-semibold text-text-normal">{title}</h1>
    </header>
  );
};

export default Header;
