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
    <section className="max-w-7xl mx-auto px-4 py-32 space-y-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">내 보험 정밀 분석</h2>
        <p className="text-gray-500 font-medium italic">"내가 이미 가입한 보험, 제대로 가입한 게 맞을까요?"</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: One-click Fetch */}
        <div className="bg-blue-50/50 rounded-[50px] p-12 md:p-16 border border-blue-100 flex flex-col justify-center min-h-[500px] relative group h-full">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 transform group-hover:scale-125 transition-transform">
             <Zap className="w-64 h-64 text-blue-600" />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-black text-blue-900 mb-6 flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Zap className="w-6 h-6 text-blue-600 fill-current" />
              </div>
              원클릭 내 보험 분석
            </h3>
            <p className="text-lg text-blue-700 font-bold mb-12 leading-relaxed max-w-md">
              따로 입력할 필요 없이 본인 인증 한 번으로<br/>
              모든 가입 내역을 실시간으로 불러옵니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleSocialFetch}
                className="flex-1 bg-[#FEE500] text-black py-6 rounded-[2rem] font-black text-lg shadow-sm hover:brightness-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-current" /> 카카오로 계산
              </button>
              <button 
                onClick={handleSocialFetch}
                className="flex-1 bg-[#03C75A] text-white py-6 rounded-[2rem] font-black text-lg shadow-sm hover:brightness-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="font-serif italic text-2xl leading-none">N</span> 네이버로 계산
              </button>
            </div>
          </div>
        </div>

        {/* Right: Direct Input */}
        <div className="bg-white rounded-[50px] p-12 md:p-16 border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] h-full">
          <div className="mb-12">
            <h3 className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                 <Calculator className="w-6 h-6 text-gray-400" />
              </div>
              직접 입력 분석
            </h3>
            <p className="text-lg text-gray-500 font-bold italic">정확한 요율 계산을 위해 정보를 알려주세요.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Age & Gender Group */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] pl-2">나이</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-3xl py-6 px-8 text-2xl font-black focus:outline-none focus:ring-4 focus:ring-orange-500/10 shadow-inner group-hover:bg-white transition-all"
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-gray-300 text-2xl">세</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] pl-2">성별</label>
                <div className="flex bg-gray-50 p-1 rounded-3xl border border-gray-100 h-[72.5px]">
                  <button 
                    type="button"
                    onClick={() => setGender('M')}
                    className={`flex-1 rounded-2xl font-black text-lg transition-all ${gender === 'M' ? 'bg-white shadow-md text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    남성
                  </button>
                  <button 
                    type="button"
                    onClick={() => setGender('F')}
                    className={`flex-1 rounded-2xl font-black text-lg transition-all ${gender === 'F' ? 'bg-white shadow-md text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    여성
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] pl-2">현재 총 월 보험료</label>
              <div className="relative group">
                <input 
                  type="number" 
                  value={premium}
                  onChange={(e) => setPremium(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl py-6 px-8 text-2xl font-black focus:outline-none focus:ring-4 focus:ring-orange-500/10 shadow-inner group-hover:bg-white transition-all"
                  placeholder="200,000"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-gray-300 text-2xl">원</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] pl-2">현재 일반암 진단비</label>
              <div className="relative group">
                <input 
                  type="number" 
                  value={cancerAmt}
                  onChange={(e) => setCancerAmt(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl py-6 px-8 text-2xl font-black focus:outline-none focus:ring-4 focus:ring-orange-500/10 shadow-inner group-hover:bg-white transition-all"
                  placeholder="30,000,000"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-gray-300 text-2xl">원</span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-orange-500 text-white font-black py-7 rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(255,165,0,0.5)] hover:bg-orange-600 transition-all transform hover:-translate-y-1 mt-8 text-xl flex items-center justify-center gap-3"
            >
              내 보험 다이어트 시작하기 (1분)
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-2 gap-4 pt-10 border-t border-gray-50 mt-6">
              <button type="button" className="flex items-center justify-center gap-2 bg-white text-gray-500 py-5 rounded-2xl text-sm font-black shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
                <MessageCircle className="w-5 h-5 text-orange-400" /> 카톡 문의
              </button>
              <button type="button" className="flex items-center justify-center gap-2 bg-white text-gray-500 py-5 rounded-2xl text-sm font-black shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
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
