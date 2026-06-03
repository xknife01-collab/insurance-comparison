import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, CheckCircle2, PiggyBank, Star, AlertCircle, TrendingUp, Scale, ArrowRightLeft } from 'lucide-react';

interface Props {
  result: {
    scores: {
      cancerScore: number;
      cerebrovascularScore: number;
      cardiovascularScore: number;
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const VariableSummary: React.FC<Props> = ({ result }) => {
  const { scores, efficiency, deficiencies } = result;
  const { analysis } = result;
  
  const varOpts = analysis?.variable || {
    subType: analysis?.selectedDetail === 1 ? 'term' : 'investment',
    monthlyPremium: 150000,
    paymentPeriod: 10,
    investmentStyle: 'balanced',
    equityRatio: 50,
    isAnnuityConversion: false,
    deathBenefit: 100000000,
    coveragePeriod: 70,
    isHealthyDiscount: false
  };

  const subType = varOpts.subType || (analysis?.selectedDetail === 1 ? 'term' : 'investment');
  const isInvestment = ['investment', 'variable_saving'].includes(subType);
  const benefitVal = varOpts.deathBenefit || 100000000;
  const age = analysis?.age || 35;
  const gender = analysis?.gender || 'M';
  const isHealthyDiscount = varOpts.isHealthyDiscount || false;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-12 text-left">
      
      {/* 1. Header & Score Dashboard */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            {isInvestment ? <TrendingUp size={200} className="text-blue-500" /> : <Scale size={200} className="text-orange-500" />}
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                isInvestment ? 'bg-blue-600 shadow-blue-500/20' : 'bg-orange-600 shadow-orange-500/20'
              }`}>
                {isInvestment ? <TrendingUp size={28} /> : <Scale size={28} />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {isInvestment ? '변액 적립식 투자 자산 리포트' : '가성비 정기보장 사망설계 리포트'}
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {isInvestment ? (
                    <>월 {varOpts.monthlyPremium.toLocaleString()}원 · {varOpts.paymentPeriod}년납 · 투자성향: {varOpts.investmentStyle === 'aggressive' ? '공격형' : varOpts.investmentStyle === 'balanced' ? '중립형' : '안정형'}</>
                  ) : (
                    <>사망보장 {(varOpts.deathBenefit / 100000000).toFixed(1)}억원 · 만 {varOpts.coveragePeriod}세 만기 · {varOpts.isHealthyDiscount ? '우량체 적용' : '표준요율 적용'}</>
                  )}
                </p>
              </div>
            </div>

            {/* AI 맞춤 정보 배너 */}
            <div className={`p-5 rounded-2xl border flex gap-3 items-start ${
              isInvestment ? 'bg-blue-50/50 border-blue-100/50' : 'bg-orange-50/50 border-orange-100/50'
            }`}>
              <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isInvestment ? 'text-blue-600' : 'text-orange-600'}`} />
              <div className="space-y-1">
                <p className={`text-xs font-black ${isInvestment ? 'text-blue-800' : 'text-orange-800'}`}>
                  {isInvestment ? 'AI 변액자산 배분 가이드' : 'AI 보장 리모델링 설계'}
                </p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  {isInvestment ? (
                    <>
                      설정하신 주식형 펀드 비율은 <span className="text-blue-600 font-black">{varOpts.equityRatio}%</span>입니다. 투자 성향이 {varOpts.investmentStyle === 'aggressive' ? '공격형' : varOpts.investmentStyle === 'balanced' ? '중립형' : '안정형'}이므로 이에 맞추어 펀드 포트폴리오를 다이내믹하게 유지하는 편이 장기 성과에 유리합니다.
                    </>
                  ) : (
                    <>
                      동일한 사망 보장 {(varOpts.deathBenefit / 100000000).toFixed(1)}억원을 평생 유지하는 종신보험 대비 정기보험으로 교체 시 **매월 보험료를 최대 80% 이상 절감**할 수 있습니다. 절약한 기회비용은 개인연금저축 등으로 재투자하는 방안이 매우 효과적입니다.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 세부 점수 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              {isInvestment ? (
                [
                  { label: '펀드 매칭 최적성', val: `${varOpts.equityRatio}% 주식형 비중`, score: scores.cancerScore },
                  { label: '납입 구조 효율성', val: `${varOpts.paymentPeriod}년납 설정`, score: scores.cerebrovascularScore },
                  { label: '위험 대응 적합도', val: varOpts.isAnnuityConversion ? '연금전환 옵션 연결' : '연금전환 미지정', score: scores.cardiovascularScore },
                  { label: '비과세 절세 효율', val: varOpts.paymentPeriod >= 10 ? '10년 비과세 만족' : '절세 조건 불충족', score: varOpts.paymentPeriod >= 10 ? 95 : 50 }
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
                ))
              ) : (
                [
                  { label: '사망보장액 적정성', val: `${(varOpts.deathBenefit / 100000000).toFixed(1)}억원 보장`, score: scores.cancerScore },
                  { label: '보장 만기 설계', val: `만 ${varOpts.coveragePeriod}세 만기`, score: scores.cerebrovascularScore },
                  { label: '우량체 할인 적용', val: varOpts.isHealthyDiscount ? '15% 특별 할인' : '할인 미지정', score: scores.cardiovascularScore },
                  { label: '종신 대비 가성비', val: '약 85% 지출 절감', score: 98 }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-black text-slate-800">{item.val}</p>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        className={`h-full bg-orange-500`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 종합 점수 카드 */}
        <div className={`rounded-[3.5rem] p-12 text-white shadow-lg flex flex-col justify-between relative overflow-hidden group ${
          isInvestment ? 'bg-blue-600 shadow-blue-600/30' : 'bg-orange-600 shadow-orange-600/30'
        }`}>
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Zap size={200} fill="currentColor" />
          </div>
          <div className="relative z-10 text-left">
            <p className="opacity-80 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Variable Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{scores.totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <CheckCircle2 size={16} className="opacity-80" />
              <span className="text-xs font-bold">
                {scores.totalScore >= 85 ? '아주 합리적으로 자산을 관리하고 계십니다!' : scores.totalScore >= 65 ? '보통 수준의 포트폴리오를 유지하고 있습니다.' : '포트폴리오 리모델링이 적극 권장됩니다.'}
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
            진단된 보장 리모델링 공백 ({deficiencies.length}건)
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

      {/* 3. 1:1 상세 비교 테이블 (정기보험인 경우 기 기회비용 전환 표) */}
      {['term', 'term_pure', 'term_ceo', 'variable_term'].includes(subType) && (
        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">Switch Strategy</div>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">1:1 상세 비교 분석</h4>
              <p className="text-xs font-bold text-slate-400">"가격은 낮추고, 보장은 더 든든하게!"</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">월 예상 절감액</p>
              <p className="text-3xl font-black text-[#FF6B00] tracking-tighter">
                {Math.max(10000, Math.round(( (benefitVal/10000000)*7000*Math.max(0.5, (age-20)*0.05+0.8)*(gender === 'M' ? 1.25 : 0.85) ) - ( (benefitVal/10000000)*1300*Math.max(0.5, (age-20)*0.05+0.8)*(gender === 'M' ? 1.25 : 0.85)*(isHealthyDiscount ? 0.85 : 1.0) ))).toLocaleString()} <span className="text-base text-slate-500">원</span>
              </p>
            </div>
          </div>

          <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-sm bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">보장 항목</th>
                  <th className="px-6 py-4">기존 종신보험 유지 시 (Stay)</th>
                  <th className="px-6 py-4 text-[#FF6B00]">교체 제안 (Switch)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700 text-xs">
                <tr>
                  <td className="px-6 py-4 font-black text-slate-900">사망 보장 한도</td>
                  <td className="px-6 py-4 text-slate-500">{(benefitVal/100000000).toFixed(1)}억원 (평생 사망 보장)</td>
                  <td className="px-6 py-4 text-slate-900 font-black">최대 {(benefitVal/100000000).toFixed(1)}억원 (가장 빈번한 경제활동기 집중 보장)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-black text-slate-900">보험료 납입 규모</td>
                  <td className="px-6 py-4 text-slate-500">월 15만 ~ 25만 원 (평생 사망 보험금 지급 준비로 인한 고비용 구조)</td>
                  <td className="px-6 py-4 text-[#FF6B00] font-black">월 1만 ~ 3만 원대 (동일 사망 보장 대비 보험료 최대 80%~90% 이상 절감)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-black text-slate-900">우량체 특별 할인</td>
                  <td className="px-6 py-4 text-slate-500">미적용 (일반 종신보험은 우량체 조건 적용이 매우 제한적)</td>
                  <td className="px-6 py-4 text-slate-900 font-black">최대 15%~18% 즉시 할인 (비흡연 + 혈압/BMI 정상 기준 만족 시 즉시 적용)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-black text-slate-900">가족 일상생활 배상책임</td>
                  <td className="px-6 py-4 text-slate-500">미가입 (특약 배제로 대인/대물 과실 누수 사고 시 무방비)</td>
                  <td className="px-6 py-4 text-slate-900 font-black">가입 (대인/대물 과실 누수 사고 시 자기부담금 20만 원 방어 특약 결합)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
export default VariableSummary;
