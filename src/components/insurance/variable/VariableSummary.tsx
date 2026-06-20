import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
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
  const isPremiumTheme = ['investment', 'variable_saving', 'variable_term', 'term_ceo'].includes(subType);
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
            {isPremiumTheme ? <TrendingUp size={200} className="text-blue-500" /> : <Scale size={200} className="text-orange-500" />}
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                isPremiumTheme ? 'bg-blue-600 shadow-blue-500/20' : 'bg-orange-600 shadow-orange-500/20'
              }`}>
                {isPremiumTheme ? <TrendingUp size={28} /> : <Scale size={28} />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {subType === 'variable_saving' ? '수익형 변액 적립/저축보험 리포트' :
                   subType === 'variable_term' ? '투자보장형 변액 정기보험 리포트' :
                   subType === 'term_ceo' ? 'CEO 경영인 절세형 정기보험 리포트' :
                   subType === 'term_pure' ? '실속 순수보장형 정기보험 리포트' :
                   isInvestment ? '변액 적립식 투자 자산 리포트' : '가성비 정기보장 사망설계 리포트'}
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
              isPremiumTheme ? 'bg-blue-50/50 border-blue-100/50' : 'bg-orange-50/50 border-orange-100/50'
            }`}>
              <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isPremiumTheme ? 'text-blue-600' : 'text-orange-600'}`} />
              <div className="space-y-1">
                <p className={`text-xs font-black ${isPremiumTheme ? 'text-blue-800' : 'text-orange-800'}`}>
                  {isInvestment ? 'AI 변액자산 배분 가이드' : 'AI 보장 리모델링 설계'}
                </p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  {subType === 'variable_saving' ? (
                    <>
                      설정하신 주식형 펀드 비율은 <span className="text-blue-600 font-black">{varOpts.equityRatio}%</span>입니다. 투자 성향이 {varOpts.investmentStyle === 'aggressive' ? '공격형' : varOpts.investmentStyle === 'balanced' ? '중립형' : '안정형'}이므로 이에 맞추어 펀드 포트폴리오를 다이내믹하게 유지하는 편이 장기 수익률 극대화에 유리합니다.
                    </>
                  ) : subType === 'variable_term' ? (
                    <>
                      사망 보장과 펀드 투자를 결합한 변액정기보험입니다. 인플레이션을 헤지할 수 있는 실적배당 혜택이 있으나, 투자 성과에 따라 해약환급금 변동성이 있으므로 안정적인 중장기 유지가 필요합니다.
                    </>
                  ) : subType === 'term_ceo' ? (
                    <>
                      법인세 절세 및 CEO 은퇴 퇴직금 플랜을 위한 경영인 정기보험입니다. 납입 보험료의 비용 처리(손비 인정) 요건과 최대 환급률 시점(10~15년)을 전략적으로 모니터링하여 법인 자산 효율을 높이십시오.
                    </>
                  ) : (
                    <>
                      동일한 사망 보장 {(varOpts.deathBenefit / 100000000).toFixed(1)}억원을 평생 유지하는 종신보험 대비 정기보험으로 교체 시 **매월 보험료를 최대 85% 이상 절감**할 수 있습니다. 절약한 기회비용은 개인연금저축 등으로 재투자하는 방안이 매우 효과적입니다.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 세부 점수 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              {isInvestment ? (
                [
                  { label: '펀드 매칭 최적성', targetId: 'input-variable-fields', val: `${varOpts.equityRatio}% 주식형 비중`, score: scores.cancerScore },
                  { label: '납입 구조 효율성', targetId: 'input-variable-fields', val: `${varOpts.paymentPeriod}년납 설정`, score: scores.cerebrovascularScore },
                  { label: '위험 대응 적합도', targetId: 'input-variable-fields', val: varOpts.isAnnuityConversion ? '연금전환 옵션 연결' : '연금전환 미지정', score: scores.cardiovascularScore },
                  { label: '비과세 절세 효율', targetId: 'input-variable-fields', val: varOpts.paymentPeriod >= 10 ? '10년 비과세 만족' : '절세 조건 불충족', score: varOpts.paymentPeriod >= 10 ? 95 : 50 }
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
                (subType === 'term_ceo' ? [
                  { label: '사망보장액 적정성', targetId: 'input-variable-fields', val: `${(varOpts.deathBenefit / 100000000).toFixed(1)}억원 보장`, score: scores.cancerScore },
                  { label: '보장 만기 설계', targetId: 'input-variable-fields', val: `만 ${varOpts.coveragePeriod}세 만기`, score: scores.cerebrovascularScore },
                  { label: '법인세 절세 효과', targetId: 'input-variable-fields', val: '납입액 전액 비용처리', score: scores.cardiovascularScore },
                  { label: '환급 효율 최적도', targetId: 'input-variable-fields', val: '목표 환급률 달성', score: 95 }
                ] : subType === 'variable_term' ? [
                  { label: '사망보장액 적정성', targetId: 'input-variable-fields', val: `${(varOpts.deathBenefit / 100000000).toFixed(1)}억원 보장`, score: scores.cancerScore },
                  { label: '보장 만기 설계', targetId: 'input-variable-fields', val: `만 ${varOpts.coveragePeriod}세 만기`, score: scores.cerebrovascularScore },
                  { label: '펀드 투자 연계도', targetId: 'input-variable-fields', val: '글로벌 자산배분', score: scores.cardiovascularScore },
                  { label: '실적배당 가성비', targetId: 'input-variable-fields', val: '투자수익 반영 가능', score: 92 }
                ] : [
                  { label: '사망보장액 적정성', targetId: 'input-variable-fields', val: `${(varOpts.deathBenefit / 100000000).toFixed(1)}억원 보장`, score: scores.cancerScore },
                  { label: '보장 만기 설계', targetId: 'input-variable-fields', val: `만 ${varOpts.coveragePeriod}세 만기`, score: scores.cerebrovascularScore },
                  { label: '우량체 할인 적용', targetId: 'input-variable-fields', val: varOpts.isHealthyDiscount ? '15% 특별 할인' : '할인 미지정', score: scores.cardiovascularScore },
                  { label: '종신 대비 가성비', targetId: 'input-variable-fields', val: '약 85% 지출 절감', score: 98 }
                ]).map((item, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-black text-slate-800">{item.val}</p>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        className={`h-full ${isPremiumTheme ? 'bg-blue-500' : 'bg-orange-500'}`}
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
          isPremiumTheme ? 'bg-gradient-to-br from-blue-600 to-indigo-800 shadow-blue-500/20' : 'bg-gradient-to-br from-[#FF6B00] to-red-600 shadow-orange-500/20'
        }`}>
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Zap size={200} fill="currentColor" />
          </div>
          <div className="relative z-10 text-left">
            <p className="opacity-80 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Rebalance Score</p>
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

      {/* 3. 1:1 상세 비교 분석 (정기보험인 경우 기 기회비용 전환 표) */}
      {['term', 'term_pure'].includes(subType) && (() => {
        const switchPremium = result.recommendations?.diet?.estimatedPremium || result.estimatedPremium || 12200;
        const stayPremium = Math.round((benefitVal / 100000000) * 180000);
        const monthlySaving = Math.max(10000, stayPremium - switchPremium);
        const tenYearSaving = monthlySaving * 12 * 10;
        
        return (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-[3.5rem] p-8 md:p-12 text-white border border-slate-800/80 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] space-y-12 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-800">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
                  0.1초 AI 리밸런싱 진단
                </div>
                <h4 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                  1:1 맞춤형 보장 다이어트
                </h4>
                <p className="text-xs font-bold text-slate-400">
                  보험리밸런스 AI가 분석한 불필요 지출 해결방안 및 숨겨진 자산 가치
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 shrink-0 w-full lg:w-auto">
                <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">월 예상 절감액</p>
                  <p className="text-3xl font-black text-[#FF6B00] tracking-tighter mt-1">
                    {monthlySaving.toLocaleString()} <span className="text-sm font-bold text-slate-300">원</span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-[#FF6B00] to-orange-600 border border-[#FF6B00]/20 p-5 rounded-3xl shadow-lg shadow-orange-500/15 text-left">
                  <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">10년 누적 자산 가치</p>
                  <p className="text-3xl font-black text-white tracking-tighter mt-1">
                    {tenYearSaving.toLocaleString()} <span className="text-sm font-bold text-white/80">원</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Stay vs Switch Card Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Stay Card */}
              <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-slate-700 transition-all duration-300 text-left">
                <div className="absolute top-4 right-4 text-xs font-black text-slate-500 tracking-wider">STAY</div>
                <h5 className="text-lg font-black text-slate-300 mb-6">기존 종신보험 유지 시</h5>
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400">예상 월 납입 보험료</span>
                    <p className="text-2xl font-black text-slate-200 mt-1">{stayPremium.toLocaleString()}원</p>
                  </div>
                  <ul className="space-y-3 text-xs font-bold text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full shrink-0" />
                      평생 사망 보장을 위해 과도한 사업비 누적 발생
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full shrink-0" />
                      중도 해지 시 납입금 대비 손실률 위험 상존
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full shrink-0" />
                      일반형 설계 시 물가상승에 따른 실질 가치 하락
                    </li>
                  </ul>
                </div>
              </div>

              {/* Switch Card */}
              <div className="bg-gradient-to-br from-[#FF6B00]/10 to-transparent border border-[#FF6B00]/30 rounded-3xl p-8 relative overflow-hidden group hover:border-[#FF6B00]/50 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(255,107,0,0.1)] text-left">
                <div className="absolute top-4 right-4 text-xs font-black text-[#FF6B00] tracking-wider animate-pulse">RECOMMENDED</div>
                <h5 className="text-lg font-black text-white mb-6">보험리밸런스 정기 교체 시</h5>
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-[#FF6B00]/80">최저가 실시간 매핑 보험료</span>
                    <p className="text-3xl font-black text-[#FF6B00] mt-1">
                      {switchPremium.toLocaleString()} <span className="text-sm text-white">원</span>
                    </p>
                  </div>
                  <ul className="space-y-3 text-xs font-bold text-white/90">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full shrink-0" />
                      동일한 사망 보장액 기준 <span className="text-[#FF6B00] font-black">매월 {monthlySaving.toLocaleString()}원 절감</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full shrink-0" />
                      가장 경제활동이 활발한 시기 집중 사망보장
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full shrink-0" />
                      비흡연 + 건강 상태 기준에 따라 최대 15% 추가 할인
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 1:1 비교 상세 내역 Table */}
            <div className="space-y-4 pt-4 text-left">
              <h5 className="text-sm font-black text-slate-300 tracking-wider uppercase">상세 보장 조건 비교</h5>
              <div className="overflow-hidden border border-slate-800 rounded-2xl bg-slate-900/40 backdrop-blur-md">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">보장 구분</th>
                      <th className="px-6 py-4">기존 종신보험 유지 시 (Stay)</th>
                      <th className="px-6 py-4 text-[#FF6B00]">정기보험 교체 시 (Switch)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-bold text-slate-300 text-xs">
                    <tr>
                      <td className="px-6 py-4 font-black text-white">사망 보장 한도</td>
                      <td className="px-6 py-4 text-slate-400">{(benefitVal/100000000).toFixed(1)}억원 (종신 사망 보장)</td>
                      <td className="px-6 py-4 text-white font-black">{(benefitVal/100000000).toFixed(1)}억원 (가장 활동적인 경제기 집중 보장)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-black text-white">월 보험료 규모</td>
                      <td className="px-6 py-4 text-slate-400">{stayPremium.toLocaleString()}원대 (고비용 납입 구조)</td>
                      <td className="px-6 py-4 text-[#FF6B00] font-black">{switchPremium.toLocaleString()}원 (최저가 매핑 적용)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-black text-white">건강체 특별 우대</td>
                      <td className="px-6 py-4 text-slate-400">미적용 (일반 종신보험은 우량체 조건 적용이 매우 협소함)</td>
                      <td className="px-6 py-4 text-white font-black">비흡연 + 혈압/BMI 기준 통과 시 최대 15% 즉시 추가 할인</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-black text-white">기회비용 활용성</td>
                      <td className="px-6 py-4 text-slate-400">보험금 적립 방식으로 유동성 결여</td>
                      <td className="px-6 py-4 text-white font-black">차액으로 연금/적금 투자 시 10년 기준 약 {tenYearSaving.toLocaleString()}원 재원 확보</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
export default VariableSummary;
