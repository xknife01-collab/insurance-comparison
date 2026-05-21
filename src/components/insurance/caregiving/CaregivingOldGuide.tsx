import React from 'react';
import { motion } from 'framer-motion';
import { Brain, HeartHandshake, ShieldCheck, AlertCircle, Users, ClipboardCheck, TrendingUp, Info } from 'lucide-react';

export const CaregivingOldGuide: React.FC = () => {
  return (
    <div className="mt-20 space-y-24">
      {/* Introduction Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-50 text-amber-700 rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] border border-amber-100 shadow-sm">
          <Info size={14} className="text-amber-500" /> Premium Care Guide
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
          치매·간병 보험, <span className="text-amber-600">왜</span> 준비해야 할까요?
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-500 font-medium leading-relaxed">
          치매는 본인보다 남겨진 가족의 삶을 무너뜨리는 질병입니다.<br />
          준비된 경제적 자산은 가족에게 줄 수 있는 마지막 배려입니다.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { 
            icon: <Users className="text-amber-500" />, 
            title: "환자 100만 명 시대", 
            value: "10명 중 1명", 
            desc: "2026년 기준 65세 이상 노인 10명 중 1명은 치매를 앓고 있습니다." 
          },
          { 
            icon: <TrendingUp className="text-rose-500" />, 
            title: "연간 관리 비용", 
            value: "3,100만 원", 
            desc: "시설 입소 시 발생하는 평균 비용으로, 매년 인건비에 따라 상승합니다." 
          },
          { 
            icon: <Brain className="text-blue-500" />, 
            title: "생존 기간", 
            value: "평균 10.3년", 
            desc: "완치가 어려운 질병의 특성상 장기간의 경제적 지원이 필수적입니다." 
          },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.03)] space-y-6"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shadow-inner">
              {stat.icon}
            </div>
            <div className="space-y-2">
              <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">{stat.title}</p>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Knowledge Section */}
      <div className="bg-slate-900 rounded-[4rem] p-10 md:p-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">
                어려운 치매 보험 용어,<br />
                <span className="text-amber-400">딱 2가지만</span> 기억하세요.
              </h3>
              <p className="text-slate-400 font-medium">가입 전 이것만 알아도 평생 후회하지 않습니다.</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
                  <ClipboardCheck size={24} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white">CDR 척도 (임상치매척도)</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    보험금 지급의 기준입니다. **경증(1점)**부터 보장되는지 반드시 확인하세요. 경증 환자 비율이 압도적으로 높습니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
                  <HeartHandshake size={24} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white">재가급여 vs 시설급여</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    집에서 케어(재가)할지, 요양원(시설)에 모실지를 결정합니다. 최근에는 집에 머물며 지원받는 **재가급여** 상품이 대세입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "CDR 1점", desc: "경증 (기억력 저하)", color: "bg-green-500" },
              { label: "CDR 2점", desc: "중등도 (일상 장애)", color: "bg-amber-500" },
              { label: "CDR 3점", desc: "중증 (24시간 돌봄)", color: "bg-orange-500" },
              { label: "CDR 4-5점", desc: "심각 (말기 상태)", color: "bg-rose-500" },
            ].map((level, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                <div className={`w-3 h-3 rounded-full ${level.color} shadow-lg shadow-black/20`} />
                <div>
                  <p className="text-lg font-black text-white tracking-tight">{level.label}</p>
                  <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest">{level.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Tip Section */}
      <div className="bg-amber-50 rounded-[3rem] p-10 md:p-16 border border-amber-100 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-amber-600 shadow-xl shadow-amber-200/50">
            <ShieldCheck size={32} />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">지정대리청구인 제도</h3>
            <p className="text-lg text-amber-900/60 font-bold italic tracking-tight">"가입하고도 못 받는 일을 막으려면?"</p>
          </div>
        </div>
        <div className="space-y-6 bg-white p-10 rounded-[2.5rem] shadow-sm border border-amber-100">
          <div className="flex gap-4">
            <AlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-sm font-medium text-gray-700 leading-relaxed">
              치매에 걸리면 본인이 스스로 보험금을 청구할 수 없습니다. 이 때문에 가입 시 반드시 **배우자나 자녀를 대리청구인**으로 지정해두어야 나중에 문제없이 보험금을 받을 수 있습니다.
            </p>
          </div>
          <div className="h-px bg-amber-50 w-full" />
          <p className="text-[0.65rem] font-black text-amber-600 uppercase tracking-[0.2em] text-center">
            가입 시 잊지 말고 꼭 체크하세요!
          </p>
        </div>
      </div>
    </div>
  );
};
