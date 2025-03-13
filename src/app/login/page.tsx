'use client';

import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store';
import { AppleAuthorizationResponse } from '@/types/auth';
import Image from 'next/image';
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

  const handleKakaoLogin = () => {
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
      console.log('🚀 ~ handleAppleLogin ~ response:', response);

      const oauthResponse = await fetch('/api/oauth/callback/apple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      });
      console.log('🚀 ~ handleAppleLogin ~ oauthResponse:', oauthResponse);

      if (!oauthResponse.ok) {
        const errorText = await oauthResponse.text();
        console.error('Error oauthResponse:', errorText);
        // 에러 처리 로직
        return;
      }
      const responseText = await oauthResponse.text();
      const oauthData = JSON.parse(responseText);
      console.log('Response text:', responseText);

      if (oauthData.success) {
        router.push('/home-page');
        setUser(oauthData.userData);
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
    <div className="flex h-screen flex-col justify-between bg-background-primary px-5 py-12">
      <div className="mt-[144px]">
        <div className="t2 text-strong">
          <p>
            미루는 당신을 위한
            <br />
            스퍼트에 오신 걸<br />
            환영합니다!
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <Button
          variant="default"
          className="l2 gap-2 rounded-[16px] bg-[#FEE500] text-[#0f1114]"
          onClick={handleKakaoLogin}
        >
          <Image
            src="/icons/login/kakao.svg"
            alt="카카오"
            width={18}
            height={17}
          />
          <span className="pt-0.5">카카오로 계속하기 1</span>
        </Button>

        <Button
          variant="default"
          className="l2 i gap-2 rounded-[16px] bg-[#e6edf8] text-[#0f1114]"
          onClick={handleAppleLogin}
        >
          <Image
            src="/icons/login/apple.svg"
            alt="애플"
            width={15}
            height={19}
          />
          <span className="pt-1">Apple로 계속하기 1</span>
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
