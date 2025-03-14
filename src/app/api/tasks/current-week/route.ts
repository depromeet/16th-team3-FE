import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: '인증 토큰이 없습니다. 로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const mondayOfThisWeek = new Date(today);
    mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);
    mondayOfThisWeek.setHours(0, 0, 0, 0);
    
    const sundayOfThisWeek = new Date(mondayOfThisWeek);
    sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
    sundayOfThisWeek.setHours(23, 59, 59, 999);
    
    // URL에 쿼리 파라미터 추가
    const url = new URL(`${API_BASE_URL}/v1/tasks/current-week`);
    url.searchParams.append('startDate', mondayOfThisWeek.toISOString());
    url.searchParams.append('endDate', sundayOfThisWeek.toISOString());
    
    // 사용자 토큰으로 API 요청
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      next: { 
        revalidate: 60 
      }
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('이번주 할일 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '이번주 할일을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}