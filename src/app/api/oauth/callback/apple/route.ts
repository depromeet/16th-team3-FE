import { AppleAuthorizationResponse } from '@/types/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body: AppleAuthorizationResponse = await req.json();
    const { code, idToken, user } = body;

    if (!code || !idToken) {
      return NextResponse.json(
        { error: 'Authorization code or id-token is missing' },
        { status: 400 },
      );
    }

    const deviceId = '0f365b39-c33d-39be-bdfc-74aaf55'; // ! TODO: 기기 id 동적 처리
    const deviceType = 'IOS'; // ! TODO: 기기 타입 동적 처리

    const oauthResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/login/apple`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authCode: code,
          nickname:
            user && user.name
              ? `${user.name.lastName}${user.name.firstName}`
              : null,
          email: user ? user.email : null,
          deviceId,
          deviceType,
        }),
      },
    );

    if (!oauthResponse.ok) {
      const errorData = await oauthResponse.json();
      return NextResponse.json(
        { error: 'Failed to authenticate', details: errorData },
        { status: oauthResponse.status },
      );
    }

    const data = await oauthResponse.json();
    const accessToken = data.jwtTokenDto.accessToken;
    const refreshToken = data.jwtTokenDto.refreshToken;
    const userData = data.memberInfo;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Tokens not found in the response' },
        { status: 500 },
      );
    }

    const nextResponse = NextResponse.json({
      success: true,
      userData: userData,
    });

    nextResponse.cookies.set('accessToken', accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60,
    });

    nextResponse.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return nextResponse;
  } catch (error) {
    console.error('Error in POST /auth:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
