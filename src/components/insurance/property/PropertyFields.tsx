import React from 'react';
import { 
  Building, Store, Utensils, BookOpen, Factory, Warehouse, Briefcase,
  ShieldAlert, Flame, HelpCircle
} from 'lucide-react';

interface Props {
  businessType: 'office' | 'retail' | 'restaurant' | 'academy' | 'factory' | 'warehouse';
  setBusinessType: (v: 'office' | 'retail' | 'restaurant' | 'academy' | 'factory' | 'warehouse') => void;
  buildingGrade: 'grade_1' | 'grade_2' | 'grade_3';
  setBuildingGrade: (v: 'grade_1' | 'grade_2' | 'grade_3') => void;
  buildingLimit: number;
  setBuildingLimit: (v: number) => void;
  interiorLimit: number;
  setInteriorLimit: (v: number) => void;
  equipmentLimit: number;
  setEquipmentLimit: (v: number) => void;
  inventoryLimit: number;
  setInventoryLimit: (v: number) => void;
  hasWaterLeak: boolean;
  setHasWaterLeak: (v: boolean) => void;
  hasPremisesLiability: boolean;
  setHasPremisesLiability: (v: boolean) => void;
  hasBusinessInterruption: boolean;
  setHasBusinessInterruption: (v: boolean) => void;
  hasFoodLiability: boolean;
  setHasFoodLiability: (v: boolean) => void;
  hasMachineryBreakdown: boolean;
  setHasMachineryBreakdown: (v: boolean) => void;
}

