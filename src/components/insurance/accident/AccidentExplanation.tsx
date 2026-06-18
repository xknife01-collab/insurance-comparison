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

export const AccidentExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-red-50/10 px-2 sm:px-4 relative overflow-hidden" id="accident-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-red-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            갑작스러운 사고와 고액의 수술비로부터 가계를 지키는 든든한 방어막
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            예측 불가능한 상해 사고 걱정 끝,<br />
            <span className="text-red-600">합리적인 상해보험 선택 기준</span>을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            상해 사망/후유장해는 물론, 깁스치료와 미끄러짐 사고까지!<br />
            비운전자 감면 혜택과 야외 레저 특약으로 가성비 100% 극대화 설계.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '비운전자 할인', label: '차량 미운전 시 즉시 적용', sub: '5% ~ 10% 보험료 추가 감면 혜택' },
          { num: '치아파절 기본보장', label: '골절진단비 내 치아 포함', sub: '가입 전 약관의 제외 조항 확인 필수' },
          { num: '후유장해 전 구간', label: '3%부터 100% 장해율 지급', sub: '고도장해(80% 이상) 한정 특약 피하기' },
          { num: '레저 스포츠 특약', label: '등산/골프 등 야외 사고 케어', sub: '저렴한 월 1천 원대로 든든한 보강' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-red-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-red-200 transition-all group">
            <p className="text-2xl font-black text-red-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 핵심 3대 질환 가이드 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-red-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-red-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">필수 체크 3대 핵심 보장</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            재해 사고 시 가장 중대한 신체적 피해와 직접 치료 비용을 방어하는{' '}
            <span className="text-red-600 font-black">상해보험 핵심 3대 가이드</span>
            입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '사망/후유장해', label: '상해 사고로 인한 신체적 영구 장해 보장', color: 'bg-red-50/50 border-red-100', badge: 'text-red-700 bg-red-100', desc: '장해지급률(3%~100%)에 따라 가입 금액을 곱하여 정액 지급되며, 경제 활동 기간 소득 상실을 대체하는 핵심 담보' },
              { title: '골절/깁스 치료', label: '일상 낙상, 미끄러짐 및 골절 치료비 보강', color: 'bg-rose-50/50 border-rose-100', badge: 'text-rose-700 bg-rose-100', desc: '뼈가 깨지거나 금이 간 경우 지급되며, 통깁스치료 외에 최근 반깁스까지 보장하는 최신 특약 조건 확인 권장' },
              { title: '상해수술/입원', label: '사고로 인한 수술 및 입원 치료비 반복 지급', color: 'bg-orange-50 border-orange-100', badge: 'text-orange-700 bg-orange-100', desc: '상해 사고로 수술 시 회당 정액 지급되며, 첫날부터 보장되는 상해입원일당을 추가하여 치료 기간 보장' },
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

          <div className="mt-8 p-5 md:p-6 bg-red-50 rounded-3xl border border-red-100">
            <p className="text-red-700 font-black text-xs mb-1">⚠️ 계약 후 알릴 의무 (통지의무)</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              상해보험은 가입 시 직업과 직무 위험군에 따라 요율이 결정되므로, 가입 후 **이직, 부서 이동, 주행 용도 변경(영업용/이륜차 사용 등)** 시 반드시 보험사에 변경 사실을 서면 통지해야 합니다. 불이행 시 보험금이 크게 삭감되거나 계약이 해지될 수 있습니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 직업급수와 고지/통지의무 작동 원리 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Heart className="w-56 h-56 text-red-600" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-red-600 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-red-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">직업위험도(급수)와 요율 작동 방식</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-red-300 mb-2 flex items-center gap-2">
                  💼 직업 위험 분류 (1급 ~ 3급)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  위험이 낮은 사무직·학생은 1급, 서비스·외근직은 2급, 제조업·현장직·배달원은 3급으로 분류됩니다. 급수가 올라갈수록 상해 위험에 비례하여 보험료가 높게 책정되며 가입 금액 한도가 축소됩니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-red-300 mb-2 flex items-center gap-2">
                  🏍️ 이륜차 및 차량 주행 목적 고지
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  오토바이(이륜차)의 상시 이용 여부 및 자가용 vs 영업용 배달·화물 주행 용도는 상해 등급 산정에 큰 비중을 차지하므로 가입 시 정확하게 알려야 합니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-red-600/20 rounded-2xl md:rounded-[2.5rem] border border-red-400/30 hover:bg-red-600/30 transition-colors">
                <p className="font-black text-red-300 mb-2 flex items-center gap-2">
                  🚗 비운전자 할인 제도 (최대 10% 감면)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  대중교통만 이용하고 평소 운전을 전혀 하지 않는 경우 '비운전자' 요율을 적용받을 수 있습니다. 일반 운전 대비 사고율이 낮아 보험료를 최대 10% 가깝게 아낄 수 있는 실속 팁입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-red-400 font-black text-xs mb-1 uppercase tracking-widest">💡 치아파절 포함 여부 확인법</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "사고로 앞니가 깨지는 등 치아 파절(코드 S02.5)은 일상 상해 중 다발하는 재해입니다. 대다수 보험사가 가격 경쟁을 위해 '골절진단비(치아파절 제외)'로 설계하는 경우가 많으므로 반드시 '치아파절 포함' 특약이 들어가 있는지 대조해 보세요."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 아웃도어 및 응급실 내원 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-red-400/30">
              <Sparkles className="w-3 h-3" /> 최신 아웃도어 상해 동향
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">야외 스포츠 취미 인구 급증과 전용 레저 특약</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              등산, 러닝, 자전거 라이딩, 골프 등 아웃도어 스포츠의 보편화로 주말이나 취미 중 일어나는 근골격계 상해 사고율이 높아지고 있습니다. 월 1~2천 원대의 저렴한 레저 특약을 믹스매치하여 치료 한도를 크게 넓히는 것이 유리합니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '레저 스포츠 상해', product: '등산/골프/자전거 사고 집중 보강', limit: '골절 및 깁스비 추가 지원', note: '취미 활동 중 발생한 물리 충격 골절 및 외상 수술 케어' },
              { company: '주말 상해 고액 보장', product: '휴일 교통/재해 특약', limit: '사망/장해 시 최고 2배 지급', note: '주말 야외 나들이 차량 통행 중 돌발 재해에 특화 설계' },
              { company: '비운전자 할인 특약', product: '대중교통 이용자 요율 혜택', limit: '최대 10% 상시 보험료 감면', note: '소유 차량 유무와 무관하게 실질 운전을 하지 않는 피보험자 우대' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {maskCompany(item.company, isUnlocked)}{' '}
                    <span className="text-red-300 text-xs font-bold ml-1">{maskProductName(item.product, isUnlocked)}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-red-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{maskText(item.limit, isUnlocked)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-red-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-red-600" /> 합리적 상해보험 스마트 가입 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 직무 변경 통지', desc: '이직이나 위험 업무 전환 시 보험사에 고지 의무를 이행했는지 확인하여 지급 분쟁 미연 방지' },
              { step: '02. 치아파절 보장 대조', desc: '다이렉트 골절 특약 중 치아 제외 문구가 포함되어 있는지 약관 확인 및 포함 조건 우대 가입' },
              { step: '03. 후유장해 3% 이상', desc: '80% 이상 고도장해 조건은 혜택을 받기 극히 어려우므로 3% 이상 전 구간 장해 보강 필수' },
              { step: '04. 레저/주말 특약 추가', desc: '레저 취미 생활을 즐기는 경우 1~2천 원짜리 주말/특정 상해 추가로 한도 중복 확대 적용' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-red-50/30 rounded-3xl border border-red-100/50 hover:border-red-200 transition-colors">
                <div className="shrink-0 font-black text-red-700 text-sm w-full sm:w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-red-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">상해 리모델링 핵심 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 이직 시 통지의무 누락 확인<br />
              ② 골절진단비 치아파절 포함 여부 체크<br />
              ③ 상해후유장해 3%~100% 한도 충분히 확보<br />
              ④ 반깁스 및 일상 수술비 특약 설계<br />
              ⑤ 비운전자 할인 대상인지 확인하여 10% 세이빙
            </p>
          </div>
          <div className="bg-white border border-red-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-red-600 w-5 h-5" /> 라이프 사이클 위험 시기
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              야외 스포츠 활동이 활발한 청장년층 시기에는 기동성 상해와 레저 사고 위험이 높고, 고령 시기에는 낙상으로 인한 척추/골반 골절 및 고관절 후유장해 리스크가 집중되므로 연령별 필요 한도 조율이 필요합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-red-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 대표 5대 보험사 상해보험 경쟁력 전수 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '삼성화재', product: '다이렉트 상해 안심케어', highlight: '브랜드 인지도 우수, 수술비 및 깁스 보장 한도 넉넉, 일상생활 배상책임 특약 연계 최적', badges: ['가입 신뢰도 1위', '배상책임 연계'] },
            { company: '현대해상', product: '무배당 현대해상 상해케어', highlight: '레저/스포츠 특약 다양화, 자전거/골프 주말 돌발 사고 추가 지급 조건 업계 우수한 수준', badges: ['레저스포츠 강자', '주말 나들이 특화'] },
            { company: 'DB손해보험', product: '참좋은 상해보험', highlight: '직업 위험군별 가입 한도 우대 적용, 중대 후유장해 시 가계 안전을 위한 연금식 분할 지급 지원', badges: ['현장직 인수 우대', '생활자금 옵션'] },
            { company: 'KB손해보험', product: 'KB 다이렉트 상해보험', highlight: '일상 미끄러짐 및 단순 골절/깁스 정액 진단비 최적 요율 매칭, 비운전자 감면 폭 최다', badges: ['골절/깁스 강점', '비운전 할인 우수'] },
            { company: 'Meritz 메리츠화재', product: '메리츠 올바른 상해보험', highlight: '2~3급 고위험군 직무 인수 기준 완화, 다발 사고에 대한 모바일 간편 청구 및 보상금 신속 지급 연동', badges: ['3급 한도 완화', '신속 보상 강자'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-red-50/20 rounded-2xl md:rounded-[2.5rem] border border-red-100 hover:border-red-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-red-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-red-700 bg-red-100 px-3 py-1 rounded-full border border-red-200"
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
      <div className="border-t border-red-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "가장 활동적인 오늘부터 노후의 낙상 위험까지,<br />
            <span className="text-red-600">균형 잡힌 고지와 세밀한 비교 진단을 통해 언제 발생할지 모르는 일상 리스크에 든든한 방패를 세워 드립니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-red-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-red-700 transition-all hover:scale-105 shadow-2xl shadow-red-600/30 shrink-0"
          >
            나의 맞춤 상해보험 무료 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);
