'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { Suspense } from 'react';

const KakaoTalk = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authCode = searchParams.get('code');

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
      } else {
        console.error('Failed to login');
      }
    },
    [router],
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
