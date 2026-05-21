import React from 'react';
import { motion } from 'framer-motion';

interface HeartFieldsProps {
  gender: 'male' | 'female';
  setGender: (gender: 'male' | 'female') => void;
  age: number;
  setAge: (age: number) => void;
  healthType: 'normal' | 'simple';
  setHealthType: (type: 'normal' | 'simple') => void;
  coverageLevel: 'basic' | 'standard' | 'premium';
  setCoverageLevel: (level: 'basic' | 'standard' | 'premium') => void;
  currentAmount: number;
  setCurrentAmount: (amount: number) => void;
}

const HeartFields: React.FC<HeartFieldsProps> = ({
  gender,
  setGender,
  age,
  setAge,
  healthType,
  setHealthType,
  coverageLevel,
  setCoverageLevel,
  currentAmount,
  setCurrentAmount,
}) => {
  return (
    <div className="bg-slate-50/50 rounded-[3rem] p-8 md:p-10 border-2 border-slate-100 mb-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">심장질환 맞춤 상세 설정</h3>
          <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mt-0.5">Advanced Heart Protection Config</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          {/* 건강 상태 선택 */}
          <div>
            <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-4 block pl-1">건강 상태 고지</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHealthType('normal')}
                className={`py-4 rounded-[1.8rem] border-2 transition-all font-black text-sm ${
                  healthType === 'normal'
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-200'
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                건강체 (표준)
              </button>
              <button
                onClick={() => setHealthType('simple')}
                className={`py-4 rounded-[1.8rem] border-2 transition-all font-black text-sm ${
                  healthType === 'simple'
                    ? 'bg-orange-500 text-white border-orange-400 shadow-xl shadow-orange-200'
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                유병자 (간편)
              </button>
            </div>
            <p className="text-[0.6rem] text-slate-400 mt-3 pl-1 leading-relaxed">
              * 고혈압, 당뇨 약 복용 중이거나 최근 5년 내 수술 이력이 있다면 '유병자'를 선택해 주세요.
            </p>
            
            {healthType === 'simple' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-5 bg-orange-50 border-2 border-orange-100 rounded-[1.8rem] flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-orange-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span className="text-[0.75rem] font-black uppercase tracking-tight">유병자 전용 분석 안내</span>
                </div>
                <p className="text-[0.75rem] font-bold text-slate-700 leading-relaxed">
                  고혈압, 당뇨 등 병력이 있으신 경우 <span className="text-orange-600 font-black">심장 전용 보험보다 [유병자 전용 카테고리]</span>에서 분석하시는 것이 훨씬 더 저렴하고 가입이 용이합니다.
                </p>
                <div className="text-[0.65rem] font-black text-orange-500 underline decoration-2 underline-offset-4 cursor-pointer hover:text-orange-700 transition-colors">
                  유병자 전수 조사 카테고리로 이동하기 →
                </div>
              </motion.div>
            )}
          </div>

          {/* 보장 범위 */}
          <div>
            <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-4 block pl-1">보장 범위 설정</label>
            <div className="flex flex-col gap-3">
              {[
                { id: 'basic', label: '실속 플랜', desc: '핵심 진단비 중심 (가성비 플랜)' },
                { id: 'standard', label: '표준 플랜', desc: '진단비 + 심장질환 수술비 포함' },
                { id: 'premium', label: 'VIP 플랜', desc: '심혈관 전체 보장 (부정맥, 심부전 등 포함)' },
              ].map((level) => (
                <button
                  key={level.id}
                  onClick={() => setCoverageLevel(level.id as any)}
                  className={`p-5 rounded-[2rem] border-2 text-left transition-all ${
                    coverageLevel === level.id
                      ? 'bg-white border-slate-900 shadow-2xl scale-[1.02]'
                      : 'bg-white/50 border-transparent text-slate-400 grayscale'
                  }`}
                >
                  <div className={`font-black text-sm ${coverageLevel === level.id ? 'text-slate-900' : 'text-slate-500'}`}>{level.label}</div>
                  <div className="text-[0.65rem] font-bold opacity-60 mt-0.5">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10 flex flex-col justify-center">
          {/* 가입 금액 설정 추가 */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest pl-1">희망 목표 금액 (보장금액)</label>
              <div className="text-2xl font-black text-red-500">
                {currentAmount >= 100000000 
                  ? `${(currentAmount / 100000000).toFixed(1)}억원` 
                  : `${(currentAmount / 10000).toLocaleString()}만원`}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100000000"
              step="10000000"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between mt-3 px-1">
              <span className="text-[0.6rem] font-bold text-slate-300">0원</span>
              <span className="text-[0.6rem] font-bold text-slate-300">5천만원</span>
              <span className="text-[0.6rem] font-bold text-slate-300">1억원</span>
            </div>
            <p className="text-[0.6rem] text-slate-400 mt-6 leading-relaxed text-center">
              * 원하시는 심장질환 진단비 목표 금액을 설정해 주세요.<br/>
              (설정 금액에 비례하여 보험료가 실시간 재산출됩니다.)
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-inner border border-slate-100 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-full animate-ping absolute opacity-20"></div>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h4 className="text-lg font-black text-slate-800 mb-2">심장질환 집중 분석 중</h4>
          <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-[200px]">
            선택하신 {coverageLevel === 'premium' ? 'VIP' : coverageLevel === 'standard' ? '표준' : '실속'} 보장 범위에 맞춰<br/>전사 비교를 진행합니다.
          </p>
        </div>
      </div>
    </div>
  </div>
  );
};

export { HeartFields };
