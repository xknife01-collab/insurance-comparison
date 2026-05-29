import React from 'react';
import { motion } from 'motion/react';

const ComparisonSection = () => {
  return (
    <section className="relative bg-[#FAF9F5] pt-24 pb-20 overflow-hidden">
      {/* Clean, sophisticated background blur elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-yellow-50/50 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text (7 cols) */}
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-orange-500 font-black text-sm uppercase tracking-wider"
            >
              위로와 신뢰를 드리는 보험 분석 서비스
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.3] tracking-tight"
            >
              어려운 경기, 가장 먼저 줄여야 할 것은<br />
              생활비가 아니라 <span className="text-orange-500 inline-block border-b-4 border-orange-500/20">내 통장에서 새나가는 보험료</span>입니다.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 text-base md:text-lg leading-relaxed font-medium"
            >
              "보험을 잘 몰라도 괜찮습니다. 당신의 소중한 자산이 1원이라도 헛되이 쓰이지 않게,<br className="hidden md:block" />
              <span className="font-bold text-slate-900">진심을 다하는 보험 분석가</span>가 당신의 곁을 지킵니다."
            </motion.p>
          </div>

          {/* Right Column: Premium Image Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 aspect-[16/10] lg:aspect-[4/3] w-full"
            >
              <img 
                src="/hero.jpg" 
                alt="Sophisticated woman using laptop" 
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Floating dynamic badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-3xl p-5 shadow-xl border border-slate-100 hidden md:flex items-center gap-4 max-w-[280px]"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-bold">실시간 맞춤 분석</p>
                <p className="text-sm font-black text-slate-800">평균 15분 이내 진단</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
