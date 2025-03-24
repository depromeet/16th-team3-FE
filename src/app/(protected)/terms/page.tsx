"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PersonalInfoPage() {
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
				<div className="s2 w-full text-center text-gray-normal">이용약관</div>
			</div>

			{/* 개인정보 처리방침 내용 */}
			<div className="px-5 flex-1 overflow-y-auto">
				<div className="mb-[4.5px]">
					<h2 className="l4 text-gray-normal mb-2">약관 및 정책</h2>
					<p className="l5 text-gray-normal mb-4">
						「SPURT」 서비스는 「개인정보 보호법」 제 30조에 따라 정보주체의
						개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수
						있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립 공개합니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						이 개인정보처리방침은 2025년 4월 19일부터 적용됩니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">① 개인정보 수집과 이용</h2>
					<p className="l5 text-gray-normal">
						SPURT는 사용자로부터 직접 제공받는 정보와 서비스 사용 시 수집되는
						정보를 수집합니다. 수집하고 있는 개인정보는 다음의 목적 이외의
						용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보
						보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할
						예정입니다.
					</p>
					<p className="l5 text-gray-normal">
						SPURT에서 개인정보를 수집하여 처리하는 방법은 3가지 입니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						계정 생성 데이터: 사용자 이름, 프로필 사진을 수집합니다.
						<br />
						컨텐츠 데이터: 프로필 사진, 사진, 캡션, 댓글, 메시지를 수집합니다.
						<br />
						맞춤형 서비스 데이터: SPURT 서비스와 관련된 신고 내용, 설문조사
						응답, 지원 요청에 대해 응답하고 개선하는데 필요한 정보를 수집합니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						② 개인정보의 처리 및 보유 기간
					</h2>
					<p className="l5 text-gray-normal">
						SPURT는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
						개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
						개인정보를 처리·보유합니다.
					</p>
					<p className="l5 text-gray-normal">
						각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						서비스 회원가입 및 관리: 서비스 회원가입과 관련한 개인정보는
						수집.이용에 관한 동의일로부터 1년까지 위 이용목적을 위하여 보유 및
						이용됩니다.
						<br />
						보유 근거: 회원 자격 관리
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						③ 처리하는 개인정보의 항목
					</h2>
					<p className="l5 text-gray-normal">
						SPURT는 다음의 개인정보 항목을 처리하고 있습니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						홈페이지 회원가입 및 관리
						<br />
						필수항목 : 사용자 이름, 프로필 사진
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						④ 개인정보의 파기절차 및 파기방법
					</h2>
					<p className="l5 text-gray-normal">
						SPURT는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
						불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
					</p>
					<p className="l5 text-gray-normal">
						개인정보 파기의 절차 및 방법은 다음과 같습니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						파기절차: SPURT는 파기 사유가 발생한 개인정보를 선정하고, SPURT의
						개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.
						<br />
						파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적
						방법을 사용합니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						⑤ 정보주체와 법정대리인의 권리·의무 및 그 행사방법에 관한 사항
					</h2>
					<p className="l5 text-gray-normal">
						정보주체는 SPURT에 대해 언제든지 개인정보 열람·정정·삭제·처리정지
						요구 등의 권리를 행사할 수 있습니다.
					</p>
					<p className="l5 text-gray-normal">
						제1항에 따른 권리 행사는 SPURT에 대해 「개인정보 보호법」 시행령
						제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수
						있으며 SPURT는 이에 대해 지체 없이 조치하겠습니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등
						대리인을 통하여 하실 수 있습니다. 이 경우 "개인정보 처리 방법에 관한
						고시(제2020-7호)" 별지 제11호 서식에 따른 위임장을 제출하셔야
						합니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						⑥ 개인정보의 안전성 확보조치에 관한 사항
					</h2>
					<p className="l5 text-gray-normal">
						SPURT는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
						있습니다.
					</p>
					<p className="l5 text-gray-normal">
						개인정보에 대한 접근 제한: 개인정보를 처리하는 데이터베이스시스템에
						대한 접근권한의 부여,변경,말소를 통하여 개인정보에 대한 접근통제를
						위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여
						외부로부터의 무단 접근을 통제하고 있습니다.
					</p>
					<p className="l5 text-gray-normal">
						개인정보의 암호화: 이용자의 개인정보는 비밀번호는 암호화 되어 저장
						및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송
						데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도
						보안기능을 사용하고 있습니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						해킹 등에 대비한 기술적 대책: SPURT는 해킹이나 컴퓨터 바이러스 등에
						의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고
						주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을
						설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						⑦ 개인정보를 자동으로 수집하는 장치의 설치·운영 및 그 거부에 관한
						사항
					</h2>
					<p className="l5 text-gray-normalmb- 8">
						SPURT는 정보주체의 이용정보를 저장하고 수시로 불러오는
						'쿠키(cookie)'를 사용하지 않습니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						⑧ 행태정보의 수집·이용·제공 및 거부 등에 관한 사항
					</h2>
					<p className="l5 text-gray-normal mb-8">
						행태정보의 수집·이용·제공 및 거부등에 관한 사항
						<br />
						SPURT는 온라인 맞춤형 광고 등을 위한 행태정보를 수집·이용·제공하지
						않습니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						⑨ 추가적인 이용·제공 판단기준
					</h2>
					<p className="l5 text-gray-normal mb-8">
						SPURT는 ｢개인정보 보호법｣ 제15조제3항 및 제17조제4항에 따라
						｢개인정보 보호법 시행령｣ 제14조의2에 따른 사항을 고려하여 정보주체의
						동의 없이 개인정보를 추가적으로 이용·제공할 수 있습니다. 이에 따라
						SPURT는 정보주체의 동의 없이 추가적인 이용·제공을 하기 위해서 다음과
						같은 사항을 고려하였습니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						⑩ 가명정보를 처리하는 경우 가명정보 처리에 관한 사항
					</h2>
					<p className="l5 text-gray-normal mb-8">
						SPURT는 다음과 같은 목적으로 가명정보를 처리하고 있습니다.
						<br />
						가명정보의 처리 목적: 서비스 내 닉네임 항목 제공
						<br />
						가명정보의 처리 및 보유기간: 서비스 탈퇴시까지
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						⑪ 개인정보 보호책임자에 관한 사항
					</h2>
					<p className="l5 text-gray-normal">
						SPURT는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
						처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
						같이 개인정보 보호책임자를 지정하고 있습니다.
					</p>
					<p className="l5 text-gray-normal">
						• 개인정보 보호책임자
						<br />
						성명: 정현우
						<br />
						직책: 개인정보관리책임자
						<br />
						직급: CTO
						<br />
						연락처: tkrtmfl333@gmail.com
					</p>
					<p className="l5 text-gray-normal mb-8">
						정보주체께서는 SPURT의 서비스(또는 사업)을 이용하시면서 발생한 모든
						개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을
						개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. SPURT는
						정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						⑫ 개인정보의 열람청구를 접수·처리하는 부서
					</h2>
					<p className="l5 text-gray-normal mb-8">
						정보주체는 ｢개인정보 보호법｣ 제35조에 따른 개인정보의 열람 청구를
						아래의 부서에 할 수 있습니다. SPURT는 정보주체의 개인정보 열람청구가
						신속하게 처리되도록 노력하겠습니다.
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">
						⑬ 정보주체의 권익침해에 대한 구제방법
					</h2>
					<p className="l5 text-gray-normal">
						정보주체는 개인정보침해로 인한 구제를 받기 위하여
						개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
						분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타
						개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기
						바랍니다.
					</p>
					<p className="l5 text-gray-normal mb-8">
						개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)
						<br />
						개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)
						<br />
						대검찰청: (국번없이) 1301 (www.spo.go.kr)
						<br />
						경찰청: (국번없이) 182 (ecrm.cyber.go.kr)
					</p>
				</div>

				<div>
					<h2 className="l5 text-gray-normal mb-4">⑭ 개인정보 처리방침 변경</h2>
					<p className="l5 text-gray-normal mb-8">
						이 개인정보처리방침은 2025년 4월 19일부터 적용됩니다.
					</p>
				</div>
			</div>
		</div>
	);
}
