'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const { mutate: test } = useMutation({
    mutationFn: async () =>
      await fetch('/api/oauth/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }),
  });

  return (
    <div>
      <div>홈 화면</div>
      <div>
        <button onClick={() => router.push('/login')}>
          로그인 페이지로 이동
        </button>
      </div>
      <button onClick={() => test()}>test</button>
    </div>
  );
};

export default HomePage;
