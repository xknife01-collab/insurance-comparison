/**
 * 치매 간병보험 완전 가이드 섹션
 */

import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Brain, Target, Zap, HeartHandshake, Pill, Sparkles,
  UserCheck, Clock, Quote, AlertTriangle, ShieldAlert, FileText
} from 'lucide-react';

export const DementiaGuideSection = ({ onAction, isUnlocked }: { onAction: () => void, isUnlocked?: boolean }) => (
  <section className="py-32 bg-amber-50/30 px-2 sm:px-4 relative overflow-hidden" id="dementia-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-black mb-6 border border-amber-200 shadow-sm">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            부모님을 위한 가장 따뜻한 준비, 치매 간병보험 가이드
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            기억을 잃어도 <span className="text-amber-600">존엄함</span>은<br />
            잃지 않도록 지켜드립니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-70">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            전국 65세 이상 10명 중 1명이 치매를 겪는 초고령 사회.<br />
            복잡한 CDR 척도부터 생활자금 플랜까지 객관적으로 정리했습니다.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
        {[
          { num: '10.38%', label: '65세 이상 치매 유병률', sub: '전국 약 100만 명 추정 (중앙치매센터)' },
          { num: '월 250~350만', label: '요양·간병 예상 비용', sub: '간병비·소모품 등 비급여 포함' },
          { num: '8.3년', label: '평균 치매 유병 기간', sub: '장기 간병 생활자금 준비 필수' },
          { num: '70%+', label: '초기 경증·중등도 비율', sub: 'CDR 1~2점 단계별 보장 핵심' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-amber-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-amber-200 transition-all group">
            <p className="text-3xl font-black text-amber-600 mb-2 group-hover:scale-110 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-400 font-bold text-center mb-16">
        * 통계 출처: 보건복지부 및 중앙치매센터 『대한민국 치매현황 2023/2024』 연보 기준
      </p>

      {/* ── [예시 기준 및 법적 필수 고지] 표준 산출 기준 및 치매보험 4대 핵심 유의사항 ── */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm mb-16">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 mt-1">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs text-slate-700 space-y-3 leading-relaxed">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-slate-900 text-sm">💡 [예시 기준 안내] 본 페이지에 안내된 보장 예시 금액 및 보험료 산출 기준</span>
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">생명·손해보험협회 공시 기준</span>
            </div>
            <p className="font-bold text-slate-800">
              • **표준 예시 산출 기준**: 무배당 치매간병보험 / 60세 남성 및 여성 (상해 1급 사무직) / 20년납 90세만기 / 무해지환급형(해약환급금 미지급형) / 주계약 및 주요 특약: 경도치매(CDR 1점) 300만 원, 중등도치매(CDR 2점) 500만 원, 중증치매(CDR 3점 이상) 2,000만 원, 중증치매 간병생활자금 매월 100만 원(최초 36회 보증지급) 기준 예시 월 보험료: 60세 남성 약 38,700원, 60세 여성 약 43,500원 (가입자의 연령, 성별, 건강상태, 가입금액 및 회사별 심사 기준에 따라 실제 보험료는 상이할 수 있습니다).
            </p>
            <div className="pt-2.5 border-t border-amber-200 text-[11px] text-slate-600 space-y-1.5">
              <p>• **90일 이상 상태 지속 조건**: 치매 진단비는 전문의(신경과·정신건강의학과)에 의한 임상치매척도(CDR) 및 뇌영상검사(CT, MRI, PET 등)를 기초로 진단 확정된 후, 최소 90일 이상 그 상태가 계속되었음이 확인되어야 보험금이 지급됩니다.</p>
              <p>• **면책기간(책임개시일) 및 감액기간 안내**: 치매 보장은 계약일로부터 1년 또는 2년의 면책기간(책임개시일 이전 진단 시 보장 제외 및 계약 무효/기납입보험료 반환)이 적용될 수 있으며, 가입 후 1~2년 이내 진단 시 50% 감액 지급 규정이 적용될 수 있습니다.</p>
              <p>• **지정대리청구인 제도 필수 신청 권고**: 치매에 걸려 인지능력이 저하되면 피보험자 본인이 보험금을 직접 청구하기 어려우므로, 보험 가입 시 배우자나 직계비속 등 가족을 '지정대리청구인'으로 사전에 반드시 지정해야 보험금 지급 누락을 방지할 수 있습니다.</p>
              <p>• **표적치료제(레켐비 등) 특약 유의사항**: 알츠하이머 신약 비급여 치료비 특약은 식약처 허가 적응증, 아밀로이드 베타 양성 확인(PET/CSF 검사) 및 전문의 처방 요건을 엄격히 충족해야 보장됩니다.</p>
              <p>• **무해지환급형 상품 안내**: 보험료 납입기간 중 계약 해지 시 해약환급금이 전혀 없거나 일반 표준형보다 적을 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CDR 척도 + 보장 전략 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* CDR 척도 카드 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-amber-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-amber-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">CDR 척도 완벽 해설</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            치매 보험금 지급의 기준이 되는{' '}
            <span className="text-amber-600 font-black">CDR(임상치매척도)</span>를
            이해해야 제대로 된 보장을 받을 수 있습니다.
          </p>

          <div className="space-y-3">
            {[
              { score: 'CDR 0점',   label: '정상',         color: 'bg-gray-50 border-gray-100',     badge: 'text-gray-400 bg-gray-100',     dot: false, desc: '인지기능 정상 — 보험 대상 아님' },
              { score: 'CDR 0.5점', label: '경도인지장애', color: 'bg-blue-50 border-blue-100',     badge: 'text-blue-600 bg-blue-100',     dot: true,  desc: '인지지원등급 — 일부 최신 상품만 보장' },
              { score: 'CDR 1점',   label: '경증 치매',    color: 'bg-amber-50 border-amber-100',   badge: 'text-amber-700 bg-amber-100',   dot: true,  desc: '일상생활 지장 시작 — 대부분 보장 시작점 ✅' },
              { score: 'CDR 2점',   label: '중등도 치매',  color: 'bg-orange-50 border-orange-100', badge: 'text-orange-700 bg-orange-100', dot: true,  desc: '상당한 도움 필요 — 간병비 본격 지급' },
              { score: 'CDR 3점+',  label: '중증 치매',    color: 'bg-red-50 border-red-100',       badge: 'text-red-700 bg-red-100',       dot: true,  desc: '독립생활 불가 — 최대 보험금 지급 🔴' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 ${item.badge}`}>{item.score}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold">{maskText(item.desc, isUnlocked)}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dot ? 'bg-amber-400' : 'bg-gray-200'}`} />
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-amber-50 rounded-3xl border border-amber-100">
            <p className="text-amber-700 font-black text-xs mb-1">⚠️ 핵심 체크포인트</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              보험금 지급 조건: 진단 확정 후{' '}
              <span className="text-amber-600">90일 이상</span> 해당 상태 지속이 일반적.
              상품마다 기준이 다르므로 약관을 반드시 확인하세요!
            </p>
          </div>
        </div>

        {/* 보장 전략 카드 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Brain className="w-56 h-56" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-amber-500 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-amber-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">2가지 보장 설계 전략</h3>
              </div>
            </div>

            <div className="space-y-6">
              {/* 진단비 중심형 */}
              <div className="p-5 md:p-8 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-amber-300 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> 진단비 중심형 (일시금)
                </p>
                <p className="text-sm opacity-75 font-bold leading-relaxed mb-4">
                  치매 확정 시 목돈 수령. 초기 시설 입소비, 리모델링 비용 등에 유리합니다.
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[['경증', '500~1천만'], ['중등도', '1~2천만'], ['중증', '2~5천만']].map(([g, a]) => (
                    <div key={g} className="bg-white/10 rounded-2xl p-3">
                      <p className="text-[10px] font-black text-amber-300">{g}</p>
                      <p className="text-xs font-black text-white mt-1">{a}원</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 간병비 중심형 */}
              <div className="p-5 md:p-8 bg-amber-500/20 rounded-2xl md:rounded-[2.5rem] border border-amber-400/30 hover:bg-amber-500/30 transition-colors">
                <p className="font-black text-amber-300 mb-3 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4" /> 간병비 중심형 (월 지급)
                </p>
                <p className="text-sm opacity-75 font-bold leading-relaxed mb-3">
                  중증 치매 진단 시 매월 30~100만 원 지급. 고정 요양비 커버에 최적.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold opacity-70">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    가족 간병 시에도 수령 가능
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold opacity-70">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    종신 지급 상품도 존재
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-amber-400 font-black text-xs mb-1 uppercase tracking-widest">💡 전문가 추천</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "40~50대는 혼합형으로, 60대 이상 부모님께는 월 지급 생활자금 중심으로
              설계하는 것이 가장 현명합니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 2025~2026 트렌드: 레켐비 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Pill className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-amber-400/30">
              <Sparkles className="w-3 h-3" /> 2025~2026 신규 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">레켐비 표적치료제 보장</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              알츠하이머 신약{' '}
              <span className="text-amber-300">'레켐비(레카네맙)'</span>는
              18개월 투약 시 비급여 비용이 수천만 원에 달합니다.
              2025년부터 주요 보험사들이 앞다퉈 특약을 출시 중입니다.
            </p>
            <p className="text-[11px] text-amber-200/80 font-bold mt-4 leading-relaxed">
              * 레켐비 등 표적치료제 특약은 식약처 허가 기준, 아밀로이드 베타 양성 확인(PET 또는 뇌척수액 검사) 및 신경과/정신건강의학과 전문의 처방 요건을 충족해야 보장되며, 회사별 가입 한도 및 책임개시일(면책기간)이 상이합니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '교보생명', product: '교보더안심치매·간병보험', limit: '최대 2,500만원', note: '정밀검사비 연 1회 지원' },
              { company: 'KB손보',   product: 'KB 골든라이프케어',        limit: '최대 2,000만원', note: '체증형 보장 구조' },
              { company: 'DB손보',   product: '프로미라이프 더보장간병',  limit: '최대 4,000만원', note: '표적치료비 특약' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {maskCompany(item.company, isUnlocked)}{' '}
                    <span className="text-amber-300 text-xs font-bold ml-1">{maskProductName(item.product, isUnlocked)}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-amber-400 text-sm shrink-0 ml-4">{maskText(item.limit, isUnlocked)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 장기요양등급 + 전략 카드 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-amber-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-amber-500" /> 장기요양등급 연계 보장
          </h3>
          <div className="space-y-3">
            {[
              { grade: '인지지원등급', desc: '치매 초기 (45점 미만)',  service: '주·야간보호센터',    tag: '최신 상품 보장' },
              { grade: '5등급',        desc: '치매 특별등급',          service: '재가급여 이용',      tag: '재가급여 지원' },
              { grade: '3~4등급',      desc: '경도~중등도',            service: '방문요양, 방문목욕', tag: '재가서비스'   },
              { grade: '1~2등급',      desc: '중증 (시설급여)',        service: '요양원 입소 가능',   tag: '시설급여'     },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-amber-50/50 rounded-3xl border border-amber-100/50 hover:border-amber-200 transition-colors">
                <div className="w-24 text-center shrink-0">
                  <p className="font-black text-amber-700 text-sm">{item.grade}</p>
                  <p className="text-[10px] text-amber-500 font-bold">{item.tag}</p>
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-800 text-sm">{maskText(item.desc, isUnlocked)}</p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">주요 서비스: {item.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-amber-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">전문가 추천 전략</h4>
            <p className="text-xs font-bold opacity-80 leading-relaxed">
              ① 경증부터 보장되는지 확인<br />
              ② 레켐비 특약 포함 여부<br />
              ③ 지정대리청구인 등록 필수<br />
              ④ 비갱신형으로 노후 보험료 고정<br />
              ⑤ 보장 종료 나이 90세 이상 필수
            </p>
          </div>
          <div className="bg-white border border-amber-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-amber-500 w-5 h-5" /> 면책기간 및 90일 지속
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              가입 후 <span className="text-amber-600 font-bold">1~2년</span> 면책기간(책임개시일) 내 진단 시 보장에서 제외되며, 진단 확정 후 <span className="text-amber-600 font-bold">최소 90일 이상</span> 해당 치매 상태가 지속 관찰되어야 최종 지급 대상이 됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 보험사별 상품 비교 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-amber-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          주요 보험사 치매간병보험 상품별 특징 안내 (생·손해보험협회 공시 기준)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '메리츠화재', product: '간편한 치매간병보험',      highlight: '유병력자 간편심사 플랜, 단계별 진단비 및 생활자금 설계',       badges: ['단계별 보장', '간편고지']    },
            { company: '삼성화재',   product: '마이핏 건강보험',           highlight: '중증질환 및 치매 통합 케어, 가족 결합 할인 혜택 연동',     badges: ['가족 결합 할인', '통합 케어'] },
            { company: 'DB손보',     product: '프로미라이프 더보장간병',   highlight: '알츠하이머 표적치료비 특약 탑재, 체증형 보장 옵션 운영',   badges: ['체증형', '표적치료']           },
            { company: 'KB손보',     product: 'KB골든라이프케어',          highlight: '신약 치료비 연계 및 간병인 지원 서비스 결합형 설계',      badges: ['간병인 지원', '체증형']      },
            { company: '현대해상',   product: '퍼펙트케어간병보험',        highlight: '국가 인지지원등급부터 단계별 보장, 장기요양 재가급여 연계',       badges: ['인지지원등급', '재가연계']               },
            { company: '교보생명',   product: '교보더안심치매·간병',       highlight: '생명보험사 정밀검사비 지원 및 중증 치매 평생 생활자금 종신 지급',  badges: ['정밀검사비', '종신자금']  },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-amber-50/40 rounded-2xl md:rounded-[2.5rem] border border-amber-100 hover:border-amber-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-amber-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200"
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
          <ShieldAlert className="w-5 h-5 text-amber-600" /> 금융소비자보호법에 따른 소비자 권익 및 가입 유의사항
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
          • **지정대리청구인 제도 안내**: 피보험자가 치매 등으로 보험금을 직접 청구할 수 없는 상태에 대비하여, 가입 시 반드시 직계가족 등을 '지정대리청구인'으로 사전 등록해 두시기 바랍니다.
        </p>
        <p>
          • **대리점 지위 고지**: 본 플랫폼(보험대리점)은 다수의 보험사와 계약을 체결하고 중개하는 금융상품판매대리·중개업자로서, 보험사로부터 계약체결권을 부여받지 아니하며 직접 보험계약을 체결할 수 없습니다.
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-amber-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "치매 보험은 부모님이 아프기 전,<br />
            <span className="text-amber-600">객관적인 비교 진단을 통해 미리 준비하는 가족 안심 자산</span>입니다."
          </p>
        </div>
        <button
          onClick={onAction}
          className="bg-amber-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-amber-700 transition-all hover:scale-105 shadow-2xl shadow-amber-400/30 shrink-0"
        >
          치매 보험료 실시간 비교 상담하기
        </button>
      </div>

    </div>
  </section>
);
