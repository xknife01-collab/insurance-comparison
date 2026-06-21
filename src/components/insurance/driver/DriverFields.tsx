import React from 'react';
import { Car, Activity, UserCheck, Clock, AlertOctagon, ShieldCheck, Scale, ShieldAlert } from 'lucide-react';

interface Props {
  drivingPurpose: 'private' | 'commercial' | 'motorcycle';
  setDrivingPurpose: (v: 'private' | 'commercial' | 'motorcycle') => void;
  jobClass: 1 | 2 | 3;
  setJobClass: (v: 1 | 2 | 3) => void;
  planType: 'saving' | 'standard' | 'premium';
  setPlanType: (v: 'saving' | 'standard' | 'premium') => void;
}

export const DriverFields: React.FC<Props> = ({
  drivingPurpose,
  setDrivingPurpose,
  jobClass,
  setJobClass,
  planType,
  setPlanType
}) => {
  return (
    <div id="input-driver-fields" className="space-y-12 animate-in fade-in duration-500">
      
      {/* ── SECTION 1: 운전 목적 설정 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Car className="w-40 h-40" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-black bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-full border border-purple-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white">
              운전 목적(용도)을 선택해 주세요
            </h4>
          </div>
          <p className="text-xs font-bold text-slate-400 leading-relaxed mb-8 max-w-2xl">
            가끔이라도 영업 목적(화물 수송, 택시 운행, 퀵서비스 등)으로 차량을 주행하거나 이륜차(오토바이)를 주행하신다면 정확한 구분을 선택해 고지해야 사고 시 불이익을 방지할 수 있습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'private', label: '자가용 (일반 개인용)', desc: '출퇴근, 통학, 마트 장보기 및 주말 레저용 일반 승용차 운행', icon: Car, tag: '일반 자가용 가입군' },
              { id: 'commercial', label: '영업용 (상업적 목적)', desc: '택시, 버스, 화물트럭, 퀵배달, 대리운전 등 유상 자동차 운송용 운행', icon: Activity, tag: '업무용 고지필수' },
              { id: 'motorcycle', label: '이륜차 (오토바이 운행)', desc: '배달대행, 퀵서비스, 통근 또는 레저 목적의 오토바이 주행 전용', icon: ShieldAlert, tag: '이륜차 전용 요율' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setDrivingPurpose(item.id as any)}
                type="button"
                className={`flex flex-col text-left p-6 md:p-8 rounded-[2.5rem] border-2 transition-all hover:scale-[1.01] active:scale-[0.99] relative group ${
                  drivingPurpose === item.id
                    ? 'bg-purple-600/10 border-purple-500 shadow-xl shadow-purple-500/5'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-4">
                  <div className={`p-4 rounded-2xl ${drivingPurpose === item.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white/10 text-slate-400 group-hover:text-white group-hover:bg-white/15'} transition-all`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                    drivingPurpose === item.id ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-400'
                  }`}>
                    {item.tag}
                  </span>
                </div>
                <h5 className={`font-black text-base md:text-lg mb-2 ${drivingPurpose === item.id ? 'text-purple-300' : 'text-slate-200'}`}>
                  {item.label}
                </h5>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 2: 직업급수 설정 ── */}
      <div className="bg-white border border-purple-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full border border-purple-200 uppercase tracking-widest">Step 02</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            피보험자의 직업 위험도를 지정해 주세요
          </h4>
        </div>
        <p className="text-xs font-bold text-slate-400 leading-relaxed mb-8 max-w-2xl">
          상해 보험사고 위험률 산정에 필수적인 고지 항목입니다. 사무직과 현장 작업직의 상해 요율 차이가 존재하므로, 현재 실질적으로 수행하고 있는 직무를 매칭해야 합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 1, label: '1급 (사무직 / 일반)', desc: '사무직원, 교사, 공무원, 대학생, 주부 등 상해 위험이 극히 적은 직군', icon: UserCheck, color: 'border-emerald-200' },
            { id: 2, label: '2급 (현장기술 / 자영업)', desc: '제조 공장 기술직, 요식업 영업주, 건설 현장 감독관 등 보통 위험군', icon: Clock, color: 'border-amber-200' },
            { id: 3, label: '3급 (현장운전 / 고위험)', desc: '영업 화물/버스 기사, 배달 라이더, 현장 일용직 등 상해 노출 극대화군', icon: AlertOctagon, color: 'border-rose-200' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setJobClass(item.id as any)}
              type="button"
              className={`flex flex-col text-left p-6 md:p-8 rounded-[2.5rem] border-2 transition-all hover:scale-[1.01] active:scale-[0.99] relative group ${
                jobClass === item.id
                  ? 'bg-purple-50/50 border-purple-600 shadow-lg shadow-purple-600/5'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="p-4 rounded-2xl bg-slate-50 text-slate-600 group-hover:bg-slate-100 transition-all mb-4 self-start">
                <item.icon className={`w-5 h-5 ${jobClass === item.id ? 'text-purple-600' : 'text-slate-400'}`} />
              </div>
              <h5 className={`font-black text-sm md:text-base mb-2 ${jobClass === item.id ? 'text-purple-600' : 'text-slate-800'}`}>
                {item.label}
              </h5>
              <p className="text-xs text-slate-400 font-bold leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── SECTION 3: 희망 보장 플랜 설정 ── */}
      <div className="bg-white border border-purple-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full border border-purple-200 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            희망하시는 보장 설계 등급을 정해 주세요
          </h4>
        </div>
        <p className="text-xs font-bold text-slate-400 leading-relaxed mb-8 max-w-2xl">
          변호사 선임 비용 경찰조사단계 선지원 탑재 유무 및 형사합의금 한도 세팅에 따라 플랜 가격 및 안정성이 조율됩니다.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              id: 'saving',
              label: '실속형 (가성비 플랜)',
              price: '월 1~2만 원대',
              desc: '벌금 및 기본적인 형사합의금만 가성비 있게 커버하는 미니멀 세팅',
              features: ['교사처(형사합의금) 1억 원', '변호사 선임비 3,000만 원', '벌금 대인 2,000만 원'],
              icon: ShieldCheck,
              accent: 'bg-emerald-50 text-emerald-700 border-emerald-100'
            },
            {
              id: 'standard',
              label: '표준형 (가장 균형 잡힌 플랜)',
              price: '월 2~3만 원대',
              desc: '평균 리스크를 안정적으로 대비하고 주요 상해 담보까지 탄탄히 추가된 정석 세팅',
              features: ['교사처(형사합의금) 1.5억 원', '변호사 선임비 5,000만 원', '벌금 대인 3,000만 원 최대'],
              icon: Scale,
              accent: 'bg-purple-50 text-purple-700 border-purple-100'
            },
            {
              id: 'premium',
              label: 'VIP 안심형 (프리미엄 플랜)',
              price: '월 3~4만 원대',
              desc: '2026 최신 트렌드인 경찰 첫 출석 단계 변호인 선임비 선지급 및 최대 한도 보강 설계',
              features: ['교사처(형사합의금) 2억 원', '경찰조사 변호사비 5,000만 원', '대인 3,000만/대물 500만 벌금'],
              icon: ShieldAlert,
              accent: 'bg-indigo-50 text-indigo-700 border-indigo-100'
            }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPlanType(item.id as any)}
              type="button"
              className={`flex flex-col text-left p-8 rounded-[2.5rem] border-2 transition-all hover:scale-[1.01] active:scale-[0.99] relative group ${
                planType === item.id
                  ? 'bg-purple-50/30 border-purple-600 shadow-xl shadow-purple-600/5'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center w-full mb-6">
                <span className={`text-[10px] font-black px-3.5 py-1.5 rounded-xl border ${item.accent}`}>
                  {item.price}
                </span>
                <item.icon className={`w-6 h-6 ${planType === item.id ? 'text-purple-600' : 'text-slate-300 group-hover:text-slate-400'}`} />
              </div>
              <h5 className={`font-black text-base md:text-lg mb-2 ${planType === item.id ? 'text-purple-600' : 'text-slate-800'}`}>
                {item.label}
              </h5>
              <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">{item.desc}</p>
              
              <div className="mt-auto space-y-2 border-t border-slate-50 pt-6 w-full">
                {item.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
};
