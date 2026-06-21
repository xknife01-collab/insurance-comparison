import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Heart, ShieldCheck, Activity, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, AlertTriangle
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const SilsonExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-blue-50/10 px-2 sm:px-4 relative overflow-hidden" id="silson-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            대한민국 4,000만 명의 선택, 의료 안전망의 핵심
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            가장 든든한 제 2의 건강보험,<br />
            <span className="text-blue-600">올바른 의료실비보험 가이드</span>를 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            나에게 맞는 급여/비급여 최적 설계부터 4세대 전환 분석까지!<br />
            매년 갱신형 구조에 대비하는 합리적인 실손의료비 매칭 솔루션.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '4/5세대 실손', label: '보험료 최대 70~75% 다이어트', sub: '기존 1~3세대 대비 월등히 저렴' },
          { num: '급여 통원/입원', label: '의료비 본인부담 80% 보장', sub: '건강보험 적용 항목 실손 환급' },
          { num: '비급여 주사/도수', label: '비급여 치료비 50~70% 보장', sub: '도수치료, 주사제, MRI 집중 케어' },
          { num: '보험료 차등제', label: '비급여 미청구 시 추가 할인', sub: '합리적인 이용량 기반 할인/할증' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-blue-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
            <p className="text-2xl font-black text-blue-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 체크 3대 핵심 보장 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-blue-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">실손의료비 필수 체크 3대 보장</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            실손보험은 가입자의 병원비 지출을 실질적으로 방어해주는 기본 담보로,{' '}
            <span className="text-blue-600 font-black">반드시 숙지해야 할 3가지 보장 기둥</span>
            이 존재합니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '급여 치료 보장', label: '건강보험 적용 급여 항목의 80% 지원', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '입원실료, 수술비, 약제비, 통원 외래 비용 등 병원에서 행해지는 대다수 정규 치료 항목 포함' },
              { title: '비급여 특약 보장', label: '건강보험 비적용 고액 비급여 치료의 70% 지원', color: 'bg-indigo-50/50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '비급여 도수치료·체외충격파·증식치료(연간 350만 한도), 비급여 주사제, 비급여 MRI/MRA 든든하게 대비' },
              { title: '비급여 차등 할인', label: '안 쓰면 깎아주고, 많이 쓰면 할증되는 구조', color: 'bg-amber-50/50 border-amber-100', badge: 'text-amber-700 bg-amber-100', desc: '직전 1년간 비급여 보험금 수령액이 없는 경우 차기년도 비급여 보험료 최대 10% 추가 할인 혜택 제공' },
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

          <div className="mt-8 p-5 md:p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <p className="text-blue-700 font-black text-xs mb-1">⚠️ 4/5세대 실손보험 보험금 청구 및 전환 팁</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              급여 항목(본인부담금 20%)과 비급여 항목(4세대 30% / 5세대 비중증 비급여 50%)의 공제 기준을 미리 대조해 보세요. 특히 5세대 실손으로 전환 가입한 뒤에도 6개월 이내에 청구한 보험금이 없다면 기존 이전 세대 보험으로 복귀할 수 있어 부담 없이 검토 가능합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 보장 대상 제외 및 예외 룰 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Heart className="w-56 h-56 text-blue-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-blue-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">가입 전 필수 확인 면책/한도 안내</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  🚫 단순 미용 및 예방 목적 진료 면책
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  치료 목적이 아닌 **미용 성형수술, 피부과 레이저 시술, 노화로 인한 탈모 치료, 건강검진, 영양제 및 비타민 주사, 각종 예방접종**은 보장 대상에서 제외됩니다. 단, 의사의 소견에 따라 질병 치료를 목적으로 지출한 비용은 예외 보상 가능합니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-blue-500/20 rounded-2xl md:rounded-[2.5rem] border border-blue-400/30 hover:bg-blue-500/30 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  ⚖️ 세대별 가입 시기 및 자기부담금 비율
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  1세대(~2009년 9월, 본인부담 거의 없음), 2세대(2009년 10월~2017년 3월, 본인부담 10~20%), 3세대(2017년 4월~2021년 6월, 비급여 특약형), 4세대(2021년 7월~2026년 4월, 급여 20%/비급여 30%), 5세대(2026년 5월~현재, 급여 20%/중증비급여 30%/비중증비급여 50%). 갱신 주기와 본인의 통원 횟수를 고려한 리모델링이 필요합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-blue-400 font-black text-xs mb-1 uppercase tracking-widest">💡 유병자/만성질환 가입 특례</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              당뇨, 고혈압 등의 만성 질환으로 정기 처방을 받고 계시거나, 과거 치료 이력이 있는 유병력자분들도 **3가지 간편 고지 질문**만 통과하면 간편 유병자 실손의료보험을 통해 핵심 수술/입원 실손 의료비를 확보할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 4세대 실손보험 전환 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-400/30">
              <Sparkles className="w-3 h-3" /> 최근 실손보험 전환 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">가파르게 오르는 갱신 보험료 절감, 4/5세대 실손 대세</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              매년 또는 3~5년마다 지나치게 급증하는 1~3세대 실손 보험료가 부담스러우신 분들을 중심으로 '4/5세대 실손' 계약 전환이 본격화되고 있습니다. 2026년 5월 출시된 5세대 실손은 과잉 의료 항목인 비중증 비급여 보장을 합리적으로 줄여 보험료를 더욱 인하함과 동시에, 기존에는 보장하지 않았던 임신·출산 및 소아 발달장애 급여 진료비를 신규 보장하여 가입자 혜택을 넓혔습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: '기본 보험료 50%~75% 절약', desc: '1~3세대 대비 대폭 저렴한 초저가 기본 요율 설계', info: '기존 월 6~8만원 대 실비 ➔ 월 1~2만원 대로 다이어트' },
              { title: '비급여 미청구 시 10% 자동 할인', desc: '직전년도 보험금 미수령자 대상 매년 추가 보험료 인하', info: '의료 쇼핑 없는 실속 가입자 우대 제도 작동' },
              { title: '무심사 4/5세대 간편 계약 전환권', desc: '기존 가입 보험사 내에서는 복잡한 신규 인수심사 없이 다이렉트 전환', info: '병력이 생긴 고연령층도 무심사 전환 가능' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.desc, isUnlocked)}</p>
                </div>
                <p className="font-black text-blue-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{item.info}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-blue-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-blue-500" /> 합리적 실손보험 스마트 가입/전환 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 연간 비급여 치료액', desc: '도수치료, 비급여 주사 등의 연간 이용 빈도를 파악하여 할인/할증 등급 및 5세대 비중증 비급여 자부담 상향(50%) 유불리 판단' },
              { step: '02. 연령별 인상폭 예측', desc: '50대 이상 고연령층의 경우 기존 실손보험의 만기 시점 갱신 예상액과 4/5세대 격차 시뮬레이션 대조' },
              { step: '03. 전환 무심사 여부 검토', desc: '질병 치료 중이거나 약을 복용 중이라도 기존 가입사 계약전환권을 활용해 무심사로 전환 가능한지 체크' },
              { step: '04. 중대 질병 진단비 보완', desc: '실손 단독 설계 시 발생할 수 있는 중대 수술비 공백을 비갱신형 3대 진단비(암, 뇌, 심장)와 병행 결합' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50 hover:border-blue-200 transition-colors">
                <div className="shrink-0 font-black text-blue-700 text-sm w-full sm:w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-blue-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">실손보험 스마트 팁 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 4/5세대 전환 시 계약전환 할인(최대 3년간 50% 할인) 혜택 체크<br />
              ② 5세대 실손 신규 보장(임신·출산, 발달장애 급여) 적용 대상 여부 확인<br />
              ③ 소액 외래 통원 치료비는 모바일 실시간 즉각 청구 가능<br />
              ④ 실비의 공제 금액 기준(급여 20% / 5세대 비중증 비급여 50%) 파악<br />
              ⑤ 중복 가입 하더라도 실손은 비례보상(이중 지급 불가) 됨을 숙지
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-blue-500 w-5 h-5" /> 가입 최적 시점
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              실손의료비는 질병이 생기거나 나이가 많아지면 인수 심사가 가장 까다로워지는 진입장벽이 높은 상품입니다. 한 살이라도 젊고 전혀 아픈 곳이 없는 건강한 상태일 때 다이렉트 단독 실손으로 즉각적인 안심 장치를 장착해두시는 것이 평생의 병원비 리스크를 제로로 만드는 골든 타임입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-blue-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 주요 손해보험사 실손의료비보험 상품 경쟁력 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '삼성화재', product: '다이렉트 실손의료비보험', highlight: '압도적인 자금력을 기반으로 한 가장 빠르고 투명한 보험금 지급 심사 프로세스 및 모바일 앱 편의성 제공', badges: ['지급 심사 우수', '대표 브랜드'] },
            { company: '현대해상', product: '다이렉트 실손의료비보장보험', highlight: '태아/어린이 실손 선두를 달성한 신뢰도 높은 설계 요율, 폭넓은 연령대별 상해 급여 보상 네트워크 보유', badges: ['어린이 실손 최우수', '상해 치료 특화'] },
            { company: 'DB손해보험', product: '다이렉트 실손의료비보험', highlight: '다이렉트 전용 수수료가 전면 배제된 매우 합리적인 월 기본 가격대 형성, 기존 가입자 계약 전환 케어 우수', badges: ['실속 보험료', '계약전환 간편화'] },
            { company: '메리츠화재', product: '다이렉트 실손의료비보험', highlight: '소액 외래 진단비 및 약제 처방 청구 서류 간소화, 통원 도수치료 및 비급여 특약 보상 청구 절차 원스톱 승인', badges: ['신속 심사', '소액청구 특화'] },
            { company: 'KB손해보험', product: '다이렉트 실손의료비보장보험', highlight: 'KB금융 계열사 통합 금융 혜택 연동 및 주택화재/자동차보험과의 간편 패키지 결합 우대 혜택 보유', badges: ['그룹 결합 우대', '쉽고 빠른 UI'] },
            { company: '한화손해보험', product: '다이렉트 실손의료비보험', highlight: '월 납입 비용 다이어트에 초점을 맞춘 합리적이고 매력적인 하루 실비 요율 책정으로 실속 지향 고객에게 우수', badges: ['가성비 집중', '실속 다이어트'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-blue-50/20 rounded-2xl md:rounded-[2.5rem] border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-blue-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200"
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
      <div className="border-t border-blue-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "가장 기본적인 것이 가장 든든한 방패가 됩니다.<br />
            <span className="text-blue-600">개인별 병원 이용량과 갱신 인상 리스크를 정밀 분석한 정밀 매칭으로 함께합니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-2xl shadow-blue-400/30 shrink-0"
          >
            의료실비 맞춤 보험 무료 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);
