"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TermsPage() {
	const router = useRouter();

	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className="flex flex-col min-h-screen">
			<div className="px-5 py-[14px] relative flex items-center">
				<button onClick={handleGoBack} className="absolute left-5">
					<Image
						src="/icons/ArrowLeft.svg"
						alt="뒤로가기"
						width={24}
						height={24}
					/>
				</button>
				<div className="s2 w-full text-center text-gray-normal">
					개인정보 처리 방침
				</div>
			</div>

			{/* 이용약관 내용 */}
			<div className="px-5 flex-1 overflow-y-auto">
				<div className="mb-[4.5px]">
					<h2 className="l4 text-gray-normal mb-2">개인정보 처리방침</h2>
					<p className="l5 text-gray-normal">
						SPURT 서비스 이용약관설명에 앞서 'SPURT' 서비스를 이용해주셔서
						감사합니다!
					</p>
					<p className="l5 text-gray-normal mb-4">
						저희 'SPURT' 서비스는 쉽고 간편한 할일 등록과 알림, 몰입 서비스와
						기술을 만들고자 합니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						이 약관과 정책은 2025년 4월 19일 업데이트 되었습니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">① 목적</h2>
					<p className="l5 text-gray-normal mb-8">
						본 약관은 SPURT(이하 "회사")가 제공하는 'SPURT' 서비스의 이용과
						관련하여 "회사"와 회원간의 권리, 의무 및 책임사항 기타 필요한 사항을
						규정함을 목적으로 한다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">② 서비스 이용자(회원)</h2>
					<p className="l5 text-gray-normal mb-8">
						해당 서비스는 만 13세 이상부터 이용할 수 있으며, 직접 계정을 만들지
						않을 경우 다른 사람, 회사, 조직 정보 혹은 기타 법인을 대신하여
						계정을 생성할 수 있는 법적 권한이 있는 사람이어야 합니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						③ 데이터 보호 및 개인정보 보호
					</h2>
					<p className="l5 text-gray-normal mb-8">
						서비스 이용자는 계정 생성 데이터, 맞춤형 서비스 데이터를 'SPURT'와
						공유하고 이에 대해 정보를 수집, 사용, 저장, 처리, 공유하는 것에
						동의하게 됩니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">④ 콘텐츠</h2>
					<p className="l5 text-gray-normal">
						콘텐츠는 프로필 사진, 사진, 캡션, 댓글, 메시지를 의미합니다. 서비스
						이용자는 콘텐츠를 사용할 권리가 있고 법률, 규칙, 규정 및 사용자 계약
						준수 여부 확인을 포함하여 'SPURT' 서비스를 통해 공유하는 콘텐츠에
						대한 책임이 있습니다.
					</p>
					<p className="l5 text-gray-normal">
						사용 권한이 없거나 법률, 규칙, 규정 혹은 사용자 계약을 위반하는
						콘텐츠를 공유할 경우, 'SPURT' 서비스에서 이를 삭제할 권리가
						있습니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						서비스 이용자는 괴롭힘, 도발, 명예 훼손, 위협, 혐오 콘텐츠, 아동
						성적 착취, 성적 확대, 자살 혹은 자해 조장, 지적 재산 절도 또는 기타
						불법 행위를 할 수 없습니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">⑤ 위반 콘텐츠 신고</h2>
					<p className="l5 text-gray-normal">
						'SPURT' 서비스는 서비스 이용자가 공유하는 콘텐츠를 모니터링할 의무가
						없습니다. 타인의 권리를 침해하거나 법률, 규칙, 규정 또는 사용자
						계약을 준수하지 않는 콘텐츠('위반 콘텐츠')는 금지됩니다. 위반
						콘텐츠를 발견한 경우, 애플리케이션의 신고 기능을 이용할 수 있습니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						서비스 이용자가 공유하는 콘텐츠가 이용자의 지식 재산권을 침해하는
						방식으로 복사되었다고 생각하는 경우, 애플리케이션에서 직접 신고할 수
						있습니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">⑥ 서비스 종료</h2>
					<p className="l5 text-gray-normal mb-8">
						서비스 이용자가 공유하는 콘텐츠 중 위반 콘텐츠를 공유하거나 타인의
						권리를 침해하거나 법률, 규칙, 규정 또는 사용자 계약을 준수하지 않는
						방식으로 'SPURT' 서비스를 사용했다고 판단되는 경우 서비스 이용자의
						계정을 일시적 혹은 영구적으로 정지하고 서비스 이용을 차단할 수
						있습니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">⑦ 서비스 사용 라이선스</h2>
					<p className="l5 text-gray-normal">
						'SPURT'는 저작권, 상표, 영업 비밀 및 기타 법률에 의해 보호됩니다.
						서비스 이용자는 'SPURT' 브랜드와 관련된 모든 소유권을 사용할 권리가
						부여되지 않습니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						'SPURT' 서비스를 이용하는동안 서비스의 일부로 제공되는 소프트웨어를
						제공하며 서비스 이용자가 이용을 중단할 시 종료됩니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">⑧ 책임의 제한</h2>
					<p className="l5 text-gray-normal mb-8">
						서비스 이용자는 'SPURT' 회사, 직원, 라이선스 제공자, 책임이 국내에서
						허용되는 최대 범위로 제한된다는 데 동의하게 됩니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						⑨ 회원 탈퇴 및 회원 자격 상실
					</h2>
					<p className="l5 text-gray-normal mb-8">
						서비스 이용자는 언제든 서비스를 탈퇴를 요청할 수 있으며, 회원 탈퇴
						버튼을 통해 진행할 수 있습니다. 단, 회원을 탈퇴해도 작성한 게시물
						또는 공유된 콘텐츠는 자동 삭제되지 않습니다. 약관과 정책을 위반한
						경우 경고, 일시적 이용 정지 및 영구적 이용정지 등의 단계로 서비스
						이용을 제한할 수 있습니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">⑩ 분쟁의 해결</h2>
					<p className="l5 text-gray-normal mb-8">
						'SPURT'와 서비스 이용자는 서비스와 관련하여 발생한 분쟁을 원만하게
						해결하기 위해 필요한 모든 노력을 해야 합니다. 그럼에도 불구하고
						발생한 분쟁에 관한 소송은 민사소송법상 관할법원에 제소합니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">⑪ 연락처 또는 질문</h2>
					<p className="l5 text-gray-normal mb-8">
						서비스에 대한 의견은 언제든지 환영합니다. 서비스와 관련한 모든 질문,
						의견 등은 피드백 페이지 혹은 SPURT 메일 주소(tkrtmfl333@gmail.com)로
						문의할 수 있습니다.
					</p>
				</div>
			</div>
		</div>
	);
}
