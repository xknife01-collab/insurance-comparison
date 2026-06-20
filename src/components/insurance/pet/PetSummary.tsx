import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, CheckCircle2, Dog, Cat, Star, AlertCircle, Heart } from 'lucide-react';
import { getBreedMultiplier } from '../../../lib/insurance/pet/petLoader';

interface Props {
  result: {
    scores: {
      patellaScore: number;
      skinScore: number;
      dentalScore: number;
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const PetSummary: React.FC<Props> = ({ result }) => {
  const { scores, efficiency, deficiencies } = result;
  const { analysis } = result;
  const petOpts = analysis?.pet || {
    petType: 'dog',
    petName: '우리애기',
    breed: '말티즈',
    birthYearMonth: '202305',
    selfPayRatio: 70,
    deductible: 30000,
    isRegistered: false,
    patellaRider: true,
    skinRider: true,
    dentalRider: false
  };

  // 나이 계산 (기준년도 2026년)
  let age = 3;
  if (petOpts.birthYearMonth && petOpts.birthYearMonth.length >= 4) {
    const birthYear = parseInt(petOpts.birthYearMonth.substring(0, 4));
    age = Math.max(0, 2026 - birthYear);
  }

  const { riskGroup, vulnerability } = getBreedMultiplier(petOpts.breed, petOpts.petType);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-12">
      {/* 1. Header: Breed Card & Score Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            {petOpts.petType === 'cat' ? <Cat size={200} className="text-orange-500" /> : <Dog size={200} className="text-orange-500" />}
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                {petOpts.petType === 'cat' ? <Cat size={28} /> : <Dog size={28} />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {petOpts.petName} ({petOpts.breed}, {age}세) 보장 상태
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {petOpts.birthYearMonth.substring(0, 4)}년 {petOpts.birthYearMonth.substring(4, 6)}월생 · {riskGroup}
                </p>
              </div>
            </div>

            {/* 품종 맞춤형 취약점 인포 */}
            <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-orange-800">품종 취약 질환 주의 요망</p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  {petOpts.breed}은(는) 유전적으로 <span className="text-orange-600 font-black">{vulnerability}</span> 등에 취약합니다. 관련 특약 가입 상태를 지속적으로 확인해 주세요.
                </p>
              </div>
            </div>

            {/* 세부 점수 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              {[
                { label: '슬개골/고관절', targetId: 'input-pet-fields', val: petOpts.patellaRider ? '가입 완료' : '미보장', score: scores.patellaScore },
                { label: '피부/외이염', targetId: 'input-pet-fields', val: petOpts.skinRider ? '가입 완료' : '미보장', score: scores.skinScore },
                { label: '구강/치과', targetId: 'input-pet-fields', val: petOpts.dentalRider ? '가입 완료' : '미보장', score: scores.dentalScore },
                { label: '동물등록 혜택', targetId: 'input-pet-fields', val: petOpts.isRegistered ? '5% 할인대상' : '할인 미적용', score: petOpts.isRegistered ? 95 : 50 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm font-black text-slate-800">{item.val}</p>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      className={`h-full ${getProgressColor(item.score)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 종합 점수 카드 */}
        <div className="bg-orange-500 rounded-[3.5rem] p-12 text-white shadow-[0_30px_70px_-20px_rgba(249,115,22,0.3)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Zap size={200} fill="currentColor" />
          </div>
          <div className="relative z-10">
            <p className="text-orange-100 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Coverage Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{scores.totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <CheckCircle2 size={16} className="text-orange-200" />
              <span className="text-xs font-bold">
                {scores.totalScore >= 85 ? '아주 든든한 펫보험 설계입니다!' : scores.totalScore >= 65 ? '보통 수준의 펫보험 보장입니다.' : '추가 보장 보강이 필요합니다.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 부족한 보장 공백 안내 */}
      {deficiencies.length > 0 && (
        <div className="bg-rose-50/50 border border-rose-100 rounded-[2.5rem] p-8 md:p-10 space-y-4">
          <h4 className="text-base font-black text-rose-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-rose-500 fill-rose-500" />
            진단된 보장 공백 ({deficiencies.length}건)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deficiencies.map((def, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-rose-100/50">
                <span className="w-2 h-2 bg-rose-500 rounded-full shrink-0" />
                <span className="text-xs font-bold text-slate-700">{def}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
