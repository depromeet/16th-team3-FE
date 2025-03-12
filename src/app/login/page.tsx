'use client';

import { useUserStore } from '@/store';
import { AppleAuthorizationResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Kakao?: any;
    AppleID?: any;
  }
}

const REDIRECT_URI_KAKAO = 'http://localhost:3000/oauth/callback/kakao';
const SCOPE_KAKAO = ['openid'].join(',');

const LoginPage = () => {
  const router = useRouter();
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  const { setUser } = useUserStore();

  const kakaoLoginHandler = () => {
    if (!isKakaoLoaded || !window.Kakao?.Auth) {
      console.error('Kakao SDK not loaded');
      return;
    }

    window.Kakao.Auth.authorize({
      redirectUri: REDIRECT_URI_KAKAO,
      scope: SCOPE_KAKAO,
    });
  };

  const handleAppleLogin = async () => {
    try {
      const response: AppleAuthorizationResponse =
        await window.AppleID.auth.signIn();

      const oauthResponse = await fetch('/api/oauth/callback/apple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify(response),
      }).then((res) => res.json());

      if (oauthResponse.success) {
        router.push('/home-page');
        setUser(oauthResponse.userData);
      } else {
        console.error('Failed to login');
      }
    } catch (err) {
      console.error('Apple login error: ', err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { AppleID } = window as any;
      if (AppleID) {
        AppleID.auth.init({
          clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
          scope: 'name email',
          redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!,
          usePopup: true,
        });
      }
    }
  }, []);

  useEffect(() => {
    const checkKakaoSDK = () => {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }
        setIsKakaoLoaded(true);
      }
    };

    checkKakaoSDK();
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <button onClick={kakaoLoginHandler} disabled={!isKakaoLoaded}>
        카카오 로그인
      </button>
      <button onClick={handleAppleLogin} style={{ cursor: 'pointer' }}>
        애플로 로그인
      </button>
    </div>
  );
};

export default LoginPage;
