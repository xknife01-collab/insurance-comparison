import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Baby, Calendar, ShieldCheck, ShieldAlert, Sparkles,
  UserCheck, Clock, Quote, ClipboardCheck, Star, Activity, AlertTriangle
} from 'lucide-react';

export const ChildPrenatalSection = ({ onAction, isUnlocked }: { onAction: () => void, isUnlocked?: boolean }) => (
  <section className="py-32 bg-yellow-50/20 px-2 sm:px-4 relative overflow-hidden" id="child-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-yellow-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
            태아부터 성인까지, 평생의 첫 보장 자산 구축
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            가장 순수한 시작을 위한 <span className="text-yellow-600">균형 잡힌 울타리</span>,<br />
            우리 아이 보험의 해답을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            임신 주수별 필수 태아 특약부터 어른이보험 3대 진단비 세팅까지!<br />
            30세 만기 가성비 플랜과 100세 만기 평생 보장 설계의 합리적 선택 기준.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '22주 6일', label: '태아특약 가입 데드라인', sub: '경과 시 선천장애 보장 제한' },
          { num: '70% 저렴', label: '성인 대비 어린이 요율', sub: '동일 보장 기준 압도적 가성비' },
          { num: '3대 진단비', label: '어린이보험 필수 특약', sub: '암, 뇌혈관, 허혈성 심장 집중' },
          { num: '계약전환권', label: '30세 만기 시 100세 연장', sub: '아프더라도 무심사로 보장 연장' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-yellow-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-yellow-200 transition-all group">
            <p className="text-3xl font-black text-yellow-600 mb-2 group-hover:scale-110 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 세대별 가이드 & 만기 비교 전략 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* 연령층 가이드 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-yellow-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Baby className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">가입 대상별 매칭 가이드</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            자녀의 성장 단계와 부모의 준비 시기에 맞춰{' '}
            <span className="text-yellow-600 font-black">가장 합리적인 담보</span>를
            구성하는 설계 가이드입니다.
          </p>

          <div className="space-y-3">
            {[
              { age: '태아기 (임산부)', label: '선천 질환 및 신생아 집중 케어', color: 'bg-yellow-50/50 border-yellow-100', badge: 'text-yellow-700 bg-yellow-100', desc: '선천적 기형, 저체중 인큐베이터 이용료, 신생아 황달 치료비 대비' },
              { age: '어린이 (0~15세)', label: '다빈도 소아 질환 & 일상 배상', color: 'bg-orange-50 border-orange-100', badge: 'text-orange-700 bg-orange-100', desc: '소아암(백혈병), 골절/화상, 어린이집 단체 생활 중 상해 대비' },
              { age: '청년 (16~35세)', label: '이른바 든든한 어른이 플랜', color: 'bg-indigo-50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '성인 보험 대비 넓은 면책기간 미적용 뇌/심장 3대 질단비 구축 기회' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 ${item.badge}`}>{item.age}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-yellow-50 rounded-3xl border border-yellow-100">
            <p className="text-yellow-700 font-black text-xs mb-1">⚠️ 태아 가입 시 필수 체크</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              임신 사실 확인 직후부터 <span className="text-yellow-600 font-black">22주 6일 이내</span>에 가입해야 
              가장 폭넓은 선천성 장애 진단비와 저체중 인큐베이터 일당을 전액 한도로 확보할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 30세 vs 100세 만기 비교 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Calendar className="w-56 h-56" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-yellow-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">만기 조건 합리적 판단 가이드</h3>
              </div>
            </div>

            <div className="space-y-6">
              {/* 30세 만기 */}
              <div className="p-5 md:p-8 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-yellow-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 30세 만기 플랜 (가성비 중심)
                </p>
                <p className="text-sm opacity-75 font-bold leading-relaxed mb-4">
                  낮은 보험료로 어린 시절 필요한 최대 한도 보장 구성 가능. 30세 만기 도래 시 무심사 계약전환제도를 통해 성인 보험으로 100세까지 자동 연장 가능.
                </p>
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-black">
                  <div className="bg-white/10 rounded-2xl p-3">
                    <p className="text-yellow-300">월 보험료</p>
                    <p className="text-white mt-1">3~4만 원대</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3">
                    <p className="text-yellow-300">주요 대상</p>
                    <p className="text-white mt-1">예산 절약 & 무심사 연장 선호</p>
                  </div>
                </div>
              </div>

              {/* 100세 만기 */}
              <div className="p-5 md:p-8 bg-yellow-500/20 rounded-2xl md:rounded-[2.5rem] border border-yellow-400/30 hover:bg-yellow-500/30 transition-colors">
                <p className="font-black text-yellow-300 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> 100세 만기 플랜 (평생 보장형)
                </p>
                <p className="text-sm opacity-75 font-bold leading-relaxed mb-3">
                  아이가 어릴 때 저렴한 보험료율을 비갱신형으로 평생(100세) 동안 동결하여 장기적인 질병 자산을 미리 물려주는 방식입니다.
                </p>
                <div className="space-y-2 text-xs font-bold opacity-75">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    3대 핵심 진단비(암, 뇌혈관, 허혈성 심장) 비갱신형 고정
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    성장기 이후 성인 질환까지 추가 가입 없이 평생 보장
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-yellow-400 font-black text-xs mb-1 uppercase tracking-widest">💡 전문가 매칭 전략</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "부모의 납입 여력에 맞춰 첫째 아이나 예산이 타이트할 때는 30세 만기로 설계한 후 만기 전환을 노리는 것이 합리적이며,
              평생 자산 가치를 미리 마련해 주려면 100세 만기 비갱신형 정석 코스가 추천됩니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 2025~2026 트렌드: 어른이보험 통합 비교 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-yellow-400/30">
              <Sparkles className="w-3 h-3" /> 어린이보험 시장 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">어른이보험 연령 확대 및 면책 조항 우대</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              기존 15세까지였던 어린이보험 가입 한도가 최대 35세까지 상향 조정되어, 성인들도 대폭 저렴한 조건으로 암/뇌/심장 주요 진단비 특약을 비갱신형 가입하는 열풍이 지속되고 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '현대해상', product: '굿앤굿어린이종합', limit: '선천질환 특화 우수', note: '대한민국 신생아 2명 중 1명 가입 대기' },
              { company: 'KB손해보험', product: 'KB희망플러스어린이', limit: '3대 진단비 업계 최대 한도', note: '독감 치료비 및 감염병 일당 고액 설계' },
              { company: 'DB손해보험', product: '아이러브건강보험', limit: '가성비 최적화 비갱신 플랜', note: '납입면제 대상 범위 업계 최다 지원' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {maskCompany(item.company, isUnlocked)}{' '}
                    <span className="text-yellow-300 text-xs font-bold ml-1">{maskProductName(item.product, isUnlocked)}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-yellow-400 text-sm shrink-0 ml-4">{maskText(item.limit, isUnlocked)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 가입 시 주의 사항 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-yellow-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-yellow-500" /> 자녀 안심 보장 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 임신 주수 확인', desc: '태아보험 가입은 임신 22주 6일 이전에 서둘러 설계 완료 필요' },
              { step: '02. 중복 보장 거르기', desc: '실손 의료비 특약은 기존 가족 실비와 중복 보상이 불가하므로 단독형으로 저렴하게 구성' },
              { step: '03. 납입 면제 조건 체크', desc: '유사암, 뇌혈관질환 진단 시에도 남은 보험료를 면제해 주는 우수 약관 비교' },
              { step: '04. 계약 전환 권리 검토', desc: '30세 만기 시 심사 없이 100세 만기로 보장 기간을 연장할 수 있는지 권리 확인' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-yellow-50/30 rounded-3xl border border-yellow-100/50 hover:border-yellow-200 transition-colors">
                <div className="shrink-0 font-black text-yellow-700 text-sm w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-yellow-500 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">어린이 보장 핵심 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 백혈병 등 소아암 대비 다제암 특약<br />
              ② 뇌성마비 등 선천성 장애 보장<br />
              ③ 면역력 취약기 입원일당 최대 세팅<br />
              ④ 일상생활배상책임 (화재 및 사고 대비)<br />
              ⑤ 30세 만기 전환제도 탑재
            </p>
          </div>
          <div className="bg-white border border-yellow-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-yellow-500 w-5 h-5" /> 선천 장애 면책 조항
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              출생 직후 선천 장애 발견 시 보험사 면책 및 지급 제한을 방지하기 위해 반드시 <span className="text-yellow-600 font-bold">임신 초~중기 (22주 이내)</span> 가입 처리를 정석으로 추천합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-yellow-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 Top 6 어린이/태아보험 상품 경쟁력 전수 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '현대해상', product: '굿앤굿어린이종합보험', highlight: '태아보험 누적 계약 선두, 신속한 보상 청구', badges: ['태아 선두 브랜드', '선천 장애 완벽'] },
            { company: 'KB손해보험', product: 'KB희망플러스자녀보험', highlight: '무사고 시 보험료 자동 할인 제도 탑재', badges: ['보험료 할인', '독감 일당 특화'] },
            { company: 'DB손해보험', product: '아이러브건강보험', highlight: '30세 만기 후 100세 전환 시 유리한 우대 조건', badges: ['계약전환 강점', '수술비 고액'] },
            { company: '메리츠화재', product: '내Mom같은어린이보험', highlight: '유사암 및 소아 희귀 질환 납입면제 범위 우수', badges: ['납면 넓음', '희귀난치병'] },
            { company: '삼성화재', product: '우리 아이 안심케어', highlight: '대기업 네임드 신속 보상 서비스 연계', badges: ['삼성케어', '치아+어린이 통합'] },
            { company: '한화손해보험', product: '라이프플러스어린이', highlight: '어른이보험 실속형 비갱신 가격 경쟁력 우수', badges: ['어른이 실속형', '비갱신 강자'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-yellow-50/20 rounded-2xl md:rounded-[2.5rem] border border-yellow-100 hover:border-yellow-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-yellow-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200"
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
      <div className="border-t border-yellow-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "세상에 태어날 가장 소중한 천사에게,<br />
            <span className="text-yellow-600">평생을 든든하게 받쳐줄 부모의 첫 선물입니다.</span>"
          </p>
        </div>
        <button
          onClick={onAction}
          className="bg-yellow-500 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-yellow-600 transition-all hover:scale-105 shadow-2xl shadow-yellow-400/30 shrink-0"
        >
          어린이/태아 보험료 실시간 비교하기
        </button>
      </div>

    </div>
  </section>
);
