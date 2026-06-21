import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Heart, ShieldCheck, Activity, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, AlertTriangle
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
  gameType?: 'amateur' | 'professional';
}

export const GolfExplanation: React.FC<Props> = ({ onAction, gameType, isUnlocked }) => (
  <section className="py-24 bg-emerald-50/10 px-2 sm:px-4 relative overflow-hidden" id="golf-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-emerald-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            초보 아마추어부터 싱글 플레이어까지 든든한 동반자
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            일생에 단 한 번뿐인 홀인원의 기쁨,<br />
            <span className="text-emerald-500">합리적인 골프보험 선택 기준</span>을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            홀인원 성공 축하금 지원부터 골프용품 파손, 배상책임까지!<br />
            4인 1팀 동반 가입 시 즉시 5% 추가 할인 혜택 매칭.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '4인 동반 할인', label: '1팀 패키지 가입 시 즉시 적용', sub: '5% 보험료 추가 할인 혜택' },
          { num: '홀인원 축하금', label: '최대 200만 원 실손 보장', sub: '증빙 영수증 1~3개월 내 청구 필수' },
          { num: '골프 배상책임', label: '스윙 오발 사고 실손 배상', sub: '사고당 2,000만~3,000만 원 한도' },
          { num: '골프용품 손해', label: '클럽 파손/도난 보장', sub: '세트당 최대 100만~200만 원 보상' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-emerald-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group">
            <p className="text-2xl font-black text-emerald-500 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 체크 3대 핵심 보장 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-emerald-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-emerald-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">골프보험 필수 체크 3대 보장</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            골프 라운딩 중 발생할 수 있는 가장 대표적인 재정적 위험과{' '}
            <span className="text-emerald-500 font-black">반드시 선택해야 할 3가지 핵심 담보</span>
            입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '홀인원 축하비', label: '기쁜 홀인원 순간의 실지출 비용 환급', color: 'bg-emerald-50/50 border-emerald-100', badge: 'text-emerald-700 bg-emerald-100', desc: '동반자 라운딩 비용, 캐디피 피팁, 축하 만찬 및 증정품(기념떡/우산 등) 실비 청구 가능' },
              { title: '스윙 배상책임', label: '필드 안에서 든든한 법적 안심 보장', color: 'bg-amber-50/50 border-amber-100', badge: 'text-amber-700 bg-amber-100', desc: '슬라이스/훅 타구 사고로 동반자나 캐디에게 가한 신해상해 및 재물 손해 보장(벌금 미포함)' },
              { title: '골프용품 파손', label: '값비싼 드라이버/아이언 파손 실비 보상', color: 'bg-yellow-50 border-yellow-100', badge: 'text-yellow-700 bg-yellow-100', desc: '스윙 중 클럽 샤프트 부러짐, 드라이버 헤드 깨짐, 골프 가방 도난 등 실손 의료비와 유사하게 실제 수리비 지급' },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 w-full sm:w-24 text-center ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm break-keep">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
            <p className="text-emerald-700 font-black text-xs mb-1">⚠️ 홀인원 축하금 지급 증빙 조건</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              홀인원 성공 후 **골프장에서 발급한 홀인원 증명서**와 라운딩 후 1개월(또는 3개월) 이내에 지출한 **카드 영수증**을 함께 제출해야 실손 정산됩니다. 현금 지출 내역은 증빙이 원칙적으로 불가하므로 주의해야 합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 보장 대상 제외 및 예외 룰 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Heart className="w-56 h-56 text-emerald-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-emerald-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">가입 전 필수 확인 면책/한도 안내</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-emerald-300 mb-2 flex items-center gap-2">
                  🚫 스크린골프 / 파3 보장 제외
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  대다수의 일반 골프보험은 **대한골프협회(KGA)가 공인한 국내 18홀 정규 대중제/회원제 골프장**에서의 경기만 인정합니다. 실내외 스크린골프장이나 9홀 미만 파3 미니 골프장에서 발생한 홀인원은 보장 대상에서 제외됩니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-emerald-500/20 rounded-2xl md:rounded-[2.5rem] border border-emerald-400/30 hover:bg-emerald-500/30 transition-colors">
                <p className="font-black text-emerald-300 mb-2 flex items-center gap-2">
                  ⚖️ 중복 가입 시 비례보상 원칙
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  홀인원 축하비용 특약 및 골프용품 손해는 **실손의료비보험과 마찬가지로 중복 가입 시 실제 지출된 금액을 기준으로 비례 분할 보상**됩니다. 여러 사에 중복 가입하더라도 축하금을 초과하여 중복 수령할 수 없습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-emerald-400 font-black text-xs mb-1 uppercase tracking-widest">💡 프로/세미프로 자격 제한</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              {gameType === 'professional' ? (
                <span className="text-amber-300 font-black">"현재 프로/지도자로 입력하셨습니다. 이에 따라 홀인원 축하비 및 용품 특약이 자동으로 보장 한도에서 제외되었음을 확인해 주시기 바랍니다."</span>
              ) : (
                "골프 티칭 프로, 세미프로, KPGA/KLPGA 소속 정회원 등 전문 체육인은 일반 골프보험의 홀인원 특약에 가입이 불가능하므로, 업무용 상해 종합 담보를 별도로 확인하셔야 합니다."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 원데이 골프보험 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-emerald-400/30">
              <Sparkles className="w-3 h-3" /> 최근 골프보험 가입 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">가볍게 즐기는 라운딩 당일형 원데이 보험 인기</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              연간 정기 멤버십이 부담스러운 라이트 골퍼들을 위한 원데이(1일형) 골프보험 가입이 빠르게 늘고 있습니다. 모바일로 라운딩 당일 아침 첫 티오프 직전에도 간편하게 가입(최소 2,000원 대)하여 24시간 동안 필드 위 위험을 완벽 차단할 수 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '4인 동반 일괄가입', product: '1팀 전체 스마트 패키지 가입', limit: '단체 가입 5% 즉시 추가할인', note: '티오프 전 동반자 3인의 이름 입력만으로 동시 체결 완료' },
              { company: '원스톱 모바일 증빙', product: '종이 서류 없는 모바일 청구 확대', limit: '인증서 및 카드 결제 캡처 청구', note: '동반 라운딩 비용 결제 카드사의 승인 명세 캡처만으로 증빙 대체' },
              { company: '용품 보장 범위 확대', product: '클럽 파손 전용 즉각 수리 지원', limit: '제조사 공식 수리비 영수증 지원', note: '피팅샵 수리뿐만 아니라 정식 AS 센터 견적서 접수 즉시 실손 보상' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {maskCompany(item.company, isUnlocked)}{' '}
                    <span className="text-emerald-300 text-xs font-bold ml-1">{maskProductName(item.product, isUnlocked)}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-emerald-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{maskText(item.limit, isUnlocked)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-emerald-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-500" /> 합리적 골프보험 스마트 가입 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 정규 18홀 대조', desc: '국내 골프장 중 18홀 이상의 정규 대중제/회원제 여부 확인 및 9홀 2회 회전 등 제외 사항 체크' },
              { step: '02. 비례보상 여부', desc: '본인이 가입하고 있는 기존 손해보험(종합/화재 등)에 홀인원 비용 특약 중복 적재 여부 확인' },
              { step: '03. 영수증 유효기간', desc: '홀인원 달성 당일로부터 보통 1개월 또는 최대 3개월 이내에 사용한 카드 지출 내역만 인정' },
              { step: '04. 경기 자격 확인', desc: 'KPGA, KLPGA 프로 등 등록 선수나 강사 경력 여부에 따른 가입 적격 심사 적용 여부 사전 검토' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-emerald-50/30 rounded-3xl border border-emerald-100/50 hover:border-emerald-200 transition-colors">
                <div className="shrink-0 font-black text-emerald-700 text-sm w-full sm:w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-emerald-500 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">골프보험 스마트 팁 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 라운딩 1팀(4인) 일괄 가입 5% 할인 받기<br />
              ② 스크린골프 홀인원 미보장 면책 확인<br />
              ③ 타구 사고 대비 배상책임 2,000만 이상 확보<br />
              ④ 골프용품 파손 드라이버 헤드 파손 보상 포함<br />
              ⑤ 홀인원 축하 선물 및 캐디피 카드 영수증 보관
            </p>
          </div>
          <div className="bg-white border border-emerald-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-emerald-500 w-5 h-5" /> 가입 최적 시점
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              연간 10회 이상 필드로 정기 라운딩을 가시는 분은 1년형 연간 골프보험이 유리하고, 연 2~3회 번개 라운딩을 즐기시는 비정기 골퍼에게는 티오프 당일에만 가입하는 원데이(1일형) 골프보험이 절대적으로 가성비 높은 대안입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-emerald-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 주요 손해보험사 골프·레저보험 상품 경쟁력 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: 'DB손해보험', product: '다이렉트 오잘공 골프보험', highlight: '다이렉트 베스트셀러 상품, 업계 우수한 수준의 홀인원 실비 지원 및 가성비 위주 요율 설계', badges: ['시장 대표 상품', '가성비 최우수'] },
            { company: '삼성화재', product: '다이렉트 착한골프보험', highlight: '간편 모바일 청구 연동, 골프웨어 등 보장 품목 다양화 및 대인 배상책임 보장 옵션 최적화', badges: ['착한 다이렉트', '웨어 파손 보장'] },
            { company: '한화손해보험', product: '다이렉트 굿샷 골프보험', highlight: '원데이 플랜 지원에 특화되어 저렴한 하루 보험료 제공, 신속한 파손 영수증 승인 속도', badges: ['원데이 전문', '빠른 실손 보상'] },
            { company: 'KB손해보험', product: 'KB 다이렉트 골프안심보험', highlight: '단체(4인) 가입 시스템이 직관적으로 모바일에 빌딩되어 동반 가입자 입력 및 결제가 매우 간편', badges: ['4인 동반 편의', '단체 할인 연계'] },
            { company: '메리츠화재', product: '든든한 골프파트너보험', highlight: '골프 중 발생할 수 있는 주요 중상해사망 및 장해율 보장 한도가 튼튼하게 설계된 정통 플랜', badges: ['상해보장 특화', '정통 골프플랜'] },
            { company: '현대해상', product: '현대해상 다이렉트 골프보험', highlight: '골프 카트 탑승 중 상해 사고 및 골프 경기장 외의 일반 스포츠 상해 손해까지 확장 설계 가능', badges: ['카트 상해 지원', '레저 상해 연계'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-emerald-50/20 rounded-2xl md:rounded-[2.5rem] border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-emerald-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-emerald-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "필드 위의 갑작스러운 사고도, 생생한 홀인원의 기쁨도<br />
            <span className="text-emerald-500">정밀한 보장 분석과 동반 가입 할인을 담은 최적의 맞춤 설계로 든든하게 동행합니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-emerald-500 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-emerald-600 transition-all hover:scale-105 shadow-2xl shadow-emerald-400/30 shrink-0"
          >
            골프·레저 맞춤 보험 무료 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);
