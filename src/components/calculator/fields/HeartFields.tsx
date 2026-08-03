import React from 'react';

interface HeartFieldsProps {
  gender: 'male' | 'female';
  setGender: (gender: 'male' | 'female') => void;
  age: number;
  setAge: (age: number) => void;
  healthType: 'normal' | 'simple';
  setHealthType: (type: 'normal' | 'simple') => void;
  coverageLevel: 'basic' | 'standard' | 'premium';
  setCoverageLevel: (level: 'basic' | 'standard' | 'premium') => void;
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
}) => {
  return (
    <div className="space-y-6">
      {/* 성별 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3">성별</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setGender('male')}
            className={`py-3 rounded-xl border transition-all ${
              gender === 'male'
                ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
            }`}
          >
            남성
          </button>
          <button
            onClick={() => setGender('female')}
            className={`py-3 rounded-xl border transition-all ${
              gender === 'female'
                ? 'bg-pink-500/20 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
            }`}
          >
            여성
          </button>
        </div>
      </div>

      {/* 연령 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3">연령 (만 나이)</label>
        <input
          type="range"
          min="20"
          max="80"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>20세</span>
          <span className="text-blue-400 font-bold text-lg">{age}세</span>
          <span>80세</span>
        </div>
      </div>

      {/* 건강 상태 (일반/유병자) */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3">건강 상태</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setHealthType('normal')}
            className={`py-3 rounded-xl border transition-all ${
              healthType === 'normal'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : 'bg-white/5 border-white/10 text-gray-500'
            }`}
          >
            <div className="text-sm font-bold">건강체</div>
            <div className="text-[10px] opacity-60">할인 혜택 적용</div>
          </button>
          <button
            onClick={() => setHealthType('simple')}
            className={`py-3 rounded-xl border transition-all ${
              healthType === 'simple'
                ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                : 'bg-white/5 border-white/10 text-gray-500'
            }`}
          >
            <div className="text-sm font-bold">유병자/간편</div>
            <div className="text-[10px] opacity-60">고혈압, 당뇨 등</div>
          </button>
        </div>
      </div>

      {/* 보장 범위 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3">보장 범위 선택</label>
        <div className="space-y-3">
          {[
            { id: 'basic', label: '실속형', desc: '허혈성 심장질환 진단비 위주' },
            { id: 'standard', label: '표준형', desc: '진단비 + 주요 수술비 포함' },
            { id: 'premium', label: '고급형', desc: '부정맥, 심부전 등 광범위 보장' },
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => setCoverageLevel(level.id as any)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                coverageLevel === level.id
                  ? 'bg-white/10 border-white/30 shadow-lg'
                  : 'bg-white/5 border-white/5 opacity-60'
              }`}
            >
              <div className="font-bold text-white">{level.label}</div>
              <div className="text-xs text-gray-400 mt-1">{level.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeartFields;
