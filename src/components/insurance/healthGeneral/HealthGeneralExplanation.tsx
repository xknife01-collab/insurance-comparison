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
            <Zap className="w-3.5 h-3.5 fill-current text-orange-500 animate-pulse" />
            0.1초 만에 전 보험사 맞춤 조립 플랜 실시간 산출
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.15]">
            가장 웅장하고 균형 잡힌 보장 자산의 완성,<br />
            <span className="text-orange-500">종합건강보험의 올바른 기준</span>을 선사합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-65">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            암, 뇌혈관, 심혈관 3대 진단비부터 1-5종 질병/상해 수술비,<br />
            일상생활 배상책임 특약까지 빈틈없이 한 번에 조립하는 대한민국 표준 종합 설계 솔루션.
          </p>
        </div>
      </div>

      {/* ── 핵심 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '비갱신형 가치', label: '평생 인상 걱정 없는 동일 요율', sub: '은퇴 전 납입 완료로 노후 경제적 부담 방어' },
          { num: '3대 핵심 진단비', label: '암·뇌·심혈관 보장 공백 Zero', sub: '뇌경색/심장 협심증 등 광범위한 진단비 매칭' },
          { num: '1-5종 수술특약', label: '질병/상해 전수 보장', sub: '수술 횟수 상관없이 매회 지급 조건 우선 필터링' },
          { num: '무해지환급형 세이브', label: '동일 보장 대비 20~30% 할인', sub: '납입 기간 내 해지 환급금 축소로 고정 지출 절감' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-orange-100/50 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-orange-300 transition-all group">
            <p className="text-xl sm:text-2xl font-black text-orange-500 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
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
              { title: '일반암 진단비', label: '소액암/유사암 제외 여부 확인', color: 'bg-orange-50/50 border-orange-100', badge: 'text-orange-700 bg-orange-100', desc: '유방암, 자궁암, 대장점막내암, 전립선암 등이 축소 보장되지 않고 일반암 진단비와 완전히 동일하게 지급되는 상품 매칭' },
              { title: '뇌질환 보장 범위', label: '뇌출혈/뇌졸중 ❌ 뇌혈관질환 ⭕', color: 'bg-amber-50/50 border-amber-100', badge: 'text-amber-700 bg-amber-100', desc: '뇌출혈(전체 뇌질환 중 9%만 보장)보다 뇌경색과 협착증을 모두 포함하는 전체 뇌혈관질환 특약으로 빈틈없이 충족' },
              { title: '심장질환 범위', label: '급성심근경색 ❌ 허혈성/심혈관 ⭕', color: 'bg-yellow-50 border-yellow-100', badge: 'text-yellow-700 bg-yellow-100', desc: '가장 빈번한 협심증(허혈성)과 부정맥, 심부전 등 넓은 심혈관질환 진단 특약을 조합하여 균형 잡힌 방어선 구축' },
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
              기존 가입 증권 분석 시 **'뇌출혈'**, **'급성심근경색증'**으로 한정되어 있다면 실제 뇌졸중이나 협심증 발생 시 보험금을 전혀 지급받을 수 없으므로, 보험 다이어트를 통해 최우선적으로 리모델링해야 합니다.
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
              종합건강보험의 월 납입액과 총 누적 비용을 획기적으로 낮추기 위해 반드시 채택해야 할{' '}
              <span className="text-orange-400 font-black">요율 및 계약 만기 최적화 공식</span>
              입니다.
            </p>

            <div className="space-y-3">
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="font-black text-orange-300 text-sm mb-1.5 flex items-center gap-2">
                  🔒 비갱신형 (Non-renewable) 구조의 안정성
                </p>
                <p className="text-[11px] opacity-75 font-bold leading-relaxed">
                  초기 보험료는 다소 높지만 납입 기간(예: 20년)이 지나면 세액 인상이나 추가금 납입 없이 만기(예: 90세)까지 안전하게 무료 혜택 보장을 유지하므로 노후 생활 고정비 위협을 든든하게 방지합니다.
                </p>
              </div>

              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="font-black text-orange-300 text-sm mb-1.5 flex items-center gap-2">
                  💸 해약환급금 미지급형 (무해지형)
                </p>
                <p className="text-[11px] opacity-75 font-bold leading-relaxed">
                  납입 기간 중 해약 시 환급금이 없는 대신 동일한 보장의 표준형 대비 매월 약 20% ~ 30% 저렴한 요율이 책정되어, 완납을 전제로 보험 다이어트를 극대화하는 현명한 가성비 선택지입니다.
                </p>
              </div>

              <div className="p-5 bg-orange-500/10 rounded-3xl border border-orange-400/20 hover:bg-orange-500/20 transition-colors">
                <p className="font-black text-orange-300 text-sm mb-1.5 flex items-center gap-2">
                  ⏱️ 20년납 90세 만기 최적화 믹스매치
                </p>
                <p className="text-[11px] opacity-75 font-bold leading-relaxed">
                  가장 경제활동이 활발한 20년 동안 보험료를 모두 완납하고 질병 위험률이 급상승하는 90세까지 보장기간을 집중 설계하여, 100세 만기 설정 플랜 대비 보험료를 10~15% 추가 세이브합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-orange-400 font-black text-xs mb-1 uppercase tracking-widest">💡 전문가의 조립형 가이드</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "종합보험 설계 시 실비는 전 보험사 공통 1년 갱신형이므로 단독 구성하시고, 3대 질병 진단비와 명품 특약(1-5종 수술비, 일상생활배상책임)은 비갱신형 무해지환급형으로 따로 분리 조립하는 것이 총 누적비용을 40% 이상 아끼는 노하우입니다."
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
              { title: '질병/상해 1-5종 수술비', feature: '수술 난이도별 세분화 보상', limit: '회당 최대 1,000만 원 지급', note: '보장 범위가 가장 넓은 수술 보장의 정석으로, 매회 반복 지급 여부 충족' },
              { title: '표적항암 약물허가 치료비', feature: '부작용 없는 최신 치료법 지원', limit: '최대 5,000만 원 보장 매칭', note: '실손 의료비 한도를 초과하는 2.5세대 암 표적 치료 수수료 대응' },
              { title: '가족일상생활 배상책임', feature: '생활 중 타인 물건/대인 피해', limit: '최대 1억 원 대물 보상 가능', note: '누수 사고, 반려견 물림 사고 등 일상 속 대인/대물 배상 완벽 대처' },
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
              { step: '01. 납입면제 범위 확인', desc: '암, 뇌졸중, 급성심근경색 등 중대 질환 진단 시 차후 잔여 보험료 면제 특약 탑재' },
              { step: '02. 5대 장기 의무고지', desc: '3개월 내 진찰, 1년 내 추가검사, 5년 내 수술/입원/7일 이상 치료 여부 성실 고지' },
              { step: '03. 납입/만기 기간 조율', desc: '생산 가능 연령에 맞추어 20년납 세팅 및 위험률이 폭증하는 90세 만기로 설계 조립' },
              { step: '04. 중복 보장 가입 제거', desc: '배상책임 특약 등 중복 가입 시 비례 보상되는 특약들은 1개 상품에만 유지하여 낭비 차단' },
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
            <h4 className="text-xl font-black mb-4">가입 시 핵심 우선순위 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 유사암 진단비 한도 최대 세팅<br />
              ② 비갱신 무해지환급형을 기본으로 채택<br />
              ③ 질병 1-5종 수술비 특약 추가<br />
              ④ 뇌출혈이 아닌 뇌혈관질환 특약으로 확대<br />
              ⑤ 가족 일상생활배상책임 특약 필수 가입
            </p>
          </div>
          <div className="bg-white border border-orange-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-orange-500 w-5 h-5" /> 리모델링 적기 분석
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              나이가 한 살이라도 어릴수록 기본 보험료 및 특약 위험 등급 요율이 훨씬 낮게 책정됩니다. 또한 혈압약, 당뇨약 등 만성 기왕력이 발생하기 전에 정밀 진단비 한도를 튼튼히 조립하는 것이 경제적으로 백번 이득입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-orange-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          대한민국 Top 6 손해보험사 종합건강보험 주력 상품 강점 전수 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '삼성화재', product: '마이헬스 파트너', highlight: '압도적인 브랜드 안정성, 광범위한 뇌/심 특약 한도와 1-5종 질병 수술 혜택의 높은 한도 보장 및 빠른 접수 신뢰', badges: ['브랜드 인지도 우수', '수술 한도 강점'] },
            { company: '메리츠화재', product: '더올바른한선 건강보험', highlight: '3대 중대질병 진단비 당사 한도 최대 세팅 가능, 업계 선두의 간편 청구 연계와 유연한 담보 구성 매칭', badges: ['진단비 최대 세팅', '담보 유연성'] },
            { company: '현대해상', product: '퍼펙트플러스 종합보험', highlight: '다양한 조립형 특약 라인업의 표준, 뇌혈관/심혈관 합산 및 수술비 특약 가성비 요율 테이블 탑재', badges: ['가성비 특약 요율', '조립 담보 최다'] },
            { company: 'KB손해보험', product: 'KB희망플러스 자산보장', highlight: '120대 질병수술비 특약 강점, 고액 암표적 치료 특약의 우수한 요율 경쟁력 제공 및 직업 등급 감면 혜택 우대', badges: ['수술 범위 우수', '암 치료비 최적화'] },
            { company: 'DB손해보험', product: '나를위한 안심건강보험', highlight: '무사고 시 보험료 환급/할인 옵션 지원, 대형 수술비 및 3대 중대 질병 진단비 인하 경쟁력', badges: ['무사고 할인', '기본 진단비 우수'] },
            { company: '한화손해보험', product: '시그니처 여성/남성 건강보험', highlight: '성별 특화 질환 담보 라인업 강력 세팅, 무해지환급 구조 설계 시 업계 최저 수준 요율 경쟁력 확보', badges: ['성별 특화 보장', '최저 요율 매칭'] },
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

      {/* ── 웅장한 CTA ── */}
      <div className="border-t border-orange-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "0.1초 만에 밝혀지는 당신만의 균형 잡힌 보장 조립,<br />
            <span className="text-orange-500">낭비 없는 내 집안 경제를 위해 지금 웅장한 여정을 함께 시작해 보세요.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-orange-500 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-orange-600 transition-all hover:scale-105 shadow-2xl shadow-orange-400/30 shrink-0"
          >
            종합건강보험 무료 맞춤 비교하기
          </button>
        )}
      </div>

    </div>
  </section>
);
