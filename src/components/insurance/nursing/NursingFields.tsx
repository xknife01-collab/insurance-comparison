import React from 'react';
import { motion } from 'motion/react';
import { Home, Building2, ShieldCheck, HeartHandshake, Info, ShieldAlert, BadgeCheck } from 'lucide-react';

interface NursingFieldsProps {
  preferredService: 'home' | 'facility' | 'both';
  setPreferredService: (v: 'home' | 'facility' | 'both') => void;
  homeAmount: number;
  setHomeAmount: (v: number) => void;
  facilityAmount: number;
  setFacilityAmount: (v: number) => void;
  hasProxyClaim: boolean;
  setHasProxyClaim: (v: boolean) => void;
  hasBrainHistory: boolean;
  setHasBrainHistory: (v: boolean) => void;
  hasLtcHistory: boolean;
  setHasLtcHistory: (v: boolean) => void;
}

export const NursingFields: React.FC<NursingFieldsProps> = ({
  preferredService,
  setPreferredService,
  homeAmount,
  setHomeAmount,
  facilityAmount,
  setFacilityAmount,
  hasProxyClaim,
  setHasProxyClaim,
  hasBrainHistory,
  setHasBrainHistory,
  hasLtcHistory,
  setHasLtcHistory,
}) => {
  return (
    <div id="input-nursing-fields" className="space-y-16">
      {/* 1. Preferred Service Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-pink-100 text-pink-500 rounded-lg text-xs font-black">1</span>
            선호 돌봄 서비스
          </h3>
          <p className="text-xs text-gray-400 font-bold mt-1">원하시는 요양 및 돌봄 제공 방식을 선택해 주세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'home',
              label: '재가급여',
              desc: '집에서 케어',
              subDesc: '요양보호사 방문, 주야간보호센터 이용',
              icon: Home,
              color: 'text-pink-500 bg-pink-50 border-pink-200'
            },
            {
              id: 'facility',
              label: '시설급여',
              desc: '요양원 등',
              subDesc: '전문 요양시설 및 요양공동생활가정 입소',
              icon: Building2,
              color: 'text-purple-500 bg-purple-50 border-purple-200'
            },
            {
              id: 'both',
              label: '전체보장',
              desc: '빈틈없는 케어',
              subDesc: '상황에 따라 집과 시설 모든 보장 합산',
              icon: ShieldCheck,
              color: 'text-blue-500 bg-blue-50 border-blue-200'
            }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = preferredService === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPreferredService(item.id as any)}
                className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50/20 shadow-lg shadow-pink-500/5'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${isSelected ? item.color : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                    <Icon size={22} />
                  </div>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-white text-[10px] font-black">✓</span>
                  )}
                </div>
                <p className="text-lg font-black text-gray-900 leading-tight">{item.label}</p>
                <p className="text-xs font-bold text-gray-500 mt-0.5">{item.desc}</p>
                <p className="text-[11px] font-bold text-gray-400 leading-tight mt-3">{item.subDesc}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-pink-50/50 p-5 rounded-3xl border border-pink-100/50 flex gap-3">
          <Info className="text-pink-500 shrink-0 mt-0.5" size={16} />
          <p className="text-xs font-bold text-pink-700 leading-relaxed">
            최근에는 **재가급여를 선호하는 비중이 80% 이상**입니다. 익숙한 집에서 익숙한 사람들과 머무르며 요양보호사의 전문적인 도움을 받는 플랜이 현재 가장 인기가 높습니다.
          </p>
        </div>
      </div>

      {/* 2. Monthly Payout Limits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Home Care Limit */}
        {(preferredService === 'home' || preferredService === 'both') && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 bg-pink-100 text-pink-500 rounded-lg text-[10px] font-black">2-1</span>
                원하는 월 재가 지원금
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-1">방문요양/주야간보호 이용 시 매월 지급받을 한도입니다.</p>
            </div>
            <div className="flex gap-3">
              {[300000, 500000, 1000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setHomeAmount(amt)}
                  className={`flex-1 py-4 rounded-2xl border font-black text-sm transition-all ${
                    homeAmount === amt
                      ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                  }`}
                >
                  {amt === 1000000 ? '100만 원' : `${amt / 10000}만 원`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Facility Care Limit */}
        {(preferredService === 'facility' || preferredService === 'both') && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 bg-pink-100 text-pink-500 rounded-lg text-[10px] font-black">
                  {preferredService === 'both' ? '2-2' : '2-1'}
                </span>
                원하는 월 시설 지원금
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-1">요양원/노인요양시설 입소 시 매월 지급받을 한도입니다.</p>
            </div>
            <div className="flex gap-3">
              {[300000, 500000, 1000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setFacilityAmount(amt)}
                  className={`flex-1 py-4 rounded-2xl border font-black text-sm transition-all ${
                    facilityAmount === amt
                      ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                  }`}
                >
                  {amt === 1000000 ? '100만 원' : `${amt / 10000}만 원`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Underwriting & Convenience Settings */}
      <div className="space-y-8 border-t border-gray-100 pt-12">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-pink-100 text-pink-500 rounded-lg text-xs font-black">3</span>
            치매 심사 및 청구 편의 설정
          </h3>
          <p className="text-xs text-gray-400 font-bold mt-1">안전한 가입 및 차질 없는 보험금 지급을 위한 추가 설정입니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Proxy Claim */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-black text-gray-800">지정대리청구인 사전 지정</p>
              <p className="text-xs text-gray-400 font-bold">치매 발병 시 본인 대신 보험금을 청구할 대리인 지정 여부</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setHasProxyClaim(true)}
                className={`flex-1 py-4 rounded-2xl border font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                  hasProxyClaim
                    ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                <span>예, 지정하겠습니다 (권장)</span>
                <span className="text-[9px] font-black text-pink-500/80">보험금 수령 누락 방지</span>
              </button>
              <button
                type="button"
                onClick={() => setHasProxyClaim(false)}
                className={`flex-1 py-4 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center ${
                  !hasProxyClaim
                    ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                아니오, 나중에 하겠습니다
              </button>
            </div>
          </div>

          {/* Brain / Dementia History */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-black text-gray-800">최근 1~5년 내 치매/뇌질환 진단·치료 이력</p>
              <p className="text-xs text-gray-400 font-bold">치매, 경도인지장애(MCI), 알츠하이머, 파킨슨병, 뇌졸중 이력 등</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setHasBrainHistory(true)}
                className={`flex-1 py-4 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center ${
                  hasBrainHistory
                    ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                네, 있습니다
              </button>
              <button
                type="button"
                onClick={() => setHasBrainHistory(false)}
                className={`flex-1 py-4 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center ${
                  !hasBrainHistory
                    ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                아니오, 없습니다
              </button>
            </div>
          </div>

          {/* Long Term Care Grade History */}
          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-1">
              <p className="text-sm font-black text-gray-800">장기요양등급 신청 또는 판정 이력</p>
              <p className="text-xs text-gray-400 font-bold">노인장기요양보험 1~5등급, 인지원등급 보유 또는 신청 중인지 여부</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setHasLtcHistory(true)}
                className={`flex-1 py-4 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center ${
                  hasLtcHistory
                    ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                네, 그렇습니다
              </button>
              <button
                type="button"
                onClick={() => setHasLtcHistory(false)}
                className={`flex-1 py-4 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center ${
                  !hasLtcHistory
                    ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                아니오, 아닙니다
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Alert Banner based on Underwriting */}
        {(hasBrainHistory || hasLtcHistory) && (
          <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100 flex gap-3 items-start animate-pulse">
            <ShieldAlert className="text-rose-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-xs font-black text-rose-800 leading-tight">초간편 심사형 가입 검토 대상</p>
              <p className="text-[11px] font-bold text-rose-600 leading-relaxed mt-1">
                치매/뇌질환 병력이 있거나 장기요양 등급을 보유하신 경우, 일반 재가시설 간병보험 가입은 보류되며 **'초간편 심사형 간병보험'**으로만 제한적으로 비교 가능합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
