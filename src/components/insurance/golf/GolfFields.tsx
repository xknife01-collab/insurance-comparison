import React from 'react';
import { Flag, ShieldCheck, Award, Users, AlertTriangle, HelpCircle, FileText } from 'lucide-react';

interface Props {
  gameType: 'amateur' | 'professional';
  setGameType: (v: 'amateur' | 'professional') => void;
  planType: 'one_day' | 'annual';
  setPlanType: (v: 'one_day' | 'annual') => void;
  durationDays: number;
  setDurationDays: (v: number) => void;
  isGroup: boolean;
  setIsGroup: (v: boolean) => void;
  companionNames: string[];
  setCompanionNames: (v: string[]) => void;
  hasHoleInOneRider: boolean;
  setHasHoleInOneRider: (v: boolean) => void;
  hasLiabilityRider: boolean;
  setHasLiabilityRider: (v: boolean) => void;
  hasEquipmentRider: boolean;
  setHasEquipmentRider: (v: boolean) => void;
}

export const GolfFields: React.FC<Props> = ({
  gameType,
  setGameType,
  planType,
  setPlanType,
  durationDays,
  setDurationDays,
  isGroup,
  setIsGroup,
  companionNames,
  setCompanionNames,
  hasHoleInOneRider,
  setHasHoleInOneRider,
  hasLiabilityRider,
  setHasLiabilityRider,
  hasEquipmentRider,
  setHasEquipmentRider,
}) => {

  const handleCompanionChange = (index: number, name: string) => {
    const next = [...companionNames];
    next[index] = name;
    setCompanionNames(next);
  };

  return (
    <div id="input-golf-fields" className="space-y-12 animate-in fade-in duration-500">
      
      {/* ── SECTION 1: 골퍼 기본정보 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Flag className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-emerald-500/25 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white">
              골퍼 유형 및 경기 계획을 알려주세요
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => {
                setGameType('amateur');
              }}
              type="button"
              className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                gameType === 'amateur'
                  ? 'bg-emerald-500/15 border-emerald-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Award className={`w-10 h-10 mb-2 ${gameType === 'amateur' ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span className="font-black text-sm">일반 아마추어 골퍼</span>
            </button>
            <button
              onClick={() => {
                setGameType('professional');
                // 프로는 홀인원/용품 가입 불가 처리 유도
                setHasHoleInOneRider(false);
                setHasEquipmentRider(false);
              }}
              type="button"
              className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                gameType === 'professional'
                  ? 'bg-amber-500/15 border-amber-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Flag className={`w-10 h-10 mb-2 ${gameType === 'professional' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="font-black text-sm">프로 골퍼 / 지도자</span>
            </button>
          </div>

          {/* 프로 선수 선택 시 경고 배너 */}
          {gameType === 'professional' && (
            <div className="p-6 bg-rose-500/20 rounded-3xl border border-rose-500/30 flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-rose-300">⚠️ 프로 선수 및 지도자 가입 제한 사항</p>
                <p className="text-xs text-slate-300 font-bold leading-relaxed mt-1">
                  골프 프로, 세미프로, 레슨 지도자 등의 경우 업무상/훈련 중 발생할 수 있는 사고의 높은 위험도로 인해 홀인원 축하비용 특약 및 골프용품 손해 특약 가입이 불가능하며, 상해 배상책임 및 상해 사망 보장 위주로 가입이 승인됩니다.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400">플랜 유형</label>
              <div className="flex gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setPlanType('one_day');
                    setDurationDays(1);
                  }}
                  className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${
                    planType === 'one_day'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  원데이 (1일 가입)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlanType('annual');
                    setDurationDays(365);
                  }}
                  className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${
                    planType === 'annual'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  연간 회원 (1년 가입)
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center">
              <label className="text-xs font-black text-slate-400">가입 일수</label>
              {planType === 'one_day' ? (
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                  />
                  <span className="font-black text-lg text-emerald-400 min-w-[50px] text-right">{durationDays}일</span>
                </div>
              ) : (
                <div className="py-3 px-5 bg-white/5 border border-white/10 rounded-2xl font-black text-sm text-slate-300">
                  1년형 패키지 고정 (365일 보장)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: 동반 가입 여부 ── */}
      <div className="bg-white border border-emerald-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 uppercase tracking-widest">Step 02</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            동반 가입(4인 1팀) 할인 여부
          </h4>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-start gap-4 mb-4">
              <Users className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-700 font-bold leading-relaxed">
                  동반자 3인을 포함하여 총 4인(1팀) 패키지로 함께 가입하시는 경우, 단체 특별 혜택이 적용되어 **월 보험료의 5%가 즉시 절감**됩니다.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsGroup(true);
                  if (companionNames.length === 0) {
                    setCompanionNames(['', '', '']);
                  }
                }}
                className={`flex-1 py-3.5 rounded-2xl font-black text-xs transition-all border ${
                  isGroup
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                }`}
              >
                4인 동반 가입 신청
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGroup(false);
                }}
                className={`flex-1 py-3.5 rounded-2xl font-black text-xs transition-all border ${
                  !isGroup
                    ? 'bg-slate-900 text-white border-slate-800'
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                }`}
              >
                1인 단독 가입
              </button>
            </div>
          </div>

          {/* 동반자 정보 입력 아코디언 */}
          {isGroup && (
            <div className="p-6 rounded-3xl border border-emerald-100 bg-white space-y-4 animate-in slide-in-from-top-4 duration-300">
              <p className="text-xs font-black text-slate-700">동반 가입자 명단 (본인 제외 3인)</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400">동반자 {idx + 1} 성명</label>
                    <input
                      type="text"
                      value={companionNames[idx] || ''}
                      onChange={(e) => handleCompanionChange(idx, e.target.value)}
                      placeholder="성함 입력"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 3: 보장 특약 선택 ── */}
      <div className="bg-white border border-emerald-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            희망하시는 선택 보장 특약을 정해 주세요
          </h4>
        </div>

        <div className="flex flex-col gap-3">
          {gameType === 'amateur' && (
            <label className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-slate-800">홀인원 축하 비용 보장 특약</span>
                <span className="text-[10px] text-slate-400 font-medium">홀인원 성공 시 식사비, 증정품, 라운딩 비용 최대 200만 원 지원 (정규 18홀 기준)</span>
              </div>
              <input
                type="checkbox"
                checked={hasHoleInOneRider}
                onChange={(e) => setHasHoleInOneRider(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded"
              />
            </label>
          )}

          <label className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-slate-800">골프 배상책임 보장 특약</span>
              <span className="text-[10px] text-slate-400 font-medium">타구 사고(생크), 스윙 오발 등으로 타인의 신체/재물에 피해를 준 실손 배상책임 보장</span>
            </div>
            <input
              type="checkbox"
              checked={hasLiabilityRider}
              onChange={(e) => setHasLiabilityRider(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded"
            />
          </label>

          {gameType === 'amateur' && (
            <label className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-slate-800">골프용품 도난/파손 손해 특약</span>
                <span className="text-[10px] text-slate-400 font-medium">클럽 헤드 부러짐, 도난 등 골프웨어 및 골프용품 파손 피해 실손 보장</span>
              </div>
              <input
                type="checkbox"
                checked={hasEquipmentRider}
                onChange={(e) => setHasEquipmentRider(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded"
              />
            </label>
          )}
        </div>
      </div>

    </div>
  );
};
