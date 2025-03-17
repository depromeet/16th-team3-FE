import ky from 'ky';
import Cookies from 'js-cookie';

const REFRESH_ENDPOINT = '/v1/auth/token/refresh';
const UNAUTHORIZED_CODE = 401;

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
          request.headers.set('Connection', 'keep-alive');
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        const accessToken = Cookies.get('accessToken');

        if (response.status === UNAUTHORIZED_CODE || !accessToken) {
          try {
            const refreshResponse = await ky.post(
              `${process.env.NEXT_PUBLIC_API_URL}${REFRESH_ENDPOINT}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Connection: 'keep-alive',
                },
                body: JSON.stringify({
                  refreshToken: Cookies.get('refreshToken'),
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

              Cookies.set('accessToken', newAccessToken);
              Cookies.set('refreshToken', refreshToken);

              return api(request, options);
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
