import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Car, ShieldCheck, Calculator, ShieldAlert, Sparkles,
  UserCheck, Clock, Quote, ClipboardCheck, Star, Activity, AlertTriangle, Compass
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const CarExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-blue-50/10 px-2 sm:px-4 relative overflow-hidden" id="car-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            도로 위의 가장 든든한 동반자, 평생 자산 보호의 시작
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            가장 합리적인 운행을 위한 <span className="text-blue-600">균형 잡힌 울타리</span>,<br />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: 'KIDI 차종요율', label: '수리비 등급 현실적 반영', sub: '국산/수입 브랜드별 특화 요율' },
          { num: '운전자 범위', label: '1인/부부/가족/누구나 한정', sub: '할증률 최소화 범위 매칭' },
          { num: '자동차상해', label: '치료비 실비 + 위자료 + 휴업손해', sub: '자기신체사고 대비 과실상계 없이 보상' },
          { num: '할인 특약', label: '마일리지, 안전점수 등 연동', sub: '주행거리 충족 시 만기 환급 혜택' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-blue-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
            <p className="text-2xl font-black text-blue-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 핵심 담보 가이드 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-blue-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">필수 핵심 담보 설계 가이드</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            교통사고 시 형사적 책임 면제와 내 가족의 균형 잡힌 치료비 확보를 위해{' '}
            <span className="text-blue-600 font-black">반드시 확인해야 할 핵심 담보</span>
             설계의 기준입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '대인배상 II', label: '반드시 "무한" 한도 설정 권장', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '교통사고처리특례법상 12대 중과실·사망·중상해 제외 일반사고 시 형사처벌 면제 요건' },
              { title: '대물배상', label: '최소 5억 원 ~ 10억 원 한도 권장', color: 'bg-indigo-50/50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '도로 위 고가 수입차 및 고전압 전기차(배터리 전손) 배상책임 위험 대비' },
              { title: '자동차상해', label: '자기신체사고 대비 보장 범위 우수', color: 'bg-emerald-50 border-emerald-100', badge: 'text-emerald-700 bg-emerald-100', desc: '상해 급수 한도 없이 약정 한도 내 치료비 실비와 위자료, 휴업손해를 과실상계 없이 보상' },
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

          <div className="mt-8 p-5 md:p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <p className="text-blue-700 font-black text-xs mb-1">💡 자상(자동차상해) 특약 체크 포인트</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              자기신체사고(자손) 대비 연 보험료는 일부 추가되지만, 사고 시 과실 비율에 따른 감액 없이 약정 한도 내에서 병원비 전액과 휴업손해를 정액 지원받을 수 있는 실질적인 운전자 보호 담보입니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 보험료 절감 5대 추가 특약 전략 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Calculator className="w-56 h-56" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-blue-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">보험료 절감 주요 할인 특약</h3>
              </div>
            </div>

            <div className="space-y-6">
              {/* 특약 1 */}
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 주행거리 마일리지 & 안전운전 점수 특약
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  연간 주행거리 충족 시(예: 3,000km 이하 구간 시 최대 35% 수준) 만기 정산 환급. TMAP/카카오내비 안전점수 기준 충족 시 추가 선할인을 적용받을 수 있습니다 (회사별 할인율 상이).
                </p>
              </div>

              {/* 특약 2 */}
              <div className="p-5 md:p-6 bg-blue-500/20 rounded-2xl md:rounded-[2.5rem] border border-blue-400/30 hover:bg-blue-500/30 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> 첨단안전장치 & 커넥티드카 연동 할인
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  출고 시 장착된 순정 안전장치 및 통신형 커넥티드 서비스 등록 시 추가 할인 혜택 적용 가능.
                </p>
                <div className="space-y-1.5 text-[11px] font-bold opacity-75">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    첨단안전장치 특약: 차선이탈/전방충돌 방지장치 탑재 시 3%~7% 수준 할인
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    커넥티드카/블랙박스 특약: 블루링크, 기아커넥트 등 개통 및 장착 시 추가 할인
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-blue-400 font-black text-xs mb-1 uppercase tracking-widest">💡 가입 팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              블랙박스 사진 등록이나 커넥티드카 앱 연동 등 증빙 자료를 청약 시 제출하면 보험료가 즉시 할인되므로 가입 전 할인 특약 증빙 서류를 미리 확인하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── [필수 고지] 자동차보험 표준 산출 기준 및 의무보험 법적 고지 ── */}
      <div className="mb-16 bg-white rounded-3xl border border-blue-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 mt-1">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs text-slate-600 space-y-2 leading-relaxed">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-slate-900 text-sm">💡 [예시 기준 안내] 자동차보험 표준 예시 산출 기준 및 의무보험 필수 안내</span>
              <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px]">손해보험협회 공시 기준</span>
            </div>
            <p className="font-bold text-slate-700">
              • **예시 산출 기준**: 주요 손해보험사 개인용 자동차보험 표준 플랜 / 35세 남성 1인 한정 / 최초 가입(가입경력 3년 이상 무사고) / 중형 가솔린 세단(차량가액 2,500만 원) / 담보: 대인I(의무), 대인II(무한), 대물(5억 원), 자기신체/자동차상해(2억/부상3천), 무보험차상해(2억), 자기차량손해(자기부담금 20%) 기준 예시 연간 보험료 약 68만 원~85만 원 (피보험자의 연령, 성별, 사고 이력, 차량 모델 및 할인특약 적용 여부에 따라 실제 보험료는 크게 상이합니다).
            </p>
            <div className="pt-2 border-t border-blue-100 text-[11px] text-slate-500 space-y-1">
              <p>• **자동차손해배상 보장법 제5조 의무보험 고지**: 자동차 보유자는 법률에 따라 대인배상 I 및 대물배상(2천만 원)에 반드시 가입해야 합니다. 의무보험 미가입 시 경과 일수에 따라 자가용 기준 최대 90만 원의 과태료가 부과되며, 미가입 상태로 운행 시 1년 이하의 징역 또는 1천만 원 이하의 벌금형에 처해질 수 있습니다.</p>
              <p>• **마일리지 할인 특약 정산 안내**: 마일리지 주행거리 할인은 보험 만기 시점에 최종 주행거리 사진을 등록하여 연간 운행 거리에 따라 사후 정산(계좌 입금)되는 후환급 특약입니다.</p>
              <p>• **교통사고처리특례법 적용 한계**: 대인배상 II를 무한으로 가입하더라도 음주운전, 신호위반, 중앙선 침범 등 12대 중과실 사고나 피해자 중상해 및 사망 사고 발생 시에는 형사 처벌 대상이 됩니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 트렌드 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
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
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {maskCompany(item.company, isUnlocked)}{' '}
                    <span className="text-blue-300 text-xs font-bold ml-1">{maskProductName(item.product, isUnlocked)}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-blue-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{maskText(item.limit, isUnlocked)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-blue-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-blue-500" /> 자격 및 담보 안심 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 대인배상 무한 설정', desc: '인명사고 발생 시 교통사고처리특례법 적용 혜택(12대 중과실/중상해 제외)을 받기 위한 대인배상II 무한 한도 설정 권장' },
              { step: '02. 대물 한도 확대 검토', desc: '고액 다중추돌 및 수입차 사고 대비를 위해 대물배상 한도를 5억 원 이상으로 넉넉하게 세팅 검토' },
              { step: '03. 자동차상해 특약 전환', desc: '상해급수별 한도 제한이 있는 자기신체사고(자손) 대신 과실상계 없이 보상 가능한 자동차상해(자상) 특약 비교 검토' },
              { step: '04. 운전자 한정 할인 대조', desc: '배우자나 가족 운전 시 실질적 범위를 초과하지 않도록 1인/부부 등 최적 운전자 특약 검토' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50 hover:border-blue-200 transition-colors">
                <div className="shrink-0 font-black text-blue-700 text-sm w-full sm:w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-blue-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">자차 보장 핵심 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① KIDI 요율 차종별 감가율 차등 적용<br />
              ② 단독사고 제외 가입을 통한 실속 설계<br />
              ③ 자차 자기부담금 비율 최적화 (20%)<br />
              ④ 침수사고 대비 특약 포함 가입<br />
              ⑤ 무보험차상해 가입 (타인 무보험 뺑소니 대비)
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
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
      <div className="mb-14 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-blue-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          주요 손해보험사 자동차보험 대표 상품 특징 안내 (손해보험협회 공시 기준)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '현대해상', product: '하이카 자동차보험', highlight: '신속 보상망 우수, 자녀 할인 연계 특화', badges: ['신속출동 강점', '커넥티드 할인'] },
            { company: 'KB손해보험', product: 'KB 자동차보험', highlight: '대중교통 할인 특약 및 안전운전 연동 할인', badges: ['안전점수 특화', '대중교통 중복'] },
            { company: 'DB손해보험', product: '프로미 자동차보험', highlight: 'Tmap 안전운전 최대 할인율 지원, 가격 가성비', badges: ['Tmap 최대할인', '가성비 우수'] },
            { company: '삼성화재', product: '애니카 자동차보험', highlight: '전국 촘촘한 긴급출동 네트워크 및 네임드 보상', badges: ['신속 보상', '네임드 출동망'] },
            { company: '메리츠화재', product: '메리츠 자동차보험', highlight: '주행거리 마일리지 환급 구간 설계가 합리적', badges: ['단거리 최적화', '마일리지 우수'] },
            { company: '한화손해보험', product: '한화 자동차보험', highlight: '연간 운행이 극단적으로 적은 유저를 위한 가성비', badges: ['초실속 요율', '실속형 마일리지'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-blue-50/20 rounded-2xl md:rounded-[2.5rem] border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-blue-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
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

      {/* ── 법적 고지문 (금소법 제19조 관련) ── */}
      <div className="mb-20 p-6 md:p-8 bg-slate-50 rounded-3xl border border-slate-200 text-xs text-slate-500 space-y-2 leading-relaxed">
        <p className="font-bold text-slate-700 text-sm mb-1">[보험 계약 체결 전 유의사항 및 법적 고지]</p>
        <p>• 보험계약 체결 전 반드시 해당 상품설명서 및 약관을 확인하시기 바랍니다.</p>
        <p>• 본 안내는 손해보험협회 심의기준 및 각 사 공시 내용을 바탕으로 작성되었으며, 보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결하는 경우 보험인수가 거절되거나 보험료가 인상될 수 있고 보장내용이 달라질 수 있습니다.</p>
        <p>• 자동차보험은 자동차손해배상 보장법상 의무보험(대인배상 I, 대물배상 2천만 원)과 임의보험(대인배상 II, 자기신체사고/자동차상해, 자기차량손해, 무보험차상해 등)으로 구분되며, 의무보험 미가입 시 관계 법령에 따라 과태료가 부과됩니다.</p>
        <p>• 주행거리 마일리지 할인특약, 블랙박스 할인, 첨단안전장치 특약, 자녀할인 특약 등 각종 할인특약은 보험사별 적용 요율 및 가입 조건(사진 제출, 실시간 주행거리 측정 등)이 상이하며, 만기 정산(후환급) 방식으로 운영될 수 있습니다.</p>
        <p>• (주)케어인슈는 다수의 보험사와 계약 체결 및 중개하는 금융상품판매대리·중개업자로서 보험사로부터 보험계약 체결권을 부여받지 아니하며 금융소비자보호법 등 관련 법령을 준수합니다.</p>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-blue-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "도로 위에서 만날 수 있는 모든 위험에 대한 균형 잡힌 방패,<br />
            <span className="text-blue-600">안전한 주행을 지키는 가장 현명한 부모와 운전자의 선택입니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-2xl shadow-blue-400/30 shrink-0"
          >
            자동차 보험료 실시간 비교 상담하기
          </button>
        )}
      </div>

    </div>
  </section>
);
