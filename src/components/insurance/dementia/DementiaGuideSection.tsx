/**
 * 치매 간병보험 완전 가이드 섹션
 */

import React from 'react';
import {
  Brain, Target, Zap, HeartHandshake, Pill, Sparkles,
  UserCheck, Clock, Quote
} from 'lucide-react';

export const DementiaGuideSection = ({ onAction }: { onAction: () => void }) => (
  <section className="py-32 bg-amber-50/30 px-2 sm:px-4 relative overflow-hidden" id="dementia-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
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
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            전국 65세 이상 10명 중 1명이 치매인 시대.<br />
            복잡한 CDR 척도부터 생활자금 플랜까지 전문가가 완벽히 정리했습니다.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '1/10',   label: '65세 이상 치매 유병률',  sub: '전국 약 100만 명 이상' },
          { num: '월 300만', label: '요양원 평균 비용',      sub: '간병인 포함 시 400만원+' },
          { num: '8.2년',  label: '평균 치매 투병 기간',    sub: '장기 보장이 필수인 이유' },
          { num: '90%',    label: '경증부터 시작하는 치매', sub: 'CDR 1점부터 보장이 핵심' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-amber-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-amber-200 transition-all group">
            <p className="text-3xl font-black text-amber-600 mb-2 group-hover:scale-110 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
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
                  <p className="text-[11px] text-slate-400 font-bold">{item.desc}</p>
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
                    {item.company}{' '}
                    <span className="text-amber-300 text-xs font-bold ml-1">{item.product}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{item.note}</p>
                </div>
                <p className="font-black text-amber-400 text-sm shrink-0 ml-4">{item.limit}</p>
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
                  <p className="font-black text-slate-800 text-sm">{item.desc}</p>
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
              <Clock className="text-amber-500 w-5 h-5" /> 면책기간 주의
            </h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
              가입 후 <span className="text-amber-600">90일~1년</span> 면책기간이 있어
              이 기간 내 진단은 보장 불가. 미리 준비할수록 유리합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 보험사별 상품 비교 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-amber-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          보험사별 주요 상품 비교 (2025~2026)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '메리츠화재', product: '간편한 치매간병보험',      highlight: '유병자 가입 용이',       badges: ['단계별 보장', '간편고지']    },
            { company: '삼성화재',   product: '마이핏 건강보험',           highlight: '중증질환+치매 통합',     badges: ['가족 결합 할인', '하이브리드'] },
            { company: 'DB손보',     product: '프로미라이프 더보장간병',   highlight: '표적치료비 최대 4천만',   badges: ['체증형', '레켐비']           },
            { company: 'KB손보',     product: 'KB골든라이프케어',          highlight: '레켐비 보장+체증형',      badges: ['간병인 지원', '체증형']      },
            { company: '현대해상',   product: '퍼펙트케어간병보험',        highlight: '인지지원등급 보장',       badges: ['암·치매 통합']               },
            { company: '교보생명',   product: '교보더안심치매·간병',       highlight: '정밀검사비 연 1회 지원',  badges: ['레켐비 2500만', '생명보험']  },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-amber-50/40 rounded-2xl md:rounded-[2.5rem] border border-amber-100 hover:border-amber-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-amber-600 mb-1">{item.company}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{item.product}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{item.highlight}</p>
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

      {/* ── CTA ── */}
      <div className="border-t border-amber-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "치매 보험은 부모님이 아프기 전,<br />
            <span className="text-amber-600">내가 건강할 때 들어드리는 선물</span>입니다."
          </p>
        </div>
        <button
          onClick={onAction}
          className="bg-amber-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-amber-700 transition-all hover:scale-105 shadow-2xl shadow-amber-400/30 shrink-0"
        >
          치매 보험료 실시간 비교하기
        </button>
      </div>

    </div>
  </section>
);
