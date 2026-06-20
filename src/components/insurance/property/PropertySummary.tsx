import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { Building, Flame, ShieldCheck, CheckCircle2, Zap, AlertTriangle, ShieldAlert } from 'lucide-react';

interface Props {
  result: {
    scores: {
      propertyScore: number;
      liabilityScore: number;
      continuityScore: number;
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const PropertySummary: React.FC<Props> = ({ result }) => {
  const { scores, deficiencies, analysis } = result;
  
  const propOpts = analysis?.property || {
    businessType: 'restaurant',
    buildingGrade: 'grade_1',
    buildingLimit: 200000000,
    interiorLimit: 50000000,
    equipmentLimit: 30000000,
    inventoryLimit: 20000000,
    hasWaterLeak: true,
    hasPremisesLiability: true,
    hasBusinessInterruption: false,
    hasFoodLiability: true,
    hasMachineryBreakdown: false
  };

  const getBusinessLabel = (type: string) => {
    switch (type) {
      case 'office': return '사무실 (일반 업무)';
      case 'retail': return '도소매 점포 (판매시설)';
      case 'restaurant': return '일반음식점 (조리시설)';
      case 'academy': return '학원/교습소 (교육시설)';
      case 'factory': return '제조공장 (생산시설)';
      case 'warehouse': return '물류창고 (보관시설)';
      default: return '일반 사업장';
    }
  };

  const getGradeLabel = (grade: string) => {
    switch (grade) {
      case 'grade_1': return '1급 (콘크리트 내화구조 - 안전)';
      case 'grade_2': return '2급 (벽돌조 불연재료 - 보통)';
      case 'grade_3': return '3급 (목조/판넬 취약구조 - 위험)';
      default: return '1급';
    }
  };

  const formatEok = (val: number) => {
    if (val === 0) return '0원';
    const eok = Math.floor(val / 100000000);
    const man = Math.floor((val % 100000000) / 10000);
    let str = '';
    if (eok > 0) str += `${eok}억`;
    if (man > 0) str += ` ${man}만`;
    return str + '원';
  };

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

  const totalAssets = propOpts.buildingLimit + propOpts.interiorLimit + propOpts.equipmentLimit + propOpts.inventoryLimit;

  return (
    <div className="space-y-12">
      {/* 1. Header: Asset Info & Score Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <Building size={200} className="text-orange-500" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                <Building size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {getBusinessLabel(propOpts.businessType)} 보장 진단 결과
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  건물 등급: {getGradeLabel(propOpts.buildingGrade)} · 총 설정 자산액: {formatEok(totalAssets)}
                </p>
              </div>
            </div>

            {/* 비례보상 주의 경고 */}
            <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-orange-800">실제 손해액 100% 실손 보장 검토</p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  재물종합보험은 가입 금액이 실제 건물/인테리어 가액의 80% 미만일 경우 화재 시 비례보상이 적용되어 큰 금전적 피해를 입을 수 있습니다. 자산 현황에 맞는 최적 가치 평가가 필요합니다.
                </p>
              </div>
            </div>

            {/* 세부 점수 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              {[
                { label: '화재재산한도', targetId: 'input-property-fields', val: formatEok(totalAssets), score: scores.propertyScore },
                { label: '배상책임특약', targetId: 'input-property-fields', val: propOpts.hasPremisesLiability ? '종합배상 가입' : '미완성', score: scores.liabilityScore },
                { label: '비즈니스연속성', targetId: 'input-property-fields', val: propOpts.hasBusinessInterruption ? '휴업 보장' : '미보장', score: scores.continuityScore },
                { label: '건물 소방안전도', targetId: 'input-property-fields', val: propOpts.buildingGrade === 'grade_1' ? '우수' : propOpts.buildingGrade === 'grade_2' ? '보통' : '취약', score: propOpts.buildingGrade === 'grade_1' ? 95 : propOpts.buildingGrade === 'grade_2' ? 75 : 50 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-xs font-black text-slate-800 truncate">{item.val}</p>
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
            <p className="text-orange-100 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Property Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{scores.totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <CheckCircle2 size={16} className="text-orange-200" />
              <span className="text-xs font-bold">
                {scores.totalScore >= 85 ? '아주 든든하게 재산 보호가 됩니다!' : scores.totalScore >= 65 ? '적정 수준의 화재/배상 설계입니다.' : '화재 및 배상 책임 보강이 시급합니다.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 부족한 보장 공백 안내 */}
      {deficiencies.length > 0 && (
        <div className="bg-rose-50/50 border border-rose-100 rounded-[2.5rem] p-8 md:p-10 space-y-4">
          <h4 className="text-base font-black text-rose-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            진단된 자산 리스크 공백 ({deficiencies.length}건)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deficiencies.map((def, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-rose-100/50">
                <span className="w-2 h-2 bg-rose-500 rounded-full shrink-0" />
                <span className="text-xs font-bold text-slate-700 leading-snug">{def}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
