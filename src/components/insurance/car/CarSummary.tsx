import React from 'react';
import { AnalysisResult } from '../../../types/insurance';
import { Car, ShieldCheck, Compass, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

export const CarSummary: React.FC<Props> = ({ result }) => {
  const { analysis } = result as any;
  if (!analysis) return null;

  const car = analysis.car || {
    annualMileage: 'under_5k',
    safeDrivingScore: 'under_80',
    hasConnectedCar: true,
    hasBlackbox: true,
    hasChildRider: false,
    currentPropertyLimit: 2,
    currentInjuryType: 'jason',
    brand: 'hyundai',
    model: 'grandeur',
    year: 2024,
    driverLimit: 'single',
    ownDamage: 'join',
  };

  const ALL_MODEL_LABELS: Record<string, string> = {
    avante: '아반떼', sonata: '쏘나타', grandeur: '그랜저', tucson: '투싼', palisade: '팰리세이드',
    morning: '모닝', k5: 'K5', k8: 'K8', sportage: '스포티지', sorento: '쏘렌토', carnival: '카니발',
    g70: 'G70', g80: 'G80', gv70: 'GV70', gv80: 'GV80',
    torres: '쌍용 토레스', rexton: '쌍용 렉스턴', xm3: '르노 XM3', trax: 'GM 트랙스',
    modely: '테슬라 Model Y', model3: '테슬라 Model 3', bmw5: 'BMW 5시리즈', mercee: '벤츠 E클래스',
  };
  const BRAND_LABELS: Record<string, string> = {
    hyundai: '현대', kia: '기아', genesis: '제네시스', kg_renault_gm: 'KG/르노', imported: '수입차',
  };
  const DRIVER_LABELS: Record<string, string> = {
    single: '1인 한정', couple: '부부 한정', family: '가족 한정', anyone: '누구나',
  };
  const OWN_DAMAGE_LABELS: Record<string, string> = {
    join: '자차 가입 (종합)', exclude_single: '단독제외 가입', none: '자차 미가입',
  };

  const getMileageLabel = (mil: string) => {
    switch (mil) {
      case 'under_3k': return '3,000 km 이하 (최상)';
      case 'under_5k': return '5,000 km 이하 (우수)';
      case 'under_10k': return '10,000 km 이하 (보통)';
      default: return '15,000 km 초과 (없음)';
    }
  };

  const getScoreLabel = (score: string) => {
    switch (score) {
      case 'over_80': return '80점 이상 (최대할인)';
      case 'under_80': return '70 ~ 80점 (기본할인)';
      case 'under_70': return '70점 미만 (할인없음)';
      default: return '미사용 / 조회안함';
    }
  };

  const getLimitLabel = (lim: number) => {
    return `대물배상 ${lim}억 원`;
  };

  const getInjuryLabel = (type: string) => {
    return type === 'jasang' ? '자동차상해 (자상)' : '자기신체사고 (자손)';
  };

  const modelId = car.model || 'grandeur';
  const brandId = car.brand || 'hyundai';
  const yearVal = car.year || 2024;
  const driverLimitVal = car.driverLimit || 'single';
  const ownDamageVal = car.ownDamage || 'join';

  const items = [
    {
      label: '가입 차량',
      amount: `${BRAND_LABELS[brandId] || brandId} ${ALL_MODEL_LABELS[modelId] || modelId} (${yearVal}년식)`,
      status: '확인됨',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      label: '운전자 범위 특약',
      amount: DRIVER_LABELS[driverLimitVal] || driverLimitVal,
      status: driverLimitVal === 'single' ? '최저가' : driverLimitVal === 'anyone' ? '고비용' : '보통',
      color: driverLimitVal === 'single' ? 'text-emerald-600 bg-emerald-50' : driverLimitVal === 'anyone' ? 'text-rose-600 bg-rose-50' : 'text-orange-600 bg-orange-50',
    },
    { 
      label: '연간 예상 주행거리', 
      amount: getMileageLabel(car.annualMileage), 
      status: car.annualMileage === 'under_3k' || car.annualMileage === 'under_5k' ? '환급 대상' : '확인됨', 
      color: car.annualMileage === 'under_3k' || car.annualMileage === 'under_5k' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 bg-gray-50' 
    },
    { 
      label: 'T-map 안전운전 점수', 
      amount: getScoreLabel(car.safeDrivingScore), 
      status: car.safeDrivingScore === 'over_80' ? '최대할인' : '적용완료', 
      color: car.safeDrivingScore === 'over_80' ? 'text-blue-600 bg-blue-50' : 'text-orange-600 bg-orange-50' 
    },
    {
      label: '자기차량손해 (자차)',
      amount: OWN_DAMAGE_LABELS[ownDamageVal] || ownDamageVal,
      status: ownDamageVal === 'join' ? '완전 보장' : ownDamageVal === 'exclude_single' ? '절약형' : '미가입',
      color: ownDamageVal === 'join' ? 'text-emerald-600 bg-emerald-50' : ownDamageVal === 'none' ? 'text-rose-600 bg-rose-50' : 'text-orange-600 bg-orange-50',
    },
    { 
      label: '대물배상 기존 한도', 
      amount: getLimitLabel(car.currentPropertyLimit), 
      status: car.currentPropertyLimit >= 5 ? '안정권' : '확장 권장', 
      color: car.currentPropertyLimit >= 5 ? 'text-indigo-600 bg-indigo-50' : 'text-red-600 bg-red-50' 
    },
    { 
      label: '기존 상해 담보 방식', 
      amount: getInjuryLabel(car.currentInjuryType), 
      status: car.currentInjuryType === 'jasang' ? '100% 보장' : '전환 권장', 
      color: car.currentInjuryType === 'jasang' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50' 
    },
  ];

  const currentPremium = analysis.monthlyPremium || 80000;
  const recommendedPremium = result.recommendations?.upgrade?.estimatedPremium || 65000;
  const annualSavings = (currentPremium - recommendedPremium) * 12;

  return (
    <div className="space-y-6 text-left">
      {/* 상세 현황 판 */}
      <div className="rounded-[2.5rem] p-10 border bg-slate-50/30 border-slate-100">
        <h3 className="text-xl font-black mb-8 flex items-center gap-2 text-slate-800">
          <Car className="text-blue-600 w-6 h-6" />
          자동차보험 상세 설계 현황
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 flex flex-col justify-center gap-2 group hover:border-slate-300 transition-all">
              <div className="flex justify-between items-center w-full">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.label}</p>
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${item.color}`}>{item.status}</span>
              </div>
              <p className="text-lg font-black text-gray-800">{item.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 월 예상 절감액 및 연간 캐시백 */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-4 -translate-y-4">
          <Car className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-900/50 rounded-full text-[0.65rem] font-bold tracking-wider uppercase mb-2">
              <Sparkles size={12} className="text-blue-400" />
              Dynamic Auto Insurance Optimizer
            </div>
            <h4 className="text-2xl font-black mb-2">자동차보험 포트폴리오 최적화 결과</h4>
            <p className="text-sm font-bold text-blue-200/90 leading-relaxed max-w-xl">
              불필요한 대리점 수수료가 빠진 다이렉트 설계와 핵심 할인 특약을 연동하여, 대물 한도와 상해 수준을 대폭 끌어올리고도 보험료 부담은 획기적으로 낮췄습니다.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-right min-w-[280px]">
            <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest block mb-1">
              연간 기대 절감액 (환급금 포함)
            </span>
            <div className="text-4xl font-black text-white mb-2">
              {annualSavings.toLocaleString()} <span className="text-xl">원 환급 가능</span>
            </div>
            <span className="text-[10px] text-blue-200/60 block">
              * 국내 Top 6 보험사 종합 실시간 최적화 기준
            </span>
          </div>
        </div>
      </div>

      {/* 자손 경고 문구 안내 */}
      {car.currentInjuryType === 'jason' && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex flex-col md:flex-row items-start gap-4">
          <AlertCircle className="text-red-500 w-8 h-8 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-sm font-black text-red-800">
              [심각] 사망/장해 발생 시 가족의 치료 부담이 커지는 '자기신체사고(자손)'로 가입되어 있습니다.
            </h5>
            <p className="text-xs text-red-600 leading-relaxed">
              자기신체사고는 사고 과실 여부에 따라 등급별 치료비 한도(상해 12등급 시 단 120만 원 한도 등) 제한이 걸려 실제 병원비마저 자비로 메꿔야 합니다. 
              **자동차상해(자상)**로 전환하면 치료비 전액은 물론 위자료와 일 못한 날에 대한 휴업손해금까지 과실 유무 관계없이 100% 지급받으실 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
