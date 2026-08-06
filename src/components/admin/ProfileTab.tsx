import React from 'react';
import { Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { DEFAULT_PROFILE_IMG, DEFAULT_LOGO_IMG } from './adminUtils';

interface ProfileTabProps {
  currentUser: any;
  editPlannerName: string;
  setEditPlannerName: (val: string) => void;
  editCustomPhone: string;
  setEditCustomPhone: (val: string) => void;
  editKakao: string;
  setEditKakao: (val: string) => void;
  showKakaoHelpEdit: boolean;
  setShowKakaoHelpEdit: (val: boolean) => void;
  editEmail: string;
  setEditEmail: (val: string) => void;
  editRegistrationNumber: string;
  setEditRegistrationNumber: (val: string) => void;
  editAgencyRegistrationNumber?: string;
  setEditAgencyRegistrationNumber?: (val: string) => void;
  editPassword: string;
  setEditPassword: (val: string) => void;
  editProfileImg: string;
  setEditProfileImg: (val: string) => void;
  editLogoUrl: string;
  setEditLogoUrl: (val: string) => void;
  editGreetingTitle: string;
  setEditGreetingTitle: (val: string) => void;
  editGreetingContent: string;
  setEditGreetingContent: (val: string) => void;
  editCompanyName: string;
  setEditCompanyName: (val: string) => void;
  editAgencyCode?: string;
  setEditAgencyCode?: (val: string) => void;
  agencyCodeCheckStatus?: 'idle' | 'checking' | 'available' | 'taken';
  setAgencyCodeCheckStatus?: (status: 'idle' | 'checking' | 'available' | 'taken') => void;
  checkAgencyCodeAvailability?: () => Promise<void>;
  editCustomAddress: string;
  setEditCustomAddress: (val: string) => void;
  editCertificationMessage: string;
  setEditCertificationMessage: (val: string) => void;
  pushStatus: 'unsupported' | 'loading' | 'default' | 'denied' | 'granted' | 'registered';
  isTestPushSending: boolean;
  loading: boolean;
  handleSaveProfile: (e: React.FormEvent) => Promise<void>;
  handleProfileUpload: (e: React.ChangeEvent<HTMLInputElement>, isReg: boolean) => Promise<void>;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>, isReg: boolean) => Promise<void>;
  handleSubscribePush: () => Promise<void>;
  handleSendTestPush: () => Promise<void>;
  showHelpGuide: boolean;
  renderHelpGuideToggle: () => React.ReactNode;
}

