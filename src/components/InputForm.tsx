/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  HeartPulse, 
  User, 
  Baby, 
  Stethoscope, 
  Clock, 
  PiggyBank, 
  Car, 
  Home, 
  Brain, 
  TrendingUp,
  MessageCircle,
  Zap,
  ChevronRight,
  ShieldIcon,
  Activity
} from 'lucide-react';
import { InsuranceAnalysis } from '../types/insurance';
import { BrainFields } from './calculator/fields/BrainFields';

const INSURANCE_TYPES = [
  { id: 'cancer', label: '암', icon: <div className="p-3 bg-orange-100 rounded-2xl text-orange-600"><ShieldCheck className="w-8 h-8" /></div> },
  { id: 'surgery', label: '수술/입원비', icon: <HeartPulse className="w-8 h-8 text-gray-400" /> },
  { id: 'life', label: '종신', icon: <Clock className="w-8 h-8 text-gray-400" /> },
  { id: 'baby', label: '신생아', icon: <Baby className="w-8 h-8 text-gray-400" /> },
  { id: 'child', label: '어린이', icon: <Baby className="w-8 h-8 text-gray-400" /> },
  { id: 'pre-existing', label: '유병자', icon: <Stethoscope className="w-8 h-8 text-gray-400" /> },
  { id: 'medical', label: '의료실비', icon: <Stethoscope className="w-8 h-8 text-gray-400" /> },
  { id: 'term', label: '정기', icon: <Clock className="w-8 h-8 text-gray-400" /> },
  { id: 'pension', label: '연금/연금저축', icon: <PiggyBank className="w-8 h-8 text-gray-400" /> },
  { id: 'driver', label: '운전자/상해', icon: <Car className="w-8 h-8 text-gray-400" /> },
  { id: 'brain', label: '뇌혈관', icon: <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600"><Brain className="w-8 h-8" /></div> },
  { id: 'home', label: '주택화재', icon: <Home className="w-8 h-8 text-gray-400" /> },
  { id: 'dementia', label: '치매', icon: <Activity className="w-8 h-8 text-gray-400" /> },
  { id: 'variable', label: '변액/변액연금', icon: <TrendingUp className="w-8 h-8 text-gray-400" /> },
];

interface InputFormProps {
  onAnalyze: (analysis: InsuranceAnalysis) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze }) => {
  const [selectedType, setSelectedType] = useState('cancer');
  const [premium, setPremium] = useState('200000');
  const [cancerAmt, setCancerAmt] = useState('30000000');
  const [isFetching, setIsFetching] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'standard' | 'simple'>('standard');
  
  // 뇌혈관 전용 상태
  const [brainDiagnosisAmt, setBrainDiagnosisAmt] = useState(10000000);
  const [brainPaymentType, setBrainPaymentType] = useState<'non-renewable' | 'renewable'>('non-renewable');
  const [brainScreeningType, setBrainScreeningType] = useState<'standard' | '3.5.5' | '3.10.5'>('standard');
  const [brainSurgeryBenefit, setBrainSurgeryBenefit] = useState(true);
  const [brainCoveragePeriod, setBrainCoveragePeriod] = useState(90);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      healthStatus,
      selectedCategory: selectedType,
      cancer: { currentAmount: Number(cancerAmt), targetAmount: 50000000 },
      cerebrovascular: { currentAmount: 10000000, targetAmount: 30000000 },
      cardiovascular: { currentAmount: 10000000, targetAmount: 30000000 },
      monthlyPremium: Number(premium)
    });
  };

  const handleSocialFetch = (provider: string) => {
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      onAnalyze({
        healthStatus,
        selectedCategory: selectedType,
        cancer: { currentAmount: 30000000, targetAmount: 50000000 },
        cerebrovascular: { currentAmount: 10000000, targetAmount: 30000000 },
        cardiovascular: { currentAmount: 10000000, targetAmount: 30000000 },
        monthlyPremium: 200000
      });
    }, 1500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 -mt-40 relative z-20">
      <div className="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] p-12 grid lg:grid-cols-12 gap-16 border border-gray-50 overflow-hidden">
        
        {/* Left: Type Selection */}
        <div className="lg:col-span-7 space-y-12">
          <div>
            <div className="flex flex-col items-center gap-4 mb-8 bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
               <div className="text-[0.6rem] font-black text-gray-400 uppercase tracking-[0.2em]">
                 대한민국 35개 전 보험사 실시간 비교 중
               </div>
               <div className="flex flex-col gap-4 w-full opacity-100 transition-all">
                 <img src="/insurance_logos_1.png" alt="Insurance Partners Group 1" className="w-full h-auto object-contain scale-105" />
                 <img src="/insurance_logos_2.png" alt="Insurance Partners Group 2" className="w-full h-auto object-contain scale-105" />
               </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb- aggregation px-2">어떤 보험이 궁금하세요?</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-8">
              {INSURANCE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex flex-col items-center justify-center aspect-square rounded-3xl border transition-all h-[110px] w-full ${
                    selectedType === type.id 
                      ? 'bg-white border-orange-500 shadow-[0_20px_40px_rgba(255,165,0,0.15)] ring-2 ring-orange-500 ring-offset-2' 
                      : 'bg-white border-gray-50 hover:border-gray-100 hover:shadow-lg'
                  }`}
                >
                  <div className="mb-2">{type.icon}</div>
                  <span className={`text-sm font-bold ${selectedType === type.id ? 'text-gray-900' : 'text-gray-400'}`}>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 px-2">
            <h3 className="text-lg font-bold text-gray-800">보장 상세와 건강상태 선택</h3>
            <div className="flex flex-wrap gap-4">
               <button 
                 type="button"
                 onClick={() => setHealthStatus('standard')}
                 className={`px-8 py-3 rounded-full border-2 font-bold transition-all ${
                   healthStatus === 'standard' 
                   ? 'border-orange-500 bg-orange-50 text-orange-600' 
                   : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                 }`}
               >
                 일반 건강보험 (건강체)
               </button>
               <button 
                 type="button"
                 onClick={() => setHealthStatus('simple')}
                 className={`px-8 py-3 rounded-full border-2 font-bold transition-all ${
                   healthStatus === 'simple' 
                   ? 'border-blue-500 bg-blue-50 text-blue-600' 
                   : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                 }`}
               >
                 유병자/간편보험 (병력있음)
               </button>
            </div>
          </div>
        </div>

        {/* Right: Dual Analysis Form */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Section 1: One-click Fetch (Top) */}
          <div className="bg-blue-50/50 rounded-[35px] p-8 border border-blue-100 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
               <Zap className="w-24 h-24 text-blue-600" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black text-blue-900 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 fill-current" />
                원클릭 내 보험 분석
              </h3>
              <p className="text-sm text-blue-700 font-medium mb-6 leading-relaxed">
                따로 입력할 필요 없이 본인 인증 한 번으로<br/>
                모든 가입 내역을 실시간으로 불러옵니다.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleSocialFetch('kakao')}
                  className="bg-[#FEE500] text-black py-4 rounded-2xl font-black text-sm shadow-sm hover:brightness-95 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" /> 카카오로 계산
                </button>
                <button 
                  onClick={() => handleSocialFetch('naver')}
                  className="bg-[#03C75A] text-white py-4 rounded-2xl font-black text-sm shadow-sm hover:brightness-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="font-serif italic text-lg leading-none">N</span> 네이버로 계산
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Direct Input (Bottom) */}
          <div className="bg-gray-50 rounded-[35px] p-8 border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900 mb-2">직접 입력 분석</h3>
              <p className="text-sm text-gray-500 font-medium">보험료와 보장을 직접 알고 계신 경우 알려주세요.</p>
            </div>
            
            {/* 뇌혈관 전용 필드 (선택 시에만 노출) */}
            {selectedType === 'brain' && (
              <BrainFields 
                diagnosisAmount={brainDiagnosisAmt}
                setDiagnosisAmount={setBrainDiagnosisAmt}
                paymentType={brainPaymentType}
                setPaymentType={setBrainPaymentType}
                screeningType={brainScreeningType}
                setScreeningType={setBrainScreeningType}
                surgeryBenefit={brainSurgeryBenefit}
                setSurgeryBenefit={setBrainSurgeryBenefit}
                coveragePeriod={brainCoveragePeriod}
                setCoveragePeriod={setBrainCoveragePeriod}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">현재 총 월 보험료</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={premium}
                    onChange={(e) => setPremium(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4.5 px-6 text-lg font-black focus:outline-none focus:ring-4 focus:ring-orange-500/10 shadow-sm transition-all"
                    placeholder="200,000"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-400 text-lg">원</span>
                </div>
              </div>

              {selectedType !== 'brain' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">현재 일반암 진단비</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={cancerAmt}
                      onChange={(e) => setCancerAmt(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-2xl py-4.5 px-6 text-lg font-black focus:outline-none focus:ring-4 focus:ring-orange-500/10 shadow-sm transition-all"
                      placeholder="30,000,000"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-400 text-lg">원</span>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-orange-500 text-white font-black py-5 rounded-[20px] shadow-[0_15px_40px_-10px_rgba(255,165,0,0.5)] hover:bg-orange-600 transition-all transform hover:-translate-y-1 mt-6 text-lg flex items-center justify-center gap-2"
              >
                내 보험 다이어트 시작하기 (1분)
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-200/50 mt-4">
                <button type="button" className="flex items-center justify-center gap-2 bg-white text-gray-700 py-4 rounded-xl text-xs font-black shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
                  <MessageCircle className="w-4 h-4 text-orange-500" /> 카톡 문의
                </button>
                <button type="button" className="flex items-center justify-center gap-2 bg-white text-gray-700 py-4 rounded-xl text-xs font-black shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
                  상담 예약
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InputForm;
