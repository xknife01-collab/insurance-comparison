import React from 'react';
import { motion } from 'motion/react';
import { Shield, TrendingUp, CheckCircle2, AlertCircle, PiggyBank, Clock, HeartHandshake, Users } from 'lucide-react';

interface Props {
  result: any;
}

export const NursingSummary: React.FC<Props> = ({ result }) => {
  const { analysis, premium } = result;
  const currentPremium = analysis.monthlyPremium || 0;
  const recommendedPremium = premium || 0;
  const savings = currentPremium - recommendedPremium;

  const prefService = analysis.nursing?.preferredService || 'both';
  const prefServiceText = prefService === 'home' ? '방문요양(재가)' : prefService === 'facility' ? '요양원(시설)' : '재가+시설 복합';
  
  const homeAmt = analysis.nursing?.homeAmount || 500000;
  const facilityAmt = analysis.nursing?.facilityAmount || 500000;

  const hasProxy = analysis.nursing?.hasProxyClaim;
  const proxyText = hasProxy ? '예, 지정함 (권장)' : '아니오, 나중에';

  const hasBrain = analysis.nursing?.hasBrainHistory;
  const hasLtc = analysis.nursing?.hasLtcHistory;

  const underwritingText = (hasBrain || hasLtc) ? '초간편 심사형' : '일반 심사형';

  const analysisItems = [
    { label: '요양 지원 방식', val: prefServiceText, status: '선택됨', icon: Users, color: 'text-pink-500' },
    { label: '재가 보장 금액', val: `월 최대 ${(homeAmt / 10000).toFixed(0)}만원`, status: '우수', icon: PiggyBank, color: 'text-emerald-500' },
    { label: '시설 보장 금액', val: `월 최대 ${(facilityAmt / 10000).toFixed(0)}만원`, status: '우수', icon: HeartHandshake, color: 'text-emerald-500' },
    { label: '대리인 지정 여부', val: proxyText, status: hasProxy ? '안전' : '경고', icon: Shield, color: hasProxy ? 'text-emerald-500' : 'text-rose-500' },
    { label: '심사 유형', val: underwritingText, status: '확인됨', icon: Users, color: 'text-blue-500' },
    { label: '면책/감액 기간', val: '90일 고정 / 1년 50%', status: '고정', icon: Clock, color: 'text-slate-400' },
  ];

  const efficiencyScore = result.scores?.totalScore ? Math.round(result.scores.totalScore) : 80;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. 재가/시설 요양 서비스 보장 분석 현황 */}
      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)]">
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 pl-2">
          <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
          재가/시설 요양 보장 분석 현황
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {analysisItems.map((item, i) => (
            <div key={i} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center gap-3">
              <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm font-black text-slate-700">{item.val}</p>
              </div>
              <span className={`text-[0.55rem] font-black px-3 py-1 rounded-full ${
                item.status === '안전' || item.status === '우수' || item.status === '선택됨' 
                  ? 'bg-pink-100 text-pink-600' 
                  : item.status === '경고' 
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 요양 서비스 상담 리포트 */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-500/20 text-pink-400 rounded-full text-[0.65rem] font-black uppercase tracking-widest mb-6">
              <HeartHandshake size={14} /> Caregiving & LTC Analysis
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              당신의 재가/시설 요양 <br/>
              <span className="text-pink-400">준비 상태를 분석</span>했습니다.
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              "방사형 그래프가 둥근 모양일수록 안전한 보장 상태입니다."
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 w-full max-w-sm">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest font-sans">보장 최적화 지수</p>
                  <p className="text-4xl font-black text-pink-400">{efficiencyScore} <span className="text-lg text-slate-500">점</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[0.65rem] font-black text-pink-500 uppercase">분석 완료</p>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4].map(s => <div key={s} className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />) }
                    {[5].map(s => <div key={s} className="w-2 h-2 rounded-full bg-white/10" />)}
                  </div>
                </div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${efficiencyScore}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-pink-500"
                />
              </div>
              <p className="text-[0.7rem] text-slate-400 font-bold mt-4 flex items-center gap-2">
                <AlertCircle size={14} className="text-pink-500" />
                {!hasProxy ? '긴급 보강 필요 항목: 지정대리청구인 지정' : '안정적인 보장 균형을 갖추고 있습니다.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 월 예상 절감액 */}
      <div className="bg-pink-50 rounded-[3rem] p-10 border border-pink-100 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-pink-200/30 rounded-full blur-3xl group-hover:bg-pink-300/50 transition-all" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 text-pink-600 mb-2">
              <PiggyBank size={20} />
              <h4 className="text-xl font-black">월 예상 절감액</h4>
            </div>
            <p className="text-[0.65rem] text-slate-400 font-bold mb-6 uppercase tracking-widest pl-7">Premium Optimization Analysis</p>
            <div className="flex flex-col gap-1 pl-7">
              <p className="text-5xl font-black text-pink-600">
                {savings > 0 ? `-${savings.toLocaleString()}` : '0'} <span className="text-2xl">원</span>
              </p>
              <p className="text-sm font-bold text-pink-600/60">불필요한 지출을 줄여 가성비를 높였습니다.</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-pink-100 shadow-xl max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <TrendingUp size={80} className="text-pink-500" />
            </div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-200">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 mb-1">최적화 분석 완료</p>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  매달 <span className="text-pink-600 font-black">{savings.toLocaleString()}원</span>을 절약하면서도, 국가 공인 재가 및 시설 보장은 더 든든하게 구성된 플랜입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Protection Strategies Footer */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center border border-white/5">
        <p className="text-pink-400 font-black text-sm uppercase tracking-[0.2em] mb-2">Optimized Protection Strategies</p>
        <p className="text-slate-400 text-xs font-medium">당신에게 가장 적합한 요양 서비스(재가/시설) 보장 최적화 전략이 수립되었습니다.</p>
      </div>
    </div>
  );
};
