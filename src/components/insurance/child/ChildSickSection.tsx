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
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-200 shadow-sm">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            일반 심사 거절 시 대안 — 유병력 아동 전용 간편심사 플랜 비교
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            ADHD · 발달지연 · 성조숙증<br />
            <span className="text-blue-600">아픈 우리아이도 간편하게 가입 심사를 받아볼 수 있습니다.</span>
          </h2>
          <p className="text-xs text-blue-500 font-bold mt-2">(※ 각 보험사별 인수 심사 기준에 따라 가입이 제한되거나 조건부 승인될 수 있습니다.)</p>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            3-N-5 간편심사 질문 통과 시 심사 대상 확인 가능<br />
            각 사 인수 지침에 따라 유병력 아동 맞춤 플랜 설계 안내.
          </p>
        </div>
      </div>

      {/* ── 핵심 통계 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '3개월', label: '간편 심사 핵심 질문', sub: '3개월 내 입원·수술 소견 여부 확인' },
          { num: '할증률', label: '일반 대비 할증 비교', sub: '무사고 기간에 따라 보험료 차등 적용' },
          { num: '5대 질환', label: '대표 유병 아동 주요 유형', sub: 'ADHD·발달지연·성조숙증·천식·골절' },
          { num: '맞춤 설계', label: '3대 진단비 한도 구성', sub: '심사 결과에 따라 최적 한도 매칭' },
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
            일반 심사 보험이 수십 가지 과거 병력을 묻는 것과 달리,
            <span className="text-blue-600 font-black"> 3가지 핵심 질문</span>을 기준으로 가입 가능 여부를 심사하는 간편 인수 방식입니다 (단, 회사별 세부 인수 지침에 따라 가입 조건이 달라질 수 있습니다).
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
              복약이나 주기적 통원 치료 중이라도 <span className="text-blue-600 font-black">최근 3개월 내 입원·수술·추가검사 소견이 없으면</span> 3가지 고지 질문에 해당하지 않아 간편 심사 대상이 될 수 있습니다 (단, 질환별 인수 심사 결과에 따라 할증 및 부담보가 적용될 수 있습니다).
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
              처음에는 3.2.5로 가입 후, 무사고 기간 달성 시 3.5.5 전환권을 행사하면 보험료를 인하할 수 있습니다 (회사별 제도 상이).
            </p>
          </div>
        </div>
      </div>

      {/* ── [필수 고지] 예시 보장금액 산출 기준 및 계약자 유의사항 ── */}
      <div className="mb-16 bg-white rounded-3xl border border-blue-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 mt-1">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs text-slate-600 space-y-2 leading-relaxed">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-slate-900 text-sm">💡 [예시 기준 안내] 본 페이지에 안내된 보장 예시 금액 및 보험료 할증폭 산출 기준</span>
              <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px]">손해보험협회 공시 기준</span>
            </div>
            <p className="font-bold text-slate-700">
              • **예시 산출 기준**: 주요 손해보험사 간편고지(유병자) 어린이보험 표준 플랜 / 10세 남아 및 여아 / 상해 1급 / 20년납 100세만기 / 해약환급금 미지급형(무해지형) / 3.5.5 간편 플랜 가입 예시 (피보험자의 연령, 성별, 치료 이력, 특약 선택 및 회사별 심사 기준에 따라 실제 보험료와 가입 가능 한도는 상이할 수 있습니다).
            </p>
            <div className="pt-2 border-t border-blue-100 text-[11px] text-slate-500 space-y-1">
              <p>• **일반 표준체 우선 확인 권고**: 유병자(간편고지) 보험은 일반 심사 보험에 비해 보험료가 약 10~35% 할증되거나 보장 범위가 제한될 수 있으므로, 과거 질병 완치 여부나 서류 심사를 통해 일반 어린이보험에 가입할 수 있는지 먼저 확인하는 것이 유리합니다.</p>
              <p>• **인수 심사 결과 차등**: 3-N-5 간편 질문을 통과하더라도 정신건강의학과 약물 투약 기간, 발달 치료 빈도, 호르몬 치료 등에 대한 각 사 언더라이팅 지침에 따라 가입이 제한되거나 특정 신체부위 부담보가 설정될 수 있습니다.</p>
              <p>• **금융감독원 연령 규제 준수**: 금융감독원 지침에 따라 어린이보험 가입 연령은 최대 15세로 제한되며, 16세 이상 35세까지는 청년 전용 간편건강 플랜으로 분리 적용됩니다.</p>
            </div>
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
              problem: '정신과 약물 복용 이력으로 일반 심사 가입 제한',
              solution: '3개월 내 입원·수술 소견 없으면 3.5.5 간편 심사 신청 가능',
              tip: '약 복용 중이어도 최근 3개월 입원·수술 소견 없으면 고지 대상 제외',
              color: 'border-purple-100 bg-purple-50/20',
              badgeColor: 'bg-purple-100 text-purple-700',
            },
            {
              illness: '발달지연 / 언어·놀이치료',
              icon: '🗣️',
              problem: '발달장애 및 지연 진단으로 일반 심사 인수 거절 빈번',
              solution: '간편고지는 "발달지연" 진단명 자체를 기본 질문에서 제외',
              tip: '통원 치료 기간과 무관하게 입원·수술 이력 없으면 간편 심사 대상 확인',
              color: 'border-blue-100 bg-blue-50/20',
              badgeColor: 'bg-blue-100 text-blue-700',
            },
            {
              illness: '성조숙증 / 호르몬 치료',
              icon: '💉',
              problem: '호르몬 억제 주사 주기 투여로 내분비 부담보 우려',
              solution: '간편 플랜 적용 시 부담보 조건 완화 가능 여부 심사 확인',
              tip: '호르몬 치료 중이라도 추가 수술·입원 소견 없으면 간편 심사 진행 가능',
              color: 'border-pink-100 bg-pink-50/20',
              badgeColor: 'bg-pink-100 text-pink-700',
            },
            {
              illness: '소아 천식 / 급성 아토피',
              icon: '🌬️',
              problem: '잦은 외래 처방 및 흡입기 이력으로 호흡기 부담보 우려',
              solution: '3개월 내 급성 입원 없으면 3.5.5 전신 보장 심사 가능',
              tip: '연고·흡입기 외래 처방은 "단순 통원"으로 간편 고지 질문 해당 없음',
              color: 'border-cyan-100 bg-cyan-50/20',
              badgeColor: 'bg-cyan-100 text-cyan-700',
            },
            {
              illness: '골절 / 깁스 수술',
              icon: '🦴',
              problem: '최근 수술 이력으로 상해 부담보 및 보험료 할증 우려',
              solution: '치료 종결 및 3개월 소견 종료 시 모바일 간편 심사 진행 가능',
              tip: '핀 제거술까지 완료 후 추가 소견 없으면 간편 심사 진행 가능',
              color: 'border-orange-100 bg-orange-50/20',
              badgeColor: 'bg-orange-100 text-orange-700',
            },
            {
              illness: '기타 만성 질환 / 복약',
              icon: '💊',
              problem: '지속 복약 및 주기적 검사 이력으로 표준체 거절 우려',
              solution: '5년 내 중대 질병(암·뇌·심) 입원 이력 없으면 3.5.5 심사 가능',
              tip: '소아 만성질환이라도 입원·수술 이력 없으면 심사 대상 확인 가능',
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
                strong: '소아암 및 다빈도 질환 보장 범위 구성 우수',
                badges: ['발달지연 3.5.5 특화', '소아암 특화', '계약전환 우수'],
                note: '태아부터 15세 어린이 전용, 16세 이상은 청년 전용 플랜으로 분리 안내',
              },
              {
                company: 'KB손해보험',
                product: 'KB 슬기로운 간편자녀보험',
                strong: '성조숙증·언어장애 특약 특화 및 무사고 전환 제도',
                badges: ['정신·행동 발달 보장', '무사고 할인 제도', '성조숙증 치료비 지원'],
                note: '간편고지 후 일정 무사고 기간 달성 시 보험료 자동 인하 제도',
              },
              {
                company: '메리츠화재',
                product: '간편한 메리츠 내Mom같은어린이보험',
                strong: '소아암 진단비 및 주요 수술비 집중 보장 플랜',
                badges: ['암 진단비 특화', 'ADHD 통원치료비', '수술비 반복 지급'],
                note: '부담보(특정 신체부위 제외) 조건 완화 여부 사전 심사 가능',
              },
              {
                company: 'DB손해보험',
                product: '아이러브 간편어린이보험',
                strong: '30세 만기 후 100세 무심사 계약전환권 지원',
                badges: ['계약전환 강점', '골절 특화', '실속형 비갱신'],
                note: '30세 만기 전환 시 전환 시점 연령 및 위험률로 보험료 재산출',
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
              { step: '01. 3개월 소견 확인', desc: '최근 3개월 내 입원·수술·재검사 소견 여부가 간편 심사 신청의 핵심 기준이 됩니다.' },
              { step: '02. N값 선택 전략', desc: '무사고 기간이 길수록 보험료 할증폭이 낮아지므로 가입 시기를 전략적으로 조율하세요.' },
              { step: '03. 부담보 조건 협의', desc: '특정 신체부위 부담보 조건 없이 인수받을 수 있는 보험사별 심사 지침을 우선 비교하세요.' },
              { step: '04. 무사고 할인 제도', desc: '가입 후 1~3년 무사고 시 보험료를 자동으로 낮춰주는 계약 전환 제도가 있는지 확인하세요.' },
              { step: '05. 만기 & 전환 전략', desc: '30세 만기 선택 시 초기 보험료 절감 가능 (100세 전환 시 전환 시점 연령 및 위험률로 보험료 재산출).' },
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
              ① 일반암 진단비 최대 한도 (가입 연령별 약관 확인)<br />
              ② 뇌혈관·심장 진단비 각 3천만 (심사 결과별 차등)<br />
              ③ 질병 수술비 매회 100만 반복 지급 특약<br />
              ④ 부담보(특정부위 제외) 완화 심사 플랜<br />
              ⑤ 무사고 시 자동 할인 계약 전환권
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <AlertTriangle className="text-rose-500 w-5 h-5" /> 반드시 피해야 할 유의사항
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              고지의무를 <span className="text-rose-600 font-black">누락하거나 축소</span>하면 향후 보험금 지급이 전면 거절되고 계약이 해지됩니다. 담당 설계사를 통해 <span className="text-blue-600 font-black">정확한 현재 상태를 공개</span>하고 안전하게 심사 통과 가능한 상품을 선택하는 것이 핵심입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 금융소비자보호법 필수 법적 고지문 ── */}
      <div className="mb-20 bg-slate-100 rounded-3xl p-6 md:p-10 border border-slate-200 text-slate-600 text-xs space-y-3 leading-relaxed">
        <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
          <ShieldAlert className="w-5 h-5 text-blue-600" /> 금융소비자보호법에 따른 소비자 권익 및 가입 유의사항
        </div>
        <p>
          • **일반 표준체 우선 확인 안내**: 유병력자(간편심사) 보험은 일반 심사 보험에 비해 보험료가 할증되거나 보장 범위가 제한될 수 있으므로, 건강 상태에 따라 일반 표준체 보험에 가입할 수 있는지 여부를 먼저 확인하시기 바랍니다.
        </p>
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
          • **대리점 지위 고지**: 본 플랫폼(보험대리점)은 다수의 보험사와 계약을 체결하고 중개하는 금융상품판매대리·중개업자로서, 보험사로부터 계약체결권을 부여받지 아니하며 직접 보험계약을 체결할 수 없습니다.
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-blue-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "아프다고 포기하지 마세요.<br />
            <span className="text-blue-600">간편고지로, 우리아이도 든든한 보장 혜택을 설계받을 수 있습니다.</span>"
          </p>
        </div>
        <button
          onClick={onAction}
          className="bg-blue-500 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-blue-600 transition-all hover:scale-105 shadow-2xl shadow-blue-400/30 shrink-0 flex items-center gap-3"
        >
          유병자 어린이 보험료 실시간 비교 상담하기
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  </section>
);
