import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Baby, Calendar, ShieldAlert, Sparkles, HelpCircle, Heart, Star } from 'lucide-react';

interface ChildFieldsProps {
  targetAgeGroup: 'prenatal' | 'child' | 'youth';
  setTargetAgeGroup: (group: 'prenatal' | 'child' | 'youth') => void;
  maturity: 30 | 100;
  setMaturity: (maturity: 30 | 100) => void;
  focusArea: 'majorDisease' | 'hospitalization';
  setFocusArea: (area: 'majorDisease' | 'hospitalization') => void;
  hasPrenatalRider: boolean;
  setHasPrenatalRider: (has: boolean) => void;
  weeksPregnancy: number;
  setWeeksPregnancy: (weeks: number) => void;
  childBirthDate: string;
  setChildBirthDate: (birth: string) => void;
}

export const ChildFields: React.FC<ChildFieldsProps> = ({
  targetAgeGroup,
  setTargetAgeGroup,
  maturity,
  setMaturity,
  focusArea,
  setFocusArea,
  hasPrenatalRider,
  setHasPrenatalRider,
  weeksPregnancy,
  setWeeksPregnancy,
  childBirthDate,
  setChildBirthDate
}) => {
  return (
    <div id="input-child-fields" className="space-y-10 text-left max-w-4xl mx-auto py-8">
      {/* 1. 대상 연령대 선택 */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <Baby className="text-yellow-500 w-6 h-6" /> 가입 대상을 선택해 주세요
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'prenatal', label: '태아 / 임산부', desc: '출생 전 태아특약 설계' },
            { id: 'child', label: '어린이 (0~15세)', desc: '성장기 집중 안심 보장' },
            { id: 'youth', label: '청년 (16~35세)', desc: '어른이보험 실속 구성' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTargetAgeGroup(item.id as any)}
              className={`p-6 rounded-[2rem] border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-2
                ${targetAgeGroup === item.id 
                  ? 'border-yellow-500 bg-yellow-50/30 text-yellow-600 shadow-md scale-102' 
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 text-slate-500'}`}
            >
              <span className="font-black text-lg">{item.label}</span>
              <span className="text-xs font-bold opacity-75">{item.desc}</span>
            </button>
          ))}
        </div>

        {targetAgeGroup !== 'prenatal' && (
          <div className="mt-8 pt-6 border-t border-slate-100/80 space-y-3">
            <label className="text-sm font-black text-slate-700 flex items-center gap-1.5">
              <Calendar className="text-yellow-500 w-4 h-4" /> 
              {targetAgeGroup === 'child' ? '우리아이 생년월일 (8자리)' : '가입 대상자 생년월일 (8자리)'}
            </label>
            <div className="max-w-xs flex items-center gap-3 bg-slate-50 border border-slate-200 hover:border-yellow-500/50 rounded-2xl p-4 transition-all duration-300">
              <input
                type="text"
                maxLength={8}
                value={childBirthDate}
                onChange={(e) => setChildBirthDate(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="예) 20180515"
                className="bg-transparent border-none outline-none font-black text-slate-800 placeholder:text-slate-300 w-full text-base"
              />
              {childBirthDate.length === 8 && (
                <span className="text-xs font-black text-yellow-600 bg-yellow-100/60 px-2.5 py-1 rounded-full whitespace-nowrap">
                  만 {new Date().getFullYear() - parseInt(childBirthDate.substring(0, 4))}세
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-bold">
              * 정확한 가입 연령대별 보험료 비교 분석을 위해 실제 가입 대상(자녀)의 생년월일을 적어주세요.
            </p>
          </div>
        )}
      </div>

      {/* 2. 태아 전용 상세 정보 (태아 선택 시에만 노출) */}
      <AnimatePresence>
        {targetAgeGroup === 'prenatal' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-yellow-50/20 rounded-[2.5rem] p-8 border border-yellow-100 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-slate-800">선천성 장애 & 인큐베이터 태아 특약</h4>
                <p className="text-xs font-bold text-slate-400 mt-1">저체중아 입원일당, 신생아 수술비 보장이 포함됩니다.</p>
              </div>
              <div className="flex bg-slate-100 rounded-[1.5rem] p-1 border border-slate-200">
                <button
                  onClick={() => setHasPrenatalRider(true)}
                  className={`px-6 py-2.5 rounded-[1.2rem] font-black text-sm transition-all ${hasPrenatalRider ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-400'}`}
                >
                  예 (권장)
                </button>
                <button
                  onClick={() => setHasPrenatalRider(false)}
                  className={`px-6 py-2.5 rounded-[1.2rem] font-black text-sm transition-all ${!hasPrenatalRider ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400'}`}
                >
                  아니오
                </button>
              </div>
            </div>

            {hasPrenatalRider && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-yellow-100/50 flex flex-col md:flex-row justify-between items-center gap-6"
              >
                <div className="text-left">
                  <span className="text-sm font-black text-slate-700">현재 임신 주수 (Weeks)</span>
                  <p className="text-xs text-slate-400 mt-1">태아보험 가입 한도는 22주 6일 이내로 제한됩니다.</p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={4}
                    max={40}
                    value={weeksPregnancy}
                    onChange={(e) => setWeeksPregnancy(parseInt(e.target.value))}
                    className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="w-20 text-center py-2 bg-white rounded-xl border border-yellow-200 shadow-sm font-black text-yellow-600">
                    {weeksPregnancy} 주차
                  </div>
                </div>
              </motion.div>
            )}

            {hasPrenatalRider && weeksPregnancy > 22 && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-3.5"
              >
                <ShieldAlert className="text-rose-500 shrink-0 w-6 h-6 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-black text-rose-800">태아 가입 제한 주의</p>
                  <p className="text-xs font-bold text-rose-600/90 leading-relaxed mt-1">
                    임신 22주 6일이 경과한 상태로 태아 보장 특약 가입이 거절되거나 제한될 수 있습니다. 
                    이 경우, 출생 이후 가입할 수 있는 어린이 플랜으로 사전 상담이 권장됩니다.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. 보장 만기 설정 */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <Calendar className="text-yellow-500 w-6 h-6" /> 보장 기간 (만기)을 결정해 주세요
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setMaturity(30)}
            className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-300 flex flex-col justify-between gap-4
              ${maturity === 30 
                ? 'border-yellow-500 bg-yellow-50/10 shadow-md scale-102' 
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'}`}
          >
            <div>
              <span className={`font-black text-xl block ${maturity === 30 ? 'text-yellow-600' : 'text-slate-800'}`}>30세 만기형 (가성비 플랜)</span>
              <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">
                성장기 위주의 강력한 혜택을 제공하며 월 보험료가 매우 저렴합니다. 자녀가 자립하는 나이에 직접 성인용으로 리모델링하는 방식입니다.
              </p>
            </div>
            <div className={`text-xs font-black px-4 py-1.5 rounded-full self-start ${maturity === 30 ? 'bg-yellow-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              월 3~4만원대 실속형
            </div>
          </button>

          <button
            onClick={() => setMaturity(100)}
            className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-300 flex flex-col justify-between gap-4
              ${maturity === 100 
                ? 'border-yellow-500 bg-yellow-50/10 shadow-md scale-102' 
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'}`}
          >
            <div>
              <span className={`font-black text-xl block ${maturity === 100 ? 'text-yellow-600' : 'text-slate-800'}`}>100세 만기형 (종합 평생 플랜)</span>
              <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">
                어릴 때 저렴하게 가입해 평생 동안 3대 핵심 진단비(암, 뇌혈관, 허혈성 심장)를 동일한 보험료로 비갱신형 보장받는 정석 플랜입니다.
              </p>
            </div>
            <div className={`text-xs font-black px-4 py-1.5 rounded-full self-start ${maturity === 100 ? 'bg-yellow-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              평생 보장 확정형
            </div>
          </button>
        </div>
      </div>

      {/* 4. 집중 보장 영역 */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <Star className="text-yellow-500 w-6 h-6" fill="currentColor" /> 보장 집중도를 선택해 주세요
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setFocusArea('majorDisease')}
            className={`p-5 rounded-[1.8rem] border-2 text-center transition-all duration-300
              ${focusArea === 'majorDisease' 
                ? 'border-yellow-500 bg-yellow-50/30 text-yellow-600 shadow-sm' 
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 text-slate-500'}`}
          >
            <span className="font-black text-base block">3대 중대질환 (암·뇌·심) 집중형</span>
            <span className="text-[11px] font-bold opacity-80 mt-1 block">소아암, 뇌성마비, 성인기까지 이어지는 3대 중대 진단비 극대화</span>
          </button>

          <button
            onClick={() => setFocusArea('hospitalization')}
            className={`p-5 rounded-[1.8rem] border-2 text-center transition-all duration-300
              ${focusArea === 'hospitalization' 
                ? 'border-yellow-500 bg-yellow-50/30 text-yellow-600 shadow-sm' 
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 text-slate-500'}`}
          >
            <span className="font-black text-base block">입원일당 & 수술비 강화형</span>
            <span className="text-[11px] font-bold opacity-80 mt-1 block">면역력이 약한 어린이집/학교 시절 잦은 독감 입원 및 각종 사고 수술비 우선 보강</span>
          </button>
        </div>
      </div>
    </div>
  );
};
