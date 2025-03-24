import Image from "next/image";

export default function PushHeader({
	content,
}: {
	content: { icon: string; message: string; subMessage: string };
}) {
	return (
		<div className="mt-[50px] flex flex-col items-center justify-center gap-3 px-5 pb-10 pt-5">
			<Image src={content.icon} alt="아이콘" width={40} height={40} />
			<p className="text-s2 text-component-accent-primary whitespace-pre-line">
				{content.message}
			</p>
			<p className="text-t2 text-gray-strong whitespace-pre-line text-center">
				{content.subMessage}
			</p>
		</div>
	);
}
