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
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        console.log(response.body);
        if (response.status === UNAUTHORIZED_CODE) {
          try {
            console.log(Cookies.get('refreshToken'));
            const refreshResponse = await ky.post(
              `${process.env.NEXT_PUBLIC_API_URL}${REFRESH_ENDPOINT}`,
              {
                headers: {
                  'Content-Type': 'application/json',
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
