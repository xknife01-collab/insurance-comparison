import React from 'react';
import { Stethoscope, Search, ShieldCheck, Activity, ChevronRight } from 'lucide-react';

export const PreExistingDetailedGuide: React.FC = () => {
  return (
    <div className="mt-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-indigo-900 rounded-[3rem] p-12 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50"></div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-indigo-400 font-black text-sm uppercase tracking-[0.4em]">유병자 보험 가이드</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            아파도 걱정 마세요.<br /><span className="text-indigo-400">더 쉽고 저렴하게.</span>
          </h2>
          <p className="text-indigo-200 font-bold max-w-2xl mx-auto leading-relaxed">
            고혈압, 당뇨부터 최근 수술 이력까지. 복잡한 3.3.5, 3.5.5 숫자의 비밀을 전문가가 쉽게 풀어드립니다.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-xl group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg">
              <Stethoscope size={32} />
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-black tracking-widest">GUIDE 01</p>
              <h3 className="text-2xl font-black text-gray-900">3.X.5 시스템 정복</h3>
            </div>
          </div>
          
          <div className="bg-indigo-50/50 p-10 rounded-[3rem] border border-indigo-100 mb-8">
             <p className="text-sm font-black text-indigo-600 mb-6 flex items-center gap-2">
               <Search size={18} /> 3.X.5 숫자의 의미
             </p>
             <div className="grid grid-cols-3 gap-6 text-center">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                   <p className="text-3xl font-black text-indigo-600">3</p>
                   <p className="text-xs font-bold text-gray-400 mt-2">3개월 내</p>
                   <p className="text-[10px] text-gray-500 mt-1">입원/수술 소견</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 ring-2 ring-indigo-500/20">
                   <p className="text-3xl font-black text-indigo-600">X</p>
                   <p className="text-xs font-bold text-gray-400 mt-2">X년 내</p>
                   <p className="text-[10px] text-gray-500 mt-1">질병 입원/수술</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                   <p className="text-3xl font-black text-indigo-600">5</p>
                   <p className="text-xs font-bold text-gray-400 mt-2">5년 내</p>
                   <p className="text-[10px] text-gray-500 mt-1">암 진단/입원/수술</p>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            {[
              { title: '3.0.5 (초간편)', desc: 'X가 0! 누구나 즉시 가입 가능' },
              { title: '3.5.5 (초저가)', desc: '일반 보험 수준의 저렴한 보험료' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-black text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400 font-bold">{item.desc}</p>
                </div>
                <ChevronRight className="text-indigo-300" size={20} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
             <Activity size={200} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-indigo-900 shadow-xl">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <p className="text-sm text-indigo-300 font-black tracking-widest">GUIDE 02</p>
                  <h3 className="text-2xl font-black">가입 전 필수 체크리스트</h3>
                </div>
              </div>
              <div className="space-y-10">
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">1</div>
                    <div>
                       <p className="text-xl font-black mb-2">높은 숫자부터 공략</p>
                       <p className="text-sm opacity-60 font-bold leading-relaxed">
                         3.5.5부터 심사를 넣어보는 것이 보험료를 30% 이상 아끼는 비결입니다.
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">2</div>
                    <div>
                       <p className="text-xl font-black mb-2">계약 전환권 확보</p>
                       <p className="text-sm opacity-60 font-bold leading-relaxed">
                         건강해지면 더 저렴한 등급으로 갈아탈 수 있는 '전환 기능'이 필수입니다.
                       </p>
                    </div>
                 </div>
              </div>
              <div className="mt-16 p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-md">
                 <p className="text-indigo-400 font-black text-sm mb-2 uppercase tracking-widest">💡 전문가의 한 마디</p>
                 <p className="text-white font-bold text-sm leading-relaxed tracking-tight">
                   "단순 약 복용은 가입 거절 사유가 아닙니다. 미리 포기하지 마세요."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
