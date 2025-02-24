import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'No accessToken' }, { status: 401 });
  }

  const testResponse = await fetch('https://app.spurt.site/v1/oauth/test', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!testResponse.ok) {
    return NextResponse.json({ error: '' }, { status: testResponse.status });
  }

  const data = await testResponse.json();
  return NextResponse.json(data);
}
