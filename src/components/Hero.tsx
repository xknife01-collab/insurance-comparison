/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

const Hero = () => (
  <section className="relative bg-[#FFF9F2] pt-24 pb-48 overflow-hidden">
    <div className="absolute top-10 left-[10%] w-8 h-8 bg-yellow-400 rounded-full shadow-lg animate-bounce" />
    <div className="absolute top-40 right-[15%] w-10 h-10 bg-yellow-400 rounded-full shadow-lg animate-pulse" />
    <div className="absolute bottom-20 left-[20%] w-6 h-6 bg-yellow-400 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '1s' }} />

    <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-orange-500 font-bold mb-6 text-lg"
      >
        위로와 신뢰를 드리는 보험 분석 서비스
      </motion.p>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight px-4"
      >
        어려운 경기, 가장 먼저 줄여야 할 것은<br />
        생활비가 아니라 <span className="text-orange-500">내 통장에서 새나가는 보험료</span>입니다.
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed px-4"
      >
        보험을 잘 몰라도 괜찮습니다. 당신의 소중한 자산이 1원이라도 헛되이 쓰이지 않게,<br />
        <span className="font-bold text-gray-900">진심을 다하는 보험 분석가</span>가 당신의 곁을 지킵니다.
      </motion.p>
    </div>
  </section>
);

export default Hero;
