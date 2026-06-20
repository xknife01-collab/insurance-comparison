import React, { useEffect } from 'react';
import { Shield, Zap, Activity, HeartHandshake, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  cancerLimit: number;
  setCancerLimit: (v: number) => void;
  similarCancerLimit: number;
  setSimilarCancerLimit: (v: number) => void;
  brainLimit: number;
  setBrainLimit: (v: number) => void;
  heartLimit: number;
  setHeartLimit: (v: number) => void;
  cardioLimit: number;
  setCardioLimit: (v: number) => void;
  has1to5Surgery: boolean;
  setHas1to5Surgery: (v: boolean) => void;
  hasTargetedTherapy: boolean;
  setHasTargetedTherapy: (v: boolean) => void;
  hasThrombolysis: boolean;
  setHasThrombolysis: (v: boolean) => void;
  hasLiability: boolean;
  setHasLiability: (v: boolean) => void;
  paymentPeriod: number;
  setPaymentPeriod: (v: number) => void;
  coveragePeriod: number;
  setCoveragePeriod: (v: number) => void;
  isRenewable: boolean;
  setIsRenewable: (v: boolean) => void;
  refundType: 'standard' | 'low';
  setRefundType: (v: 'standard' | 'low') => void;
}

export const HealthGeneralFields: React.FC<Props> = ({
  cancerLimit, setCancerLimit,
  similarCancerLimit, setSimilarCancerLimit,
  brainLimit, setBrainLimit,
  heartLimit, setHeartLimit,
  cardioLimit, setCardioLimit,
  has1to5Surgery, setHas1to5Surgery,
  hasTargetedTherapy, setHasTargetedTherapy,
  hasThrombolysis, setHasThrombolysis,
  hasLiability, setHasLiability,
  paymentPeriod, setPaymentPeriod,
  coveragePeriod, setCoveragePeriod,
  isRenewable, setIsRenewable,
  refundType, setRefundType
}) => {

  // 일반암 한도의 20% 규제 적용
  useEffect(() => {
    const maxSimilar = Math.round(cancerLimit * 0.2);
    if (similarCancerLimit > maxSimilar) {
      setSimilarCancerLimit(maxSimilar);
    }
  }, [cancerLimit, similarCancerLimit, setSimilarCancerLimit]);

  const limitOptions = {
    cancer: [
      { label: '1,000만', value: 10000000 },
      { label: '3,000만', value: 30000000 },
      { label: '5,000만', value: 50000000 },
      { label: '1억 원', value: 100000000 }
    ],
    similar: [
      { label: '200만', value: 2000000 },
      { label: '600만', value: 6000000 },
      { label: '1,000만', value: 10000000 },
      { label: '2,000만', value: 20000000 }
    ],
    brain: [
      { label: '1,000만', value: 10000000 },
      { label: '2,000만', value: 20000000 },
      { label: '3,000만', value: 30000000 },
      { label: '5,000만', value: 50000000 }
    ],
    heart: [
      { label: '1,000만', value: 10000000 },
      { label: '2,000만', value: 20000000 },
      { label: '3,000만', value: 30000000 },
      { label: '5,000만', value: 50000000 }
    ],
    cardio: [
      { label: '미가입', value: 0 },
      { label: '500만', value: 5000000 },
      { label: '1,000만', value: 10000000 },
      { label: '2,000만', value: 20000000 }
    ]
  };

  return (
    <div id="input-healthGeneral-fields" className="bg-orange-50/20 rounded-[3rem] p-8 md:p-12 mb-12 border border-orange-100/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-orange-100/50 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-7 bg-orange-500 rounded-full"></div>
          <div className="text-left">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">종합건강 보장 및 조건 설계</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Comprehensive Health Planner</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] font-black text-orange-500 bg-orange-100/50 px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles size={12} className="animate-spin" /> 0.1초 맞춤 분석
          </span>
        </div>
      </div>

      {/* 3대 진단비 설정 */}
      <h4 className="text-lg font-black text-slate-700 text-left mb-6 flex items-center gap-2">
        <Shield size={18} className="text-orange-500" />
        3대 질병 진단비 한도 (핵심 보장)
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* 일반암 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-black text-slate-600">일반암 진단비</span>
            <span className="text-base font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-xl">
              {(cancerLimit / 10000).toLocaleString()}만 원
            </span>
          </div>
          <div className="flex bg-slate-50 rounded-2xl p-1 shadow-inner">
            {limitOptions.cancer.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCancerLimit(opt.value)}
                className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${cancerLimit === opt.value ? 'bg-slate-900 text-white shadow-md scale-102' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 유사암 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-600">유사암 진단비</span>
              <div className="group relative">
                <AlertCircle size={14} className="text-slate-300 cursor-pointer" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-3 bg-slate-800 text-white text-[0.65rem] font-bold rounded-2xl shadow-xl z-10 leading-relaxed">
                  ⚠️ 금감원 가이드라인: 일반암 진단비의 최대 20% 한도로만 설계가 제한됩니다.
                </div>
              </div>
            </div>
            <span className="text-base font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-xl">
              {(similarCancerLimit / 10000).toLocaleString()}만 원
            </span>
          </div>
          <div className="flex bg-slate-50 rounded-2xl p-1 shadow-inner">
            {limitOptions.similar.map((opt) => {
              const isDisabled = opt.value > Math.round(cancerLimit * 0.2);
              return (
                <button
                  key={opt.value}
                  disabled={isDisabled}
                  onClick={() => setSimilarCancerLimit(opt.value)}
                  className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${similarCancerLimit === opt.value ? 'bg-slate-900 text-white shadow-md scale-102' : isDisabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 뇌혈관 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-black text-slate-600">뇌혈관질환 진단비</span>
            <span className="text-base font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-xl">
              {(brainLimit / 10000).toLocaleString()}만 원
            </span>
          </div>
          <div className="flex bg-slate-50 rounded-2xl p-1 shadow-inner">
            {limitOptions.brain.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBrainLimit(opt.value)}
                className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${brainLimit === opt.value ? 'bg-slate-900 text-white shadow-md scale-102' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 허혈성 심장 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-black text-slate-600">허혈성 심장질환 진단비</span>
            <span className="text-base font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-xl">
              {(heartLimit / 10000).toLocaleString()}만 원
            </span>
          </div>
          <div className="flex bg-slate-50 rounded-2xl p-1 shadow-inner">
            {limitOptions.heart.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setHeartLimit(opt.value)}
                className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${heartLimit === opt.value ? 'bg-slate-900 text-white shadow-md scale-102' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 심혈관 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 flex flex-col justify-between md:col-span-2 max-w-2xl mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-black text-slate-600">심혈관질환(부정맥, 심부전 등) 진단비</span>
            <span className="text-base font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-xl">
              {cardioLimit === 0 ? '미가입' : `${(cardioLimit / 10000).toLocaleString()}만 원`}
            </span>
          </div>
          <div className="flex bg-slate-50 rounded-2xl p-1 shadow-inner">
            {limitOptions.cardio.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCardioLimit(opt.value)}
                className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${cardioLimit === opt.value ? 'bg-slate-900 text-white shadow-md scale-102' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 가입 계약 조건 설정 */}
      <h4 className="text-lg font-black text-slate-700 text-left mb-6 flex items-center gap-2 border-t border-orange-100/50 pt-8">
        <Zap size={18} className="text-orange-500" />
        가입 조건 및 환급 종류 세팅
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        {/* 납입기간 */}
        <div className="flex flex-col gap-2.5 text-left">
          <span className="text-xs font-black text-slate-400 pl-1 uppercase tracking-wider">납입 기간</span>
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100/80">
            {[10, 20, 30].map((val) => (
              <button
                key={val}
                onClick={() => setPaymentPeriod(val)}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${paymentPeriod === val ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {val}년납
              </button>
            ))}
          </div>
        </div>

        {/* 보장기간 */}
        <div className="flex flex-col gap-2.5 text-left">
          <span className="text-xs font-black text-slate-400 pl-1 uppercase tracking-wider">보장 만기</span>
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100/80">
            {[80, 90, 100].map((val) => (
              <button
                key={val}
                onClick={() => setCoveragePeriod(val)}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${coveragePeriod === val ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {val}세만기
              </button>
            ))}
          </div>
        </div>

        {/* 해지환급금 */}
        <div className="flex flex-col gap-2.5 text-left">
          <span className="text-xs font-black text-slate-400 pl-1 uppercase tracking-wider">해지 환급 종류</span>
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100/80">
            {[
              { label: '표준형', value: 'standard' },
              { label: '무해지형 (25%↓)', value: 'low' }
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRefundType(opt.value as any)}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${refundType === opt.value ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 갱신 여부 */}
        <div className="flex flex-col gap-2.5 text-left">
          <span className="text-xs font-black text-slate-400 pl-1 uppercase tracking-wider">갱신 유형</span>
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100/80">
            {[
              { label: '비갱신형', value: false },
              { label: '갱신형 (초기55%↓)', value: true }
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setIsRenewable(opt.value)}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${isRenewable === opt.value ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 필수 추천 특약 카드 */}
      <h4 className="text-lg font-black text-slate-700 text-left mb-6 flex items-center gap-2 border-t border-orange-100/50 pt-8">
        <Activity size={18} className="text-orange-500" />
        종합케어를 위한 필수 조립 특약
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1-5종 수술비 */}
        <button
          onClick={() => setHas1to5Surgery(!has1to5Surgery)}
          className={`flex items-start gap-4 p-5 rounded-3xl transition-all duration-300 text-left border-2
            ${has1to5Surgery 
              ? 'bg-slate-900 text-white border-slate-800 shadow-xl' 
              : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200'}`}
        >
          <div className={`p-2.5 rounded-2xl ${has1to5Surgery ? 'bg-slate-800 text-orange-400' : 'bg-slate-50 text-slate-400'}`}>
            <Activity size={20} />
          </div>
          <div>
            <p className="text-sm font-black">질병·상해 1-5종 수술비</p>
            <p className={`text-[0.65rem] font-bold mt-1 ${has1to5Surgery ? 'text-slate-400' : 'text-slate-400'}`}>
              가장 빈도가 높은 수술비 보장을 등급별 정액 반복 지급
            </p>
          </div>
        </button>

        {/* 표적항암 치료비 */}
        <button
          onClick={() => setHasTargetedTherapy(!hasTargetedTherapy)}
          className={`flex items-start gap-4 p-5 rounded-3xl transition-all duration-300 text-left border-2
            ${hasTargetedTherapy 
              ? 'bg-slate-900 text-white border-slate-800 shadow-xl' 
              : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200'}`}
        >
          <div className={`p-2.5 rounded-2xl ${hasTargetedTherapy ? 'bg-slate-800 text-orange-400' : 'bg-slate-50 text-slate-400'}`}>
            <Zap size={20} />
          </div>
          <div>
            <p className="text-sm font-black">표적항암 치료비</p>
            <p className={`text-[0.65rem] font-bold mt-1 ${hasTargetedTherapy ? 'text-slate-400' : 'text-slate-400'}`}>
              부작용이 적은 최신 고액 표적 항암 약물 처방 지원
            </p>
          </div>
        </button>

        {/* 혈전용해 치료비 */}
        <button
          onClick={() => setHasThrombolysis(!hasThrombolysis)}
          className={`flex items-start gap-4 p-5 rounded-3xl transition-all duration-300 text-left border-2
            ${hasThrombolysis 
              ? 'bg-slate-900 text-white border-slate-800 shadow-xl' 
              : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200'}`}
        >
          <div className={`p-2.5 rounded-2xl ${hasThrombolysis ? 'bg-slate-800 text-orange-400' : 'bg-slate-50 text-slate-400'}`}>
            <Shield size={20} />
          </div>
          <div>
            <p className="text-sm font-black">급성 혈전용해 치료비</p>
            <p className={`text-[0.65rem] font-bold mt-1 ${hasThrombolysis ? 'text-slate-400' : 'text-slate-400'}`}>
              뇌경색/급성심근경색 골든타임 내 혈전 제거 주사 보장
            </p>
          </div>
        </button>

        {/* 일배책 */}
        <button
          onClick={() => setHasLiability(!hasLiability)}
          className={`flex items-start gap-4 p-5 rounded-3xl transition-all duration-300 text-left border-2
            ${hasLiability 
              ? 'bg-slate-900 text-white border-slate-800 shadow-xl' 
              : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200'}`}
        >
          <div className={`p-2.5 rounded-2xl ${hasLiability ? 'bg-slate-800 text-orange-400' : 'bg-slate-50 text-slate-400'}`}>
            <HeartHandshake size={20} />
          </div>
          <div>
            <p className="text-sm font-black">가족 일상배상책임</p>
            <p className={`text-[0.65rem] font-bold mt-1 ${hasLiability ? 'text-slate-400' : 'text-slate-400'}`}>
              누수 사고나 반려견 물림 등 타인 재산/신체 피해 배상 (최대 1억)
            </p>
          </div>
        </button>

      </div>
    </div>
  );
};
