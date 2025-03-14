import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  try {
    const response = await fetch(`${API_BASE_URL}/v1/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: '해당 할일을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '할일을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  try {
    // 토큰 검사
    if (!accessToken) {
      return NextResponse.json(
        { error: '인증 정보가 없습니다. 다시 로그인해주세요.' },
        { status: 401 },
      );
    }

    const apiUrl = `${API_BASE_URL}/v1/tasks/${taskId}`;
    console.log(`삭제 API 요청 URL: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 상세한 에러 로깅
    if (!response.ok) {
      const errorBody = await response.text().catch(() => '응답 내용 없음');
      console.error(`삭제 API 오류 응답 (${response.status}): ${errorBody}`);

      if (response.status === 404) {
        return NextResponse.json(
          { error: '해당 할일을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error: `할일 삭제 실패 (${response.status}): ${response.statusText}`,
          details: errorBody,
        },
        { status: response.status },
      );
    }

    console.log(`할일 삭제 성공: ${taskId}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('할일 삭제 중 예외 발생:', error);

    return NextResponse.json(
      {
        error: `할일을 삭제하는 중 서버 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
      },
      { status: 500 },
    );
  }
}
