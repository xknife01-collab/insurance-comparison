/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Zap, ChevronRight, Calculator } from 'lucide-react';
import { InsuranceAnalysis } from '../types/insurance';

interface AnalysisSectionProps {
  onAnalyze: (analysis: InsuranceAnalysis) => void;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ onAnalyze }) => {
  const [premium, setPremium] = useState('200000');
  const [cancerAmt, setCancerAmt] = useState('30000000');
  const [age, setAge] = useState('40');
  const [gender, setGender] = useState<'M' | 'F'>('M');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      age: Number(age),
      gender: gender,
      jobClass: 1,
      cancer: { currentAmount: Number(cancerAmt), targetAmount: 50000000 },
      cerebrovascular: { currentAmount: 10000000, targetAmount: 30000000 },
      cardiovascular: { currentAmount: 10000000, targetAmount: 30000000 },
      monthlyPremium: Number(premium)
    });
  };

  const handleSocialFetch = () => {
    onAnalyze({
      age: 40,
      gender: 'M',
      jobClass: 1,
      cancer: { currentAmount: 30000000, targetAmount: 50000000 },
      cerebrovascular: { currentAmount: 10000000, targetAmount: 30000000 },
      cardiovascular: { currentAmount: 10000000, targetAmount: 30000000 },
      monthlyPremium: 200000
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-40 space-y-24">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
           <Zap size={14} className="fill-current text-orange-500" /> Professional Deep Analysis
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">내 보험 정밀 분석</h2>
        <p className="text-xl text-gray-500 font-bold italic">"내가 이미 가입한 보험, 제대로 가입한 게 맞을까요?"</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-stretch">
        {/* Left: One-click Fetch */}
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-24 opacity-5 scale-150 transform group-hover:scale-125 transition-transform duration-1000 rotate-12">
             <Zap className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 space-y-12">
            <div className="space-y-6">
               <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                 원클릭 내 보험 분석
               </h3>
               <p className="text-lg text-slate-400 font-bold leading-relaxed max-w-sm">
                 따로 입력할 필요 없이 본인 인증 한 번으로<br/>
                 모든 가입 내역을 실시간으로 불러옵니다.
               </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSocialFetch}
                className="w-full bg-[#FEE500] text-black py-7 rounded-[2.2rem] font-black text-xl shadow-xl hover:brightness-105 transition-all flex items-center justify-center gap-3"
              >
                <div className="w-8 h-8 bg-black/5 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                카카오로 계산
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSocialFetch}
                className="w-full bg-[#03C75A] text-white py-7 rounded-[2.2rem] font-black text-xl shadow-xl hover:brightness-105 transition-all flex items-center justify-center gap-4"
              >
                <span className="font-serif italic text-3xl leading-none">N</span> 
                네이버로 계산
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right: Direct Input */}
        <div className="bg-white rounded-[4rem] p-12 md:p-20 border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] flex flex-col">
          <div className="mb-16">
            <h3 className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-4">
               직접 입력 분석
            </h3>
            <p className="text-lg text-gray-500 font-bold italic">정확한 요율 계산을 위해 정보를 알려주세요.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 flex-1">
            {/* Age & Gender Group */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">나이</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-[2rem] py-7 px-8 text-2xl font-black focus:outline-none focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-500/5 transition-all"
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-gray-300 text-2xl">세</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">성별</label>
                <div className="flex bg-gray-50 p-2 rounded-[2rem] h-[88px] gap-2">
                  <button 
                    type="button"
                    onClick={() => setGender('M')}
                    className={`flex-1 rounded-2xl font-black text-xl transition-all ${gender === 'M' ? 'bg-white shadow-lg text-slate-900' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    남성
                  </button>
                  <button 
                    type="button"
                    onClick={() => setGender('F')}
                    className={`flex-1 rounded-2xl font-black text-xl transition-all ${gender === 'F' ? 'bg-orange-500 shadow-lg text-white' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    여성
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">현재 총 월 보험료</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={premium}
                  onChange={(e) => setPremium(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-[2rem] py-7 px-8 text-2xl font-black focus:outline-none focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-500/5 transition-all"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-gray-300 text-2xl">원</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">현재 일반암 진단비</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={cancerAmt}
                  onChange={(e) => setCancerAmt(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-[2rem] py-7 px-8 text-2xl font-black focus:outline-none focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-500/5 transition-all"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-gray-300 text-2xl">원</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white font-black py-8 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(255,107,0,0.4)] transition-all mt-10 text-2xl flex items-center justify-center gap-4"
            >
              내 보험 다이어트 시작하기 (1분)
              <ChevronRight className="w-8 h-8" />
            </motion.button>

            <div className="grid grid-cols-2 gap-4 pt-12 border-t border-gray-50 mt-12">
              <button type="button" className="flex items-center justify-center gap-3 bg-white text-slate-900 py-6 rounded-2xl text-base font-black shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-orange-500 fill-current" />
                </div>
                카톡 문의
              </button>
              <button type="button" className="flex items-center justify-center gap-3 bg-white text-slate-900 py-6 rounded-2xl text-base font-black shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
                상담 예약
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;
