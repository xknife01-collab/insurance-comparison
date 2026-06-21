import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Heart, ShieldCheck, Activity, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, Gem
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const DentalExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-teal-50/10 px-2 sm:px-4 relative overflow-hidden" id="dental-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-teal-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
            건강할 때 준비하는 평생 치아 안전망
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            오르면 부담되는 비싼 치과 치료비,<br />
            <span className="text-teal-600">현명한 치아보험 가이드</span>를 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            나에게 맞는 보존치료(크라운/레진)부터 임플란트 고액 보철치료까지!<br />
            면책/감액기간을 든든하게 계산한 안심 치아 비교 설계.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '무제한 보존치료', label: '크라운/레진 연간 무제한 보장', sub: '자연치아 보존 치료 한도 최적화' },
          { num: '임플란트 150만', label: '상해/질병 보철비 고액 지원', sub: '브릿지, 틀니 등 보철 전격 커버' },
          { num: '진단형 프리패스', label: '즉시 면책/감액기간 0일 면제', sub: '사전 검진 통과 시 당일 즉시 보장' },
          { num: '고지 간소 무진단', label: '치과 검진 없는 5분 초간편 가입', sub: '3가지 고지만으로 즉각 체결 가능' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-teal-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-teal-200 transition-all group">
            <p className="text-2xl font-black text-teal-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 체크 3대 핵심 보장 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-teal-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-teal-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-teal-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">치아보험 필수 체크 3대 보장</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            치아보험은 본인의 연령대와 치아 상태에 맞춰{' '}
            <span className="text-teal-600 font-black">보존치료와 보철치료의 한도를 균형 있게 설계</span>
            해야 합니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '보존치료 (자연치)', label: '치아를 유지하며 때우고 씌우는 보장', color: 'bg-teal-50/50 border-teal-100', badge: 'text-teal-700 bg-teal-100', desc: '레진(아말감/GI 대체), 인레이, 온레이 및 치수를 살리는 크라운 치료(연간 개수 한도 및 단가 체크 필수)' },
              { title: '보철치료 (인공치)', label: '치아 상실 시 다리 역할을 하는 대체 이식 보장', color: 'bg-emerald-50/50 border-emerald-100', badge: 'text-emerald-700 bg-emerald-100', desc: '잇몸뼈에 심는 임플란트(영구치 발치 기준), 양옆 치아에 거는 브릿지, 전체/부분 틀니 보장' },
              { title: '진단형 사전 가입', label: '가입 즉시 감액 없이 전액 보장 혜택', color: 'bg-amber-50/50 border-amber-100', badge: 'text-amber-700 bg-amber-100', desc: '치과 사전 정밀 검진 통과 시 90일 면책기간 및 1~2년 이내 50% 지급 감액 조항 완전 삭제 특권' },
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

          <div className="mt-8 p-5 md:p-6 bg-teal-50 rounded-3xl border border-teal-100">
            <p className="text-teal-700 font-black text-xs mb-1">⚠️ 충치와 잇몸병 치료 고지의무 주의</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              가입 전 1년 이내 충치로 인한 치료 기록이 있거나, 5년 이내 잇몸병(치주염)으로 치아를 뺀 적이 있는 경우 고지의무 대상이 되며, 이를 정확히 알리지 않으면 보험금 지급 거절 및 강제 해지 사유가 되므로 투명한 고지가 선행되어야 합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 보장 대상 제외 및 예외 룰 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Heart className="w-56 h-56 text-teal-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-teal-500 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-teal-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">가입 전 필수 확인 면책/한도 안내</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-teal-300 mb-2 flex items-center gap-2">
                  🚫 기발치 치아(이미 뽑은 치아) 면책 조항
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  보험 가입일 **이전에 이미 뽑아버린 빈 치아(기발치 치아) 자리에 보험 가입 후 임플란트나 브릿지 시술**을 받는 경우, 해당 치아는 원칙적으로 보험금 보상 대상에서 완전히 제외(면책)됩니다. 가입 후 발치된 영구치에 한해 보장됩니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-teal-500/20 rounded-2xl md:rounded-[2.5rem] border border-teal-400/30 hover:bg-teal-500/30 transition-colors">
                <p className="font-black text-teal-300 mb-2 flex items-center gap-2">
                  ⏱️ 질병 원인 면책 90일 및 1~2년 감액제
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  질병으로 인한 보존/보철 치료는 가입 후 90일간 면책(미지급)되며, 무진단형의 경우 보통 1~2년 이내 치료 시 가입 금액의 50%만 지급(감액)됩니다. 단, **재해/상해 사고로 인한 치과 수술은 대기기간 없이 즉시 전액** 보장됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-teal-400 font-black text-xs mb-1 uppercase tracking-widest">💡 사랑니 및 미용 시술 면책</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              치열 교정 치료(미용 목적), 치아 미백 시술, 그리고 자연 퇴화되어 자연 발치되는 경우나 사랑니의 보존/보철 치료비는 순수 질병/치아우식 치료 목적으로 인정되지 않아 보장에서 제외됨을 유의해 주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 진단형 vs 무진단형 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-teal-400/30">
              <Sparkles className="w-3 h-3" /> 치아보험 가입 필수 비교 트랙
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">내 치아 건강에 맞는 진단형 vs 무진단형 선택 기준</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              시중에 공급되는 대다수 상품은 간편하게 심사 없이 가입되는 **무진단형**이지만, 현재 치주 상태가 매우 양호하고 치과 방문 이력이 깨끗하신 분들이라면 면책/감액 대기기간이 아예 없고 한도가 훨씬 큰 **진단형** 가입이 경제적이며 절대적으로 우월합니다. 본인의 최근 치과 진료 소견을 바탕으로 최적의 가입 트랙을 설계하십시오.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: '무진단형 (간편 심사형)', desc: '검진 없이 3가지 질문 고지만으로 간편 체결', info: '90일 면책 & 1~2년 50% 감액' },
              { title: '진단형 (건강 심사형)', desc: '치과 방문 사전 구강 검진 통과 후 무제한 승인', info: '당일 즉시 전액 보장' },
              { title: '연령대별 보장 비중 최적화', desc: '2030 크라운 무제한 ➔ 4050 고액 임플란트 결합형', info: '나이별 맞춤 특약 배분 설계' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.desc, isUnlocked)}</p>
                </div>
                <p className="font-black text-teal-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{item.info}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-teal-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-teal-500" /> 합리적 치아보험 스마트 가입/리모델링 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 최근 1년 충치 검진', desc: '최근 1년 이내 충치(치아우식증)로 치과 치료를 받았거나 추가 치료 진단을 받은 적이 있는지 사전 대조' },
              { step: '02. 5년 내 잇몸병 치료', desc: '치주염(풍치 등)으로 인한 자연치 발치 이력이나 치주 수술, 정밀 스케일링 소견의 고지 적합성 판단' },
              { step: '03. 감액/대기 일정 역산', desc: '임플란트 및 고액 크라운 수술이 필요할 경우, 90일 면책 및 1~2년 50% 감액기간의 종료 일정을 계산한 예약 설계' },
              { step: '04. 틀니 착용 여부 체크', desc: '현재 부분 틀니 또는 전체 틀니를 착용하고 계신지 확인하여 보철치료 가입 승인 한도 사전 심사 검토' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-teal-50/30 rounded-3xl border border-teal-100/50 hover:border-teal-200 transition-colors">
                <div className="shrink-0 font-black text-teal-700 text-sm w-full sm:w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-teal-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">치아보험 스마트 팁 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 치아가 완전히 깨끗하다면 면책 없는 진단형 공략<br />
              ② 가입 전 이미 뽑은 기발치 치아 임플란트는 보장 면책<br />
              ③ 상해 사고 타구 임플란트는 가입 첫날부터 전액 보장<br />
              ④ 2030 세대는 크라운 무제한 특약 꼼꼼히 구성<br />
              ⑤ 잇몸 건강 5년 무사고 시 대다수 무진단형 패스
            </p>
          </div>
          <div className="bg-white border border-teal-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-teal-500 w-5 h-5" /> 가입 최적 시점
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              치아는 한 번 손상되거나 잇몸 뼈가 녹기 시작하면 재생이 불가능하며 고액의 치료비가 발생합니다. 특히 충치로 통증이 발생한 뒤에는 무진단형 치아보험도 고지의무 위반에 해당해 가입이 전면 불가능해집니다. 따라서 자잘한 충치 통증이나 불편함을 느끼기 전, 가장 깨끗하고 건강한 치아 상태일 때 미리 월 2~3만원 대로 든든한 방어막을 구축하시는 것이 최선의 타이밍입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-teal-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 주요 보험사 치아·보철보험 상품 경쟁력 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '라이나생명', product: 'THE건강한치아보험', highlight: '국내 최초 치아보험 출시 브랜드로, 업계 우수의 지급 실적과 가장 방대한 임플란트 고액 지원 및 신속 정산 프로세스 제공', badges: ['대표 브랜드', '보철 지원 독보적'] },
            { company: '삼성화재', product: '다이렉트 치아보험', highlight: '간편한 모바일 사진 촬영 접수 및 개수 제한 없는 크라운/보존치료 개수 무제한 연계 혜택을 통한 가성비 최적화 상품', badges: ['대형사 신뢰', '크라운 무제한'] },
            { company: 'DB손해보험', product: '다이렉트 참좋은치아보험', highlight: '설계사 대면 수수료가 전액 절감된 초저가 다이렉트 전용 기본 보험료 책정으로 가벼운 월 부담금 제시', badges: ['최저 보험료', '실속 지향'] },
            { company: '메리츠화재', product: '다이렉트 이목구비보험', highlight: '치과 충치 치료뿐만 아니라 백내장 등 안과 질환, 이비인후과 질환 수술 비용까지 특약으로 폭넓게 동시 구성 가능', badges: ['이목구비 종합', '신속 심사'] },
            { company: 'KB손해보험', product: '다이렉트 치아보장보험', highlight: 'KB스타클럽 금융 혜택 및 간편 고지 승인 시스템이 모바일에 완벽 장착되어 3가지 간편 질문만으로 간편한 가입 제공', badges: ['금융 우대 연계', '간편 가입'] },
            { company: '한화손해보험', product: '다이렉트 하얀이치아보험', highlight: '자연치아 보존 치료 한도 최적화를 통해 충치 레진, 인레이 다수 치료 필요 고객에게 가장 매력적인 가격 제시', badges: ['보존치료 강자', '다이어트 요율'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-teal-50/20 rounded-2xl md:rounded-[2.5rem] border border-teal-100 hover:border-teal-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-teal-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-teal-700 bg-teal-100 px-3 py-1 rounded-full border border-teal-200"
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
      <div className="border-t border-teal-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "미래의 건강한 미소를 지켜내는 가장 든든한 저축.<br />
            <span className="text-teal-600">진단이력과 면책 감액 기간을 분석한 일관성 있고 현명한 맞춤 설계로 평생 치아 건강을 보호합니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-teal-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-teal-700 transition-all hover:scale-105 shadow-2xl shadow-teal-400/30 shrink-0"
          >
            치아 맞춤 보험 무료 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);
