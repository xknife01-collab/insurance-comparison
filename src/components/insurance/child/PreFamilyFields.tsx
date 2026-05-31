import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Calendar, ShieldAlert, Sparkles, Activity, Clock, ShieldCheck } from 'lucide-react';

interface PreFamilyFieldsProps {
  illnessType: string;
  setIllnessType: (type: string) => void;
  noAccidentYears: '0' | '2' | '3' | '5';
  setNoAccidentYears: (years: '0' | '2' | '3' | '5') => void;
  maturity: 30 | 100;
  setMaturity: (maturity: 30 | 100) => void;
}

export const PreFamilyFields: React.FC<PreFamilyFieldsProps> = ({
  illnessType,
  setIllnessType,
  noAccidentYears,
  setNoAccidentYears,
  maturity,
  setMaturity
}) => {
  const illnessTips: Record<string, { title: string; text: string; badge: string }> = {
    adhd: {
      title: 'ADHD(주의력 결핍) 집중 컨설팅',
      text: '정신과 약을 장기 복용 중이거나 정기 상담을 받더라도, 최근 3개월 이내에 추가 검사(재검사)나 수술 소견이 없다면 암, 뇌, 심장 3대 진단비를 심사 서류 없이 100% 통과할 수 있습니다.',
      badge: '약물 복용 중 가입 가능'
    },
    development: {
      title: '발달지연 (언어·미술·놀이치료) 안심 플랜',
      text: '일반 어린이보험은 심사에서 100% 거절되는 가장 빈번한 질환입니다. 하지만 간편 고지를 사용하면 3개월 소견 통과 시 뇌/심장 진단비와 수술비 한도를 동일하게 확보할 수 있습니다.',
      badge: '발달지연 치료 중 인수 통과'
    },
    puberty: {
      title: '성조숙증 (호르몬 조사 치료)',
      text: '호르몬 억제 주사를 주기적으로 맞고 계시더라도, 의사의 추가 소견이 없다면 할증이나 인과관계 부담보 없이 전사 가입 가능한 맞춤 특약 매칭이 가능합니다.',
      badge: '부담보 없음'
    },
    asthma: {
      title: '소아 천식 / 급성 아토피 케어',
      text: '잦은 외래 통원 및 연고/흡입기 처방 이력이 있더라도 3개월 내 급성 입원 사실이 없다면 메리츠/현대 등의 간편 3.5.5 플랜으로 깔끔하게 승인됩니다.',
      badge: '할증 최소화'
    },
    fracture: {
      title: '단순 사고 / 골절 및 깁스 수술',
      text: '최근 1년 이내에 깁스나 핀 고정 수술을 했더라도 3개월 이내 추가 진료 소견이 끝나셨다면 별도 심사 서류 없이 모바일 간편 심사로 1분 만에 가입 승인됩니다.',
      badge: '서류 제출 면제'
    },
    etc: {
      title: '기타 만성 질환 / 약 복용',
      text: '이 외의 소아 만성 질환이나 주기적인 약 복용이 있더라도, 암/뇌/심 간편 심사 질문(3개월 소견 / 5년 중대질환)에 해당하지 않으면 바로 가입 가능합니다.',
      badge: '간편 고지 프리패스'
    }
  };

  return (
    <div className="space-y-10 text-left max-w-4xl mx-auto py-8">
      
      {/* 1. 우리아이 병력 유형 선택 */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h4 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <Stethoscope className="text-blue-500 w-6 h-6" /> 우리아이 맞춤 병력을 체크해 주세요 (인수 우대)
        </h4>
        <p className="text-xs font-bold text-slate-400 mb-6 ml-8">실제 현장에서 가장 많이 거절당하지만 간편 고지로 100% 승인되는 대표 질환군입니다.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { id: 'development', label: '발달지연 / 놀이치료' },
            { id: 'adhd', label: 'ADHD / 소아 우울' },
            { id: 'puberty', label: '성조숙증 / 성장호르몬' },
            { id: 'asthma', label: '소아 천식 / 아토피' },
            { id: 'fracture', label: '골절 / 깁스 수술' },
            { id: 'etc', label: '기타 질환 / 약 복용' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setIllnessType(item.id)}
              className={`p-5 rounded-[1.8rem] border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2
                ${illnessType === item.id 
                  ? 'border-blue-500 bg-blue-50/20 text-blue-600 shadow-sm scale-102 font-black' 
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 text-slate-500 font-bold'}`}
            >
              <span className="text-sm text-center">{item.label}</span>
            </button>
          ))}
        </div>

        {/* 안내 문구 애니메이션 */}
        <AnimatePresence mode="wait">
          {illnessType && illnessTips[illnessType] && (
            <motion.div
              key={illnessType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-6 bg-blue-50/30 border border-blue-100/50 rounded-[2rem] flex items-start gap-4"
            >
              <Sparkles className="text-blue-500 shrink-0 w-6 h-6 mt-1" />
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-slate-800 text-base">{illnessTips[illnessType].title}</span>
                  <span className="text-[10px] font-black bg-blue-500 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {illnessTips[illnessType].badge}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 leading-relaxed mt-2">
                  {illnessTips[illnessType].text}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. 무사고 연수 슬라이더 (N값 설정) */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h4 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <Activity className="text-blue-500 w-6 h-6" /> 무사고(입원/수술 없는) 기간을 입력해 주세요
        </h4>
        <p className="text-xs font-bold text-slate-400 mb-6 ml-8">최근 입원이나 수술 이력이 없는 기간이 길수록 건강체 할인이 적용되어 보험료가 급격히 하락합니다.</p>
        
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-[1.8rem] border border-slate-100">
            {[
              { val: '0', label: '0년 (3.0.5)', desc: '치료 종결 즉시' },
              { val: '2', label: '2년 (3.2.5)', desc: '경증 병력자' },
              { val: '3', label: '3년 (3.3.5)', desc: '안정기 진입' },
              { val: '5', label: '5년 (3.5.5)', desc: '최대 25% 할인' }
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setNoAccidentYears(item.val as any)}
                className={`flex-1 py-4 px-3 rounded-[1.5rem] text-center transition-all duration-300 flex flex-col items-center justify-center gap-1
                  ${noAccidentYears === item.val
                    ? 'bg-blue-500 text-white shadow-md font-black scale-102'
                    : 'text-slate-400 hover:text-slate-600 font-bold'}`}
              >
                <span className="text-sm">{item.label}</span>
                <span className="text-[9px] opacity-75">{item.desc}</span>
              </button>
            ))}
          </div>

          <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-3.5">
            <ShieldCheck className="text-emerald-500 shrink-0 w-6 h-6" />
            <div className="text-left">
              <span className="text-xs font-black text-emerald-800">
                {noAccidentYears === '5' 
                  ? '🏆 초우량 간편 3.5.5 플랜 적용! 표준체와 겨우 8% 내외 가격차로 최적 가입 가능합니다.' 
                  : noAccidentYears === '3'
                  ? '✨ 간편 3.3.5 실속 할인 적용! 보험료 할증폭이 15% 이내로 줄어듭니다.'
                  : noAccidentYears === '2'
                  ? '👍 간편 3.2.5 기본 인수 보장 플랜 적용! 심사 서류 없이 모바일 프리패스가 작동합니다.'
                  : '⚠️ 3.0.5 초간편 가입 적용! 과거 입원/수술 이력과 무관하게 3개월 질문 하나로 즉시 가입 가능합니다.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 보장 만기 설정 */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <Calendar className="text-blue-500 w-6 h-6" /> 보장 만기를 결정해 주세요
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMaturity(30)}
            className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-300 flex flex-col justify-between gap-4
              ${maturity === 30 
                ? 'border-blue-500 bg-blue-50/10 shadow-md scale-102' 
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'}`}
          >
            <div>
              <span className={`font-black text-xl block ${maturity === 30 ? 'text-blue-600' : 'text-slate-800'}`}>30세 만기 (자립 집중형)</span>
              <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">
                유병자 할증이 붙더라도 월 보험료 부담을 극도로 낮추어 성장기 동안 확실하게 리스크를 방어하고 30세에 자립 전환합니다.
              </p>
            </div>
            <div className={`text-xs font-black px-4 py-1.5 rounded-full self-start ${maturity === 30 ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              월 4~5만원대 실속형
            </div>
          </button>

          <button
            onClick={() => setMaturity(100)}
            className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-300 flex flex-col justify-between gap-4
              ${maturity === 100 
                ? 'border-blue-500 bg-blue-50/10 shadow-md scale-102' 
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'}`}
          >
            <div>
              <span className={`font-black text-xl block ${maturity === 100 ? 'text-blue-600' : 'text-slate-800'}`}>100세 만기 (평생 보장형)</span>
              <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">
                소아기 유병 이력이 나이가 들어 더 큰 성인 만성 질환으로 이어지기 전에, 100세 만기 비갱신형으로 평생 보장 자산을 확정해 두는 추천 플랜입니다.
              </p>
            </div>
            <div className={`text-xs font-black px-4 py-1.5 rounded-full self-start ${maturity === 100 ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              평생 안심 확정형
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};
