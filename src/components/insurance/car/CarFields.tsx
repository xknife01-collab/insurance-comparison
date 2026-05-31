import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Car, Compass, Navigation, HelpCircle, Shield, AlertTriangle, Users, Search, X } from 'lucide-react';
import { CAR_DATABASE, FLAT_CAR_MODELS, CAR_MODEL_MAP } from '../../../data/carDatabase';
import { getEngineOptions, getTrimOptions } from '../../../lib/insurance/car/carSpecHelpers';

interface CarFieldsProps {
  annualMileage: 'under_3k' | 'under_5k' | 'under_10k' | 'over_15k';
  setAnnualMileage: (v: 'under_3k' | 'under_5k' | 'under_10k' | 'over_15k') => void;
  safeDrivingScore: 'none' | 'under_70' | 'under_80' | 'over_80';
  setSafeDrivingScore: (v: 'none' | 'under_70' | 'under_80' | 'over_80') => void;
  hasConnectedCar: boolean;
  setHasConnectedCar: (v: boolean) => void;
  hasBlackbox: boolean;
  setHasBlackbox: (v: boolean) => void;
  hasChildRider: boolean;
  setHasChildRider: (v: boolean) => void;
  currentPropertyLimit: number;
  setCurrentPropertyLimit: (v: number) => void;
  currentInjuryType: 'jason' | 'jasang';
  setCurrentInjuryType: (v: 'jason' | 'jasang') => void;
  carBrand: string;
  setCarBrand: (v: string) => void;
  carModel: string;
  setCarModel: (v: string) => void;
  carYear: number;
  setCarYear: (v: number) => void;
  carDriverLimit: 'single' | 'couple' | 'family' | 'anyone';
  setCarDriverLimit: (v: 'single' | 'couple' | 'family' | 'anyone') => void;
  carOwnDamage: 'join' | 'exclude_single' | 'none';
  setCarOwnDamage: (v: 'join' | 'exclude_single' | 'none') => void;
  hasLaneSafety: boolean;
  setHasLaneSafety: (v: boolean) => void;
  hasForwardCollision: boolean;
  setHasForwardCollision: (v: boolean) => void;
  selectedEngine: string;
  setSelectedEngine: (v: string) => void;
  selectedTrim: string;
  setSelectedTrim: (v: string) => void;
}

