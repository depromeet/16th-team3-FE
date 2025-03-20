// app/lib/serverApi.ts
import ky from 'ky';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const REFRESH_ENDPOINT = '/v1/auth/token/refresh';
const UNAUTHORIZED_CODE = 401;

export const serverApi = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (response.status === UNAUTHORIZED_CODE || !accessToken) {
          try {
            const refreshResponse = await ky.post(
              `${process.env.NEXT_PUBLIC_API_URL}${REFRESH_ENDPOINT}`,
              {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  refreshToken: refreshToken,
                }),
                credentials: 'include',
              },
            );

            if (refreshResponse.ok) {
              const { accessToken: newAccessToken, refreshToken } =
                (await refreshResponse.json()) as {
                  accessToken: string;
                  refreshToken: string;
                };

              const nextResponse = NextResponse.next();

              nextResponse.cookies.set('accessToken', newAccessToken, {
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

              return serverApi(request, options);
            } else {
              return response;
            }
          } catch (error) {
            return response;
          }
        }
        return response;
      },
    ],
  },
});
