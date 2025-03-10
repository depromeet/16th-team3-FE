'use client';

import { api } from '@/lib/ky';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const { mutate: test } = useMutation({
    mutationFn: async () => await api.get('v1/auth/test'),
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
