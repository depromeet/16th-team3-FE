import { NextRequest, NextResponse } from 'next/server';

async function getNewAccessToken(refreshToken: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/token/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
        }),
      },
    );

    const data = await response.json();

    return {
      newAccessToken: data.jwtTokenDto.accessToken,
      newRefreshToken: data.jwtTokenDto.refreshToken,
    };
  } catch (error) {
    throw new Error('Error refreshing access token: ' + error);
  }
}

function checkAccessTokenExpired(accessToken?: string): boolean {
  if (!accessToken) return true;

  const tokenParts = accessToken.split('.');
  if (tokenParts.length !== 3) return true;

  try {
    const payload = JSON.parse(atob(tokenParts[1]));
    const exp = payload.exp;

    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch (e) {
    return true;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set('Content-Type', 'application/json');
  requestHeaders.set('Authorization', `Bearer ${accessToken}`);

  // ! Question: 이런 방식으로 accessToken의 만료 여부를 판단해도 괜찮을까?
  const isAccessTokenExpired = checkAccessTokenExpired(accessToken);

  if (!accessToken || !refreshToken || isAccessTokenExpired) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAccessTokenExpired && refreshToken) {
    try {
      const { newAccessToken, newRefreshToken } =
        await getNewAccessToken(refreshToken);

      const response = NextResponse.next();

      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 60,
      });

      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // * Next.js 내부 리소스를 제외한 모든 경로에 middleware 적용
  // * 로그인 페이지는 제외 - 제외하지 않으면 무한 리다이렉트 발생
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico|login).*)'],
};

export const runtime = 'nodejs';
