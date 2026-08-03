import React from 'react';
import { Hotel, HeartHandshake, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export const CaregivingDetailedGuide: React.FC = () => {
  return (
    <div className="mt-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-purple-900 rounded-[3rem] p-12 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-50"></div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-purple-400 font-black text-sm uppercase tracking-[0.4em]">간병인 걱정 끝</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            자녀에게 짐이 되지 않는 노후,<br />간병 서비스 보험 트렌드
          </h2>
          <p className="text-purple-200 font-bold max-w-2xl mx-auto leading-relaxed">
            하늘의 별 따기보다 힘들다는 간병인 구하기. 보험사가 직접 보내주는 '지원형'과 현금으로 받는 '사용형'을 완벽 비교해 드립니다.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white rounded-[4rem] p-12 border border-purple-100 shadow-lg group">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Hotel size={28} />
            </div>
            <div>
              <p className="text-xs text-purple-600 font-black tracking-widest">CARE TYPE 01</p>
              <h4 className="text-2xl font-black text-gray-900">간병인 지원형 (파견)</h4>
            </div>
          </div>
          <div className="bg-purple-50 p-8 rounded-[2.5rem] border border-purple-100 mb-6">
            <p className="font-black text-purple-700 mb-2">✅ 보험사가 직접 파견합니다</p>
            <p className="text-sm text-gray-600 font-bold leading-relaxed">
              48시간 전 신청 시 보험사 제휴 업체에서 간병인을 직접 파견합니다. 인건비가 아무리 올라도 추가 비용이 없다는 것이 최대 장점입니다.
            </p>
          </div>
          <ul className="space-y-4 px-4 text-sm font-bold text-gray-500">
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              인건비 상승(물가) 리스크 제로
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              직접 구해야 하는 스트레스 해소
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl group">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-900 shadow-xl">
              <HeartHandshake size={28} />
            </div>
            <div>
              <p className="text-xs text-purple-300 font-black tracking-widest">CARE TYPE 02</p>
              <h4 className="text-2xl font-black">간병인 사용형 (현금)</h4>
            </div>
          </div>
          <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 mb-6">
            <p className="font-black text-purple-200 mb-2">✅ 현금 일당으로 돌려받습니다</p>
            <p className="text-sm opacity-80 font-bold leading-relaxed">
              내가 원하는 간병인을 고용하거나 가족이 간병해도 일당(15만원 등)을 현금으로 지급받습니다. 비갱신형 가입이 가능해 경제적입니다.
            </p>
          </div>
          <ul className="space-y-4 px-4 text-sm font-bold opacity-70">
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-purple-300 rounded-full"></div>
              가족 간병 시에도 보험금 수령 가능
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-purple-300 rounded-full"></div>
              비갱신형 가입 시 보험료 인상 걱정 없음
            </li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm space-y-4">
          <h5 className="font-black flex items-center gap-2 text-gray-900"><Sparkles className="text-purple-500" size={18} /> 체증형 필수!</h5>
          <p className="text-xs font-bold text-gray-400 leading-relaxed">
            5년/10년마다 보장 금액이 늘어나는 특약입니다. 미래의 고물가와 인건비를 감당하기 위한 2024년 필수 선택 사항입니다.
          </p>
        </div>
        <div className="p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm space-y-4">
          <h5 className="font-black flex items-center gap-2 text-gray-900"><UserCheck className="text-purple-500" size={18} /> 요양병원 한도</h5>
          <p className="text-xs font-bold text-gray-400 leading-relaxed">
            일반 병원과 요양병원의 보상 금액이 다를 수 있습니다. 치매 등이 걱정된다면 요양병원 한도가 높은 상품이 유리합니다.
          </p>
        </div>
        <div className="p-10 bg-purple-600 rounded-[3rem] shadow-xl text-white space-y-4">
          <h5 className="font-black flex items-center gap-2"><ShieldCheck size={18} /> 전문가 전략</h5>
          <p className="text-xs font-bold opacity-80 leading-relaxed">
            부모님께는 '지원형'을, 4050 활동기 고객님께는 미래 인건비를 대비한 '사용형 체증 플랜'을 강력 추천합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