export function ProfileTab({
  currentUser,
  editPlannerName,
  setEditPlannerName,
  editCustomPhone,
  setEditCustomPhone,
  editKakao,
  setEditKakao,
  showKakaoHelpEdit,
  setShowKakaoHelpEdit,
  editEmail,
  setEditEmail,
  editRegistrationNumber,
  setEditRegistrationNumber,
  editAgencyRegistrationNumber = '',
  setEditAgencyRegistrationNumber = () => {},
  editPassword,
  setEditPassword,
  editProfileImg,
  setEditProfileImg,
  editLogoUrl,
  setEditLogoUrl,
  editGreetingTitle,
  setEditGreetingTitle,
  editGreetingContent,
  setEditGreetingContent,
  editCompanyName,
  setEditCompanyName,
  editAgencyCode,
  setEditAgencyCode,
  agencyCodeCheckStatus,
  setAgencyCodeCheckStatus,
  checkAgencyCodeAvailability,
  editCustomAddress,
  setEditCustomAddress,
  editCertificationMessage,
  setEditCertificationMessage,
  pushStatus,
  isTestPushSending,
  loading,
  handleSaveProfile,
  handleProfileUpload,
  handleLogoUpload,
  handleSubscribePush,
  handleSendTestPush,
  showHelpGuide,
  renderHelpGuideToggle
}: ProfileTabProps) {

  const formatAgencyCode = (codeOrId: string) => {
    if (!codeOrId) return '';
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(codeOrId);
    if (isUuid) {
      return codeOrId.substring(0, 8);
    }
    return codeOrId;
  };

  const myHomepageUrl = currentUser.role === 'super'
    ? `${window.location.origin}/`
    : currentUser.role === 'planner'
      ? `${window.location.origin}/${currentUser.plannerCode || ''}`
      : `${window.location.origin}/${formatAgencyCode(currentUser.agencyCode || currentUser.agencyId || '')}`;

  return (
    <form key="profile" onSubmit={handleSaveProfile} className="active-tab-fade-slide space-y-8 text-left">
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white">
            {currentUser.role === 'super' ? '대표 랜딩페이지 설정' : '개인 프로필 및 랜딩페이지 설정'}
          </h2>
          <p className="text-xs font-bold text-slate-400">
            {currentUser.role === 'super'
              ? '기본 주소(설계사 파라미터가 없을 때)로 접속하는 고객에게 보여줄 랜딩페이지 인사말, 링크, 연락처를 실시간으로 설정하세요.'
              : '고객에게 보여줄 내 프로필 사진, 인사말 문구, 카카오톡 상담 링크 및 대표번호를 실시간으로 커스텀하세요.'
            }
          </p>
        </div>
        {renderHelpGuideToggle()}
      </div>

      {/* Promo URL Banner */}
      <div className="space-y-6">
        <div className={`bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-slate-955 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-4 border ${
          showHelpGuide ? 'border-orange-500/80' : 'border-orange-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded text-[9px] font-black uppercase">
              PROMO LINK
            </span>
            <h4 className="font-extrabold text-sm text-white">내 영업 홍보 전용 홈페이지 주소</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            <input 
              type="text" 
              readOnly 
              value={myHomepageUrl}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-slate-300 font-bold outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(myHomepageUrl);
                  alert("홍보용 홈페이지 주소가 클립보드에 복사되었습니다!");
                }}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-black text-xs rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> 주소 복사
              </button>
              <a
                href={myHomepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5 no-underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> 내 홈페이지 바로가기
              </a>
            </div>
          </div>

          {currentUser.role === 'agency' && (
            <div className="text-xs text-slate-400 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-2 mt-2 leading-relaxed">
              <p className="font-extrabold text-amber-400 flex items-center gap-1">
                <span>📢</span> 대리점 주소 안내 및 동적 변경 안내
              </p>
              <p className="font-semibold text-slate-300 break-keep">
                현재 대리점의 고유 코드를 설정하여 단축 주소(<code className="text-orange-400 font-black font-mono">/{formatAgencyCode(currentUser.agencyCode || currentUser.agencyId || '')}</code>)를 사용하실 수 있습니다.
              </p>
              <p className="font-semibold text-slate-400 break-keep">
                💡 <span className="text-slate-300">하단 프로필 설정에서 <strong>'대리점 고유 코드'</strong>를 원하시는 단축 코드(예: <code className="text-orange-400 font-black font-mono">won-novel</code>)로 수정하고 저장하시면, 위의 홈페이지 홍보 주소 및 소속 설계사의 모든 링크가 새로운 단축 주소로 실시간 자동 변경됩니다!</span>
              </p>
            </div>
          )}
        </div>

        {showHelpGuide && (
          <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
            <div className="pl-2 space-y-1">
              <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 나의 랜딩페이지 링크 복사</span>
              <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                "🔗 이 링크를 복사하여 고객에게 전달하거나 카카오톡 프로필에 등록하면, 대표님 전용 맞춤 보험 진단 페이지로 연결됩니다!"
              </p>
            </div>
          </div>
        )}

        {/* 광고심의 안내 배너 */}
        <div className="bg-slate-950 border border-orange-500/20 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-orange-400 font-extrabold text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>[필독] 링크 배포 및 외부 광고 시 광고 심의 준수 안내</span>
          </div>
          <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
            회원(설계사)님의 안전한 영업을 위해 외부 광고 집행 시 아래 심의 규정을 반드시 확인해 주시기 바랍니다.
          </p>
          <div className="text-[10px] text-slate-450 space-y-2.5 border-t border-slate-900 pt-3">
            <div>
              <p className="font-extrabold text-slate-300">📌 대리점(GA)별 개별 심의 원칙</p>
              <p className="pl-3 leading-relaxed text-slate-450 mt-1">
                보험협회 광고 심의는 법인(GA)별로 개별 적용됩니다. 타 대리점(예: 소속 대리점 vs 타 대리점)의 심의필 번호를 도용하거나, 심의 없이 블로그·카페·SNS 등에 링크를 무단 배포할 경우 <strong className="text-red-400 font-bold">금융소비자보호법(금소법) 위반으로 고액의 과태료 및 자격 정지 처분</strong>을 받을 수 있습니다.
              </p>
            </div>
            <div>
              <p className="font-extrabold text-slate-300">💡 안전한 활용 가이드라인</p>
              <ul className="list-disc pl-7 space-y-1.5 leading-relaxed text-slate-450 mt-1">
                <li><strong>1:1 상담용 (심의 불필요)</strong>: 이미 상담 중인 고객에게 카카오톡 1:1 메시지로 분석 리포트 링크를 보내는 것은 '영업 지원 도구'에 해당하여 심의 없이 즉시 가능합니다.</li>
                <li><strong>불특정 다수 대상 홍보 (심의 필수)</strong>: 블로그, 유튜브, 키워드 광고 등에 링크를 공개적으로 게시할 경우, 소속 대리점(GA) 준법감시실을 통해 본 플랫폼의 화면 심의를 먼저 통과한 후 <strong>부여받은 심의번호를 하단에 기재</strong>하고 광고를 집행해야 합니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={`bg-slate-950/40 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-6 border ${
        showHelpGuide ? 'border-orange-500/80 animate-pulse' : 'border-slate-850'
      }`}>
        {showHelpGuide && (
          <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
            <div className="pl-2 space-y-1">
              <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 프로필 및 랜딩 브랜딩 설정</span>
              <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                "🎨 이곳에 등록한 사진, 로고, 대표 번호, 소속 지점 주소 및 진심 어린 인사말이 고객의 보장 분석 결과 하단 카드와 푸터에 0.1초 만에 즉시 동적 반영됩니다."
              </p>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* 로그인 ID */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              로그인 ID
            </label>
            <input 
              type="text"
              value={currentUser.plannerCode || ''}
              readOnly
              className="w-full bg-slate-950/40 border border-slate-900 rounded-xl py-2.5 px-4 outline-none text-xs text-slate-500 font-bold cursor-not-allowed select-all"
            />
            <p className="text-[10px] text-slate-500 font-medium">
              💡 해당 대시보드 로그인 시 사용하는 고유 식별 코드입니다. (수정 불가)
            </p>
          </div>

          {/* 설계사 이름 */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              설계사 이름 (필수)
            </label>
            <input 
              type="text"
              value={editPlannerName}
              onChange={(e) => setEditPlannerName(e.target.value)}
              placeholder="예: 홍길동"
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              대표 상담 연락처 (필수)
            </label>
            <input 
              type="text"
              value={editCustomPhone}
              onChange={(e) => setEditCustomPhone(e.target.value)}
              placeholder="예: 010-1234-5678"
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
              required
            />
          </div>

          {/* Kakao Talk Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                카카오톡 상담 연결 링크 (오픈채팅/채널 주소)
              </label>
              <button
                type="button"
                onClick={() => setShowKakaoHelpEdit(!showKakaoHelpEdit)}
                className="text-[10px] text-orange-400 hover:text-orange-300 font-bold transition-all flex items-center gap-1 cursor-pointer bg-slate-800/40 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
              >
                오픈채팅 링크 확인 방법 ❓
              </button>
            </div>
            <input 
              type="url"
              value={editKakao}
              onChange={(e) => setEditKakao(e.target.value)}
              placeholder="예: https://open.kakao.com/o/..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
            />
            {showKakaoHelpEdit && (
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-[11px] text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200 text-left normal-case">
                <p className="font-extrabold text-white flex items-center gap-1">
                  <span>💬</span> 카카오톡 1:1 오픈채팅방 생성 및 링크 확인 방법
                </p>
                <ol className="list-decimal pl-4 space-y-1.5 font-medium text-slate-300">
                  <li>스마트폰에서 <strong className="text-white">카카오톡</strong> 앱을 실행합니다.</li>
                  <li>하단 <strong className="text-white">채팅 탭</strong>으로 이동 후, 우측 상단의 <strong className="text-white">말풍선+ (새로운 채팅)</strong> 아이콘을 누릅니다.</li>
                  <li><strong className="text-white">오픈채팅</strong> ➜ <strong className="text-white">내 오픈링크</strong> ➜ <strong className="text-white">만들기</strong> 버튼을 선택합니다.</li>
                  <li><strong className="text-white">1:1 채팅방</strong>을 선택한 후, 이름과 프로필을 설정하여 방을 만듭니다.</li>
                  <li>방이 생성되면 우측 상단 메뉴(혹은 중간)의 <strong className="text-white">링크 공유</strong> ➜ <strong className="text-white">링크 복사</strong>를 누릅니다.</li>
                  <li>복사된 주소(예: <code className="text-orange-400 font-bold">https://open.kakao.com/o/...</code>)를 위 입력창에 붙여넣어 주세요.</li>
                </ol>
                <p className="text-[10px] text-slate-500 font-bold border-t border-slate-850 pt-1.5 leading-normal">
                  ⚠️ <strong className="text-amber-400">필수 체크 설정</strong>: 오픈채팅방 생성 시 <strong className="text-white">"카카오프렌즈 프로필만 허용" 옵션은 반드시 해제(OFF)</strong>로 설정해 주세요. 그래야 익명 고객(카카오프렌즈 프로필)과 일반 실명 프로필 고객 모두 오류 없이 상담방에 입장할 수 있습니다.
                  <br />
                  ※ 일반 개인 카톡 아이디는 인터넷 브라우저 바로가기 연결을 지원하지 않아, 반드시 오픈채팅방 주소로 등록하셔야 고객이 실시간으로 상담을 신청할 수 있습니다.
                </p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              대표 상담 이메일 (선택)
            </label>
            <input 
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="예: support@rebalance.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
            />
          </div>

          {/* 광고심의필 번호 */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              보험대리점 광고심의필 번호 (선택 - 등록 시 하단 푸터 및 랜딩페이지에 상시 노출)
            </label>
            <input 
              type="text"
              value={editRegistrationNumber}
              onChange={(e) => setEditRegistrationNumber(e.target.value)}
              placeholder="예: 손해보험협회 심의필 제2026-1234호 또는 생명보험협회 심의필 제2026-5678호"
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
              autoComplete="off"
            />
          </div>

          {/* 보험대리점 등록번호 */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              보험대리점 등록번호 (선택 - 예: 2019020052호)
            </label>
            <input 
              type="text"
              value={editAgencyRegistrationNumber}
              onChange={(e) => setEditAgencyRegistrationNumber(e.target.value)}
              placeholder="예: 2019020052호 (대리점명과 분리되어 푸터 및 고지문에 깔끔하게 표시됩니다)"
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
              autoComplete="off"
            />
          </div>

          {/* Password */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              로그인 비밀번호 변경 *
            </label>
            {/* Dummy inputs to prevent Chrome autofill */}
            <input type="text" name="chrome_autofill_prevent_un" style={{ display: 'none' }} />
            <input type="password" name="chrome_autofill_prevent_pw" style={{ display: 'none' }} />
            <input 
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              placeholder="대시보드 로그인 시 사용할 비밀번호를 입력하세요"
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
              autoComplete="new-password"
              required
            />
          </div>

          {/* Profile Image Upload & URL */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              프로필 사진 이미지 등록
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
              <img 
                src={editProfileImg || DEFAULT_PROFILE_IMG}
                alt="프로필 미리보기"
                className="w-16 h-16 rounded-2xl object-cover bg-slate-800 shrink-0 border border-slate-700 self-center sm:self-auto"
              />
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleProfileUpload(e, false)}
                    className="hidden" 
                    id="edit-profile-upload"
                  />
                  <label 
                    htmlFor="edit-profile-upload"
                    className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all border border-slate-700 text-center"
                  >
                    사진 변경 (자동 압축)
                  </label>
                </div>
                <input 
                  type="text"
                  value={editProfileImg}
                  onChange={(e) => setEditProfileImg(e.target.value)}
                  placeholder="프로필 사진의 이미지 주소를 입력하거나 위 버튼으로 업로드하세요."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2 px-3 outline-none text-[11px] text-slate-300 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Company Logo Upload & URL */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              회사 로고 이미지 등록
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-955 p-4 rounded-2xl border border-slate-850">
              <img 
                src={editLogoUrl || DEFAULT_LOGO_IMG}
                alt="로고 미리보기"
                className="w-24 h-12 object-contain bg-slate-850 rounded-2xl shrink-0 border border-slate-700 p-1 self-center sm:self-auto"
              />
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, false)}
                    className="hidden" 
                    id="edit-logo-upload"
                  />
                  <label 
                    htmlFor="edit-logo-upload"
                    className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all border border-slate-700 text-center"
                  >
                    로고 변경 (자동 압축)
                  </label>
                </div>
                <input 
                  type="text"
                  value={editLogoUrl}
                  onChange={(e) => setEditLogoUrl(e.target.value)}
                  placeholder="회사 로고의 이미지 주소를 입력하거나 위 버튼으로 업로드하세요."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2 px-3 outline-none text-[11px] text-slate-300 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Greeting Title */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              메인 랜딩페이지 한줄 인사말 제목
            </label>
            <input 
              type="text"
              value={editGreetingTitle}
              onChange={(e) => setEditGreetingTitle(e.target.value)}
              placeholder="예: 보장 낭비를 해결하는 정직한 전문가"
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
              required
            />
          </div>

          {/* Greeting Content */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              메인 랜딩페이지 상세 인사말 본문 (긴 인사말)
            </label>
            <textarea 
              value={editGreetingContent}
              onChange={(e) => setEditGreetingContent(e.target.value)}
              placeholder="예: 불필요한 과납 보장을 전부 다 아껴드리겠습니다."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold resize-none"
              required
            />
          </div>

          {/* Company Name / Branch Name */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              지점/소속 회사 이름 (필수)
            </label>
            <input 
              type="text"
              value={editCompanyName}
              onChange={(e) => setEditCompanyName(e.target.value)}
              placeholder="예: 더윤컴퍼니 강남지점"
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
              required
            />
          </div>

          {currentUser.role === 'agency' && editAgencyCode !== undefined && setEditAgencyCode !== undefined && (
            <div className="space-y-2 md:col-span-2 animate-in fade-in duration-200">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                대리점 고유 코드 (단축 주소용, 필수)
              </label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={editAgencyCode}
                  onChange={(e) => {
                    setEditAgencyCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                    if (setAgencyCodeCheckStatus) setAgencyCodeCheckStatus('idle');
                  }}
                  placeholder="예: won-novel"
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                  required
                />
                {checkAgencyCodeAvailability && (
                  <button 
                    type="button"
                    onClick={checkAgencyCodeAvailability}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 rounded-xl text-xs transition-all cursor-pointer shrink-0"
                  >
                    중복 검사
                  </button>
                )}
              </div>
              {agencyCodeCheckStatus === 'checking' && <p className="text-[10px] text-blue-400 font-bold">코드 검사 중...</p>}
              {agencyCodeCheckStatus === 'available' && <p className="text-[10px] text-emerald-400 font-bold">✓ 사용 가능한 대리점 고유코드입니다.</p>}
              {agencyCodeCheckStatus === 'taken' && <p className="text-[10px] text-red-400 font-bold">✗ 이미 사용 중인 대리점 코드입니다. 다른 코드를 사용해 주세요.</p>}
              <p className="text-[10px] text-slate-500 font-medium">
                💡 변경 시 대리점 및 소속 설계사의 모든 홍보 주소가 즉시 변경되므로 신중히 변경해 주세요!
              </p>
            </div>
          )}

          {/* 지점 주소 */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              지점 주소 (필수)
            </label>
            <input 
              type="text"
              value={editCustomAddress}
              onChange={(e) => setEditCustomAddress(e.target.value)}
              placeholder="예: 서울시 강남구 테헤란로 123"
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
              required
            />
          </div>

          {/* 인증 문구 */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              인증 문구 (선택 - 기입 시 하단 푸터 및 랜딩페이지에 상시 노출)
            </label>
            <input 
              type="text"
              value={editCertificationMessage}
              onChange={(e) => setEditCertificationMessage(e.target.value)}
              placeholder="예: 더윤컴퍼니 공식 인증 설계사"
              className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
            />
          </div>

        </div>
      </div>

      {/* 실시간 푸시 알림 설정 카드 */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-amber-500" />
        <div className="pl-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded text-[9px] font-black uppercase">
              PUSH NOTIFICATION
            </span>
            <h4 className="font-extrabold text-sm text-white">신규 고객(리드) 실시간 푸시 알림 설정</h4>
          </div>
          <p className="text-xs text-slate-400 font-bold leading-relaxed break-keep text-left">
            고객이 대표님 전용 랜딩페이지에서 진단 신청을 완료하면, **0.1초 만에 스마트폰 및 브라우저 백그라운드로 즉시 푸시 알림이 발송**됩니다. PC 브라우저와 PWA가 지원되는 모바일 환경에서 모두 실시간 수신이 가능합니다.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-850">
            <div className="flex items-center gap-3">
              {pushStatus === 'registered' && (
                <>
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="text-xs font-black text-white block text-left">실시간 알림 수신 상태: ON</span>
                    <span className="text-[10px] text-slate-500 font-bold block text-left">이 기기로 신규 리드 실시간 팝업 및 진동 알림이 도착합니다.</span>
                  </div>
                </>
              )}
              {pushStatus === 'granted' && (
                <>
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse" />
                  <div>
                    <span className="text-xs font-black text-white block text-left">알림 권한은 허용되었으나 수신 미설정 상태</span>
                    <span className="text-[10px] text-slate-500 font-bold block text-left">아래 [활성화] 버튼을 클릭하면 수신이 완료됩니다.</span>
                  </div>
                </>
              )}
              {(pushStatus === 'default' || pushStatus === 'loading') && (
                <>
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-600 animate-pulse" />
                  <div>
                    <span className="text-xs font-black text-slate-350 block text-left">알림 수신 비활성화 상태</span>
                    <span className="text-[10px] text-slate-500 font-bold block text-left">신규 리드를 놓치지 않으려면 실시간 푸시 알림을 활성화하세요.</span>
                  </div>
                </>
              )}
              {pushStatus === 'denied' && (
                <>
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
                  <div>
                    <span className="text-xs font-black text-red-400 block text-left">알림 권한 차단됨</span>
                    <span className="text-[10px] text-slate-500 font-bold block text-left">브라우저의 사이트 설정에서 알림 권한을 [허용]으로 재설정해야 합니다.</span>
                  </div>
                </>
              )}
              {pushStatus === 'unsupported' && (
                <>
                  <span className="w-3.5 h-3.5 rounded-full bg-red-650" />
                  <div>
                    <span className="text-xs font-black text-slate-400 block text-left">미지원 환경</span>
                    <span className="text-[10px] text-slate-500 font-bold block text-left">이 브라우저 혹은 앱에서는 웹 푸시 알림 기능이 작동하지 않습니다.</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {(pushStatus === 'default' || pushStatus === 'granted') && (
                <button
                  type="button"
                  onClick={handleSubscribePush}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl cursor-pointer transition-all shadow-md active:scale-95 border-none"
                >
                  🔔 실시간 알림 활성화
                </button>
              )}
              {pushStatus === 'registered' && (
                <>
                  <button
                    type="button"
                    onClick={handleSendTestPush}
                    disabled={isTestPushSending}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-black text-xs rounded-xl cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1.5 border-none"
                  >
                    🚀 {isTestPushSending ? '전송 중...' : '알림 수신 테스트 전송'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubscribePush}
                    className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 font-black text-xs rounded-xl cursor-pointer transition-all border border-slate-800 active:scale-95"
                  >
                    기기 갱신
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-xl text-xs shadow-lg shadow-orange-500/10 cursor-pointer active:scale-95 transition-all disabled:opacity-50 border-none"
        >
          {loading ? '저장 중...' : '💾 프로필 설정 실시간 저장 및 동기화'}
        </button>
      </div>
    </form>
  );
}
