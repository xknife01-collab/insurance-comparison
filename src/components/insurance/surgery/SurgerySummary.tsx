import React from 'react';
import { ShieldCheck, Activity, Users, Bed, Zap, CheckCircle2, Info, Star, Shield, Stethoscope, Hospital } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';

export const SurgerySummary = ({ result }: { result: AnalysisResult }) => {
  const { analysis } = result;
  
  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-400 rounded-[4.5rem] p-12 md:p-24 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(255,107,0,0.3)]">
        <div className="absolute top-0 right-0 p-24 opacity-10 rotate-12 scale-150">
          <Activity size={350} />
        </div>
        <div className="relative z-10 space-y-10">
          <div className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 backdrop-blur-xl rounded-full text-[0.75rem] font-black uppercase tracking-[0.4em] shadow-lg">
            제 2의 건강보험, 수술·입원 완벽 가이드
          </div>
          <div className="space-y-4">
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
                수술비의 모든 것,<br/><span className="text-orange-900/30">한눈에 분석해 드립니다.</span>
             </h2>
          </div>
          <p className="text-xl md:text-2xl font-bold opacity-90 leading-relaxed max-w-3xl">
            대한민국 4,000만 명이 가입한 국민 보험 실손의 완벽한 파트너.<br/>
            복잡한 종별 수술 분류와 간병 옵션 뒤에 숨겨진 <span className="underline underline-offset-8 decoration-white/30 decoration-4">진짜 혜택</span>을 전문가가 직접 정리했습니다.
          </p>
          <div className="pt-6 flex flex-wrap gap-4">
             <div className="px-6 py-3 bg-black/20 rounded-2xl flex items-center gap-3">
                <CheckCircle2 size={20} className="text-orange-200" />
                <span className="text-sm font-black italic">전 보험사 최신 요율 반영 완료</span>
             </div>
          </div>
        </div>
      </section>

      {/* CONTENT 01: 핵심 보장 */}
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-[4rem] p-16 border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_40px_80px_-20px_rgba(255,107,0,0.1)] group">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center text-orange-600 group-hover:rotate-[360deg] transition-all duration-1000 shadow-xl shadow-orange-50">
              <Activity size={36} />
            </div>
            <div>
              <p className="text-[0.7rem] font-black text-orange-400 tracking-[0.3em] uppercase mb-1.5 opacity-60">CONTENT 01</p>
              <h4 className="text-3xl font-black text-slate-800 tracking-tight italic">수술비 핵심 보장</h4>
            </div>
          </div>
          <div className="space-y-10">
            <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                 <Hospital size={80} />
              </div>
              <p className="font-black text-xl text-slate-800 mb-4 flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span> 🏥 급여 (공통 치료)
              </p>
              <p className="text-base font-bold text-slate-500 leading-relaxed pl-4">
                국민건강보험이 적용되는 항목으로, 실제 병원비에서 자기부담금을 제외한 금액을 보상합니다. (입원, 외래, 처방조제 포함)
              </p>
            </div>
            <div className="p-8 bg-orange-50/30 rounded-[2.5rem] border border-orange-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                 <Star size={80} />
              </div>
              <p className="font-black text-xl text-orange-600 mb-4 flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-orange-600 rounded-full inline-block"></span> ⭐ 비급여 (특화 치료)
              </p>
              <p className="text-base font-bold text-slate-600 leading-relaxed pl-4">
                건강보험이 적용되지 않아 부담이 큰 도수치료, 비급여 주사료, MRI/MRA 등을 중점 보장합니다. 수술 가입의 핵심입니다.
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT 02: 필수 체크 용어 */}
        <div className="bg-slate-900 rounded-[4rem] p-16 text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute bottom-0 right-0 p-12 opacity-5 scale-125">
            <Bed size={200} />
          </div>
          <div className="relative z-10">
            <p className="text-[0.7rem] font-black text-orange-400 tracking-[0.3em] uppercase mb-1.5 opacity-60">CONTENT 02</p>
            <h4 className="text-3xl font-black mb-12 tracking-tight italic">3대 필수 체크 용어</h4>
            <div className="space-y-8">
              {[
                { n: '1', t: '자기부담금 (Deductible)', d: '치료비 전액이 아닌, 본인이 부담해야 하는 20~30%의 최소 비율입니다.' },
                { n: '2', t: '갱신 및 재가입 주기', d: '가 수술비 담보는 100% 갱신형이며, 가입 시기에 따라 1~5년 주기로 조건이 변경됩니다.' },
                { n: '3', t: '고지의무 (계약 전 알릴 의무)', d: '5년 내 큰 질환이나 1년 내 추가 검사 소견 등을 정확히 밝혀야 보장이 취소되지 않습니다.' },
              ].map((p, idx) => (
                <div key={idx} className="flex gap-8 p-6 hover:bg-white/5 rounded-[2rem] transition-all border border-transparent hover:border-white/10 group/item">
                  <span className="text-5xl font-black text-orange-500/20 group-hover/item:text-orange-500 transition-colors duration-500">{p.n}</span>
                  <div>
                    <p className="text-xl font-black text-orange-400 mb-2">{p.t}</p>
                    <p className="text-base font-bold opacity-50 leading-relaxed">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expert Tip Area */}
      <div className="p-16 bg-white rounded-[4.5rem] border border-orange-100 shadow-[0_50px_100px_-30px_rgba(255,107,0,0.15)] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
        <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0 animate-bounce shadow-2xl shadow-orange-200">
           <Zap size={44} fill="white" />
        </div>
        <div className="space-y-4">
           <p className="text-2xl font-black text-slate-800 tracking-tight">💡 전문가의 핵심 팁</p>
           <p className="text-xl md:text-2xl font-bold text-slate-500 italic leading-relaxed">
             "실물 카드가 아닌 <span className="text-slate-900 underline underline-offset-4 decoration-orange-500/30 decoration-4">'모바일 앱'</span> 청구가 가능한지 확인하세요. 소액 통원비는 그때그때 청구하는 것이 보장을 가장 똑똑하게 활용하는 방법입니다."
           </p>
        </div>
      </div>

      {/* Market Segments Section */}
      <div className="grid md:grid-cols-3 gap-10">
         {[
           { t: '대형 보험사 (S사, H사)', d: '전국적인 서비스망과 빠른 보험금 지급 심사가 최대 강점입니다. 갱신 연령이 높아져도 자금력이 풍부해 안정적인 운영이 가능합니다.', icon: Shield },
           { t: '다이렉트 전용 (D사, M사)', d: '설계사 수수료가 빠져 있어 동일 보장 대비 월 보험료가 15~20% 저렴합니다. 합리적인 소비를 지향하는 젊은 층에 적합합니다.', icon: Zap },
           { t: '4세대 착한 통합보장', d: '가장 최신 트렌드로, 병원을 자주 안 가면 보험료를 깎아주고 병원 방문이 매우 잦으면 할증되는 합리적인 구조입니다.', icon: Stethoscope },
         ].map((m, i) => (
           <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                 <m.icon size={24} />
              </div>
              <h5 className="text-xl font-black text-slate-800 mb-4">{m.t}</h5>
              <p className="text-sm font-bold text-slate-500 leading-relaxed">{m.d}</p>
           </div>
         ))}
      </div>

      <div className="text-center py-10">
         <p className="text-3xl font-black text-slate-200 tracking-tighter italic">"보장은 건강할 때 준비해야 하는 진입장벽이 가장 높은 자산입니다."</p>
      </div>
    </div>
  );
};
