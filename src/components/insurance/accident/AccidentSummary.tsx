import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, CheckCircle2, Star, AlertCircle, Eye, Activity, UserCheck } from 'lucide-react';

interface Props {
  result: {
    scores: {
      deathScore: number;
      disabilityScore: number;
      treatmentScore: number;
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const AccidentSummary: React.FC<Props> = ({ result }) => {
  const { scores, efficiency, deficiencies, analysis } = result;

  const opts = analysis?.accident || {
    accidentDeathLimit: 50000000,
    accidentDisabilityLimit: 50000000,
    fractureLimit: 300000,
    castLimit: 100000,
    surgeryLimit: 500000,
    hospitalDailyLimit: 20000,
    jobClass: 1,
    drivingType: 'private',
    hasLeisureRider: false
  };

  const jobClassLabel = opts.jobClass === 1 ? '1급 (저위험)' : opts.jobClass === 2 ? '2급 (중위험)' : '3급 (고위험)';
  const drivingLabel = opts.drivingType === 'none' ? '비운전' : opts.drivingType === 'private' ? '자가용' : '영업용';

  const getJobVulnerability = (level: number) => {
    if (level === 1) return '사무 환경으로 큰 신체 상해 리스크는 적으나, 미끄러짐 및 일상 골절과 가벼운 상해 외상 보강이 핵심입니다.';
    if (level === 2) return '외근, 영업 활동 및 차량 주행 빈도가 있어 도로 통행 중의 접촉 사고나 낙상 등 다각도 대비가 권장됩니다.';
    return '건설/제조/기계 조작/영업용 운전 등 물리 위험에 상시 노출되어 골절, 압박, 중대 사고 수술 등의 대형 재해 대책이 필수로 요구됩니다.';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  const formatWon = (value: number) => {
    if (value >= 100000000) {
      const eok = Math.floor(value / 100000000);
      const remain = Math.floor((value % 100000000) / 10000);
      return remain > 0 ? `${eok}억 ${remain}만 원` : `${eok}억 원`;
    }
    return `${(value / 10000).toLocaleString()}만 원`;
  };

  return (
    <div className="space-y-12">
      {/* 1. Header: Risk Card & Overall Score Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <Shield size={200} className="text-red-600" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                <UserCheck size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {analysis.name || '고객'}님 상해 위험 프로필 분석
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  직업: {jobClassLabel} · 운전: {drivingLabel} · 연령: {analysis.age || 40}세 ({analysis.gender === 'M' ? '남성' : '여성'})
                </p>
              </div>
            </div>

            {/* 직업 맞춤형 위험 정보 */}
            <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100/50 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-red-800">직무 환경 리스크 경고</p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  {getJobVulnerability(opts.jobClass)}
                </p>
              </div>
            </div>

            {/* 세부 점수 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              {[
                { label: '상해사망', targetId: 'input-accident-death', val: formatWon(opts.accidentDeathLimit), score: scores.deathScore },
                { label: '후유장해', targetId: 'input-accident-disability', val: formatWon(opts.accidentDisabilityLimit), score: scores.disabilityScore },
                { label: '일상치료 (골절/깁스)', targetId: 'input-accident-fracture', val: `${formatWon(opts.fractureLimit)} (깁스: ${opts.castLimit > 0 ? formatWon(opts.castLimit) : '미가입'})`, score: scores.treatmentScore },
                { label: '수술/입원/레저', targetId: 'input-accident-surgery', val: `수술: ${formatWon(opts.surgeryLimit)} / ${opts.hasLeisureRider ? '레저 가입' : '레저 미가입'}`, score: opts.hasLeisureRider ? 95 : 65 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-xs font-black text-slate-800 truncate" title={item.val}>{item.val}</p>
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
        <div className="bg-red-600 rounded-[3.5rem] p-12 text-white shadow-[0_30px_70px_-20px_rgba(220,38,38,0.3)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Zap size={200} fill="currentColor" />
          </div>
          <div className="relative z-10">
            <p className="text-red-100 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Accident Safety Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{scores.totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <CheckCircle2 size={16} className="text-red-200" />
              <span className="text-[10px] font-bold">
                {scores.totalScore >= 85 ? '안전망이 탄탄히 구축되었습니다!' : scores.totalScore >= 65 ? '보통 수준의 일상 상해 보장입니다.' : '긴급한 상해 특약 보강을 권장합니다.'}
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
