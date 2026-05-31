import React from 'react';
import {
  Car, ShieldCheck, Calculator, ShieldAlert, Sparkles,
  UserCheck, Clock, Quote, ClipboardCheck, Star, Activity, AlertTriangle, Compass
} from 'lucide-react';

interface Props {
  onAction?: () => void;
}

export const CarExplanation: React.FC<Props> = ({ onAction }) => (
  <section className="py-24 bg-blue-50/10 px-4 relative overflow-hidden" id="car-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            도로 위의 가장 든든한 동반자, 평생 자산 보호의 시작
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            가장 합리적인 운행을 위한 <span className="text-blue-600">완벽한 울타리</span>,<br />
            우리 차 보험의 해답을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            차종별 KIDI 감가방어율부터 자상(자동차상해) 특약 핵심 가이드까지!<br />
            마일리지 할인 환급과 3대 주요 담보 설계의 가장 현명한 정석 기준.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: 'KIDI 차종요율', label: '수리비 등급 현실적 반영', sub: '국산/수입 브랜드별 특화 요율' },
          { num: '운전자 범위', label: '1인/부부/가족/누구나 한정', sub: '할증률 최소화 범위 매칭' },
          { num: '자동차상해', label: '치료비 전액 + 위자료 + 휴업손해', sub: '자기신체사고 대비 압도적 한도 보장' },
          { num: '5대 추가특약', label: '마일리지, 안전점수 등 연동', sub: '최대 40% 이상 연간 할인 환급 가능' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-blue-100 rounded-[3rem] p-8 text-center shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
            <p className="text-2xl font-black text-blue-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 핵심 담보 가이드 */}
        <div className="bg-white rounded-[4rem] p-12 border border-blue-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">필수 핵심 담보 설계 가이드</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            교통사고 시 형사적 책임 면제와 내 가족의 완벽한 치료비 확보를 위해{' '}
            <span className="text-blue-600 font-black">반드시 구성해야 할 핵심 담보</span>
             설계의 정석입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '대인배상 II', label: '반드시 "무한" 한도로 가입', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '12대 중과실 제외 일반 교통사고 시 형사 처벌(기소) 면제 필수 조건' },
              { title: '대물배상', label: '최소 5억 원 ~ 10억 원 한도 권장', color: 'bg-indigo-50/50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '도로 위 고가 수입차 및 고전압 전기차(배터리 전손) 급증 환경 대비' },
              { title: '자동차상해', label: '자기신체사고 대신 무조건 선택', color: 'bg-emerald-50 border-emerald-100', badge: 'text-emerald-700 bg-emerald-100', desc: '치료비 급수 제한 없음! 치료비 전액 + 위자료 + 일 못한 기간 휴업손해 100% 보장' },
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

          <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <p className="text-blue-700 font-black text-xs mb-1">⚠️ 자상(자동차상해) 가입 시 필수 체크</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              자기신체사고(자손) 대비 연 보험료는 단 <span className="text-blue-600 font-black">2~3만 원 차이</span>에 불과하지만, 큰 사고 시 본인 부담 병원비를 수천만 원 아낄 수 있는 실질적인 생존 보장 담보입니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 보험료 절감 5대 추가 특약 전략 */}
        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Calculator className="w-56 h-56" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-blue-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">보험료 절감 5대 할인 특약</h3>
              </div>
            </div>

            <div className="space-y-6">
              {/* 특약 1 */}
              <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 주행거리 마일리지 & 안전운전 점수 특약
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  연간 주행거리 충족 시 <span className="text-blue-300 font-black">최대 35% 현금 환급</span>. 티맵/카카오내비 안전점수 80점 이상 달성 시 추가로 <span className="text-blue-300 font-black">11%~13% 추가 즉시 할인</span>을 중복 적용받을 수 있습니다.
                </p>
              </div>

              {/* 특약 2 */}
              <div className="p-6 bg-blue-500/20 rounded-[2.5rem] border border-blue-400/30 hover:bg-blue-500/30 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> 첨단안전장치 & 커넥티드카 연동 할인
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  순정 첨단 장치 및 커넥티드 서비스 탑재 차량은 가만히 있어도 추가 혜택을 챙겨갈 수 있습니다.
                </p>
                <div className="space-y-1.5 text-[11px] font-bold opacity-75">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    첨단안전장치 특약: 차선이탈/전방충돌 방지장치 탑재 시 3%~7% 할인
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    커넥티드카/블랙박스 특약: 블루링크, 기아커넥트 등 개통 시 약 7% 할인
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-blue-400 font-black text-xs mb-1 uppercase tracking-widest">💡 전문가 꿀팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "블랙박스 할인 특약이나 커넥티드카 할인은 가입 시 사진 1장 등록이나 순정 앱 연동만으로 즉시 보험료가 차감되므로, 설계 시 빠뜨리지 않고 100% 챙겨가는 것이 현명한 맞춤 설계의 기초입니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4rem] p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-400/30">
              <Sparkles className="w-3 h-3" /> 자동차보험 시장 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">수입 프리미엄 브랜드 및 전기차 수리비 할증 현실화</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              보험개발원(KIDI) 기준 수리비 등급 요율 세분화 정책에 따라, 부품 공임비가 비싼 외제차와 배터리 전손 우려가 큰 전기차의 자차 요율이 정밀하게 인상되었습니다. 국산 일반 세단 대비 자차 특약 가격 차이가 2배 이상 벌어지고 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '국산 대형 SUV/RV', product: '카니발, 팰리세이드 등', limit: '자차 요율 1.85% 선 반영', note: '수리 규모가 상대적으로 큰 차종 보정 적용' },
              { company: '전기차 / 테슬라', product: 'Model Y, 아이오닉 6 등', limit: '자차 요율 2.25% 선 반영', note: '하부 배터리팩 손상 시 전손 처리 위험 반영' },
              { company: '수입 프리미엄 브랜드', product: 'BMW 5시리즈, Benz E클래스 등', limit: '자차 요율 2.35% 선 반영', note: '외제차 고가 순정 부품대 및 고액 공임비 반영' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {item.company}{' '}
                    <span className="text-blue-300 text-xs font-bold ml-1">{item.product}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{item.note}</p>
                </div>
                <p className="font-black text-blue-400 text-sm shrink-0 ml-4">{item.limit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-blue-100 rounded-[4rem] p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-blue-500" /> 자격 및 담보 안심 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 대인배상 무한 설정', desc: '인명사고 발생 시 형사 책임을 면하기 위해 무조건 대인배상II 무한 한도 필수 지정' },
              { step: '02. 대물 한도 확대 검토', desc: '고액 전선사고 대비를 위해 대물배상 한도를 5억 원 이상으로 넉넉하게 세팅' },
              { step: '03. 자동차상해 특약 전환', desc: '단순 보장 한도 제한이 있는 자기신체사고(자손) 약관을 빼고 자동차상해(자상)로 상향 선택' },
              { step: '04. 운전자 한정 할인 대조', desc: '배우자나 가족 운전 시 실질적 범위를 초과하지 않도록 1인/부부 등 최적 운전자 특약 검토' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50 hover:border-blue-200 transition-colors">
                <div className="shrink-0 font-black text-blue-700 text-sm w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-blue-600 text-white rounded-[3.5rem] p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">자차 보장 핵심 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① KIDI 요율 차종별 감가율 차등 적용<br />
              ② 단독사고 제외 가입을 통한 실속 설계<br />
              ③ 자차 자기부담금 비율 최적화 (20%)<br />
              ④ 침수사고 대비 특약 포함 가입<br />
              ⑤ 무보험차상해 가입 (타인 무보험 뺑소니 대비)
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-[3.5rem] p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-blue-500 w-5 h-5" /> 선천/노후 차 감가 예방
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              노후 차량은 매년 가치가 낮아지므로 최저가액(10% Failsafe) 기준이 있는 등급 요율을 적용받는지 확인해 보고 불필요한 고액 자차 설계는 조정하는 것이 좋습니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-[4rem] p-12 border border-blue-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 Top 6 자동차/자차보험 상품 경쟁력 전수 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '현대해상', product: '하이카 자동차보험', highlight: '신속 보상망 1위, 자녀 할인 연계 특화', badges: ['신속출동 강점', '커넥티드 할인'] },
            { company: 'KB손해보험', product: 'KB 자동차보험', highlight: '대중교통 할인 특약 및 안전운전 연동 할인', badges: ['안전점수 특화', '대중교통 중복'] },
            { company: 'DB손해보험', product: '프로미 자동차보험', highlight: 'Tmap 안전운전 최고 할인율 지원, 가격 가성비', badges: ['Tmap 할인최고', '가성비 우수'] },
            { company: '삼성화재', product: '애니카 자동차보험', highlight: '전국 촘촘한 긴급출동 네트워크 및 네임드 보상', badges: ['신속 보상', '네임드 출동망'] },
            { company: '메리츠화재', product: '메리츠 자동차보험', highlight: '주행거리 마일리지 환급 구간 설계가 합리적', badges: ['단거리 최적화', '마일리지 우수'] },
            { company: '한화손해보험', product: '한화 자동차보험', highlight: '연간 운행이 극단적으로 적은 유저를 위한 가성비', badges: ['초실속 요율', '실속형 마일리지'] },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-blue-50/20 rounded-[2.5rem] border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-blue-600 mb-1">{item.company}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{item.product}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{item.highlight}</p>
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
            "도로 위에서 만날 수 있는 모든 위험에 대한 완벽한 방패,<br />
            <span className="text-blue-600">안전한 주행을 지키는 가장 현명한 부모와 운전자의 선택입니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-2xl shadow-blue-400/30 shrink-0"
          >
            자동차 보험료 실시간 비교하기
          </button>
        )}
      </div>

    </div>
  </section>
);
