import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  ShieldCheck, ShieldAlert, Sparkles, Brain, Heart,
  Clock, Activity, AlertTriangle, CheckCircle, Star,
  Stethoscope, UserCheck, Quote, ChevronRight, Zap
} from 'lucide-react';

export const ChildSickSection = ({ onAction, isUnlocked }: { onAction: () => void, isUnlocked?: boolean }) => (
  <section className="py-32 bg-blue-50/20 px-2 sm:px-4 relative overflow-hidden" id="child-sick-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            일반 보험 거절? 포기하지 마세요 — 간편고지 전용 프리패스
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            ADHD · 발달지연 · 성조숙증<br />
            <span className="text-blue-600">아픈 우리아이도 100% 가입됩니다.</span>
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            3개월 소견만 없으면 OK! 간편 3-N-5 심사 기준으로<br />
            유병력 어린이도 일반아이와 동일한 3대 진단비 확보 가능.
          </p>
        </div>
      </div>

      {/* ── 핵심 통계 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '3개월', label: '간편 심사 핵심 질문', sub: '3개월 내 소견만 없으면 즉시 가입 가능' },
          { num: '35%', label: '일반 대비 최대 할증폭', sub: '무사고 5년이면 8~10%로 급감' },
          { num: '5대 질환', label: '대표 유병 어린이 타겟', sub: 'ADHD·발달지연·성조숙증·천식·골절' },
          { num: '100%', label: '3대 진단비 동일 적용', sub: '암 5천만·뇌·심 각 3천만 한도 동일' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-blue-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
            <p className="text-3xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 간편고지란 무엇인가? + 3-N-5 설명 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* 간편고지 설명 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-blue-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">간편고지 보험이란?</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
            일반 보험이 수십 가지 과거 병력을 묻는 것과 달리,
            <span className="text-blue-600 font-black"> 단 3가지 핵심 질문</span>만 통과하면
            유병력 여부와 관계없이 바로 가입할 수 있는 특별 인수 방식입니다.
          </p>

          <div className="space-y-3">
            {[
              { q: '① 최근 3개월 이내', desc: '입원·수술·추가 검사(재검사) 필요 의사 소견을 받은 사실이 없을 것', pass: true },
              { q: '② 최근 N년 이내', desc: '입원 또는 수술 이력이 없을 것 (N = 0, 2, 3, 5년 중 선택)', pass: true },
              { q: '③ 최근 5년 이내', desc: '암·협심증·뇌졸중 등 중대 질병 진단·입원·수술 이력 없을 것', pass: true },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50">
                <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-slate-800 text-sm">{item.q}</p>
                  <p className="text-[11px] text-slate-500 font-bold mt-1">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <p className="text-blue-700 font-black text-xs mb-1">💡 핵심 포인트</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              ADHD 약을 매일 먹어도, 발달치료를 주 3회 받아도 — <span className="text-blue-600 font-black">최근 3개월 내 입원·수술이 없으면</span> 3가지 질문을 모두 통과할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 3-N-5 등급 설명 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Activity className="w-56 h-56" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-blue-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">3-N-5 등급 완전 해설</h3>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { grade: '3.5.5 (최우량)', nDesc: '5년 무사고', premium: '+8~10%', color: 'bg-emerald-500/20 border-emerald-400/30', badge: 'text-emerald-300' },
                { grade: '3.3.5 (실속형)', nDesc: '3년 무사고', premium: '+15~18%', color: 'bg-blue-500/20 border-blue-400/30', badge: 'text-blue-300' },
                { grade: '3.2.5 (기본형)', nDesc: '2년 무사고', premium: '+22~25%', color: 'bg-yellow-500/20 border-yellow-400/30', badge: 'text-yellow-300' },
                { grade: '3.0.5 (초간편)', nDesc: '입원/수술 직후', premium: '+30~35%', color: 'bg-rose-500/20 border-rose-400/30', badge: 'text-rose-300' },
              ].map((item, i) => (
                <div key={i} className={`p-5 rounded-3xl border ${item.color}`}>
                  <div className="flex justify-between items-center">
                    <p className={`font-black text-sm ${item.badge}`}>{item.grade}</p>
                    <p className="text-white font-black text-sm">보험료 {item.premium}</p>
                  </div>
                  <p className="text-slate-400 text-xs font-bold mt-1">조건: {item.nDesc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-blue-400 font-black text-xs mb-1 uppercase tracking-widest">⚡ 무사고 전환 전략</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              처음에는 3.2.5로 가입 후, 2년 무사고 달성 시 3.5.5 전환권을 행사하면 보험료를 최대 20% 추가 절감할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 5대 유병 질환별 맞춤 전략 ── */}
      <div className="mb-16 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-blue-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight flex items-center gap-3">
          <Zap className="w-6 h-6 text-blue-500" /> 유병 질환별 맞춤 가입 전략
        </h3>
        <p className="text-sm text-slate-400 font-bold mb-10">가장 많이 거절당하는 5대 소아 질환, 간편고지로 이렇게 해결합니다.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              illness: 'ADHD / 소아 우울',
              icon: '🧠',
              problem: '정신과 약물 장기복용으로 일반 보험 전면 거절',
              solution: '3개월 내 입원·수술 소견 없으면 3.5.5 즉시 통과',
              tip: '약 복용 중이어도 OK — 복약 사실 자체는 고지 항목 아님',
              color: 'border-purple-100 bg-purple-50/20',
              badgeColor: 'bg-purple-100 text-purple-700',
            },
            {
              illness: '발달지연 / 언어·놀이치료',
              icon: '🗣️',
              problem: '발달장애 진단으로 심사팀 거절 1순위 질환',
              solution: '간편고지는 "발달지연" 진단명 자체를 고지항목에서 제외',
              tip: '치료 기간·빈도 무관 — 입원 이력만 없으면 100% 통과',
              color: 'border-blue-100 bg-blue-50/20',
              badgeColor: 'bg-blue-100 text-blue-700',
            },
            {
              illness: '성조숙증 / 호르몬 치료',
              icon: '💉',
              problem: '호르몬 억제 주사 주기 투여로 내분비 부담보 우려',
              solution: '메리츠·현대 간편 플랜 적용 시 자궁·난소 부담보 없이 전신 승인',
              tip: '호르몬 치료 중이라도 추가 수술 소견 없으면 프리패스',
              color: 'border-pink-100 bg-pink-50/20',
              badgeColor: 'bg-pink-100 text-pink-700',
            },
            {
              illness: '소아 천식 / 급성 아토피',
              icon: '🌬️',
              problem: '잦은 외래 처방 및 흡입기 이력으로 호흡기 부담보 적용',
              solution: '3개월 내 급성 입원 없으면 3.5.5 전신 보장 (부담보 없음)',
              tip: '연고·흡입기 처방은 "통원 치료"로 간편 고지 질문 해당 없음',
              color: 'border-cyan-100 bg-cyan-50/20',
              badgeColor: 'bg-cyan-100 text-cyan-700',
            },
            {
              illness: '골절 / 깁스 수술',
              icon: '🦴',
              problem: '최근 수술 이력으로 상해 부담보·보험료 할증 우려',
              solution: '치료 종결 후 3개월 소견 종료 시 서류 없이 모바일 즉시 가입',
              tip: '핀 제거술까지 완료 후 3개월 소견 없으면 당일 승인',
              color: 'border-orange-100 bg-orange-50/20',
              badgeColor: 'bg-orange-100 text-orange-700',
            },
            {
              illness: '기타 만성 질환 / 복약',
              icon: '💊',
              problem: '지속 복약·주기적 혈액검사 이력으로 표준체 거절',
              solution: '5년 내 중대 질병(암·뇌·심) 입원 이력만 없으면 3.5.5 통과',
              tip: '당뇨·고혈압 약이라도 입원·수술 이력이 없으면 대부분 통과',
              color: 'border-green-100 bg-green-50/20',
              badgeColor: 'bg-green-100 text-green-700',
            },
          ].map((item, i) => (
            <div key={i} className={`p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border ${item.color} hover:shadow-lg transition-all`}>
              <div className="text-3xl mb-4">{item.icon}</div>
              <p className={`text-[10px] font-black px-3 py-1 rounded-full inline-block mb-3 ${item.badgeColor}`}>{item.illness}</p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-slate-600">{item.problem}</p>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-slate-800">{item.solution}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-slate-500 italic">{item.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 보험사 간편 어린이보험 비교표 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Star className="w-40 h-40" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-400/30">
            <Sparkles className="w-3 h-3" /> 2025년 주요 보험사 간편 어린이보험 비교
          </div>
          <h3 className="text-3xl font-black mb-10 tracking-tight">유병자 어린이보험 보험사별 강점</h3>

          <div className="space-y-4">
            {[
              {
                company: '현대해상',
                product: '간편한 굿앤굿어린이종합보험',
                strong: '시장점유율 1위 · 소아암·정신질환 보장 범위 최다',
                badges: ['발달지연 3.5.5 특화', '소아암 특화', '계약전환 우수'],
                note: '태아부터 35세까지 — 어른이 비갱신 구조 안정성 업계 최상',
              },
              {
                company: 'KB손해보험',
                product: 'KB 슬기로운 간편자녀보험',
                strong: '성조숙증·언어장애 특약 특화 · 무사고 할인권 탑재',
                badges: ['정신·행동 발달 보장', '무사고 할인 자동 적용', '성조숙증 치료비 지급'],
                note: '간편고지 후 무사고 달성 시 최대 5회 보험료 자동 할인',
              },
              {
                company: '메리츠화재',
                product: '간편한 메리츠 어른이종합보험',
                strong: '암 진단비 첫해부터 감액 없이 전액 지급 (업계 최초)',
                badges: ['감액기간 없음', 'ADHD 통원치료비', '수술비 매회 반복 지급'],
                note: '부담보(특정 신체부위 제외) 없이 전신 보장 인수 시 강점',
              },
              {
                company: 'DB손해보험',
                product: '아이러브 간편어린이보험',
                strong: '30세 만기 → 100세 무심사 계약 전환 조건 업계 최우수',
                badges: ['계약전환 1위', '골절 특화', '가성비 비갱신'],
                note: '처음엔 저렴한 간편 플랜으로 가입 후 나중에 표준 전환',
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 md:p-6 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors gap-4">
                <div className="flex-1">
                  <p className="font-black text-base">
                    {maskCompany(item.company, isUnlocked)}{' '}
                    <span className="text-blue-300 text-sm font-bold ml-1">{maskProductName(item.product, isUnlocked)}</span>
                  </p>
                  <p className="text-xs text-slate-400 font-bold mt-1">{item.strong}</p>
                  <p className="text-[11px] text-slate-500 font-bold mt-1 italic">{maskText(item.note, isUnlocked)}</p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {item.badges.map((b) => (
                    <span key={b} className="text-[10px] font-black text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 + 주의사항 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-blue-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-blue-500" /> 유병자 어린이보험 가입 전 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 3개월 소견 확인', desc: '최근 3개월 내 입원·수술·재검사 소견 여부가 가입 가능성의 90%를 결정합니다.' },
              { step: '02. N값 선택 전략', desc: '무사고 기간이 길수록 보험료가 낮아지므로 가입 시기를 전략적으로 조율하세요.' },
              { step: '03. 부담보 조건 협의', desc: '특정 신체부위 부담보 조건 없이 인수받을 수 있는 보험사를 우선 비교하세요.' },
              { step: '04. 무사고 할인권 확인', desc: '가입 후 2~3년 무사고 시 보험료를 자동으로 낮춰주는 전환권이 있는지 확인하세요.' },
              { step: '05. 만기 & 전환 전략', desc: '30세 만기로 저렴하게 시작 → 만기 시 무심사 100세 전환으로 장기 자산화 가능합니다.' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50 hover:border-blue-200 transition-colors">
                <div className="shrink-0 font-black text-blue-700 text-sm w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-blue-500 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">유병 어린이 보장 핵심 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 일반암 진단비 5천만 (감액 없이)<br />
              ② 뇌혈관·심장 진단비 각 3천만<br />
              ③ 질병 수술비 매회 100만 반복<br />
              ④ 부담보(특정부위 제외) 없이 전신 보장<br />
              ⑤ 무사고 시 자동 할인 계약 전환권
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <AlertTriangle className="text-rose-500 w-5 h-5" /> 반드시 피해야 할 함정
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              고지의무를 <span className="text-rose-600 font-black">누락하거나 축소</span>하면 향후 보험금 지급이 전면 거절되고 계약이 해지됩니다. 담당 설계사를 통해 <span className="text-blue-600 font-black">정확한 현재 상태를 공개</span>하고 안전하게 심사 통과 가능한 상품을 선택하는 것이 핵심입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-blue-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "아프다고 포기하지 마세요.<br />
            <span className="text-blue-600">간편고지로, 우리아이도 당당하게 보장받을 권리가 있습니다.</span>"
          </p>
        </div>
        <button
          onClick={onAction}
          className="bg-blue-500 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-blue-600 transition-all hover:scale-105 shadow-2xl shadow-blue-400/30 shrink-0 flex items-center gap-3"
        >
          유병자 어린이 보험료 비교하기
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  </section>
);
