/**
 * 재가/시설 간병보험 완전 가이드 섹션
 */

import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Home, Building2, HeartHandshake, ShieldCheck, BadgeAlert, Sparkles,
  UserCheck, Clock, Quote, ClipboardCheck, AlertTriangle, ShieldAlert, FileText
} from 'lucide-react';

export const NursingSection = ({ onAction, isUnlocked }: { onAction: () => void, isUnlocked?: boolean }) => (
  <section className="py-32 bg-pink-50/20 px-2 sm:px-4 relative overflow-hidden" id="nursing-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-xs font-black mb-6 border border-pink-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
            초고령 사회의 필수 선택, 재가/시설 요양보험 완전 해부
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            사는 곳은 달라져도 <span className="text-pink-600">돌봄의 격</span>은<br />
            유지되도록 든든하게 지켜드립니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-70">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            국가 공인 장기요양보험의 15%~20% 본인부담금과 비급여 식재료비까지!<br />
            방문요양(재가) 및 요양시설 이용 시 발생하는 실제 경제적 부담을 대비하는 가이드.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
        {[
          { num: '80%+',   label: '재가급여 이용자 비율',      sub: '익숙한 자택 중심 요양 선호' },
          { num: '15~20%', label: '국가 요양 본인부담금',    sub: '재가 15%, 시설 20% (비급여 제외)' },
          { num: '6.5년',  label: '평균 장기요양 이용 기간',  sub: '장기적인 생활비 매칭 고려 필요' },
          { num: '월 40~60만', label: '요양시설 비급여 식비 평균',  sub: '정부 미지원 식재료비 등 개인 부담' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-pink-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-pink-200 transition-all group">
            <p className="text-3xl font-black text-pink-600 mb-2 group-hover:scale-110 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-400 font-bold text-center mb-16">
        * 통계 출처: 국민건강보험공단 『2023/2024 노인장기요양보험 통계연보』 공시 기준
      </p>

      {/* ── [예시 기준 및 법적 필수 고지] 표준 산출 기준 및 재가/시설 요양보험 4대 핵심 유의사항 ── */}
      <div className="bg-pink-50/80 border border-pink-200 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm mb-16">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0 text-pink-700 mt-1">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs text-slate-700 space-y-3 leading-relaxed">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-slate-900 text-sm">💡 [예시 기준 안내] 본 페이지에 안내된 보장 예시 금액 및 보험료 산출 기준</span>
              <span className="bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded text-[10px]">생명·손해보험협회 공시 기준</span>
            </div>
            <p className="font-bold text-slate-800">
              • **표준 예시 산출 기준**: 무배당 재가·시설 장기요양보험 / 60세 남성 및 여성 (상해 1급 사무직) / 20년납 90세만기 / 무해지환급형(해약환급금 미지급형) / 주계약 및 주요 특약: 장기요양(1~5등급) 재가급여지원금 월 50만 원(월 1회 이상 실제 이용 시), 시설급여지원금 월 50만 원(노인요양시설 입소 시) 기준 예시 월 보험료: 60세 남성 약 32,400원, 60세 여성 약 37,800원 (가입자의 연령, 성별, 건강상태, 가입금액 및 회사별 심사 기준에 따라 실제 보험료는 상이할 수 있습니다).
            </p>
            <div className="pt-2.5 border-t border-pink-200 text-[11px] text-slate-600 space-y-1.5">
              <p>• **재가급여 매월 지급 필수 요건**: 재가급여 지원금은 단순히 장기요양 1~5등급 판정만으로 자동 지급되지 않으며, 공인된 장기요양기관을 통해 방문요양·방문목욕·주야간보호·방문간호 등을 **월 1회 이상 실제로 이용하고 급여이용기록지(영수증)가 제출되어야 매월 지급**됩니다.</p>
              <p>• **시설급여 vs 요양병원 입원 구분 필수**: 장기요양 시설급여는 노인복지법상 인가받은 '노인요양시설(요양원)' 입소 시에만 지급되며, **의료법상 의료기관인 '요양병원' 입원 시에는 시설급여 지원금이 지급되지 않습니다.**</p>
              <p>• **면책기간(책임개시일) 및 감액기간 안내**: 치매 및 노인성 질환에 대해 가입 후 90일 또는 1년의 면책기간(책임개시일 이전 판정 시 보장 제외 및 계약 무효)이 적용될 수 있으며, 가입 후 1~2년 이내 판정 시 가입금액의 50%만 지급되는 감액기간이 적용될 수 있습니다.</p>
              <p>• **지정대리청구인 제도 필수 안내**: 중증 치매나 와상 상태로 인해 피보험자 본인이 보험금을 직접 청구하기 어려운 상황에 대비하여, 가입 시 반드시 배우자나 자녀 등 가족을 '지정대리청구인'으로 사전 등록해야 원활한 수령이 가능합니다.</p>
              <p>• **무해지환급형 상품 안내**: 보험료 납입기간 중 계약 해지 시 해약환급금이 전혀 없거나 일반 표준형보다 적을 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 장기요양제도 해설 + 보장 설계 전략 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* 제도 설명 카드 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-pink-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-pink-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <ClipboardCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-pink-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">장기요양 제도 해설</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            국민건강보험공단에서 판정하는{' '}
            <span className="text-pink-600 font-black">장기요양등급(1~5등급)</span>에
            따라 정부 지원금과 개인 부담 한도가 결정됩니다.
          </p>

          <div className="space-y-3">
            {[
              { grade: '1~2등급', label: '와상/중증 상태', color: 'bg-red-50 border-red-100', badge: 'text-rose-700 bg-rose-100', desc: '시설급여(요양원) 입소 중심 — 본인부담 20%' },
              { grade: '3~4등급', label: '거동불편 상태', color: 'bg-pink-50/50 border-pink-100', badge: 'text-pink-700 bg-pink-100', desc: '재가급여(방문요양) 중심 — 본인부담 15% ✅' },
              { grade: '5등급',   label: '치매특별 등급', color: 'bg-amber-50 border-amber-100', badge: 'text-amber-700 bg-amber-100', desc: '치매 전문 요양보호사 매칭 및 인지훈련' },
              { grade: '인지지원', label: '초기 경증치매', color: 'bg-blue-50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '주야간보호센터 이용 위주 보장 확대 추세' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 ${item.badge}`}>{item.grade}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-pink-50 rounded-3xl border border-pink-100">
            <p className="text-pink-700 font-black text-xs mb-1">⚠️ 핵심 체크포인트</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              정부의 장기요양보험은 한도 초과금액 및 식비/이용료 등{' '}
              <span className="text-pink-600 font-black">비급여 항목을 보장하지 않습니다.</span>
              민간 보험으로 매월 지급받는 재가/시설 지원금이 이 공백을 완화하는 데 큰 도움이 됩니다.
            </p>
          </div>
        </div>

        {/* 보장 설계 전략 카드 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Home className="w-56 h-56" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-pink-500 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-pink-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">재가 vs 시설 설계 전략</h3>
              </div>
            </div>

            <div className="space-y-6">
              {/* 재가급여 중심 */}
              <div className="p-5 md:p-8 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-pink-300 mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4" /> 재가급여 보장 (자택형)
                </p>
                <p className="text-sm opacity-75 font-bold leading-relaxed mb-4">
                  방문요양보호사 파견, 목욕, 간호 및 주야간보호센터 이용료 지원. 매월 사용 횟수(최소 월 1회 이상) 조건 충족 시 지급.
                </p>
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-black">
                  <div className="bg-white/10 rounded-2xl p-3">
                    <p className="text-pink-300">표준 지급액</p>
                    <p className="text-white mt-1">월 30~50만 원</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3">
                    <p className="text-pink-300">최대 한도형</p>
                    <p className="text-white mt-1">월 70~100만 원</p>
                  </div>
                </div>
              </div>

              {/* 시설급여 중심 */}
              <div className="p-5 md:p-8 bg-pink-500/20 rounded-2xl md:rounded-[2.5rem] border border-pink-400/30 hover:bg-pink-500/30 transition-colors">
                <p className="font-black text-pink-300 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> 시설급여 보장 (요양원형)
                </p>
                <p className="text-sm opacity-75 font-bold leading-relaxed mb-3">
                  장기요양 등급(1~2등급 또는 3~4등급 중 공단 입소 승인 시) 판정 후 요양시설 입소 시 고정 식비 및 본인부담금 집중 보전.
                </p>
                <div className="space-y-2 text-xs font-bold opacity-75">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                    매월 30~100만 원 평생 또는 보장기간 지급
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                    요양병원 간병비와 중복 보장 체크 필수
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-pink-400 font-black text-xs mb-1 uppercase tracking-widest">💡 요약 팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "부모님 거동이 다소 양호하신 초기에는 재가급여 위주로 요양보호사 도움을 받고,
              장기 와상 상태가 심화되면 요양원으로 이전하는 것이 정석입니다. 따라서 **복합형(하이브리드)** 설계가 이상적입니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 2025~2026 트렌드: 체증형 재가 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-pink-400/30">
              <Sparkles className="w-3 h-3" /> 2025~2026 인플레이션 극복 전략
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">체증형 재가/시설 특약 등장</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              요양보호사 인건비와 물가 상승에 발맞추어,
              가입 시 정해진 한도가 고정되는 것이 아니라 **매년 5%씩 또는 특정 주기로 보장액이 늘어나는 체증형 구조**가 큰 인기를 얻고 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: 'DB손해보험', product: '참좋은재가시설요양', limit: '매년 5% 복리 체증', note: '가입 10년 후 지급액 단계적 증액' },
              { company: '흥국화재',   product: '흥국재가케어간병',   limit: '단기요양 일당 체증 추가', note: '실속형 기본 보장 구조 연계' },
              { company: 'KB손해보험', product: 'KB요양방문케어보험', limit: '재가 월 최대 100만 원', note: '충분한 생활자금 중심 설계' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {maskCompany(item.company, isUnlocked)}{' '}
                    <span className="text-pink-300 text-xs font-bold ml-1">{maskProductName(item.product, isUnlocked)}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-pink-400 text-sm shrink-0 ml-4">{maskText(item.limit, isUnlocked)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 장기요양등급 연계 보장 상세 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-pink-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-pink-500" /> 국가 공인 수급자 의무 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 수급 자격 확인', desc: '만 65세 이상 또는 만 65세 미만 중 노인성 질병(뇌졸중, 치매 등) 보유자' },
              { step: '02. 공단 등급 신청', desc: '국민건강보험공단 지사 방문/인터넷 신청 후 의사소견서 제출 및 현장 조사' },
              { step: '03. 등급 판정 완료', desc: '1~5등급 또는 인지원등급 판정서 수령 및 장기요양인정서 확보' },
              { step: '04. 서비스 개시', desc: '공인된 재가복지센터 혹은 요양원 계약 후 서비스를 월 1회 이상 실제로 이용하고 증빙 제출' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-pink-50/30 rounded-3xl border border-pink-100/50 hover:border-pink-200 transition-colors">
                <div className="shrink-0 font-black text-pink-700 text-sm w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-pink-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">가입 시 핵심 체크</h4>
            <p className="text-xs font-bold opacity-80 leading-relaxed">
              ① 요양등급 이력 전(건강할 때) 가입<br />
              ② 재가와 시설을 모두 아우르는 하이브리드<br />
              ③ 대리청구인 미리 지정<br />
              ④ 면책기간(90일) 및 감액기간 유무<br />
              ⑤ 100세 만기로 안정적인 보장
            </p>
          </div>
          <div className="bg-white border border-pink-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-pink-500 w-5 h-5" /> 90일 면책 조항
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              가입 후 질병 책임개시일(90일~1년) 내 판정 시 보장에서 제외될 수 있으며, 등급 판정 후 월 1회 이상 공인 서비스 이용 증빙이 확인되어야 보험금이 지급됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 보험사별 주요 상품 비교 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-pink-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          주요 보험사 재가/시설 요양보험 대표 상품 안내 (생·손해보험협회 공시 기준)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '흥국화재',   product: '흥국재가케어간병보험',   highlight: '실속형 보험료 설계 및 방문요양·방문목욕 특화', badges: ['가성비 재가', '방문요양 특화'] },
            { company: 'DB손해보험', product: '참좋은재가시설요양',     highlight: '체증형 한도 매년 5% 상승 옵션 운영', badges: ['체증형', '브랜드 선두'] },
            { company: 'KB손해보험', product: 'KB요양방문케어보험',     highlight: '국가 인지지원등급부터 보장 개시, 요양원 입소 지원',   badges: ['인지지원', '요양원특약'] },
            { company: '삼성화재',   product: '마이핏 요양케어',        highlight: '치매 진단비와 재가급여 보장 동시 탑재 하이브리드', badges: ['치매+LTC 통합', '든든보장'] },
            { company: '라이나생명', product: '방문요양시설종합보험',   highlight: '고령층 전용 간편고지 심사 및 재가급여 집중 보장',   badges: ['고연령 플랜', '재가전문'] },
            { company: '교보생명',   product: '교보더안심LTC간병',       highlight: '생명보험 특유의 매월 연금식 장기 간병자금 종신 지급', badges: ['종신연금형', '대리청구'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-pink-50/20 rounded-2xl md:rounded-[2.5rem] border border-pink-100 hover:border-pink-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-pink-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-pink-700 bg-pink-100 px-3 py-1 rounded-full border border-pink-200"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 금융소비자보호법 필수 법적 고지문 ── */}
      <div className="mb-20 bg-slate-100 rounded-3xl p-6 md:p-10 border border-slate-200 text-slate-600 text-xs space-y-3 leading-relaxed">
        <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
          <ShieldAlert className="w-5 h-5 text-pink-600" /> 금융소비자보호법에 따른 소비자 권익 및 가입 유의사항
        </div>
        <p>
          • **계약 전 설명의무**: 보험계약 체결 전 반드시 해당 상품설명서 및 약관을 상세히 확인하시기 바랍니다. 본 안내는 소비자의 이해를 돕기 위한 요약 자료이며 실제 보상 및 계약 내용은 해당 약관에 따릅니다.
        </p>
        <p>
          • **예금자보호법 안내**: 본 보험상품은 예금자보호법에 따라 해약환급금(또는 만기 시 보험금)에 기타지급금을 합하여 1인당 "5천만 원까지"(본 금융회사 등의 모든 예금보호 대상 금융상품 합산) 보호됩니다. 5천만 원을 초과하는 나머지 금액은 보호되지 않습니다.
        </p>
        <p>
          • **기존 계약 해지 후 신계약 체결 시 불이익**: 기존 보험계약을 해지하고 신규 보험계약을 체결하는 경우, 피보험자의 질병 이력이나 연령 증가 등으로 인하여 인수가 거절되거나 보험료가 인상될 수 있으며, 새로운 면책기간 및 감액기간이 적용될 수 있습니다.
        </p>
        <p>
          • **시설급여와 요양병원 입원 구분**: 본 보험의 장기요양 '시설급여' 지원금은 노인복지법상 노인요양시설(요양원) 입소 시에만 적용되며, 의료법상 '요양병원' 입원 시에는 시설급여가 지급되지 않습니다.
        </p>
        <p>
          • **대리점 지위 고지**: 본 플랫폼(보험대리점)은 다수의 보험사와 계약을 체결하고 중개하는 금융상품판매대리·중개업자로서, 보험사로부터 계약체결권을 부여받지 아니하며 직접 보험계약을 체결할 수 없습니다.
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-pink-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "가장 편안한 내 집에서 존엄하게 나이 드는 것,<br />
            <span className="text-pink-600">객관적인 데이터 비교를 통해 든든한 요양 자산을 세워 드립니다.</span>"
          </p>
        </div>
        <button
          onClick={onAction}
          className="bg-pink-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-pink-700 transition-all hover:scale-105 shadow-2xl shadow-pink-400/30 shrink-0"
        >
          재가/시설 보험료 실시간 비교 상담하기
        </button>
      </div>

    </div>
  </section>
);