export const PropertyFields: React.FC<Props> = ({
  businessType,
  setBusinessType,
  buildingGrade,
  setBuildingGrade,
  buildingLimit,
  setBuildingLimit,
  interiorLimit,
  setInteriorLimit,
  equipmentLimit,
  setEquipmentLimit,
  inventoryLimit,
  setInventoryLimit,
  hasWaterLeak,
  setHasWaterLeak,
  hasPremisesLiability,
  setHasPremisesLiability,
  hasBusinessInterruption,
  setHasBusinessInterruption,
  hasFoodLiability,
  setHasFoodLiability,
  hasMachineryBreakdown,
  setHasMachineryBreakdown,
}) => {

  const businessOptions = [
    { value: 'office', label: '사무실', desc: '일반 업무 시설', icon: Briefcase },
    { value: 'retail', label: '도소매 점포', desc: '의류, 마트 등 판매점', icon: Store },
    { value: 'restaurant', label: '일반음식점', desc: '식당, 카페 등 조리 시설', icon: Utensils },
    { value: 'academy', label: '학원/교습소', desc: '교육 및 실습 시설', icon: BookOpen },
    { value: 'factory', label: '제조공장', desc: '생산 및 조립 공장', icon: Factory },
    { value: 'warehouse', label: '물류창고', desc: '보관 및 유통 시설', icon: Warehouse },
  ] as const;

  const formatEok = (val: number) => {
    if (val === 0) return '0원';
    const eok = Math.floor(val / 100000000);
    const man = Math.floor((val % 100000000) / 10000);
    let str = '';
    if (eok > 0) str += `${eok}억`;
    if (man > 0) str += ` ${man}만`;
    return str + '원';
  };

  return (
    <div id="input-property-fields" className="space-y-12 animate-in fade-in duration-500">
      
      {/* ── SECTION 1: 업종 및 건물 구조 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Building className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-orange-500/25 text-orange-300 px-3 py-1.5 rounded-full border border-orange-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white">
              사업장 업종과 건물 구조를 선택해 주세요
            </h4>
          </div>

          {/* 업종 선택 */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400">업종 유형 (요율 적용 기준)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {businessOptions.map((opt) => {
                const IconComp = opt.icon;
                const active = businessType === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setBusinessType(opt.value);
                      if (opt.value !== 'restaurant') setHasFoodLiability(false);
                      if (opt.value !== 'factory' && opt.value !== 'warehouse') setHasMachineryBreakdown(false);
                    }}
                    type="button"
                    className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border-2 text-center transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      active
                        ? 'bg-orange-500/15 border-orange-500 shadow-xl text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <IconComp className={`w-8 h-8 mb-2 ${active ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span className="font-black text-sm">{opt.label}</span>
                    <span className="text-[10px] text-slate-500 mt-1">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 건물 등급 */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400">건물 구조 등급 (소방/화재 강도 기준)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'grade_1', label: '1급 (내화조)', desc: '콘크리트, 슬라브 지붕' },
                { value: 'grade_2', label: '2급 (연와조)', desc: '벽돌조, 불연 판넬' },
                { value: 'grade_3', label: '3급 (목조/기타)', desc: '목조, 조립식 샌드위치 판넬' },
              ].map((item) => {
                const active = buildingGrade === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setBuildingGrade(item.value as any)}
                    type="button"
                    className={`flex flex-col p-4 rounded-2xl border text-left transition-all ${
                      active
                        ? 'bg-orange-500/15 border-orange-500 text-white font-black'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-black">{item.label}</span>
                    <span className="text-[9px] opacity-70 mt-1 leading-tight">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: 자산별 보장 한도 ── */}
      <div className="bg-white border border-orange-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full border border-orange-200 uppercase tracking-widest">Step 02</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            보장받으실 자산 가치를 설정해 주세요 (실손비례 기준)
          </h4>
        </div>

        <div className="space-y-6">
          {/* 건물 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-600">건물 가입금액 (뼈대 및 외벽)</label>
              <span className="text-sm font-black text-orange-600">{formatEok(buildingLimit)}</span>
            </div>
            <input
              type="range"
              min={50000000}
              max={2000000000}
              step={50000000}
              value={buildingLimit}
              onChange={(e) => setBuildingLimit(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>5천만 원</span>
              <span>10억 원</span>
              <span>20억 원</span>
            </div>
          </div>

          {/* 시설/인테리어 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-600">시설 및 인테리어 가액 (조명, 바닥, 벽체 등)</label>
              <span className="text-sm font-black text-orange-600">{formatEok(interiorLimit)}</span>
            </div>
            <input
              type="range"
              min={10000000}
              max={1000000000}
              step={10000000}
              value={interiorLimit}
              onChange={(e) => setInteriorLimit(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>1천만 원</span>
              <span>5억 원</span>
              <span>10억 원</span>
            </div>
          </div>

          {/* 집기비품 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-600">집기비품 가액 (가구, 기기, 사무 집기 등)</label>
              <span className="text-sm font-black text-orange-600">{formatEok(equipmentLimit)}</span>
            </div>
            <input
              type="range"
              min={10000000}
              max={500000000}
              step={10000000}
              value={equipmentLimit}
              onChange={(e) => setEquipmentLimit(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>1천만 원</span>
              <span>2.5억 원</span>
              <span>5억 원</span>
            </div>
          </div>

          {/* 재고자산 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-600">재고자산 가액 (원재료, 완제품, 판매 상품)</label>
              <span className="text-sm font-black text-orange-600">{formatEok(inventoryLimit)}</span>
            </div>
            <input
              type="range"
              min={10000000}
              max={1000000000}
              step={10000000}
              value={inventoryLimit}
              onChange={(e) => setInventoryLimit(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>1천만 원</span>
              <span>5억 원</span>
              <span>10억 원</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: 배상 및 특약 사항 ── */}
      <div className="bg-white border border-orange-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full border border-orange-200 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            필요한 추가 배상책임 및 보장 특약을 체크해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              자산 손상 및 중단 리스크 대비 특약
            </h5>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800">급배수시설 누출손해 (누수 보장)</span>
                  <span className="text-[10px] text-slate-400 font-medium">배관 파손으로 인한 매장 인테리어 침수 피해 보장</span>
                </div>
                <input
                  type="checkbox"
                  checked={hasWaterLeak}
                  onChange={(e) => setHasWaterLeak(e.target.checked)}
                  className="w-5 h-5 accent-orange-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800">점포 휴업손해 (영업중단 보상)</span>
                  <span className="text-[10px] text-slate-400 font-medium">화재 사고 복구 기간 중 매일 고정 임차료 등 손실 지원</span>
                </div>
                <input
                  type="checkbox"
                  checked={hasBusinessInterruption}
                  onChange={(e) => setHasBusinessInterruption(e.target.checked)}
                  className="w-5 h-5 accent-orange-500 rounded"
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-500" />
              배상책임 및 산업 설비 특약
            </h5>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-slate-200 transition-all">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800">시설소유(관리)자 배상책임</span>
                  <span className="text-[10px] text-slate-400 font-medium">매장 내 미끄러짐 등 고객 신체/재물 손해배상</span>
                </div>
                <input
                  type="checkbox"
                  checked={hasPremisesLiability}
                  onChange={(e) => setHasPremisesLiability(e.target.checked)}
                  className="w-5 h-5 accent-orange-500 rounded"
                />
              </label>

              {businessType === 'restaurant' && (
                <label className="flex items-center justify-between p-4 rounded-2xl border border-orange-200 bg-orange-50/30 cursor-pointer hover:border-orange-300 transition-all">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      음식물 배상책임
                      <span className="text-[9px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded">음식점 전용</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">식중독 사고 또는 음식 내 이물질 피해 배상 보상</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasFoodLiability}
                    onChange={(e) => setHasFoodLiability(e.target.checked)}
                    className="w-5 h-5 accent-orange-500 rounded"
                  />
                </label>
              )}

              {(businessType === 'factory' || businessType === 'warehouse') && (
                <label className="flex items-center justify-between p-4 rounded-2xl border border-orange-200 bg-orange-50/30 cursor-pointer hover:border-orange-300 transition-all">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      기계 고장 및 전기적 손해
                      <span className="text-[9px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded">산업/물류 전용</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">전기 합선, 과부하, 오작동으로 인한 기계 파손 보상</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasMachineryBreakdown}
                    onChange={(e) => setHasMachineryBreakdown(e.target.checked)}
                    className="w-5 h-5 accent-orange-500 rounded"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
