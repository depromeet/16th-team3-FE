'use client';

import useUserStore from '@/store/useUserStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { Suspense } from 'react';

const KakaoTalk = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authCode = searchParams.get('code');

  const { setUser } = useUserStore();

  const loginMutation = useCallback(
    async (authCode: string) => {
      const response = await fetch('/api/oauth/callback/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authCode }),
      }).then((res) => res.json());

      if (response.success) {
        router.push('/');
        setUser(response.userData);
      } else {
        console.error('Failed to login');
      }
    },
    [router, setUser],
  );

  useEffect(() => {
    if (authCode) {
      loginMutation(authCode);
    }
  }, [authCode, loginMutation]);

  return (
    <div>
      <span>로그인 중...</span>
    </div>
  );
};

const KakaoTalkPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KakaoTalk />
    </Suspense>
  );
};

export default KakaoTalkPage;
