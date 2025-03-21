'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  imageUrl: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

// ! 기본 이미지가 사용되는 경우가 있을까? - 에러 상황일 때?
const DEFAULT_IMAGE = '/icons/mypage/default-profile.png';

const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl,
  alt = '프로필 이미지',
  width = 72,
  height = 72,
  className = 'rounded-full',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);

      const img = new (window as any).Image() as HTMLImageElement;
      img.src = imageUrl;

      img.onload = () => {
        setIsLoading(false);
        setIsError(false);
      };

      img.onerror = () => {
        setIsLoading(false);
        setIsError(true);
      };
    } else {
      setIsLoading(false);
    }
  }, [imageUrl]);

  return (
    <div style={{ width, height }} className="relative">
      {isLoading ? (
        <div
          className={`absolute inset-0 animate-pulse bg-gray-200 ${className}`}
          style={{ width, height }}
        ></div>
      ) : (
        <Image
          src={isError ? DEFAULT_IMAGE : imageUrl || DEFAULT_IMAGE}
          alt={alt}
          width={width}
          height={height}
          onLoadingComplete={() => setIsLoading(false)}
          className={`${className} transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          priority
        />
      )}
    </div>
  );
};

export default ProfileImage;
