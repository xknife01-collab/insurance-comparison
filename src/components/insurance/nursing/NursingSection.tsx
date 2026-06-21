/**
 * 재가/시설 간병보험 완전 가이드 섹션
 */

import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Home, Building2, HeartHandshake, ShieldCheck, BadgeAlert, Sparkles,
  UserCheck, Clock, Quote, ClipboardCheck
} from 'lucide-react';

export const NursingSection = ({ onAction, isUnlocked }: { onAction: () => void, isUnlocked?: boolean }) => (
  <section className="py-32 bg-pink-50/20 px-2 sm:px-4 relative overflow-hidden" id="nursing-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
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
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            국가 공인 장기요양보험의 15%~20% 본인부담금과 비급여 식재료비까지!<br />
            빈틈없이 채워주는 방문요양(재가) 및 요양시설 특화 보험 가이드.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '80%',    label: '재가급여 선호 비율',      sub: '익숙한 자택 요양 대세' },
          { num: '15~20%', label: '국가 요양 본인부담금',    sub: '개인이 부담해야 할 실손 영역' },
          { num: '6.5년',  label: '평균 장기요양 이용 기간',  sub: '장기적인 생활비 매칭 필수' },
          { num: '월 50만', label: '요양원 비급여 식비 평균',  sub: '정부 미지원 비급여 항목 대비' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-pink-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-pink-200 transition-all group">
            <p className="text-3xl font-black text-pink-600 mb-2 group-hover:scale-110 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
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
              민간 보험으로 매월 지급받는 재가/시설 지원금이 이 공백을 완전히 메워줍니다.
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
              { company: 'DB손해보험', product: '참좋은재가시설요양', limit: '매년 5% 복리 체증', note: '가입 10년 후 지급액 1.5배 돌파' },
              { company: '흥국화재',   product: '흥국재가케어간병',   limit: '단기요양 일당 체증 추가', note: '가장 저렴한 기본형 대비 고효율' },
              { company: 'KB손해보험', product: 'KB요양방문케어보험', limit: '재가 월 최대 100만 원', note: '업계 최대 한도 일시적 운영' },
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
              { step: '04. 서비스 개시', desc: '공인된 재가복지센터 혹은 요양원 계약 후 서비스를 월 1회 이상 실제로 이용' },
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
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
              가입 직후 치매나 뇌질환 진단 시 면책될 수 있어 최소 <span className="text-pink-600 font-bold">90일 이전</span> 가입 및 유지 상태를 권장합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 보험사별 주요 상품 비교 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-pink-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          LTC 재가/시설 보험사별 대표 상품 비교 (2025~2026)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '흥국화재',   product: '흥국재가케어간병보험',   highlight: '초경쟁력 있는 보험료 설계', badges: ['가성비 재가', '방문요양 특화'] },
            { company: 'DB손해보험', product: '참좋은재가시설요양',     highlight: '체증형 한도 매년 5% 상승', badges: ['체증형', '브랜드 선두'] },
            { company: 'KB손해보험', product: 'KB요양방문케어보험',     highlight: '인지지원등급 보장 개시',   badges: ['인지지원', '요양원특약'] },
            { company: '삼성화재',   product: '마이핏 요양케어',        highlight: '치매와 재가 보장 동시 탑재', badges: ['치매+LTC 통합', '든든보장'] },
            { company: '라이나생명', product: '방문요양시설종합보험',   highlight: '무제한 갱신 고령층 가입',   badges: ['고연령 무심사', '재가전문'] },
            { company: '교보생명',   product: '교보더안심LTC간병',       highlight: '생명보험 특유의 매월 연금식', badges: ['종신연금형', '대리청구'] },
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

      {/* ── CTA ── */}
      <div className="border-t border-pink-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "가장 편안한 내 집에서 존엄하게 나이 드는 것,<br />
            <span className="text-pink-600">재가/시설 요양보험이 준비해 드립니다.</span>"
          </p>
        </div>
        <button
          onClick={onAction}
          className="bg-pink-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-pink-700 transition-all hover:scale-105 shadow-2xl shadow-pink-400/30 shrink-0"
        >
          재가/시설 보험료 실시간 비교하기
        </button>
      </div>

    </div>
  </section>
);
