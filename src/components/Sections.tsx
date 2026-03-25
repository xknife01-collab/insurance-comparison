/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrendingUp, ShieldCheck, Clock, MessageCircle } from 'lucide-react';

export const ProblemSection = () => (
  <section className="py-24 bg-white px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">혹시 당신도 모르게 버려지는 돈이 있지는 않나요?</h2>
        <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <TrendingUp className="w-6 h-6 text-red-600" />,
            bg: 'bg-red-50 border-red-100',
            title: '국밥 세 그릇의 낭비',
            desc: <>보험료 15만 원 중 4만 원이 중복이라면? 당신은 매달 아무 이유 없이 <span className="font-bold text-red-600">국밥 세 그릇 값을 길바닥에 버리고 있는 셈</span>입니다.</>
          },
          {
            icon: <ShieldCheck className="w-6 h-6 text-orange-600" />,
            bg: 'bg-orange-50 border-orange-100',
            title: '지인이라서 가입한 보험',
            desc: <>미안해서 가입한 보험... <span className="font-bold text-orange-600">나중에 정말 아플 때 당신을 지켜줄 수 있을까요?</span> 이제는 데이터로 냉정하게 따져볼 때입니다.</>
          },
          {
            icon: <Clock className="w-6 h-6 text-orange-400" />,
            bg: 'bg-gray-900 text-white border-gray-800',
            title: '노후의 시한폭탄',
            desc: <>지금 3만 원인 갱신형 보험, 10년 뒤엔 15만 원이 될 수도 있습니다. <span className="font-bold text-white">노후의 시한폭탄</span>을 지금 확정 지출로 바꾸세요.</>
          }
        ].map((item, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border shadow-sm ${item.bg}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${item.bg === 'bg-gray-900 text-white border-gray-800' ? 'bg-white/10' : 'bg-white/50'}`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
            <p className="opacity-80 leading-relaxed text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const PhilosophySection = () => (
  <section className="py-24 bg-gray-50 overflow-hidden px-4">
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-xl relative border border-gray-100">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <ShieldCheck className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 leading-tight">
            "저는 보험을 팔지 않습니다.<br />
            당신의 <span className="text-orange-500">'안심'</span>을 설계합니다."
          </h2>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              저도 보험이 외계어처럼 어렵기만 했던 시절이 있었습니다. 하지만 제대로 된 보험 하나가 한 가정을 무너뜨리지 않는 든든한 버팀목이 된다는 것을 수많은 사례로 지켜봤습니다.
            </p>
            <p>
              어려운 경기 속에 여러분의 땀 묻은 돈이 보험사가 아닌 <span className="font-bold text-gray-900">여러분의 가족을 위해 쓰이도록</span>, 설계사의 양심을 걸고 정직하게 분석하겠습니다.
            </p>
          </div>

          <div className="mt-16 flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-3xl overflow-hidden shadow-lg transform -rotate-3">
              <img src="https://picsum.photos/seed/planner/200/200" alt="Planner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="font-black text-2xl tracking-tight">보험 분석가 김리치</p>
              <p className="text-gray-400 font-bold">인카금융서비스 공식 인증 설계사</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="bg-[#1A1A1A] text-white pt-24 pb-12 px-4 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
        <div className="max-w-sm">
          <p className="text-xs text-gray-500 font-bold mb-4 uppercase tracking-widest">무료 전화 상담 센터</p>
          <p className="text-5xl font-black text-white leading-none mb-8 tracking-tighter">080.808.1088</p>
          <div className="space-y-2 text-xs text-gray-500 font-bold">
            <p>고객센터 영업시간</p>
            <p>평일 09:00 - 18:00 / 주말 10:00 - 15:00</p>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
           {[1,2,3,4].map(i => (
             <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                <span className="text-[10px] text-gray-500 font-bold block mb-2">실시간 분석 현황</span>
                <span className="text-sm font-bold block mb-4">암보험 김**님</span>
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mx-auto animate-pulse"></div>
             </div>
           ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-12 text-[10px] text-gray-600 space-y-4 max-w-4xl opacity-60">
        <p>[ 필수안내사항 ]</p>
        <p>보험대리점 : 리치앤코 (등록번호 : 제2006038313호) 본 광고는 광고심의기준을 준수하였으며, 유효기간은 심의일로부터 1년입니다.</p>
        <p>보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결하는 과정에서 질병이력, 연령증가 등으로 가입이 거절되거나 보험료가 인상될 수 있습니다. 또한 해약환급금 손실이 발생할 수 있으니 유의하시기 바랍니다.</p>
        <p>© GoodRich Co., Ltd. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);
