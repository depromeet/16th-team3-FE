import Image from "next/image";

interface CompletePhotoCardProps {
	capturedImage: string;
	actionText: string;
	time: string;
}

export default function CompletePhotoCard({
	capturedImage,
	actionText,
	time,
}: CompletePhotoCardProps) {
	return (
		<div className="rounded-2xl px-5">
			<div className="flex gap-3 rounded-2xl bg-[linear-gradient(180deg,rgba(121,121,235,0.3)_0%,rgba(121,121,235,0.1)_29.17%,rgba(121,121,235,0)_100%)] py-4 pl-4">
				<div className="flex gap-[14px]">
					<div className="relative h-[48px] w-[48px] overflow-hidden rounded-lg">
						<Image
							src={capturedImage}
							alt="인증 사진"
							fill
							className="object-cover rounded-[4px]"
							sizes="48px"
							priority
						/>
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-gray-strong text-lg font-semibold">
							{actionText}
						</p>
						<p className="text-b3 text-gray-neutral">{time}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