export const CarFields: React.FC<CarFieldsProps> = ({
  annualMileage,
  setAnnualMileage,
  safeDrivingScore,
  setSafeDrivingScore,
  hasConnectedCar,
  setHasConnectedCar,
  hasBlackbox,
  setHasBlackbox,
  hasChildRider,
  setHasChildRider,
  currentPropertyLimit,
  setCurrentPropertyLimit,
  currentInjuryType,
  setCurrentInjuryType,
  carBrand,
  setCarBrand,
  carModel,
  setCarModel,
  carYear,
  setCarYear,
  carDriverLimit,
  setCarDriverLimit,
  carOwnDamage,
  setCarOwnDamage,
  hasLaneSafety,
  setHasLaneSafety,
  hasForwardCollision,
  setHasForwardCollision,
  selectedEngine,
  setSelectedEngine,
  selectedTrim,
  setSelectedTrim
}) => {
  // 1. 상태 선언
  const [originTab, setOriginTab] = useState<'domestic' | 'imported'>('domestic');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'brand' | 'model' | 'year' | 'confirm'>('brand');

  // 차종/모델 선택 핸들러 - 엔진/트림을 해당 차종의 최적화된 옵션으로 실시간 매핑 초기화!
  const handleSelectModel = (modelId: string, brandId: string) => {
    setCarBrand(brandId);
    setCarModel(modelId);
    
    const model = CAR_MODEL_MAP[modelId];
    const type = model?.type || 'sedan';
    const dynEngines = getEngineOptions(type, brandId, modelId);
    const dynTrims = getTrimOptions(type, brandId, modelId);
    
    setSelectedEngine(dynEngines[0].id);
    setSelectedTrim(dynTrims[0].id);
    
    setModalStep('engine');
  };

  // 2. 현재 선택된 제조사에 따라 국산/수입 탭 자동 동기화
  useEffect(() => {
    const activeBrand = CAR_DATABASE.find(b => b.id === carBrand);
    if (activeBrand) {
      setOriginTab(activeBrand.origin);
    }
  }, [carBrand]);

  // 3. 국산/수입 탭에 해당하는 제조사 목록 필터링
  const filteredBrands = useMemo(() => {
    return CAR_DATABASE.filter(brand => brand.origin === originTab);
  }, [originTab]);

  // 4. 실시간 차량 검색 로직 (제조사명 또는 모델명 매칭)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().replace(/\s+/g, '');
    return FLAT_CAR_MODELS.filter(model => {
      const matchLabel = model.label.toLowerCase().replace(/\s+/g, '').includes(query);
      const matchBrand = model.brandLabel.toLowerCase().replace(/\s+/g, '').includes(query);
      return matchLabel || matchBrand;
    }).slice(0, 10);
  }, [searchQuery]);

  // 5. 선택된 제조사의 모델 목록
  const currentBrandModels = useMemo(() => {
    const brand = CAR_DATABASE.find(b => b.id === carBrand);
    return brand ? brand.models : [];
  }, [carBrand]);

  // 6. 카테고리 필터링이 적용된 모델 목록
  const filteredModels = useMemo(() => {
    if (selectedVehicleType === 'all') return currentBrandModels;
    return currentBrandModels.filter(m => m.type === selectedVehicleType);
  }, [currentBrandModels, selectedVehicleType]);

  // 7. 제조사 변경 시 해당 제조사의 첫 번째 사용 가능한 모델로 자동 리셋
  useEffect(() => {
    if (currentBrandModels.length > 0) {
      const exists = currentBrandModels.some(m => m.id === carModel);
      if (!exists) {
        setCarModel(currentBrandModels[0].id);
      }
    }
  }, [carBrand, currentBrandModels]);

  // 8. 현재 선택된 모델 정보 조회 (carDatabase.ts 기반)
  const currentModelData = useMemo(() => {
    const model = CAR_MODEL_MAP[carModel];
    if (model) return { label: model.label, price: model.basePrice, type: model.type };
    
    // fallback if not found
    return { label: '그랜저', price: 43000000, type: 'sedan' };
  }, [carModel]);

  // 동적 엔진 및 트림 리스트 획득
  const engineOptions = useMemo(() => {
    return getEngineOptions(currentModelData.type || 'sedan', carBrand, carModel);
  }, [currentModelData.type, carBrand, carModel]);

  const trimOptions = useMemo(() => {
    return getTrimOptions(currentModelData.type || 'sedan', carBrand, carModel);
  }, [currentModelData.type, carBrand, carModel]);

  // 엔진 및 트림에 따른 가격 보정 적용
  const adjustedBasePrice = useMemo(() => {
    let price = currentModelData.price;
    const engineOpt = engineOptions.find(o => o.id === selectedEngine);
    if (engineOpt) price += engineOpt.price;

    const trimOpt = trimOptions.find(o => o.id === selectedTrim);
    if (trimOpt) price += trimOpt.price;

    return price;
  }, [currentModelData.price, selectedEngine, selectedTrim, engineOptions, trimOptions]);

  // 차량가액 연산 (차종에 따른 차별화된 연식별 감가방어율 실시간 반영!)
  const basePrice = adjustedBasePrice;
  const ageYears = 2026 - carYear;

  const carType = currentModelData.type || 'sedan';
  let depreciationFactor = 0.88; // 국산 일반 세단 기준 (12% 감가)
  if (carType === 'suv' || carType === 'van' || carType === 'truck') {
    depreciationFactor = 0.90; // 국산 RV/SUV/밴/트럭 감가 방어력 반영 (10% 감가)
  } else if (carType === 'ev' || carBrand === 'tesla') {
    depreciationFactor = 0.84; // 전기차 중고 시세 감가율 반영 (16% 감가)
  }

  const calculatedCarValue = Math.max(
    Math.round(basePrice * Math.pow(depreciationFactor, ageYears)),
    Math.round(basePrice * 0.1)
  );

  // 운전자 범위 특약 할증율 (1인=100%, 부부=115%, 가족=135%, 누구나=170%)
  const driverMultipliers = {
    single: 1.0,
    couple: 1.15,
    family: 1.35,
    anyone: 1.70
  };
  const driverMultiplier = driverMultipliers[carDriverLimit] || 1.0;

  // 차종/제조사별 보험개발원(KIDI) 기준 수리비 등급 요율 현실적 반영
  let baseOwnDamageRate = 0.0165; // 국산 일반 세단 기준 (1.65%)
  if (carType === 'suv' || carType === 'van' || carType === 'truck') {
    baseOwnDamageRate = 0.0185; // 국산 대형 RV/SUV (수리 빈도 및 규모가 큼) 기준 (1.85%)
  } else if (carType === 'ev' || carBrand === 'tesla') {
    baseOwnDamageRate = 0.0225; // 전기차 (배터리 교체비 가산) 기준 (2.25%)
  } else if (carBrand === 'bmw' || carBrand === 'mercedes' || carBrand === 'audi' || carBrand === 'volvo' || carBrand === 'porsche') {
    baseOwnDamageRate = 0.0235; // 수입 프리미엄 브랜드 (고가 부품 및 공임 가산) 기준 (2.35%)
  }

  // 예상 자차 보험료 (자차 가입=100%, 단독제외=70%, 미가입=0% 에 운전자 할증 및 KIDI 요율 반영)
  const ownDamageRateFactor = carOwnDamage === 'join' ? baseOwnDamageRate : carOwnDamage === 'exclude_single' ? baseOwnDamageRate * 0.7 : 0;
  const ownDamagePremium = Math.round(calculatedCarValue * ownDamageRateFactor * driverMultiplier);


  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto text-left">
      
      {/* SECTION 1: 차량 정보 및 자차손해 설정 */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 md:p-12 space-y-8">
        <h4 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Car className="text-blue-600 w-7 h-7" />
          1. 차량 정보 입력 및 자차손해 설정
        </h4>

        {/* 선택된 차량 요약 카드 (다이렉트 보험사 스타일) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Car className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black text-blue-500 tracking-wider block uppercase">현재 선택된 차량 사양</span>
              <h5 className="text-xl font-bold text-slate-800">
                {CAR_DATABASE.find(b => b.id === carBrand)?.label || '선택 제조사'} {currentModelData.label} 
                <span className="text-slate-400 font-bold ml-2">({carYear}년식)</span>
              </h5>
              <div className="flex flex-wrap gap-2 mt-1.5">
                <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600">
                  {engineOptions.find(o => o.id === selectedEngine)?.label || '⛽ 가솔린 2.5'}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600">
                  {trimOptions.find(o => o.id === selectedTrim)?.label || '🎖️ 프리미엄'}
                </span>
                <span className="px-2.5 py-1 bg-blue-50 rounded-lg text-[10px] font-black text-blue-600">
                  차량가액: {(calculatedCarValue / 10000).toLocaleString()}만원
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalStep('brand');
              setIsModalOpen(true);
            }}
            className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all flex items-center gap-2 shadow-md active:scale-95 self-start md:self-auto"
          >
            <Search className="w-4 h-4" />
            차종 / 연식 변경하기 (다이렉트 검색)
          </button>
        </div>

        {/* 1-4. 자차 보장 방식 설정 */}
        <div className="space-y-4">
          <label className="text-sm font-black text-slate-500 uppercase tracking-widest block flex justify-between items-center">
            <span>자기차량손해(자차) 보장 방식</span>
            <span className="text-xs text-blue-500 font-bold">노후 차량은 미가입 또는 단독제외 시 보험료 대폭 절감</span>
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { id: 'join', label: '자차 가입 (종합 보장)', desc: '타사/단독 사고 및 차량 침수 전액 보장' },
              { id: 'exclude_single', label: '단독사고 제외 가입', desc: '가드레일 충돌 등 단독 사고 보장 제외 (실속형)' },
              { id: 'none', label: '자차 미가입', desc: '차량가액 보장을 완전히 포기 (최소 요율 적용)' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCarOwnDamage(item.id as any)}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-center gap-1 ${
                  carOwnDamage === item.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]'
                    : 'border-slate-100 bg-white hover:border-slate-200 text-slate-700'
                }`}
              >
                <span className="font-black text-base text-slate-800">{item.label}</span>
                <span className="text-[10px] text-slate-400 font-bold leading-normal">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 실시간 감가상각 가치 및 자차 요율 프리뷰 */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/30 text-blue-300 rounded-lg text-[9px] font-black uppercase tracking-widest">Live Estimate</span>
              <span className="text-xs font-bold text-blue-200">{currentModelData.label} ({carYear}년식)</span>
            </div>
            <h5 className="text-xl font-bold tracking-tight">차량 평가액 기반 자차 보장 사양</h5>
          </div>

          <div className="flex items-center gap-8 border-t border-white/10 md:border-t-0 pt-6 md:pt-0">
            <div className="text-right">
              <span className="text-[10px] font-black text-blue-300 block">산정 차량 가액</span>
              <span className="text-2xl font-black text-white">{(calculatedCarValue / 10000).toLocaleString()}</span>
              <span className="text-xs font-bold text-blue-200 ml-0.5">만원</span>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-right">
              <span className="text-[10px] font-black text-emerald-400 block">연간 자차 보험료 (예상)</span>
              <span className="text-2xl font-black text-emerald-400">
                {carOwnDamage === 'none' ? '0' : (ownDamagePremium).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-300 ml-0.5">원</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 운전자 범위 특약 설정 (신설) */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 md:p-12 space-y-8">
        <h4 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Users className="text-blue-600 w-7 h-7" />
          2. 피보험자 운전자 범위 특약을 설정해 주세요
        </h4>

        <div className="space-y-4">
          <label className="text-sm font-black text-slate-500 uppercase tracking-widest block">
            운전자 범위 (가입 한도)
          </label>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { id: 'single', label: '피보험자 1인 한정', multiplier: '기본 요율 적용', desc: '본인 1명만 운전 가능 (가장 저렴)' },
              { id: 'couple', label: '부부 한정 특약', multiplier: '약 15% 할증', desc: '법적 배우자 및 본인만 보장' },
              { id: 'family', label: '가족 한정 특약', multiplier: '약 35% 할증', desc: '부모, 배우자, 자녀까지 보장 범위 확대' },
              { id: 'anyone', label: '누구나 운전 (제한없음)', multiplier: '약 70% 할증', desc: '타인이 운전해도 전액 동일 보상 (할증 최고)' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCarDriverLimit(item.id as any)}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-2 h-full ${
                  carDriverLimit === item.id
                    ? 'border-slate-800 bg-slate-900 text-white shadow-lg scale-105'
                    : 'border-slate-100 bg-white hover:border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <span className="font-black text-base block">{item.label}</span>
                  <span className={`text-[10px] font-black ${carDriverLimit === item.id ? 'text-blue-400' : 'text-slate-400'}`}>
                    {item.multiplier}
                  </span>
                </div>
                <span className={`text-[10px] leading-relaxed mt-2 ${carDriverLimit === item.id ? 'text-slate-300 font-bold' : 'text-slate-400'}`}>
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: 할인 특약 정보 */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 md:p-12 space-y-8">
        <h4 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Compass className="text-slate-700 w-7 h-7" />
          3. 적용 가능한 추가 할인 특약을 선택해 주세요
        </h4>

        {/* 주행거리 */}
        <div className="space-y-4">
          <label className="text-sm font-black text-slate-500 uppercase tracking-widest block">
            연간 예상 주행거리 (마일리지 할인)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(
              [
                { id: 'under_3k', label: '3,000 km 이하', discount: '최대 35% 환급' },
                { id: 'under_5k', label: '5,000 km 이하', discount: '최대 27% 환급' },
                { id: 'under_10k', label: '10,000 km 이하', discount: '최대 18% 환급' },
                { id: 'over_15k', label: '15,000 km 초과', discount: '환급 대상 없음' }
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAnnualMileage(item.id)}
                className={`p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  annualMileage === item.id
                    ? 'border-slate-800 bg-slate-900 text-white shadow-lg scale-105'
                    : 'border-slate-100 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="font-black text-[1.1rem]">{item.label}</span>
                <span className={`text-[0.65rem] font-bold ${annualMileage === item.id ? 'text-blue-400' : 'text-slate-400'}`}>
                  {item.discount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tmap / 카카오 안전운전 점수 */}
        <div className="grid md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <label className="text-sm font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
              안전운전 점수 (티맵/카카오)
              <span className="group relative cursor-help text-slate-300">
                <HelpCircle size={14} />
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-[10px] p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 font-normal leading-relaxed">
                  스마트폰 네비게이션 앱의 최근 주행점수(500km 이상 주행 기준)를 뜻하며, 기준 점수 달성 시 보험료가 추가 할인됩니다.
                </span>
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { id: 'none', label: '미사용/조회안함' },
                  { id: 'under_70', label: '70점 미만' },
                  { id: 'under_80', label: '70점 ~ 80점' },
                  { id: 'over_80', label: '80점 이상 (우수)' }
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSafeDrivingScore(item.id)}
                  className={`p-4 rounded-xl border text-center font-black transition-all text-sm ${
                    safeDrivingScore === item.id
                      ? 'border-slate-800 bg-slate-900 text-white shadow-md'
                      : 'border-slate-100 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 장비 및 기타 할인 특약 */}
          <div className="space-y-4">
            <label className="text-sm font-black text-slate-500 uppercase tracking-widest block">
              부가 장비 및 자녀 여부
            </label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 cursor-pointer hover:border-slate-200 transition-all">
                <input
                  type="checkbox"
                  checked={hasConnectedCar}
                  onChange={(e) => setHasConnectedCar(e.target.checked)}
                  className="w-5 h-5 rounded accent-slate-800"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">커넥티드카 서비스 사용 (현대 블루링크, 기아 커넥트 등)</span>
                  <span className="text-[10px] text-blue-500 font-bold">장치 기본 할인 약 7% + 안전운전 연계 시 최대 24% 할인 가능</span>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 cursor-pointer hover:border-slate-200 transition-all">
                <input
                  type="checkbox"
                  checked={hasBlackbox}
                  onChange={(e) => setHasBlackbox(e.target.checked)}
                  className="w-5 h-5 rounded accent-slate-800"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">블랙박스 장착</span>
                  <span className="text-[10px] text-slate-400 font-bold">사고 예방 및 증거 확보 특별 약정 할인 적용 (5% 할인)</span>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 cursor-pointer hover:border-slate-200 transition-all">
                <input
                  type="checkbox"
                  checked={hasLaneSafety}
                  onChange={(e) => setHasLaneSafety(e.target.checked)}
                  className="w-5 h-5 rounded accent-slate-800"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">차선 이탈 경고/방지 장치 장착 (ADAS)</span>
                  <span className="text-[10px] text-slate-400 font-bold">주행 차선 이탈 감지 및 경보 장치 연동 시 (3% 추가 할인)</span>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 cursor-pointer hover:border-slate-200 transition-all">
                <input
                  type="checkbox"
                  checked={hasForwardCollision}
                  onChange={(e) => setHasForwardCollision(e.target.checked)}
                  className="w-5 h-5 rounded accent-slate-800"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">전방 충돌 방지 장치 장착</span>
                  <span className="text-[10px] text-slate-400 font-bold">추돌 위험 시 긴급 자동 제동 시스템 탑재 시 (4% 추가 할인)</span>
                </div>
              </label>

              <label className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 cursor-pointer hover:border-slate-200 transition-all">
                <input
                  type="checkbox"
                  checked={hasChildRider}
                  onChange={(e) => setHasChildRider(e.target.checked)}
                  className="w-5 h-5 rounded accent-slate-800"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">만 6세 이하 자녀 있음 또는 태아 상태 (자녀 할인 특약)</span>
                  <span className="text-[10px] text-orange-500 font-bold">임산부/어린 자녀 동반 시 3% ~ 최대 17% 특별 추가 할인</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {hasConnectedCar && safeDrivingScore !== 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3"
          >
            <AlertTriangle className="text-orange-500 flex-shrink-0" size={18} />
            <p className="text-xs font-bold text-orange-700">
              * 안내: 커넥티드카 할인과 안전운전(티맵) 할인은 대다수 보험사에서 중복 가입이 불가능할 수 있습니다. 
              시뮬레이터 연산부는 자동으로 **가장 할인율이 높은 하나를 선택해 최저가**를 책정합니다.
            </p>
          </motion.div>
        )}
      </div>

      {/* SECTION 4: 기존 가입 정보 분석 */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 md:p-12 space-y-8">
        <h4 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Shield className="text-slate-700 w-7 h-7" />
          4. 현재 가입해 계신 담보 세부 한도를 선택해 주세요
        </h4>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 대물배상 한도 */}
          <div className="space-y-4">
            <label className="text-sm font-black text-slate-500 uppercase tracking-widest block flex justify-between items-center">
              <span>기존 대물배상 한도</span>
              <span className="text-orange-500 text-xs font-black">고가 차량 사고 대비 10억 권장</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(
                [
                  { value: 1, label: '1억' },
                  { value: 2, label: '2억' },
                  { value: 3, label: '3억' },
                  { value: 5, label: '5억' },
                  { value: 10, label: '10억' }
                ] as const
              ).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCurrentPropertyLimit(item.value)}
                  className={`py-4 rounded-xl border text-center font-black transition-all text-sm ${
                    currentPropertyLimit === item.value
                      ? 'border-slate-800 bg-slate-900 text-white shadow-md'
                      : 'border-slate-100 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 상해 형태 선택 */}
          <div className="space-y-4">
            <label className="text-sm font-black text-slate-500 uppercase tracking-widest block flex justify-between items-center">
              <span>기존 자기신체 상해 담보 방식</span>
              <span className="text-xs text-blue-500 font-black">자상(자동차상해)으로 교체 추천</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCurrentInjuryType('jason')}
                className={`p-5 rounded-xl border-2 text-left transition-all flex flex-col justify-center gap-1 ${
                  currentInjuryType === 'jason'
                    ? 'border-slate-800 bg-slate-900 text-white shadow-md scale-105'
                    : 'border-slate-100 bg-white hover:border-slate-200 text-slate-700'
                }`}
              >
                <span className="font-black text-base">자기신체사고 (자손)</span>
                <span className={`text-[10px] ${currentInjuryType === 'jason' ? 'text-red-300 font-bold' : 'text-slate-400'}`}>
                  치료비만 등급별 제한적 지급
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentInjuryType('jasang')}
                className={`p-5 rounded-xl border-2 text-left transition-all flex flex-col justify-center gap-1 ${
                  currentInjuryType === 'jasang'
                    ? 'border-slate-800 bg-slate-900 text-white shadow-md scale-105'
                    : 'border-slate-100 bg-white hover:border-slate-200 text-slate-700'
                }`}
              >
                <span className="font-black text-base">자동차상해 (자상)</span>
                <span className={`text-[10px] ${currentInjuryType === 'jasang' ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
                  치료비 + 위자료 + 휴업손해 전액 보장
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 다이렉트 차량 선택 모달 팝업 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 overflow-hidden flex flex-col max-h-[85vh] text-left animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            
            {/* 모달 닫기 버튼 */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 모달 헤더 및 단계 표시 */}
            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800">다이렉트 차량 찾기</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Vehicle Selector wizard</p>
                </div>
              </div>

              {/* 단계별 스텝 가이드 바 */}
              <div className="grid grid-cols-6 gap-2 mt-4">
                {[
                  { id: 'brand', label: '1. 제조사' },
                  { id: 'model', label: '2. 대표차종' },
                  { id: 'engine', label: '3. 엔진형식' },
                  { id: 'trim', label: '4. 세부트림' },
                  { id: 'year', label: '5. 연식선택' },
                  { id: 'confirm', label: '6. 최종확인' }
                ].map((s) => {
                  const stepOrder = ['brand', 'model', 'engine', 'trim', 'year', 'confirm'];
                  const currentIndex = stepOrder.indexOf(modalStep);
                  const stepIndex = stepOrder.indexOf(s.id);
                  const isCurrent = modalStep === s.id;
                  const isCompleted = stepIndex < currentIndex;

                  return (
                    <div key={s.id} className="flex flex-col gap-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${
                        isCurrent ? 'bg-blue-600' : isCompleted ? 'bg-emerald-500' : 'bg-slate-100'
                      }`} />
                      <span className={`text-[10px] font-black text-center transition-all ${
                        isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-500' : 'text-slate-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 모달 내용 스크롤 영역 */}
            <div className="overflow-y-auto flex-1 my-6 pr-2 min-h-[40vh]">
              
              {/* STEP 1: 제조사 선택 */}
              {modalStep === 'brand' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* 국산/수입 탭 */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">제조사 구분</span>
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl max-w-xs">
                      <button
                        type="button"
                        onClick={() => setOriginTab('domestic')}
                        className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                          originTab === 'domestic'
                            ? 'bg-white text-slate-800 shadow-sm'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        국산차
                      </button>
                      <button
                        type="button"
                        onClick={() => setOriginTab('imported')}
                        className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                          originTab === 'imported'
                            ? 'bg-white text-slate-800 shadow-sm'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        수입차
                      </button>
                    </div>
                  </div>

                  {/* 실시간 검색창 */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">실시간 브랜드 및 차종 직접 검색</span>
                    <div className="relative max-w-xl">
                      <Search className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="예) 아반떼, 그랜저, 쏘렌토, 3시리즈, E클래스..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-800 placeholder:text-slate-300 bg-slate-50/50"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {/* 실시간 검색 결과 리스트 */}
                      {searchResults.length > 0 && (
                        <div className="absolute z-[110] w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-50">
                          {searchResults.map((model) => (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => {
                                handleSelectModel(model.id, model.brandId);
                                setSearchQuery('');
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-blue-50/50 flex justify-between items-center transition-all text-xs"
                            >
                              <div>
                                <span className="font-semibold text-slate-400 mr-1.5">[{model.brandLabel}]</span>
                                <span className="font-bold text-slate-800">{model.label}</span>
                              </div>
                              <span className="text-[10px] text-blue-500 font-black">바로 선택 →</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 제조사 로고 목록 */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">제조사 선택</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {filteredBrands.map((brand) => (
                        <button
                          key={brand.id}
                          type="button"
                          onClick={() => {
                            setCarBrand(brand.id);
                            setModalStep('model'); // 제조사 선택 완료 시 자동으로 대표차종 단계로 이동!
                          }}
                          className={`p-4 rounded-xl border-2 text-center font-black transition-all text-xs flex flex-col justify-center items-center gap-1.5 ${
                            carBrand === brand.id
                              ? 'border-blue-600 bg-blue-50/20 text-blue-600 font-bold'
                              : 'border-slate-100 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="text-sm font-black">{brand.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: 대표 차종 선택 */}
              {modalStep === 'model' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-sm font-bold text-slate-800">
                      [{CAR_DATABASE.find(b => b.id === carBrand)?.label || '선택 제조사'}] 의 대표 차종 선택
                    </span>

                    {/* 차체 형태 카테고리 필터 */}
                    <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
                      {[
                        { id: 'all', label: '전체' },
                        { id: 'sedan', label: '세단' },
                        { id: 'suv', label: 'SUV' },
                        { id: 'ev', label: '전기차(EV)' },
                        { id: 'hatchback', label: '경차/해치백' },
                        { id: 'van', label: '승합/RV' },
                        { id: 'truck', label: '화물/트럭' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedVehicleType(cat.id)}
                          className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all ${
                            selectedVehicleType === cat.id
                              ? 'bg-white text-slate-800 shadow-sm'
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {filteredModels.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          handleSelectModel(model.id, carBrand);
                        }}
                        className={`p-4 rounded-xl border-2 text-center font-black transition-all flex flex-col justify-center items-center gap-1 ${
                          carModel === model.id
                            ? 'border-slate-800 bg-slate-900 text-white shadow-md font-bold'
                            : 'border-slate-100 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="font-black text-sm">{model.label}</span>
                        <span className={`text-[9px] ${carModel === model.id ? 'text-slate-300' : 'text-slate-400'}`}>
                          {(model.basePrice / 10000).toLocaleString()}만원부터
                        </span>
                      </button>
                    ))}
                    {filteredModels.length === 0 && (
                      <div className="col-span-full py-8 text-center text-xs font-bold text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        해당 카테고리의 차종이 아직 등록되어 있지 않습니다. 다른 카테고리를 눌러보세요.
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* STEP 3: 엔진/배기량 선택 */}
              {modalStep === 'engine' && (
                <div className="space-y-6 animate-in fade-in duration-300 text-center py-4">
                  <span className="text-sm font-bold text-slate-800 block mb-2 flex justify-center items-center gap-1.5">
                    <span>{CAR_DATABASE.find(b => b.id === carBrand)?.label}</span>
                    <span className="text-blue-600">{currentModelData.label}</span>
                    <span className="text-slate-400 font-normal">차량의 엔진 형식 선택</span>
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {engineOptions.map((eng) => (
                      <button
                        key={eng.id}
                        type="button"
                        onClick={() => {
                          setSelectedEngine(eng.id);
                          setModalStep('trim'); // 엔진 선택 완료 시 트림 선택 단계로 이동!
                        }}
                        className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-center gap-1 ${
                          selectedEngine === eng.id
                            ? 'border-blue-600 bg-blue-50/20 text-blue-800 shadow-md font-bold'
                            : 'border-slate-100 bg-white hover:border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-black text-sm">{eng.label}</span>
                        <span className={`text-[10px] ${selectedEngine === eng.id ? 'text-blue-600' : 'text-slate-400'}`}>
                          {eng.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: 세부 트림 선택 */}
              {modalStep === 'trim' && (
                <div className="space-y-6 animate-in fade-in duration-300 text-center py-4">
                  <span className="text-sm font-bold text-slate-800 block mb-2 flex justify-center items-center gap-1.5">
                    <span>{CAR_DATABASE.find(b => b.id === carBrand)?.label}</span>
                    <span className="text-blue-600">{currentModelData.label}</span>
                    <span className="text-slate-400 font-normal">차량의 세부 트림(등급) 선택</span>
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    {trimOptions.map((tr) => (
                      <button
                        key={tr.id}
                        type="button"
                        onClick={() => {
                          setSelectedTrim(tr.id);
                          setModalStep('year'); // 트림 선택 완료 시 연식 선택 단계로 이동!
                        }}
                        className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-center gap-1.5 ${
                          selectedTrim === tr.id
                            ? 'border-blue-600 bg-blue-50/20 text-blue-800 shadow-md font-bold'
                            : 'border-slate-100 bg-white hover:border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-black text-sm">{tr.label}</span>
                        <span className={`text-[10px] ${selectedTrim === tr.id ? 'text-blue-600' : 'text-slate-400'}`}>
                          {tr.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: 연식 선택 */}
              {modalStep === 'year' && (
                <div className="space-y-6 animate-in fade-in duration-300 text-center py-4">
                  <span className="text-sm font-bold text-slate-800 block mb-2">
                    {CAR_DATABASE.find(b => b.id === carBrand)?.label} {currentModelData.label} 차량의 최초 등록 연식 선택
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto max-h-60 overflow-y-auto pr-1">
                    {Array.from({ length: 2026 - 2011 + 1 }, (_, i) => 2026 - i).map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setCarYear(year);
                          setModalStep('confirm'); // 연식 선택 완료 시 최종 확인 단계로 이동!
                        }}
                        className={`p-4 rounded-xl border text-center font-black transition-all text-sm flex flex-col justify-center items-center gap-1 ${
                          carYear === year
                            ? 'border-slate-800 bg-slate-900 text-white shadow-md font-bold'
                            : 'border-slate-100 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="font-black text-sm">{year}년식</span>
                        <span className={`text-[9px] ${carYear === year ? 'text-slate-300' : 'text-slate-400'}`}>
                          {year === 2026 ? '신차' : `${2026 - year}년 경과`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: 최종 확인 */}
              {modalStep === 'confirm' && (
                <div className="space-y-6 animate-in fade-in duration-300 max-w-xl mx-auto py-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
                    <h5 className="text-center font-black text-lg text-slate-800">선택된 차량 최종 명세 확인</h5>
                    
                    <div className="divide-y divide-slate-100 text-sm">
                      <div className="py-3 flex justify-between">
                        <span className="text-slate-400 font-bold">제조사 (브랜드)</span>
                        <span className="text-slate-800 font-black">{CAR_DATABASE.find(b => b.id === carBrand)?.label}</span>
                      </div>
                      <div className="py-3 flex justify-between">
                        <span className="text-slate-400 font-bold">모델명</span>
                        <span className="text-slate-800 font-black">{currentModelData.label}</span>
                      </div>
                      <div className="py-3 flex justify-between">
                        <span className="text-slate-400 font-bold">연식 (최초등록)</span>
                        <span className="text-slate-800 font-black">{carYear}년식</span>
                      </div>
                      <div className="py-3 flex justify-between">
                        <span className="text-slate-400 font-bold">엔진 형식</span>
                        <span className="text-slate-800 font-black">
                          {engineOptions.find(o => o.id === selectedEngine)?.label || '기본형 엔진'}
                        </span>
                      </div>
                      <div className="py-3 flex justify-between">
                        <span className="text-slate-400 font-bold">세부 트림</span>
                        <span className="text-slate-800 font-black">
                          {trimOptions.find(o => o.id === selectedTrim)?.label || '기본 등급'}
                        </span>
                      </div>
                      <div className="py-3 flex justify-between items-center">
                        <span className="text-slate-400 font-bold">신차 가격</span>
                        <span className="text-slate-800 font-black">
                          {(basePrice / 10000).toLocaleString()}만원
                        </span>
                      </div>
                      <div className="py-3 flex justify-between items-center">
                        <span className="text-slate-400 font-bold flex items-center gap-1">
                          감가 적용 평가액
                          <span className="group relative cursor-help text-slate-300">
                            <HelpCircle size={12} />
                            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-[9px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 font-normal">
                              차종/제조사별 특화 감가상각 잔가율이 반영된 예상 시장 거래가치입니다. 자차 보험료 산출의 기초가 됩니다.
                            </span>
                          </span>
                        </span>
                        <span className="text-blue-600 font-black text-base">
                          {(calculatedCarValue / 10000).toLocaleString()}만원
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-center font-bold"
                  >
                    이 차량 사양으로 시뮬레이터 적용하기
                  </button>
                </div>
              )}
            </div>

            {/* 모달 하단 버튼 바 (이전 단계 네비게이션) */}
            <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
              {modalStep !== 'brand' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (modalStep === 'model') setModalStep('brand');
                    else if (modalStep === 'engine') setModalStep('model');
                    else if (modalStep === 'trim') setModalStep('engine');
                    else if (modalStep === 'year') setModalStep('trim');
                    else if (modalStep === 'confirm') setModalStep('year');
                  }}
                  className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all border border-slate-100"
                >
                  ← 이전 단계로 돌아가기
                </button>
              ) : (
                <div />
              )}
              <span className="text-[10px] font-black text-slate-300">
                차량 가액 시뮬레이터 v1.2
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
