'use client';

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
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [isAppleSDKAvailable, setIsAppleSDKAvailable] = useState(false);

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

  const handleAppleLogin = () => {
    if (!isAppleSDKAvailable) return;
    window.AppleID.auth.signIn();
  };

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

  useEffect(() => {
    if (window.AppleID) {
      window.AppleID.auth.init({
        clientId: '...',
        redirectURI: '...',
        scope: 'email name',
        usePopup: true,
      });
      setIsAppleSDKAvailable(true);
    }
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <button onClick={kakaoLoginHandler} disabled={!isKakaoLoaded}>
        카카오 로그인
      </button>
      <button onClick={handleAppleLogin}>애플 로그인</button>
    </div>
  );
};

export default LoginPage;
