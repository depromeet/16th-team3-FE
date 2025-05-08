"use client";

import Image from "next/image";
import { memo, useEffect, useState } from "react";

import DefaultSpurtyImage from "@public/icons/mypage/default-profile.png";

interface ProfileImageProps {
	imageUrl: string;
	alt?: string;
	width?: number;
	height?: number;
	className?: string;
}

const ProfileImage = ({
	imageUrl,
	alt = "프로필 이미지",
	width = 72,
	height = 72,
	className = "rounded-full",
}: ProfileImageProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	const isDefault = imageUrl.includes("default_profile.jpeg");

	useEffect(() => {
		if (imageUrl) {
			setIsLoading(true);

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
		<Image
			src={isError || isDefault ? DefaultSpurtyImage : imageUrl}
			alt={alt}
			width={width}
			height={height}
			onLoadingComplete={() => setIsLoading(false)}
			className={`${className} transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
			priority
		/>
	);
};

export default memo(ProfileImage);
