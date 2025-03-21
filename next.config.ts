const nextConfig = {
  images: {
    domains: ['k.kakaocdn.net'], // 카카오 CDN 도메인 추가
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img1.kakaocdn.net',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: https:;",
  },
  // 기존 설정이 있다면 유지
};

module.exports = nextConfig;
