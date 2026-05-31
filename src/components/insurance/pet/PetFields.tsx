import React, { useState, useEffect } from 'react';
import { Dog, Cat, ShieldCheck, Heart, Stethoscope, Activity, FileText } from 'lucide-react';
import { createClient } from '../../../utils/supabase/client';

interface Props {
  petType: 'dog' | 'cat';
  setPetType: (v: 'dog' | 'cat') => void;
  petName: string;
  setPetName: (v: string) => void;
  breed: string;
  setBreed: (v: string) => void;
  birthYearMonth: string;
  setBirthYearMonth: (v: string) => void;
  selfPayRatio: 50 | 70 | 80 | 90;
  setSelfPayRatio: (v: 50 | 70 | 80 | 90) => void;
  deductible: 10000 | 20000 | 30000 | 50000 | 100000;
  setDeductible: (v: 10000 | 20000 | 30000 | 50000 | 100000) => void;
  isRegistered: boolean;
  setIsRegistered: (v: boolean) => void;
  patellaRider: boolean;
  setPatellaRider: (v: boolean) => void;
  skinRider: boolean;
  setSkinRider: (v: boolean) => void;
  dentalRider: boolean;
  setDentalRider: (v: boolean) => void;
}

export const PetFields: React.FC<Props> = ({
  petType,
  setPetType,
  petName,
  setPetName,
  breed,
  setBreed,
  birthYearMonth,
  setBirthYearMonth,
  selfPayRatio,
  setSelfPayRatio,
  deductible,
  setDeductible,
  isRegistered,
  setIsRegistered,
  patellaRider,
  setPatellaRider,
  skinRider,
  setSkinRider,
  dentalRider,
  setDentalRider,
}) => {
  const [dbBreeds, setDbBreeds] = useState<any[]>([]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('pet_breeds')
          .select('*')
          .order('breed_name', { ascending: true });
        
        if (!error && data && data.length > 0) {
          setDbBreeds(data);
        }
      } catch (err) {
        console.warn('Failed to fetch pet breeds from Supabase, using local defaults.', err);
      }
    };
    fetchBreeds();
  }, []);

  // Local fallbacks in case DB is offline or loading
  const fallbackDogBreeds = [
    { breed_name: '말티즈', risk_group: 'high', multiplier: 1.25 },
    { breed_name: '포메라니안', risk_group: 'high', multiplier: 1.25 },
    { breed_name: '치와와', risk_group: 'high', multiplier: 1.25 },
    { breed_name: '요크셔', risk_group: 'high', multiplier: 1.25 },
    { breed_name: '비숑 프리제', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '토이푸들', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '푸들', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '시추', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '닥스훈트', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '슈나우저', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '스피츠', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '웰시코기', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '비글', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '코카스파니엘', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '이탈리안 그레이하운드', risk_group: 'medium', multiplier: 1.15 },
    { breed_name: '파피용', risk_group: 'normal', multiplier: 1.00 },
    { breed_name: '시바견', risk_group: 'normal', multiplier: 1.00 },
    { breed_name: '진돗개', risk_group: 'normal', multiplier: 1.00 },
    { breed_name: '프렌치불독', risk_group: 'super_high', multiplier: 1.40 },
    { breed_name: '불독', risk_group: 'super_high', multiplier: 1.40 },
    { breed_name: '리트리버', risk_group: 'super_high', multiplier: 1.40 },
    { breed_name: '래브라도 리트리버', risk_group: 'super_high', multiplier: 1.40 },
    { breed_name: '허스키', risk_group: 'super_high', multiplier: 1.40 },
    { breed_name: '말라뮤트', risk_group: 'super_high', multiplier: 1.40 },
    { breed_name: '믹스견', risk_group: 'normal', multiplier: 1.00 }
  ];

  const fallbackCatBreeds = [
    { breed_name: '코리안 쇼트헤어', risk_group: 'discount', multiplier: 0.95 },
    { breed_name: '러시안블루', risk_group: 'normal', multiplier: 1.05 },
    { breed_name: '샴', risk_group: 'normal', multiplier: 1.05 },
    { breed_name: '벵갈', risk_group: 'normal', multiplier: 1.05 },
    { breed_name: '아비시니안', risk_group: 'normal', multiplier: 1.05 },
    { breed_name: '아메리칸 쇼트헤어', risk_group: 'normal', multiplier: 1.05 },
    { breed_name: '브리티시 쇼트헤어', risk_group: 'normal', multiplier: 1.05 },
    { breed_name: '스코티시', risk_group: 'high', multiplier: 1.15 },
    { breed_name: '페르시안', risk_group: 'high', multiplier: 1.15 },
    { breed_name: '랙돌', risk_group: 'high', multiplier: 1.15 },
    { breed_name: '노르웨이 숲', risk_group: 'high', multiplier: 1.15 },
    { breed_name: '메인쿤', risk_group: 'high', multiplier: 1.15 },
    { breed_name: '믹스묘', risk_group: 'discount', multiplier: 0.95 }
  ];

  // Group breeds by type (preferring DB data)
  const currentDogBreeds = dbBreeds.length > 0 
    ? dbBreeds.filter(b => b.pet_type === 'dog') 
    : fallbackDogBreeds;

  const currentCatBreeds = dbBreeds.length > 0 
    ? dbBreeds.filter(b => b.pet_type === 'cat') 
    : fallbackCatBreeds;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* ── SECTION 1: 반려동물 기본정보 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Dog className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-orange-500/25 text-orange-300 px-3 py-1.5 rounded-full border border-orange-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white">
              아이의 기본 정보를 알려주세요
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => {
                setPetType('dog');
                if (breed === '코리안 쇼트헤어') setBreed('말티즈');
              }}
              type="button"
              className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                petType === 'dog'
                  ? 'bg-orange-500/15 border-orange-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Dog className={`w-10 h-10 mb-2 ${petType === 'dog' ? 'text-orange-500' : 'text-slate-400'}`} />
              <span className="font-black text-sm">반려견 (강아지)</span>
            </button>
            <button
              onClick={() => {
                setPetType('cat');
                if (breed === '말티즈') setBreed('코리안 쇼트헤어');
              }}
              type="button"
              className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                petType === 'cat'
                  ? 'bg-orange-500/15 border-orange-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Cat className={`w-10 h-10 mb-2 ${petType === 'cat' ? 'text-orange-500' : 'text-slate-400'}`} />
              <span className="font-black text-sm">반려묘 (고양이)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400">아이 이름</label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="코코, 보리 등"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400">품종</label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-2xl py-3.5 px-5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
              >
                {petType === 'dog' ? (
                  currentDogBreeds.map((b) => {
                    const labelRisk = b.risk_group === 'super_high' ? '최고위험' : b.risk_group === 'high' ? '고위험' : b.risk_group === 'medium' ? '중위험' : '일반';
                    return (
                      <option key={b.breed_name} value={b.breed_name} className="bg-slate-900 text-white">
                        {b.breed_name} ({labelRisk} - {b.multiplier}배)
                      </option>
                    );
                  })
                ) : (
                  currentCatBreeds.map((b) => {
                    const labelRisk = b.risk_group === 'high' ? '고위험' : b.risk_group === 'discount' ? '할인' : '일반';
                    return (
                      <option key={b.breed_name} value={b.breed_name} className="bg-slate-900 text-white">
                        {b.breed_name} ({labelRisk} - {b.multiplier}배)
                      </option>
                    );
                  })
                )}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400">출생년월</label>
              <input
                type="text"
                value={birthYearMonth}
                onChange={(e) => setBirthYearMonth(e.target.value)}
                placeholder="예) 202305"
                maxLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: 보장비율 및 자기부담금 ── */}
      <div className="bg-white border border-orange-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full border border-orange-200 uppercase tracking-widest">Step 02</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            원하시는 실손 보장 비율과 부담금을 정해 주세요
          </h4>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-black text-slate-400 block mb-3">보장 비율 (치료비 실손 보상 비율)</label>
            <div className="flex gap-3">
              {[50, 70, 80, 90].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setSelfPayRatio(ratio as any)}
                  className={`flex-1 py-3 rounded-xl font-bold border transition-all text-sm ${
                    selfPayRatio === ratio
                      ? 'border-orange-500 bg-orange-50 text-orange-600 font-black shadow-sm'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {ratio}% 보장
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 block mb-3">통원/입원 시 1일 자기부담금 (진료비에서 차감)</label>
            <div className="flex flex-wrap gap-3">
              {[10000, 20000, 30000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDeductible(amt as any)}
                  className={`flex-1 py-3 min-w-[70px] rounded-xl font-bold border transition-all text-sm ${
                    deductible === amt
                      ? 'border-orange-500 bg-orange-50 text-orange-600 font-black shadow-sm'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {(amt / 10000).toLocaleString()}만원
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: 특약 및 할인 요건 ── */}
      <div className="bg-white border border-orange-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full border border-orange-200 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            추가 보장 특약과 할인 항목을 선택해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 특약 가입 여부 */}
          <div className="space-y-4">
            <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-orange-500" />
              질병/상해 주요 선택 특약
            </h5>
            <div className="flex flex-col gap-3">
              {petType === 'dog' && (
                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-slate-800">슬개골 및 고관절 탈구 보장</span>
                    <span className="text-[10px] text-slate-400 font-medium">소형견 다빈도 질환 1위 보장 (1년 대기)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={patellaRider}
                    onChange={(e) => setPatellaRider(e.target.checked)}
                    className="w-5 h-5 accent-orange-500 rounded"
                  />
                </label>
              )}

              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800">피부병 및 귓병(외이염) 보장</span>
                  <span className="text-[10px] text-slate-400 font-medium">만성 아토피 및 외이도 청소, 약 처방 보완</span>
                </div>
                <input
                  type="checkbox"
                  checked={skinRider}
                  onChange={(e) => setSkinRider(e.target.checked)}
                  className="w-5 h-5 accent-orange-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800">스케일링 및 구강 치료 보장</span>
                  <span className="text-[10px] text-slate-400 font-medium">치주염 발치 수술 및 정기 스케일링 특약</span>
                </div>
                <input
                  type="checkbox"
                  checked={dentalRider}
                  onChange={(e) => setDentalRider(e.target.checked)}
                  className="w-5 h-5 accent-orange-500 rounded"
                />
              </label>
            </div>
          </div>

          {/* 동물등록 유무 */}
          <div className="space-y-4">
            <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              동물등록 할인 (보험료 5% 즉시 절감)
            </h5>
            <div className="flex flex-col gap-4">
              <div className="p-5 rounded-3xl bg-orange-50/50 border border-orange-100">
                <p className="text-[11px] text-orange-800 font-bold leading-relaxed mb-4">
                  정부 동물등록제에 가입된 반려견/반려묘의 등록번호 또는 내장형 칩 등록 상태가 증빙되면 월 보험료의 5%를 할인받을 수 있습니다.
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsRegistered(true)}
                    className={`flex-1 py-3.5 rounded-2xl font-black text-xs transition-all border ${
                      isRegistered
                        ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/20'
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    동물등록 되어있음
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegistered(false)}
                    className={`flex-1 py-3.5 rounded-2xl font-black text-xs transition-all border ${
                      !isRegistered
                        ? 'bg-slate-900 text-white border-slate-800'
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    미등록 / 해당없음
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
