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
      {/* 1. Header: Pet Coverage Summary */}
      <div className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
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
              <p className="text-xs font-black text-orange-800">품종 취약 질환 안내</p>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                {petOpts.breed}은(는) 유전적으로 <span className="text-orange-600 font-black">{vulnerability}</span> 등에 취약합니다. 관련 특약 가입 상태를 확인해 주세요.
              </p>
            </div>
          </div>

          {/* 세부 점수 리스트 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            {[
              { label: '슬개골/고관절', targetId: 'input-pet-fields', val: petOpts.patellaRider ? '가입 완료' : '미보장', status: petOpts.patellaRider ? '가입' : '미가입' },
              { label: '피부/외이염', targetId: 'input-pet-fields', val: petOpts.skinRider ? '가입 완료' : '미보장', status: petOpts.skinRider ? '가입' : '미가입' },
              { label: '구강/치과', targetId: 'input-pet-fields', val: petOpts.dentalRider ? '가입 완료' : '미보장', status: petOpts.dentalRider ? '가입' : '미가입' },
              { label: '동물등록 혜택', targetId: 'input-pet-fields', val: petOpts.isRegistered ? '5% 할인대상' : '할인 미적용', status: petOpts.isRegistered ? '할인' : '미등록' },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => scrollToInputAndHighlight((item as any).targetId)}
                className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center gap-2 group hover:border-orange-300 hover:shadow-sm cursor-pointer transition-all duration-300"
              >
                <div className="flex justify-between items-center w-full">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${item.status === '가입' || item.status === '할인' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>{item.status}</span>
                </div>
                <p className="text-sm font-black text-slate-800">{item.val}</p>
              </div>
            ))}
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

      {/* 3. 진단 참고 안내 */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed space-y-1">
        <p>* 상기 보장 분석 점수 및 취약 질환 정보는 공인 통계 자료에 기반한 참고 자료이며, 실제 보상 여부 및 세부 보상 기준은 가입하신 보험 상품의 약관에 따릅니다.</p>
        <p className="font-bold text-slate-600">* [통계 출처]: 농림축산식품부 『2023년 동물복지에 대한 국민의식조사 결과보고서』 (2024년 1월 16일 공표, 국가동물보호정보시스템 공시)</p>
      </div>
    </div>
  );
};
