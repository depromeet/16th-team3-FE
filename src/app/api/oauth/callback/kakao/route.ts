import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authCode, deviceId, deviceType } = body;

    if (!authCode) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 },
      );
    }

    // * AccessToken을 headers에 담아서 보내는 요청이 아니어서 fetch를 사용함.
    const oauthResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authCode,
          provider: 'KAKAO',
          deviceId: deviceId || '0f365b39-c33d-39be-bdfc-74aaf55',
          deviceType: deviceType || 'IOS',
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
    const isNewUser = data.isNewUser;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Tokens not found in the response' },
        { status: 500 },
      );
    }

    const nextResponse = NextResponse.json({
      success: true,
      userData: userData,
      isNewUser: isNewUser,
    });

    nextResponse.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: true, // ! TODO: 앱 심사 받을 때, true로 변경 / 로컬(웹)에서 테스트할 떄, true로 변경 / 로컬(앱)에서 테스트할 때, false로 변경
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
