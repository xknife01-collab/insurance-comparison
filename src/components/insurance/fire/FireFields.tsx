import React, { useState, useEffect } from 'react';
import { Home, Key, ShieldCheck, HelpCircle, FileText, AlertTriangle, Layers, Ruler } from 'lucide-react';

interface Props {
  residenceType: 'apartment' | 'villa' | 'house';
  setResidenceType: (v: 'apartment' | 'villa' | 'house') => void;
  occupancyType: 'owner' | 'tenant';
  setOccupancyType: (v: 'owner' | 'tenant') => void;
  buildingArea: number;
  setBuildingArea: (v: number) => void;
  structureGrade: 1 | 2 | 3;
  setStructureGrade: (v: 1 | 2 | 3) => void;
  hasWaterLeakRider: boolean;
  setWaterLeakRider: (v: boolean) => void;
  hasLiabilityRider: boolean;
  setLiabilityRider: (v: boolean) => void;
  hasTemporaryHousingRider: boolean;
  setTemporaryHousingRider: (v: boolean) => void;
  householdGoodsLimit: number;
  setHouseholdGoodsLimit: (v: number) => void;
  buildingLimit: number;
  setBuildingLimit: (v: number) => void;
  selectedDetail?: number;
}

export const FireFields: React.FC<Props> = ({
  residenceType,
  setResidenceType,
  occupancyType,
  setOccupancyType,
  buildingArea,
  setBuildingArea,
  structureGrade,
  setStructureGrade,
  hasWaterLeakRider,
  setWaterLeakRider,
  hasLiabilityRider,
  setLiabilityRider,
  hasTemporaryHousingRider,
  setTemporaryHousingRider,
  householdGoodsLimit,
  setHouseholdGoodsLimit,
  buildingLimit,
  setBuildingLimit,
  selectedDetail,
}) => {
  const buildingInputRef = React.useRef<HTMLInputElement>(null);
  const goodsInputRef = React.useRef<HTMLInputElement>(null);

  const [localBuildingText, setLocalBuildingText] = useState((buildingLimit / 100000000).toString());
  const [localGoodsText, setLocalGoodsText] = useState((householdGoodsLimit / 100000000).toString());

  useEffect(() => {
    setLocalBuildingText((buildingLimit / 100000000).toString());
  }, [buildingLimit]);

  useEffect(() => {
    setLocalGoodsText((householdGoodsLimit / 100000000).toString());
  }, [householdGoodsLimit]);

  useEffect(() => {
    if (selectedDetail === 0 && buildingInputRef.current) {
      buildingInputRef.current.focus();
      buildingInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (selectedDetail === 1 && goodsInputRef.current) {
      goodsInputRef.current.focus();
      goodsInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedDetail]);

  const pyeong = buildingArea * 0.3025;
  const costPerPyeong = residenceType === 'apartment' ? 5500000 : residenceType === 'villa' ? 5000000 : 6500000;
  const recommendedLimit = Math.round((pyeong * costPerPyeong) / 10000000) * 10000000;
  const recommendedLimitText = recommendedLimit >= 100000000 
    ? `${Math.floor(recommendedLimit / 100000000)}억 ${recommendedLimit % 100000000 > 0 ? `${((recommendedLimit % 100000000) / 10000000).toFixed(0)}천만` : ''}원`
    : `${(recommendedLimit / 10000000).toFixed(0)}천만 원`;

  const recommendedGoodsLimit = pyeong < 15 ? 15000000 : pyeong < 25 ? 20000000 : pyeong < 35 ? 30000000 : 50000000;
  const recommendedGoodsText = `${(recommendedGoodsLimit / 10000000).toFixed(0)}천만 원`;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* ── STEP 01: 주거 기본정보 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Home className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-red-500/25 text-red-300 px-3 py-1.5 rounded-full border border-red-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white">
              기본적인 주거 정보를 선택해 주세요
            </h4>
          </div>

          {/* 주거 형태 */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400">주거 형태</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'apartment', label: '아파트 (공동주택)', desc: '단위 요율 최저' },
                { id: 'villa', label: '빌라 / 연립 / 다세대', desc: '누수 리스크 높음' },
                { id: 'house', label: '단독 주택 / 상가주택', desc: '구조급수 확인 권장' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setResidenceType(item.id as any)}
                  type="button"
                  className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    residenceType === item.id
                      ? 'bg-red-500/15 border-red-500 shadow-xl text-white'
                      : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <Home className={`w-8 h-8 mb-2 ${residenceType === item.id ? 'text-red-500' : 'text-slate-400'}`} />
                  <span className="font-black text-sm">{item.label}</span>
                  <span className="text-[9px] opacity-60 mt-1 font-bold">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 거주 유형 (소유자 vs 세입자) */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400">거주 유형 (가입 목적)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setOccupancyType('owner')}
                type="button"
                className={`flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all hover:scale-[1.02] ${
                  occupancyType === 'owner'
                    ? 'bg-red-500/15 border-red-500 shadow-xl'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <Key className={`w-8 h-8 ${occupancyType === 'owner' ? 'text-red-500' : 'text-slate-400'}`} />
                <div className="text-left">
                  <p className="font-black text-sm">자가 소유자 (집주인 / 실거주)</p>
                  <p className="text-[10px] opacity-60 font-bold">건물 및 화재배상, 누수 배상 동시 탑재 필요</p>
                </div>
              </button>
              <button
                onClick={() => setOccupancyType('tenant')}
                type="button"
                className={`flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all hover:scale-[1.02] ${
                  occupancyType === 'tenant'
                    ? 'bg-red-500/15 border-red-500 shadow-xl'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <FileText className={`w-8 h-8 ${occupancyType === 'tenant' ? 'text-red-500' : 'text-slate-400'}`} />
                <div className="text-left">
                  <p className="font-black text-sm">임차인 (세입자 / 월세 / 전세)</p>
                  <p className="text-[10px] opacity-60 font-bold">임차자 배상책임 및 내 가재도구 손실 집중</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── STEP 02: 면적 및 건물 급수 ── */}
      <div className="bg-white border border-red-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-red-100 text-red-800 px-3 py-1.5 rounded-full border border-red-200 uppercase tracking-widest">Step 02</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            주택 면적과 구조 등급을 알려주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 전용 면적 */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-xs font-black text-slate-400 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-red-500" />
                전용면적 (㎡)
              </label>
              <span className="text-lg font-black text-slate-800">{buildingArea}㎡ (약 {Math.round(buildingArea * 0.3025)}평)</span>
            </div>
            <input
              type="range"
              min={20}
              max={250}
              step={1}
              value={buildingArea}
              onChange={(e) => setBuildingArea(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>원룸 (20㎡)</span>
              <span>국민평수 (84㎡)</span>
              <span>대형 (250㎡)</span>
            </div>
          </div>

          {/* 건물 등급 */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              건물 구조 등급
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              {[
                { grade: 1, label: '1급 (기본)', desc: '철근콘크리트' },
                { grade: 2, label: '2급', desc: '벽돌조 / 블록조' },
                { grade: 3, label: '3급', desc: '목조 / 기와조' },
              ].map((item) => (
                <button
                  key={item.grade}
                  type="button"
                  onClick={() => setStructureGrade(item.grade as any)}
                  className={`flex-1 py-3 rounded-2xl font-bold border transition-all text-xs flex flex-col items-center ${
                    structureGrade === item.grade
                      ? 'border-red-500 bg-red-50 text-red-600 font-black shadow-sm'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[9px] font-medium opacity-75 mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STEP 03: 특약 및 한도 설정 ── */}
      <div className="bg-white border border-red-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-red-100 text-red-800 px-3 py-1.5 rounded-full border border-red-200 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            희망 특약과 보장 한도를 지정해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 특약 세팅 */}
          <div className="space-y-4">
            <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              생활 안전 주요 특약
            </h5>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800">급배수시설누출손해 (누수 대책)</span>
                  <span className="text-[10px] text-slate-400 font-medium">배관 누수로 인한 자택 도배/장판 피해 보장</span>
                </div>
                <input
                  type="checkbox"
                  checked={hasWaterLeakRider}
                  onChange={(e) => setWaterLeakRider(e.target.checked)}
                  className="w-5 h-5 accent-red-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800">
                    {occupancyType === 'tenant' 
                      ? '임차자배상책임 / 화재배상책임 (필수)' 
                      : '화재배상책임 / 일상생활배상책임 (권장)'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {occupancyType === 'tenant'
                      ? '집주인 건물 원상복구 책임(1억 한도) 및 이웃집 화재 전파 배상'
                      : '이웃집 화재 전파 피해 및 일상생활 배상책임 변제 (대물 최대 20억)'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hasLiabilityRider}
                  onChange={(e) => setLiabilityRider(e.target.checked)}
                  className="w-5 h-5 accent-red-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800">화재 복구 중 임시거주비 (숙박/일당)</span>
                  <span className="text-[10px] text-slate-400 font-medium">복구 기간 주거 이전 비용 지원 (일당 최대 10만)</span>
                </div>
                <input
                  type="checkbox"
                  checked={hasTemporaryHousingRider}
                  onChange={(e) => setTemporaryHousingRider(e.target.checked)}
                  className="w-5 h-5 accent-red-500 rounded"
                />
              </label>
            </div>
          </div>

          {/* 한도 세팅 */}
          <div className="space-y-6">
            <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-500" />
              보장 한도 (가입 금액)
            </h5>

            {/* 건물 한도 */}
            <div className={`space-y-3 text-left p-5 rounded-3xl transition-all duration-500 border-2 relative overflow-hidden ${
              occupancyType === 'tenant'
                ? 'bg-slate-100/50 border-slate-200/50 opacity-60'
                : selectedDetail === 0 
                  ? 'border-red-500 bg-red-50/20 shadow-[0_15px_30px_-15px_rgba(239,68,68,0.15)] scale-[1.01]' 
                  : 'border-transparent'
            }`}>
              {occupancyType === 'tenant' && (
                <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-4 text-center">
                  <div className="bg-white/95 px-5 py-3 rounded-2xl shadow-lg border border-slate-200/80 max-w-sm">
                    <p className="text-xs font-black text-slate-800 mb-0.5">세입자(임차인) 가입 제외</p>
                    <p className="text-[10px] font-bold text-slate-500 leading-normal">
                      세입자는 건물 직접 가입 대상이 아닙니다. 대신 **아래 STEP 03의 [임차자배상책임 특약]**으로 집주인의 건물 원상복구 책임(1억)을 완벽히 대체 보장받습니다.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-400 flex items-center gap-2">
                  <Home className="w-4 h-4 text-red-500" />
                  우리집 공시가격 / 건물 평가액 직접 입력
                </label>
                <span className="text-sm font-black text-red-600">
                  {buildingLimit >= 100000000 
                    ? `${Math.floor(buildingLimit / 100000000)}억 ${buildingLimit % 100000000 > 0 ? `${((buildingLimit % 100000000) / 10000000).toFixed(0)}천만` : ''}원`
                    : `${(buildingLimit / 10000000).toFixed(0)}천만 원`}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="flex gap-2 items-center shrink-0">
                  <input
                    ref={buildingInputRef}
                    type="number"
                    min={0.1}
                    max={100}
                    step={0.1}
                    value={localBuildingText}
                    onChange={(e) => {
                      const text = e.target.value;
                      setLocalBuildingText(text);
                      const val = Number(text);
                      if (!isNaN(val) && val >= 0.1 && val <= 100) {
                        setBuildingLimit(val * 100000000);
                      }
                    }}
                    onBlur={() => {
                      setLocalBuildingText((buildingLimit / 100000000).toString());
                    }}
                    placeholder="예: 7 (7억)"
                    className="w-28 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs outline-none focus:border-red-500 focus:bg-white transition-all text-right"
                  />
                  <span className="text-[10px] font-black text-slate-400 whitespace-nowrap">억 원 단위</span>
                </div>
                
                <div className="flex-1 flex flex-wrap gap-1">
                  {[50000000, 100000000, 500000000, 1000000000, 3000000000, 10000000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBuildingLimit(amt)}
                      className={`flex-1 min-w-[38px] py-2 rounded-lg text-[9px] font-black border transition-all ${
                        buildingLimit === amt
                          ? 'border-red-500 bg-red-50 text-red-600 shadow-sm'
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {amt >= 100000000 ? `${(amt / 100000000).toFixed(0)}억` : `${(amt / 10000000).toFixed(0)}천만`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center justify-between mt-1 bg-orange-50/50 p-2.5 rounded-xl border border-orange-100/50">
                <span className="text-[9px] font-bold text-orange-700">
                  💡 우리집 공시지가/평가액을 잘 모르시나요?
                </span>
                <button
                  type="button"
                  onClick={() => setBuildingLimit(recommendedLimit)}
                  className="px-2.5 py-1 rounded-md bg-orange-500 text-white font-black text-[9px] hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
                >
                  권장가 {recommendedLimitText} 자동 적용
                </button>
              </div>

              <div className="text-[9px] font-bold text-slate-400 pl-1 leading-normal">
                * 토지 가격을 제외한 **순수 건물만의 시세/평가액**으로 입력해 주세요. (일반적으로 공동주택 공시가격의 60~70% 또는 평당 400만~600만 원 수준이 적정합니다.)
              </div>
            </div>

            {/* 가재도구 한도 */}
            <div className={`space-y-3 text-left p-5 rounded-3xl transition-all duration-500 border-2 ${
              selectedDetail === 1 
                ? 'border-red-500 bg-red-50/20 shadow-[0_15px_30px_-15px_rgba(239,68,68,0.15)] scale-[1.01]' 
                : 'border-transparent'
            }`}>
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  가재도구 평가액 직접 입력
                </label>
                <span className="text-sm font-black text-red-600">
                  {householdGoodsLimit >= 100000000 
                    ? `${Math.floor(householdGoodsLimit / 100000000)}억 ${householdGoodsLimit % 100000000 > 0 ? `${((householdGoodsLimit % 100000000) / 10000000).toFixed(0)}천만` : ''}원`
                    : `${(householdGoodsLimit / 10000000).toFixed(0)}천만 원`}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="flex gap-2 items-center shrink-0">
                  <input
                    ref={goodsInputRef}
                    type="number"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={localGoodsText}
                    onChange={(e) => {
                      const text = e.target.value;
                      setLocalGoodsText(text);
                      const val = Number(text);
                      if (!isNaN(val) && val >= 0.1 && val <= 10) {
                        setHouseholdGoodsLimit(val * 100000000);
                      }
                    }}
                    onBlur={() => {
                      setLocalGoodsText((householdGoodsLimit / 100000000).toString());
                    }}
                    placeholder="예: 0.3 (3천만)"
                    className="w-28 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs outline-none focus:border-red-500 focus:bg-white transition-all text-right"
                  />
                  <span className="text-[10px] font-black text-slate-400 whitespace-nowrap">억 원 단위</span>
                </div>
                
                <div className="flex-1 flex gap-1">
                  {[10000000, 20000000, 30000000, 50000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setHouseholdGoodsLimit(amt)}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-black border transition-all ${
                        householdGoodsLimit === amt
                          ? 'border-red-500 bg-red-50 text-red-600 shadow-sm'
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {amt >= 100000000 ? `${(amt / 100000000).toFixed(0)}억` : `${(amt / 10000000).toFixed(0)}천만`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center justify-between mt-1 bg-orange-50/50 p-2.5 rounded-xl border border-orange-100/50">
                <span className="text-[9px] font-bold text-orange-700">
                  💡 가재도구(가전/가구 등) 총 평가액을 잘 모르시나요?
                </span>
                <button
                  type="button"
                  onClick={() => setHouseholdGoodsLimit(recommendedGoodsLimit)}
                  className="px-2.5 py-1 rounded-md bg-orange-500 text-white font-black text-[9px] hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
                >
                  권장가 {recommendedGoodsText} 자동 적용
                </button>
              </div>
            </div>

            {/* 안내 경고 */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 font-bold leading-normal text-left">
                건물 구조 등급이 정확하지 않을 경우, 실제 사고 발생 시 보험가액 비례 보상으로 인해 복구 보상금이 삭감될 위험이 있으므로 정확히 기재해 주세요. (철근콘크리트 아파트/빌라는 대다수 1급에 해당합니다.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

