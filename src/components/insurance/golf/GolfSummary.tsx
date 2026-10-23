import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, CheckCircle2, Flag, Star, AlertCircle, Users } from 'lucide-react';

interface Props {
  result: {
    scores: {
      holeInOneScore: number;
      liabilityScore: number;
      equipmentScore: number;
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const GolfSummary: React.FC<Props> = ({ result }) => {
  const { scores, efficiency, deficiencies } = result;
  const { analysis } = result;
  const golfOpts = analysis?.golf || {
    gameType: 'amateur',
    planType: 'annual',
    durationDays: 365,
    isGroup: false,
    companionNames: [],
    hasHoleInOneRider: true,
    hasLiabilityRider: true,
    hasEquipmentRider: true,
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-12">
      {/* 1. Header: Golf Coverage Summary */}
      <div className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
          <Flag size={200} className="text-emerald-500" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Flag size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {golfOpts.gameType === 'amateur' ? '아마추어 골퍼' : '프로 골퍼 / 레슨 지도자'} 맞춤 설계 상태
              </h3>
              <p className="text-xs font-bold text-slate-400">
                {golfOpts.planType === 'one_day' ? `원데이 플랜 (${golfOpts.durationDays}일 가입)` : '연간 패키지 플랜 (365일 가입)'}
                {golfOpts.isGroup ? ' · 4인 동반 단체 할인 적용' : ' · 1인 단독 가입'}
              </p>
            </div>
          </div>

          {/* 골퍼 자격 안내 인포 */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-black text-emerald-800">
                {golfOpts.gameType === 'professional' ? '프로 선수 보장 안내' : '필드 내 보장 점검'}
              </p>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                {golfOpts.gameType === 'professional' ? (
                  <span>프로 자격 특성 상 <span className="text-rose-500 font-black">홀인원 축하비 및 골프용품 특약 가입이 제한</span>됩니다. 상해 사망 및 타구 배상책임 보장 위주로 확인해 주세요.</span>
                ) : (
                  <span>필드 타구 사고나 슬라이스로 인한 캐디/동반자 상해 사고 대비를 위해 <span className="text-emerald-600 font-black">배상책임 특약</span> 가입 상태를 확인해 주세요.</span>
                )}
              </p>
            </div>
          </div>

          {/* 세부 점수 리스트 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            {[
              { label: '홀인원 보장', targetId: 'input-golf-fields', val: golfOpts.gameType === 'professional' ? '보장 제외' : (golfOpts.hasHoleInOneRider ? '가입 완료' : '미보장'), status: golfOpts.hasHoleInOneRider ? '가입' : '미가입' },
              { label: '경기 배상책임', targetId: 'input-golf-fields', val: golfOpts.hasLiabilityRider ? '가입 완료' : '미보장', status: golfOpts.hasLiabilityRider ? '가입' : '미가입' },
              { label: '용품 파손/도난', targetId: 'input-golf-fields', val: golfOpts.gameType === 'professional' ? '보장 제외' : (golfOpts.hasEquipmentRider ? '가입 완료' : '미보장'), status: golfOpts.hasEquipmentRider ? '가입' : '미가입' },
              { label: '단체 동반 혜택', targetId: 'input-golf-fields', val: golfOpts.isGroup ? '5% 할인대상' : '할인 미적용', status: golfOpts.isGroup ? '할인' : '일반' },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => scrollToInputAndHighlight((item as any).targetId)}
                className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center gap-2 group hover:border-emerald-300 hover:shadow-sm cursor-pointer transition-all duration-300"
              >
                <div className="flex justify-between items-center w-full">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${item.status === '가입' || item.status === '할인' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{item.status}</span>
                </div>
                <p className="text-sm font-black text-slate-800">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 부족한 보장 공백 안내 */}
      {deficiencies.length > 0 && (
        <div className="bg-rose-50/50 border border-rose-100 rounded-[2.5rem] p-8 md:p-10 space-y-4">
          <h4 className="text-base font-black text-rose-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-rose-500 fill-rose-500" />
            진단된 보장 공백 ({deficiencies.length}건)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deficiencies.map((def, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-rose-100/50">
                <span className="w-2 h-2 bg-rose-500 rounded-full shrink-0" />
                <span className="text-xs font-bold text-slate-700">{def}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 진단 참고 안내 */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-400 font-medium leading-relaxed">
        * 상기 점수 및 보장 분석 결과는 입력하신 경기 유형과 선택 담보에 따른 예시이며, 실제 보상 여부 및 세부 보상 기준은 해당 상품의 약관에 따릅니다.
      </div>
    </div>
  );
};
