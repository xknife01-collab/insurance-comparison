import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { Shield, TrendingUp, CheckCircle2, AlertCircle, Scale, PiggyBank, Activity, Clock, Car, UserCheck, ShieldAlert, ShieldCheck } from 'lucide-react';

interface Props {
  result: any;
  formatAmount?: (amt: number) => string;
  forceMobile?: boolean;
}

export const DriverSummary: React.FC<Props> = ({ result, forceMobile }) => {
  const { analysis, recommendations } = result || {};
  const driverOpts = analysis?.driver || {
    drivingPurpose: 'private',
    jobClass: 1,
    planType: 'standard'
  };

  const { drivingPurpose, jobClass, planType } = driverOpts;
  const currentPremium = analysis?.monthlyPremium || 25000;
  
  // 추천 플랜 요금 (실속형 가격 기준)
  const recommendedPremium = recommendations?.diet?.estimatedPremium || 9900;
  const savings = currentPremium - recommendedPremium;

  // 요약 분석 카드 정보 6가지 구성
  const analysisItems = [
    { 
      label: '운전 목적', targetId: 'input-driver-fields', 
      val: drivingPurpose === 'motorcycle' ? '이륜차 (오토바이)' : (drivingPurpose === 'commercial' ? '영업용 (상업 목적)' : '자가용 (일반 개인)'), 
      status: '선택됨', 
      icon: Car, 
      color: 'text-purple-500' 
    },
    { 
      label: '직업 등급', targetId: 'input-driver-fields', 
      val: `${jobClass}급 (상해위험도)`, 
      status: '정상', 
      icon: UserCheck, 
      color: 'text-emerald-500' 
    },
    { 
      label: '희망 플랜', targetId: 'input-driver-fields', 
      val: planType === 'saving' ? '실속형' : planType === 'premium' ? 'VIP 안심형' : '표준형', 
      status: '정상', 
      icon: Scale, 
      color: 'text-purple-500' 
    },
    { 
      label: '형사합의금 (교사처)', targetId: 'input-driver-fields', 
      val: planType === 'saving' ? '1억 원 한도' : planType === 'premium' ? '2억 원 한도' : '1.5억 원 한도', 
      status: planType === 'saving' ? '보통' : '우수', 
      icon: ShieldCheck, 
      color: planType === 'saving' ? 'text-slate-400' : 'text-emerald-500' 
    },
    { 
      label: '변호사 선임 비용', targetId: 'input-driver-fields', 
      val: planType === 'saving' ? '3,000만 원' : '5,000만 원 (경찰선지원)', 
      status: '정상', 
      icon: Clock, 
      color: 'text-emerald-500' 
    },
    { 
      label: '벌금 보장 한도', targetId: 'input-driver-fields', 
      val: planType === 'saving' ? '대인 2,000만 원' : (planType === 'premium' ? '대인 3천 / 대물 5백' : '대인 3,000만 원'), 
      status: '정상', 
      icon: Shield, 
      color: 'text-emerald-500' 
    },
  ];

  // 보장 부족 피드백 점수 및 수치 계산
  const score = result?.scores?.totalScore || 85;
  const deficiencies = result?.deficiencies || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. 운전자 보험 보장 분석 현황 */}
      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)]">
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 pl-2">
          <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
          운전자 보험 보장 분석 현황
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {analysisItems.map((item, i) => (
            <div key={i} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center gap-3">
              <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-xs font-black text-slate-700 leading-tight">{item.val}</p>
              </div>
              <span className={`text-[0.55rem] font-black px-3 py-1 rounded-full ${item.status === '우수' || item.status === '정상' || item.status === '선택됨' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 운전자 서비스 상담 리포트 */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-[0.65rem] font-black uppercase tracking-widest mb-6">
              <ShieldAlert size={14} /> Driver Safety Analysis
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              선택하신 맞춤 플랜의 <br/>
              <span className="text-purple-400">운전자 보장 밸런스를 분석</span>했습니다.
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              "오각형 그래프가 넓고 균형 잡힌 모양일수록 형사합의 및 법률 분쟁 시 빈틈없이 대비된 상태입니다."
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 w-full max-w-sm">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">보장 분석 점수</p>
                  <p className="text-4xl font-black text-purple-400">{score} <span className="text-lg text-slate-500">점</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[0.65rem] font-black text-red-500 uppercase">보강 추천</p>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map(s => <div key={s} className="w-2 h-2 rounded-full bg-red-500" />)}
                    {[4, 5].map(s => <div key={s} className="w-2 h-2 rounded-full bg-white/10" />)}
                  </div>
                </div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-purple-500"
                />
              </div>
              {deficiencies.length > 0 ? (
                <p className="text-[0.7rem] text-slate-400 font-bold mt-4 flex items-start gap-2 leading-tight">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <span>주요 보강 항목: {deficiencies[0].substring(0, 35)}...</span>
                </p>
              ) : (
                <p className="text-[0.7rem] text-emerald-400 font-bold mt-4 flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  준비 상태가 매우 양호합니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 동일 연령·조건 기준 월 예상 절약 보험료 섹션 */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-4 -translate-y-4">
          <div className="w-48 h-48 rounded-full border-8 border-white"></div>
        </div>
        <div className={`relative z-10 flex ${forceMobile ? 'flex-col items-start' : 'flex-col md:flex-row md:items-center md:justify-between'} gap-8`}>
          <div>
            <span className="text-xs font-black text-indigo-200 uppercase tracking-widest bg-indigo-900/30 px-3 py-1 rounded-full mb-4 inline-block">
              Driver Protection Specialization Analysis
            </span>
            <h4 className="text-2xl font-black mb-2">동일 연령·운전조건 기준 월 예상 절약 보험료</h4>
            <p className="text-indigo-100 text-sm font-bold opacity-80">
              사용자님의 연령과 운전 환경에 맞춘 최적의 운전자 필수 담보 플랜으로 전환 시 절감되는 금액입니다.
            </p>
          </div>
          <div className={forceMobile ? 'text-left' : 'text-right'}>
            {savings > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-yellow-300">
                  {savings.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-indigo-100">원 절감</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter text-white">
                  현재 납입금액 유지/추가 보강 필요
                </span>
              </div>
            )}
            <p className="text-[10px] text-indigo-200 font-bold mt-2 opacity-60 uppercase tracking-widest">
              * 추천 상품 기준 예상 수치 (비례보상 담보 포함 여부에 따라 상이)
            </p>
          </div>
        </div>
      </div>

      {/* Optimized Protection Strategies Footer */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center border border-white/5">
        <p className="text-purple-400 font-black text-sm uppercase tracking-[0.2em] mb-2">Optimized Law & Safety Strategies</p>
        <p className="text-slate-400 text-xs font-medium">당신에게 가장 적합한 운전자 안전 보장 최적화 전략이 수립되었습니다.</p>
      </div>
    </div>
  );
};
