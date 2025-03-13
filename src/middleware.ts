import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // * Next.js 내부 리소스를 제외한 모든 경로에 middleware 적용
  // * 로그인 페이지는 제외 - 제외하지 않으면 무한 리다이렉트 발생
  matcher: ['/', '/((?!_next/static|favicon.ico|login|icons).*)'],
};

export const runtime = 'nodejs';
