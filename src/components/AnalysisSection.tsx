/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, ChevronRight } from 'lucide-react';
import { InsuranceAnalysis } from '../types/insurance';
import { HyphenAuthModal } from './insurance/remodeling/HyphenAuthModal';
import { StandardizedCoverage } from '../types/remodeling';

interface AnalysisSectionProps {
  onAnalyze: (analysis: InsuranceAnalysis) => void;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ onAnalyze }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Form states
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birth, setBirth] = useState('');
  const [age, setAge] = useState(''); // 2026 - 1977 + 1 = 50
  const [mobileNo, setMobileNo] = useState('');

  // Handle auto-calculating age based on birth date (8 digits)
  const handleBirthChange = (val: string) => {
    setBirth(val);
    if (val.length === 8) {
      const birthYear = parseInt(val.substring(0, 4));
      if (!isNaN(birthYear)) {
        const currentYear = new Date().getFullYear(); // 2026
        setAge(String(currentYear - birthYear + 1));
      }
    }
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (coverage: StandardizedCoverage) => {
    onAnalyze({
      name: userName,
      mobile: mobileNo,
      age: coverage.age,
      gender: coverage.gender,
      jobClass: 1,
      selectedCategory: 'remodeling',
      cancer: { currentAmount: coverage.cancer_diagnosis, targetAmount: 50000000 },
      cerebrovascular: { currentAmount: coverage.brain_vascular, targetAmount: 30000000 },
      cardiovascular: { currentAmount: coverage.ischemic_heart, targetAmount: 30000000 },
      surgery: { currentAmount: coverage.surgery_amount ?? 0, targetAmount: 10000000 },
      postDisability: { currentAmount: coverage.post_disability_amount ?? 0, targetAmount: 30000000 },
      paymentExemption: 'standard',
      healthStatus: 'standard',
      monthlyPremium: coverage.current_total_premium,
      _remodelingCoverage: coverage
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-40 space-y-24">
      {/* 100% 안심 자율 비교 서비스 배너 (텍스트만) */}
      <div className="max-w-4xl mx-auto w-full text-center px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-500/10 text-orange-600 rounded-full text-[11px] md:text-xs font-black uppercase tracking-wider mb-4">
          ✨ 100% 안심 자율 비교 서비스
        </div>
        
        {/* Title */}
        <h3 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight mb-4 leading-tight">
          "가입 권유 전화 <span className="text-orange-500">Zero</span>" — 100% 완전 비대면 자율 분석
        </h3>
        
        {/* Description */}
        <p className="text-sm md:text-base lg:text-lg text-slate-600 font-bold leading-relaxed max-w-2xl mx-auto break-keep mb-3">
          상담원 전화 유도 없이, 오직 AI 빅데이터 엔진을 통해 고객 스스로 100% 자율 비교 및 진단을 완료할 수 있습니다.
        </p>
        
        {/* Subtext */}
        <div className="text-xs md:text-sm text-slate-400 font-semibold">
          (전화는 고객이 원할 때만 1:1 신청 가능)
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
           <Zap size={14} className="fill-current text-orange-500" /> Professional Deep Analysis
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">내 보험 정밀 분석</h2>
        <p className="text-xl text-gray-500 font-bold italic">"내가 이미 가입한 보험, 제대로 가입한 게 맞을까요?"</p>
      </div>


      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-slate-900 rounded-[4rem] p-8 md:p-16 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-24 opacity-5 scale-150 transform group-hover:scale-125 transition-transform duration-1000 rotate-12">
             <Zap className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 space-y-10">
            <div className="space-y-4 text-center">
               <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                 원클릭 내 보험 분석
               </h3>
               <p className="text-sm md:text-base text-slate-400 font-bold leading-relaxed">
                 따로 입력할 필요 없이 본인 인증 정보 입력 후 실시간으로 정보를 조회합니다.
               </p>
            </div>

            {/* 고객과의 안심 3대 약속 배너 */}
            <div className="max-w-xl mx-auto bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-orange-50/50 border-2 border-orange-200/80 rounded-[2.5rem] p-6 text-left shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🛡️</span>
                <h4 className="text-sm font-black text-slate-800 tracking-tight">고객과의 안심 3대 약속</h4>
                <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-[8px] font-black uppercase tracking-wider">Verified</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                <div className="bg-white p-3.5 rounded-2xl border border-orange-100 flex flex-col gap-0.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Promise 1</span>
                    <span className="text-xs font-black text-slate-800 leading-tight">동의 없는 전화 금지</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed mt-0.5 break-keep">상담 동의가 없는 한, 광고성 무단 전화를 일절 유도하지 않습니다.</p>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-orange-100 flex flex-col gap-0.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Promise 2</span>
                    <span className="text-xs font-black text-slate-800 leading-tight">개인정보 암호화</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed mt-0.5 break-keep">자가진단 단계에서는 연락처가 든든하게 마스킹 보호 처리됩니다.</p>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-orange-100 flex flex-col gap-0.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Promise 3</span>
                    <span className="text-xs font-black text-slate-800 leading-tight">카톡 1:1 익명 상담</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed mt-0.5 break-keep">고객이 원할 때만 코드를 활용한 익명 상담으로 매칭됩니다.</p>
                </div>
              </div>
            </div>

            {/* 고객 안심 보장 배너 */}
            <div className="max-w-xl mx-auto bg-[#FFF8F0] border-2 border-amber-200/80 rounded-3xl p-5 flex items-center gap-3.5 text-left shadow-xl animate-in fade-in duration-500">
              <span className="text-xl text-orange-500 flex-shrink-0 animate-pulse">🛡️</span>
              <p className="text-xs sm:text-sm font-black text-slate-800 leading-relaxed break-keep">
                저희는 고객님의 연락처를 묻지 않습니다. 안심하시고 비교 분석하시고 필요하실 때에만 카카오톡 요청해 주세요.
              </p>
            </div>

            <form onSubmit={handleStartAnalysis} className="space-y-6 max-w-xl mx-auto w-full">
              {/* Row 1: Name and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">성함</label>
                  <input
                    type="text"
                    placeholder="홍길동"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">성별</label>
                  <div className="flex bg-white/5 p-1 rounded-2xl h-[54px] gap-1 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setGender('M')}
                      className={`flex-1 rounded-xl font-black text-xs transition-all ${gender === 'M' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      남성
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('F')}
                      className={`flex-1 rounded-xl font-black text-xs transition-all ${gender === 'F' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      여성
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Birthdate and Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">생년월일 (8자리)</label>
                  <input
                    type="text"
                    placeholder="예) 19770101"
                    maxLength={8}
                    value={birth}
                    onChange={(e) => handleBirthChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">나이</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="예) 50"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all"
                      required
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-sm">세</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Mobile No */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">연락처 (Mobile)</label>
                <input
                  type="text"
                  placeholder="예) 01012345678"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all"
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-black py-5 rounded-2xl text-base shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-3 mt-6"
              >
                내 보험 정밀 분석 시작하기
                <ChevronRight size={18} />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      <HyphenAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialData={{
          userName,
          gender,
          birth,
          mobileNo,
          age: Number(age)
        }}
      />
    </section>
  );
};

export default AnalysisSection;
