import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { Zap, CheckCircle2, AlertCircle, Star, Activity, Bed, Users, ShieldCheck, Syringe } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';

export const SurgerySummary = ({ result }: { result: AnalysisResult }) => {
  const { analysis } = result;

  const config = (analysis as any)?.surgery_hospital || {
    focus: 'wide',
    hospitalAmount: 30000,
    caregiverOption: 'none',
    tertiaryHospital: false,
  };

  const focus           = config.focus || 'wide';
  const hospitalAmount  = config.hospitalAmount || 0;
  const caregiverOpt    = config.caregiverOption || 'none';
  const tertiaryHosp    = config.tertiaryHospital || false;

  // ── 보장 항목 정의 ──────────────────────────────────────────
  const coverageItems = [
    {
      label: '질병/상해 수술비', targetId: 'input-surgery-fields',
      icon: Activity,
      covered: focus === 'wide',
      partial: focus === 'named' || focus === 'major',
      status: focus === 'wide' ? '광범위 보장' : focus === 'named' ? '1-5종 한정' : '중증 한정',
      score: focus === 'wide' ? 95 : 60,
    },
    {
      label: '1~5종 종별 수술비', targetId: 'input-surgery-fields',
      icon: Syringe,
      covered: focus === 'named',
      partial: focus === 'wide',
      status: focus === 'named' ? '정밀 보장' : focus === 'wide' ? '기본 포함' : '미포함',
      score: focus === 'named' ? 95 : focus === 'wide' ? 70 : 30,
    },
    {
      label: '입원일당', targetId: 'input-surgery-fields',
      icon: Bed,
      covered: hospitalAmount >= 30000,
      partial: hospitalAmount > 0 && hospitalAmount < 30000,
      status: hospitalAmount === 0 ? '미보장' : `${hospitalAmount.toLocaleString()}원/일`,
      score: hospitalAmount === 0 ? 0 : Math.min(95, (hospitalAmount / 150000) * 100 + 40),
    },
    {
      label: '간병인 서비스', targetId: 'input-surgery-fields',
      icon: Users,
      covered: caregiverOpt !== 'none',
      partial: false,
      status: caregiverOpt === 'none' ? '미선택' : caregiverOpt === 'use' ? '사용 일당' : '간병인 지원',
      score: caregiverOpt === 'none' ? 0 : caregiverOpt === 'support' ? 95 : 70,
    },
    {
      label: '상급종합병원', targetId: 'input-surgery-fields',
      icon: ShieldCheck,
      covered: tertiaryHosp,
      partial: false,
      status: tertiaryHosp ? '집중 보장' : '미선택',
      score: tertiaryHosp ? 95 : 40,
    },
  ];

  // ── Coverage Score 계산 ─────────────────────────────────────
  const totalScore = Math.round(coverageItems.reduce((s, i) => s + i.score, 0) / coverageItems.length);

  // ── 보장 공백 진단 ──────────────────────────────────────────
  const deficiencies: string[] = [];
  if (hospitalAmount === 0)       deficiencies.push('입원일당 미가입 — 장기 입원 시 생활비 공백 발생 위험');
  if (hospitalAmount < 30000 && hospitalAmount > 0) deficiencies.push(`입원일당 ${hospitalAmount.toLocaleString()}원 — 시장 평균(3만원/일) 미달`);
  if (caregiverOpt === 'none')    deficiencies.push('간병인 서비스 미선택 — 중증 수술 후 간병비 전액 본인 부담');
  if (!tertiaryHosp)              deficiencies.push('상급종합병원 미보장 — 대학병원 입원 시 추가 비용 발생');
  if (focus === 'major')          deficiencies.push('1~5종 수술비 미포함 — 일상 수술(백내장·탈장 등) 보장 공백');

  const getScoreColor = (score: number) =>
    score >= 85 ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    : score >= 65 ? 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    : 'text-rose-500 bg-rose-500/10 border-rose-500/20';

  const getBarColor = (score: number) =>
    score >= 85 ? 'bg-emerald-500' : score >= 65 ? 'bg-orange-500' : 'bg-rose-400';

  const getStatusColor = (item: typeof coverageItems[0]) =>
    item.covered
      ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
      : item.partial
        ? 'text-orange-700 bg-orange-50 border-orange-100'
        : 'text-rose-600 bg-rose-50 border-rose-100';

  const focusLabel = focus === 'wide' ? '광범위 질병/상해형' : focus === 'named' ? '1-5종 정밀 요율형' : '중증 집중 보장형';

  return (
    <div className="space-y-12">

      {/* ── 상단: 보장 현황 카드 + Coverage Score ── */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* 좌측: 보장 현황 카드 */}
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.025] group-hover:scale-110 transition-transform duration-700">
            <Activity size={200} className="text-orange-500" />
          </div>

          <div className="relative z-10 space-y-8">
            {/* 헤더 */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                <Activity size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  고객님의 수술·입원 보장 현황
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  보장 스타일: {focusLabel}
                </p>
              </div>
            </div>

            {/* 설계 요약 안내 배너 */}
            <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-orange-800">수술비 보장 설계 분석 완료</p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  수술 난이도별 종별 분류(1~5종), 관혈·비관혈 수술 구분, 입원일당 한도를 기준으로
                  <span className="text-orange-600 font-black"> 현재 보장 공백과 최적 설계 방향</span>을 분석했습니다.
                </p>
              </div>
            </div>

            {/* 보장 항목별 현황 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
              {coverageItems.map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <item.icon size={10} className="text-slate-300" />
                    {item.label}
                  </p>
                  <p className={`text-xs font-black px-2 py-1 rounded-lg border inline-block ${getStatusColor(item)}`}>
                    {item.status}
                  </p>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full ${getBarColor(item.score)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 우측: Coverage Score 카드 */}
        <div className="bg-orange-500 rounded-[3.5rem] p-12 text-white shadow-[0_30px_70px_-20px_rgba(249,115,22,0.35)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Zap size={200} fill="currentColor" />
          </div>
          <div className="relative z-10">
            <p className="text-orange-100 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Coverage Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <CheckCircle2 size={16} className="text-orange-200" />
              <span className="text-xs font-bold">
                {totalScore >= 85
                  ? '수술·입원 보장이 탄탄합니다!'
                  : totalScore >= 65
                    ? '일부 보장 공백이 있습니다.'
                    : '보장 보강이 시급합니다.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 하단: 보장 공백 진단 ── */}
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
