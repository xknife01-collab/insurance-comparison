import React from 'react';
import { motion } from 'motion/react';

const ComparisonSection = () => {
  return (
    <section 
      className="relative bg-slate-900 bg-cover bg-center pt-32 pb-40 md:pt-40 md:pb-52 overflow-hidden"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Dark overlay to ensure readable text on the left while keeping the woman visible on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-2xl text-left space-y-6">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-400 font-black text-sm uppercase tracking-wider"
          >
            위로와 신뢰를 드리는 보험 분석 서비스
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.25] tracking-tight"
          >
            어려운 경기, 가장 먼저 줄여야 할 것은<br />
            생활비가 아니라 <span className="text-orange-400 underline decoration-orange-400/40 decoration-4 underline-offset-8">내 통장에서 새나가는 보험료</span>입니다.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base md:text-xl leading-relaxed font-medium"
          >
            "보험을 잘 몰라도 괜찮습니다. 당신의 소중한 자산이 1원이라도 헛되이 쓰이지 않게,<br className="hidden md:block" />
            <span className="font-bold text-white">진심을 다하는 보험 분석가</span>가 당신의 곁을 지킵니다."
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
