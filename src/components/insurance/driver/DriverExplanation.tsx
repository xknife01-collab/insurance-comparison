import React from 'react';
import {
  Car, ShieldCheck, Scale, ShieldAlert, Sparkles,
  UserCheck, Clock, Quote, Activity, Compass, HelpCircle, AlertOctagon
} from 'lucide-react';

interface Props {
  onAction?: () => void;
}

export const DriverExplanation: React.FC<Props> = ({ onAction }) => (
  <section className="py-24 bg-purple-50/10 px-4 relative overflow-hidden" id="driver-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-purple-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            나와 상대방, 그리고 내 가족을 지키는 최후의 법률적 방패
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            단 한 번의 사고로 무너지는 일상 방지,<br />
            <span className="text-purple-600">운전자 보험의 명쾌한 정석</span>을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            12대 중과실 사고 변호사 선임비용 경찰조사단계 보장부터!<br />
            벌금 대인 3천만 원 한도와 교통사고처리지원금 2억 원의 합리적 설계 기준.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '경찰조사 변호사비', label: '경찰조사 개시 시점 지원', sub: '불기소/약식기소 포함 선지원 가능' },
          { num: '교사처 형사합의금', label: '피해자 중상해 시 최대 2억', sub: '형사합의금 실손 한도 대폭 보강' },
          { num: '스쿨존 대인벌금', label: '민식이법 벌금 최대 3천만', sub: '대물벌금 500만 원 중복 보장' },
          { num: '자부상 치료비', label: '14급 단순 염좌도 정액 지급', sub: '사고부상치료비 등급별 집중 케어' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-purple-100 rounded-[3rem] p-8 text-center shadow-sm hover:shadow-xl hover:border-purple-200 transition-all group">
            <p className="text-2xl font-black text-purple-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 핵심 3대 담보 가이드 */}
        <div className="bg-white rounded-[4rem] p-12 border border-purple-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-purple-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">필수 핵심 3대 비용 담보</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            운전 중 중과실 사고가 발생했을 때, 구속이나 형사처벌을 예방하기 위해{' '}
            <span className="text-purple-600 font-black">설계 시 무조건 채워야 할 필수 3대 담보</span>
             의 설계의 기준입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '교통사고처리지원금', label: '형사합의금 최대 2억 원 한도 실손 보장', color: 'bg-purple-50/50 border-purple-100', badge: 'text-purple-700 bg-purple-100', desc: '피해자 사망, 6주 이상 치료 필요 상해, 또는 12대 중과실 사고 시 형사합의비 부담 전담' },
              { title: '변호사 선임비용', label: '경찰조사 단계부터 선지원 탑재 필수', color: 'bg-indigo-50/50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '과거 약식기소 후에만 나오던 담보에서 개선되어, 경찰 첫 출석(조사) 단계부터 5천만 원 즉각 지원' },
              { title: '대인/대물 벌금', label: '스쿨존 민식이법 3천만 원 한도 최고치 설계', color: 'bg-emerald-50 border-emerald-100', badge: 'text-emerald-700 bg-emerald-100', desc: '어린이보호구역 벌금 인상안 완벽 대비 및 도로 시설물 훼손 벌금 최대 500만 원 보장' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-purple-50 rounded-3xl border border-purple-100">
            <p className="text-purple-700 font-black text-xs mb-1">⚠️ 구 가입자 리모델링 가이드</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              2025년 이전 가입 고객은 최근 대다수 상품에 도입된 **변호사 선임비 자기부담금 50% 페널티**가 없는 경우가 많으므로, 단순히 한도 증액을 위해 함부로 해약하기보다는 기존 증권을 먼저 정밀 진단받는 것이 훨씬 안전합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 자동차보험 vs 운전자보험 비교 */}
        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Scale className="w-56 h-56 text-purple-600" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-purple-600 rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-purple-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">민사 책임과 형사 책임의 완벽한 분리</h3>
              </div>
            </div>

            <div className="space-y-6">
              {/* 차이 1 */}
              <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-purple-300 mb-2 flex items-center gap-2">
                  🚗 자동차보험 (민사 배상 100%)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  피해 차량 수리, 부상인 치료 및 위자료 지급 등 **"상대방의 인적/물적 피해를 대신 메꿔주는"** 강제성 민사 보험입니다. 본인의 사법적 형사 처벌은 대신 방어해 주지 않습니다.
                </p>
              </div>

              {/* 차이 2 */}
              <div className="p-6 bg-purple-500/20 rounded-[2.5rem] border border-purple-400/30 hover:bg-purple-500/30 transition-colors">
                <p className="font-black text-purple-300 mb-2 flex items-center gap-2">
                  🛡️ 운전자보험 (형사/행정 방어 100%)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  12대 중과실 사고 등으로 형사 입건 시 본인의 법적 구속을 면하고 사법 절차를 방어하기 위한 **"행정적 벌금, 변호사비용, 형사합의금"**을 전담하는 실질적인 본인 보호형 법률 보험입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-purple-400 font-black text-xs mb-1 uppercase tracking-widest">💡 설계 핵심 팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "자동차보험에서 모든 것이 해결될 것이라 믿다가, 중과실 인명 사고 시 형사합의비 수천만 원을 개인 자산으로 감당해 가정이 흔들리는 운전자가 많습니다. 단 월 1~2만 원의 운전자 설계가 인생의 최후 보루가 됩니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 경찰조사단계 보장 의무화 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4rem] p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-purple-400/30">
              <Sparkles className="w-3 h-3" /> 운전자보험 시장 최신 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">수사 초기 단계 방어를 위한 경찰 조사 특약의 진화</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              최근 대법원 판례 및 검경 수사권 조정에 따라 초기 수사기관 진술의 중요성이 극대화되었습니다. 이에 발맞추어 기소 이전 경찰서 출석 단계부터 변호사가 동행해 법적 불이익을 완전히 차단하는 특약 가입이 완벽한 정석으로 자리 잡았습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '변호사 선임비용', product: '경찰조사 개시 시점 탑재형', limit: '최대 5,000만 원 실손 한도', note: '불기소, 내사종결, 약식기소 시에도 변호사 선임비 전액 지원' },
              { company: '교통사고처리지원금', product: '피해자 중상해(1~3급) 특별 약정', limit: '최대 2억 원 한도 실손 보장', note: '검찰 기소 전 형사합의금 신속 지급 체계 탑재 여부' },
              { company: '자동차사고부상치료비', product: '14급 단순 타박/염좌 청구', limit: '등급별 최대 30만 원 정액 보장', note: '경상환자 도덕적 해이 방지를 위한 진료기록부 검증 필터 적용' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {item.company}{' '}
                    <span className="text-purple-300 text-xs font-bold ml-1">{item.product}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{item.note}</p>
                </div>
                <p className="font-black text-purple-400 text-sm shrink-0 ml-4">{item.limit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-purple-100 rounded-[4rem] p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-purple-500" /> 안심 리모델링 & 가입 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 수사 개시 동행 보장', desc: '기소가 아닌 경찰 조사단계 첫 출석부터 변호인 대리 선임비 보장이 포함되는지 확인' },
              { step: '02. 6주 미만 사고 지원', desc: '스쿨존 및 일반 도로 6주 미만 경상 사고 형사합의 시에도 실손 보장이 적용되는지 체크' },
              { step: '03. 일배책 중복 배제 확인', desc: '일상생활배상책임 특약 중복 가입으로 비례보상되어 보험료가 낭비되는지 증권 점검' },
              { step: '04. 직업 등급 고지 준수', desc: '운전직, 현장직 등 직업 등급 변경 고지를 빠뜨려 사고 발생 시 보장이 거절되는 리스크 차단' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-purple-50/30 rounded-3xl border border-purple-100/50 hover:border-purple-200 transition-colors">
                <div className="shrink-0 font-black text-purple-700 text-sm w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-purple-600 text-white rounded-[3.5rem] p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">보장 리모델링 핵심 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 자기부담금 50% 조항 적용 여부 체크<br />
              ② 경찰 조사단계 선임비 탑재 유무<br />
              ③ 자부치 염좌(14급) 보장 한도 확인<br />
              ④ 교통사고처리지원금 2억 이상 업그레이드<br />
              ⑤ 벌금 한도 법정 최고액 3천만 세팅
            </p>
          </div>
          <div className="bg-white border border-purple-100 rounded-[3.5rem] p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-purple-500 w-5 h-5" /> 기존 보험 유지 검토
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              예전에 가입한 운전자보험은 변호사 비용 실손 보장 조건(자기부담금 전무)이 현재보다 훨씬 유리하므로, 전문가 정밀 증단 없이 섣불리 해약해선 절대 안 됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-[4rem] p-12 border border-purple-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 Top 6 보험사 운전자/법률비용보험 상품 경쟁력 전수 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '현대해상', product: '마음안심 운전자보험', highlight: '경찰조사단계 선임비 탄탄한 기본 한도, 자녀 양육 운전자 우대 할인', badges: ['경찰단계 선두', '가족 가입 우대'] },
            { company: 'KB손해보험', product: '안전운전 파트너 운전자보험', highlight: '대중교통 상해 및 자부상 한도 보강 설계, 경쟁력 있는 특약 요율', badges: ['자부상 우수', '합리적 요율'] },
            { company: 'DB손해보험', product: '참좋은 운전자보험', highlight: '업계 최초 경찰조사 선임비 보장 특허 출시, 탄탄한 수사 동행 프로토콜', badges: ['최초 특허 탑재', '변호사 한도최고'] },
            { company: '삼성화재', product: '안심동행 운전자보험', highlight: '형사합의금 접수 시 신속 심사 및 즉각 합의금 선지급 네트워크', badges: ['신속 심사', '네임드 출동망'] },
            { company: '메리츠화재', product: '올바른 운전자보험', highlight: '12대 중과실 한도 보장 극대화 및 단순 타박상 단독 보장 설계 최적화', badges: ['중과실 특화', '경상 케어 최적화'] },
            { company: '한화손해보험', product: '차도리 운전자보험', highlight: '주말 상해사고 집중 보강 특약 및 직장인 출퇴근길 안심 보장 특화', badges: ['주말사고 특약', '직장인 맞춤형'] },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-purple-50/20 rounded-[2.5rem] border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-purple-600 mb-1">{item.company}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{item.product}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{item.highlight}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200"
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
      <div className="border-t border-purple-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "가장 완전한 형태의 운전 권리 보호 장벽,<br />
            <span className="text-purple-600">가정과 나의 인생을 완벽하게 지키는 현명한 설계사와 운전자의 파트너십입니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-purple-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-purple-700 transition-all hover:scale-105 shadow-2xl shadow-purple-400/30 shrink-0"
          >
            운전자 보험 무료 맞춤 설계하기
          </button>
        )}
      </div>

    </div>
  </section>
);
