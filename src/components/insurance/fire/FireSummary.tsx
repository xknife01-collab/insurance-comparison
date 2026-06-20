import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, CheckCircle2, Home, Flame, Star, AlertCircle, Building } from 'lucide-react';

interface Props {
  result: {
    scores: {
      structureScore: number;
      riderScore: number;
      limitScore: number;
      waterLeakScore: number;
      liabilityScore: number;
      housingScore: number;
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const FireSummary: React.FC<Props> = ({ result }) => {
  const { scores, deficiencies, analysis } = result;
  
  const fireOpts = analysis?.fire || {
    residenceType: 'apartment',
    occupancyType: 'owner',
    buildingArea: 84,
    structureGrade: 1,
    hasWaterLeakRider: true,
    hasLiabilityRider: true,
    hasTemporaryHousingRider: true,
    householdGoodsLimit: 30000000,
    buildingLimit: 100000000,
  };

  const getResidenceTypeLabel = (t: string) => {
    if (t === 'apartment') return '아파트 (공동주택)';
    if (t === 'villa') return '빌라 / 연립 / 다세대';
    return '단독 주택 / 상가주택';
  };

  const getOccupancyTypeLabel = (o: string) => {
    return o === 'owner' ? '자가 소유주 (임대인/실거주)' : '임차인 (세입자)';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* 1. Header: Property Info Card & Score Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 md:p-12 border border-red-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <Building size={200} className="text-red-500" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <Home size={28} />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {getResidenceTypeLabel(fireOpts.residenceType)} 보장 상태
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {getOccupancyTypeLabel(fireOpts.occupancyType)} · 면적 {fireOpts.buildingArea}㎡ (약 {Math.round(fireOpts.buildingArea * 0.3025)}평) · 건물 {fireOpts.structureGrade}급 구조
                </p>
              </div>
            </div>

            {/* 구조급수 위험 인포 */}
            <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100/50 flex gap-3 items-start text-left">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-red-800">건물 등급 및 보장 체크 포인트</p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  {fireOpts.structureGrade === 1 
                    ? '1급 철근콘크리트 구조로 상대적으로 기본 화재율이 낮게 책정되어 있으나, 이웃집 누수 피해 및 일상배상책임 한도가 충분한지 매칭 대조가 권장됩니다.'
                    : '2~3급 목조/기와/벽돌조 건물은 화재 확산 리스크가 크기 때문에 건물 복구 가입 금액(한도)을 시세보다 높게 설정해야 전손 피해 시 충분한 보상이 가능합니다.'}
                </p>
              </div>
            </div>

            {/* 세부 점수 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 text-left">
              {[
                { label: '누수 (급배수) 특약', targetId: 'input-fire-fields', val: fireOpts.hasWaterLeakRider ? '가입 완료' : '미보장', score: scores.waterLeakScore || 30 },
                { label: '배상책임 (대물)', targetId: 'input-fire-fields', val: fireOpts.hasLiabilityRider ? '가입 완료' : '미보장', score: scores.liabilityScore || 30 },
                { label: '임시 거주 지원', targetId: 'input-fire-fields', val: fireOpts.hasTemporaryHousingRider ? '가입 완료' : '미보장', score: scores.housingScore || 40 },
                { label: '보장 한도 균형', targetId: 'input-fire-fields', val: fireOpts.occupancyType === 'tenant' ? '자가 건물 제외' : `${(fireOpts.buildingLimit / 100000000).toFixed(1)}억 원`, score: scores.limitScore || 70 },
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
        <div className="bg-red-500 rounded-[3.5rem] p-12 text-white shadow-[0_30px_70px_-20px_rgba(239,68,68,0.3)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Flame size={200} fill="currentColor" />
          </div>
          <div className="relative z-10 text-left">
            <p className="text-red-100 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Fire Coverage Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{scores.totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <CheckCircle2 size={16} className="text-red-200" />
              <span className="text-xs font-bold">
                {scores.totalScore >= 85 ? '아주 든든한 화재보험 설계입니다!' : scores.totalScore >= 65 ? '보통 수준의 화재안전 보장입니다.' : '긴급히 추가 특약 보완이 필요합니다.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 부족한 보장 공백 안내 */}
      {deficiencies.length > 0 && (
        <div className="bg-red-50/50 border border-red-100 rounded-[2.5rem] p-8 md:p-10 space-y-4 text-left">
          <h4 className="text-base font-black text-red-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-red-500 fill-red-500" />
            진단된 보장 공백 및 위험 요소 ({deficiencies.length}건)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deficiencies.map((def, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-red-100/50 shadow-sm">
                <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                <span className="text-xs font-bold text-slate-700">{def}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default FireSummary;
