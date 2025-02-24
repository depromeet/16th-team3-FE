'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const KakaoTalk = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authCode = searchParams.get('code');

  const loginMutation = async (authCode: string) => {
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
  };

  useEffect(() => {
    if (authCode) {
      loginMutation(authCode);
    }
  }, [authCode]);

  return (
    <div>
      <span>로그인 중...</span>
    </div>
  );
};

export default KakaoTalk;
