'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao?: any;
  }
}

const redirectUri = 'http://localhost:3000/oauth/callback/kakao';
const scope = ['openid'].join(',');

const LoginPage = () => {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  const kakaoLoginHandler = () => {
    if (!isKakaoLoaded || !window.Kakao?.Auth) {
      console.error('Kakao SDK not loaded');
      return;
    }

    window.Kakao.Auth.authorize({
      redirectUri,
      scope,
    });
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

  return (
    <div>
      <button onClick={kakaoLoginHandler} disabled={!isKakaoLoaded}>
        카카오 로그인
      </button>
    </div>
  );
};

export default LoginPage;
