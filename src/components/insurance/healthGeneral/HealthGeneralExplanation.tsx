import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Heart, ShieldCheck, Activity, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, AlertTriangle, Shield, Zap
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const HealthGeneralExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-orange-50/10 px-2 sm:px-4 relative overflow-hidden" id="health-general-detail">
    {/* Background glowing decorations */}
    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>

    <div className="max-w-7xl mx-auto">

      {/* ── 웅장한 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-600 px-4 py-2 rounded-full text-xs font-black mb-6 border border-orange-200 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-orange-500" />
            30여 개 주요 보험사 공시 기준 맞춤 조립 플랜 비교 안내
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.15]">
            가장 균형 잡힌 보장 자산의 완성,<br />
            <span className="text-orange-500">종합건강보험의 올바른 기준</span>을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-65">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            암, 뇌혈관, 심혈관 3대 진단비부터 1-5종 질병/상해 수술비,<br />
            일상생활 배상책임 특약까지 필요한 담보를 선택 조립하는 종합 보장 솔루션.
          </p>
        </div>
      </div>

      {/* ── 핵심 특징 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { num: '비갱신형 구조', label: '납입 기간 내 동일 보험료 적용', sub: '은퇴 전 납입 완료로 노후 경제적 부담 방어' },
          { num: '3대 핵심 진단비', label: '암·뇌혈관·허혈성심장 집중', sub: '뇌경색/협심증 등 넓은 보장 범위 특약 매칭' },
          { num: '1-5종 수술특약', label: '질병/상해 종별 차등 지급', sub: '약관 기준 수술 분류에 따라 정액 보상' },
          { num: '해약환급금 미지급형', label: '표준형 대비 합리적인 요율', sub: '납입 중 환급금이 없는 조건으로 보험료 절감' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-orange-100/50 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-orange-300 transition-all group">
            <p className="text-xl sm:text-2xl font-black text-orange-500 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── [필수 고지] 예시 보장금액 산출 기준 및 계약자 유의사항 ── */}
      <div className="mb-16 bg-white rounded-3xl border border-orange-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0 text-orange-600 mt-1">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs text-slate-600 space-y-2 leading-relaxed">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-slate-900 text-sm">💡 [예시 기준 안내] 본 페이지에 안내된 보장 예시 금액 및 보험료 산출 기준</span>
              <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded text-[10px]">손해보험협회 공시 기준</span>
            </div>
            <p className="font-bold text-slate-700">
              • **예시 산출 기준**: 주요 손해보험사 종합건강 표준 플랜 / 40세 남성 / 상해 1급(사무직) / 20년납 90세만기 / 해약환급금 미지급형(무해지형) / 월 보험료 68,500원 기준 (가입자의 연령, 성별, 직업, 특약 선택 및 회사별 심사 기준에 따라 실제 보험료와 보장금액은 상이할 수 있습니다).
            </p>
            <div className="pt-2 border-t border-orange-100 text-[11px] text-slate-500 space-y-1">
              <p>• **해약환급금 미지급형 유의사항**: 해약환급금 미지급형(무해지) 상품은 보험료 납입기간 중 계약을 해지할 경우 해약환급금이 전혀 없으며(0원), 납입기간이 완료된 이후에는 일반 표준형 상품 수준의 해약환급금이 발생합니다.</p>
              <p>• **갱신형 특약 안내**: 갱신형 특약이 포함된 경우 연령 증가 및 위험률 변동에 따라 갱신 시점에 보험료가 인상될 수 있습니다.</p>
              <p>• **암 보장 개시일**: 일반암 진단비는 계약일로부터 90일이 지난 다음 날부터 보장되며, 1년 미만 진단 시 보험금의 50%가 감액 지급될 수 있습니다(약관 기준).</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 가이드 01 & 가이드 02 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 3대 중대질병 설계의 정석 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-orange-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-orange-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">3대 질병 진단비 가입 솔루션</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            중대 질병은 입원비, 수술비뿐 아니라 치료 중 휴직에 따른{' '}
            <span className="text-orange-500 font-black">소득 공백 보전이 본질</span>
            이므로 진단비의 보장 범위를 꼼꼼하게 확장해야 합니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '일반암 진단비', label: '소액암/유사암 제외 범위 확인', color: 'bg-orange-50/50 border-orange-100', badge: 'text-orange-700 bg-orange-100', desc: '유사암(기저세포암, 갑상선암, 제자리암, 경계성종양) 외 일반암 100% 보장 (가입 후 90일 면책, 1년 미만 50% 감액 적용)' },
              { title: '뇌질환 보장 범위', label: '뇌출혈/뇌졸중 ❌ 뇌혈관질환 ⭕', color: 'bg-amber-50/50 border-amber-100', badge: 'text-amber-700 bg-amber-100', desc: '통계청 다빈도 통계 기준 뇌경색증(I63)과 협착증을 폭넓게 포함하는 [뇌혈관질환진단특약]으로 충족' },
              { title: '심장질환 범위', label: '급성심근경색 ❌ 허혈성/심혈관 ⭕', color: 'bg-yellow-50 border-yellow-100', badge: 'text-yellow-700 bg-yellow-100', desc: '다빈도 협심증(허혈성)과 부정맥, 심부전 등 넓은 심혈관질환 진단 특약을 연계하여 균형 잡힌 보장선 구축' },
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

          <div className="mt-8 p-5 md:p-6 bg-orange-50 rounded-3xl border border-orange-100">
            <p className="text-orange-700 font-black text-xs mb-1">⚠️ 보장 범위 확대 가이드</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              기존 가입 증권 분석 시 **'뇌출혈'**, **'급성심근경색증'**으로만 한정되어 있다면 다빈도 뇌경색이나 협심증 발생 시 해당 진단비 지급이 제한될 수 있으므로, 보장 범위(뇌혈관·허혈성)를 점검해 보시는 것이 권장됩니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 현명한 보험 요율의 설계 공식 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Heart className="w-56 h-56 text-orange-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-orange-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">비갱신 무해지환급형의 재정학</h3>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
              종합건강보험의 월 납입액과 총 누적 비용을 계획적으로 관리하기 위해 채택하는{' '}
              <span className="text-orange-400 font-black">요율 및 계약 만기 최적화 구조</span>
              입니다.
            </p>

            <div className="space-y-3">
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="font-black text-orange-300 text-sm mb-1.5 flex items-center gap-2">
                  🔒 비갱신형 (Non-renewable) 구조의 안정성
                </p>
                <p className="text-[11px] opacity-75 font-bold leading-relaxed">
                  초기 보험료는 다소 높지만 납입 기간(예: 20년) 동안 완납하면 만기(예: 90세)까지 추가 보험료 납입 없이 보장을 유지하므로 노후 생활 고정 지출 위험을 방어할 수 있습니다.
                </p>
              </div>

              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="font-black text-orange-300 text-sm mb-1.5 flex items-center gap-2">
                  💸 해약환급금 미지급형 (무해지형)
                </p>
                <p className="text-[11px] opacity-75 font-bold leading-relaxed">
                  납입 기간 중 해약 시 환급금이 없는 대신 동일 보장의 표준형 대비 월 보험료가 절감되어 완납 유지 시 유리합니다. (단, 중도 해약 시 환급금이 0원이므로 장기 유지 능력을 신중히 고려해야 합니다.)
                </p>
              </div>

              <div className="p-5 bg-orange-500/10 rounded-3xl border border-orange-400/20 hover:bg-orange-500/20 transition-colors">
                <p className="font-black text-orange-300 text-sm mb-1.5 flex items-center gap-2">
                  ⏱️ 20년납 90세 만기 최적화 설계
                </p>
                <p className="text-[11px] opacity-75 font-bold leading-relaxed">
                  경제활동기(예: 20년) 동안 보험료를 완납하고 주요 질병 위험 기간인 90세 만기로 집중 설계하여, 100세 만기 설정 플랜 대비 월 납입 부담을 낮추고 효율을 높입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-orange-400 font-black text-xs mb-1 uppercase tracking-widest">💡 전문가의 조립형 가이드</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "종합보험 설계 시 실손의료비는 전 보험사 공통 1년 갱신형 단독으로 구성하시고, 3대 질병 진단비와 주요 특약(1-5종 수술비, 일상배상책임 등)은 비갱신형·해약환급금 미지급형으로 분리 조립하는 것이 장기 납입과 보장 유지에 효과적인 설계 방식입니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드 배너 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-orange-400/30">
              <Sparkles className="w-3 h-3" /> 종합건강 최신 가입 동향
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">수술비 한도 극대화와 표적항암 치료제 특약의 대세화</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              최근 출시되는 건강보험은 수술 방식(다빈치로봇 수술 등)에 따른 연간 보장 한도를 대폭 확대하고 있으며, 수천만 원이 드는 고가의 표적항암 약물 치료 및 면역치료 요율을 단돈 몇 천 원의 특약으로 매칭하여 암 진단비의 부담을 덜고 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: '질병/상해 1-5종 수술비', feature: '수술 난이도별 세분화 보상', limit: '종별 최대 1,000만 원 (5종 예시)', note: '약관 기준 수술 분류표에 따름 (매회 반복 지급 여부는 약관별 상이)' },
              { title: '표적항암 약물허가 치료비', feature: '부작용 완화 최신 치료법 지원', limit: '최대 5,000만 원 (특약 가입금액 기준)', note: '식약처 허가 효능·효과 범위 내 투약 시 (특약 기준)' },
              { title: '가족일상생활 배상책임', feature: '생활 중 타인 물건/대인 피해', limit: '1사고당 최대 1억 원 (자기부담금 차감)', note: '누수 사고, 반려견 사고 등 일상 속 대인/대물 법률상 배상책임 (중복 가입 시 비례 보상)' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {item.title}{' '}
                    <span className="text-orange-300 text-xs font-bold ml-1">{item.feature}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-orange-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{maskText(item.limit, isUnlocked)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-orange-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-orange-500" /> 종합건강보험 현명한 가입 핵심 5대 프로세스
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 납입면제 범위 확인', desc: '암, 뇌졸중, 급성심근경색 또는 후유장해 80% 이상 진단 시 차후 보험료 납입 면제 (회사별 약관 기준)' },
              { step: '02. 5대 장기 의무고지', desc: '3개월 내 진찰, 1년 내 추가검사, 5년 내 수술/입원/7일 이상 치료 여부 성실 고지' },
              { step: '03. 납입/만기 기간 조율', desc: '생산 가능 연령에 맞추어 20년납 세팅 및 주요 위험률 구간인 90세 만기 등으로 설계 조립' },
              { step: '04. 중복 보장 가입 제거', desc: '배상책임 특약 등 중복 가입 시 비례 보상되는 특약들은 1개 상품에만 유지하여 불필요한 지출 방지' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-orange-50/30 rounded-3xl border border-orange-100/50 hover:border-orange-200 transition-colors">
                <div className="shrink-0 font-black text-orange-700 text-sm w-full sm:w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-orange-500 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">가입 시 핵심 권장사항 5선</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 일반암 대비 유사암 한도 적정 세팅<br />
              ② 비갱신 무해지환급형 우선 검토<br />
              ③ 질병 1-5종 수술비 특약 연계<br />
              ④ 뇌출혈 대신 뇌혈관질환 특약으로 확대<br />
              ⑤ 가족 일상생활배상책임 특약 가입 여부 확인
            </p>
          </div>
          <div className="bg-white border border-orange-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-orange-500 w-5 h-5" /> 리모델링 적기 분석
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              연령이 낮을수록 기본 보험료 및 특약 위험 등급 요율이 유리하게 책정됩니다. 또한 고혈압, 당뇨 등 만성 기왕력이 발생하기 전에 정밀 진단비 한도를 미리 준비하는 것이 합리적인 자산 방어 전략입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-orange-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          주요 손해보험사 종합건강보험 상품별 특징 비교 (손해보험협회 공시 기준)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '삼성화재', product: '마이헬스 파트너', highlight: '브랜드 안정성, 광범위한 뇌/심 특약 한도와 1-5종 질병 수술 혜택 연계 및 신속한 보상 접수 지원', badges: ['브랜드 인지도 우수', '수술 한도 강점'] },
            { company: '메리츠화재', product: '더올바른한선 건강보험', highlight: '3대 중대질병 진단비 한도 세팅 용이, 모바일 간편 청구 연계와 유연한 담보 구성 매칭', badges: ['진단비 한도 세팅', '담보 유연성'] },
            { company: '현대해상', product: '퍼펙트플러스 종합보험', highlight: '다양한 조립형 특약 라인업, 뇌혈관/심혈관 합산 및 수술비 특약 가성비 요율 테이블 탑재', badges: ['가성비 특약 요율', '다양한 담보 구성'] },
            { company: 'KB손해보험', product: 'KB희망플러스 자산보장', highlight: '주요 질병수술비 특약 강점, 고액 암표적 치료 특약의 요율 경쟁력 제공 및 직업 등급 감면 혜택 우대', badges: ['수술 범위 우수', '암 치료비 최적화'] },
            { company: 'DB손해보험', product: '나를위한 안심건강보험', highlight: '무사고 시 보험료 할인 옵션 지원, 대형 수술비 및 3대 중대 질병 진단비 안정적 설계', badges: ['무사고 할인', '기본 진단비 우수'] },
            { company: '한화손해보험', product: '시그니처 여성/남성 건강보험', highlight: '성별 특화 질환 담보 라인업 세팅, 무해지환급 구조 설계 시 경쟁력 있는 요율 제공', badges: ['성별 특화 보장', '요율 경쟁력'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-orange-50/20 rounded-2xl md:rounded-[2.5rem] border border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-orange-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-200"
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
      <div className="border-t border-orange-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "공시 기준 데이터로 확인하는 당신만의 균형 잡힌 보장 조립,<br />
            <span className="text-orange-500">불필요한 지출을 줄이고 든든한 보장 설계를 지금 상담해 보세요.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-orange-500 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-orange-600 transition-all hover:scale-105 shadow-2xl shadow-orange-400/30 shrink-0"
          >
            종합건강보험 맞춤 비교 상담하기
          </button>
        )}
      </div>

    </div>
  </section>
);
