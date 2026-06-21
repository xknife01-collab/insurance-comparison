import React from 'react';
import { Shield, ShieldAlert, Award, Car, User, Briefcase, Plus, Heart, Target } from 'lucide-react';

interface Props {
  accidentDeathLimit: number;
  setAccidentDeathLimit: (v: number) => void;
  accidentDisabilityLimit: number;
  setAccidentDisabilityLimit: (v: number) => void;
  fractureLimit: number;
  setFractureLimit: (v: number) => void;
  castLimit: number;
  setCastLimit: (v: number) => void;
  surgeryLimit: number;
  setSurgeryLimit: (v: number) => void;
  hospitalDailyLimit: number;
  setHospitalDailyLimit: (v: number) => void;
  jobClass: 1 | 2 | 3;
  setJobClass: (v: 1 | 2 | 3) => void;
  drivingType: 'none' | 'private' | 'commercial';
  setDrivingType: (v: 'none' | 'private' | 'commercial') => void;
  hasLeisureRider: boolean;
  setHasLeisureRider: (v: boolean) => void;
}

export const AccidentFields: React.FC<Props> = ({
  accidentDeathLimit,
  setAccidentDeathLimit,
  accidentDisabilityLimit,
  setAccidentDisabilityLimit,
  fractureLimit,
  setFractureLimit,
  castLimit,
  setCastLimit,
  surgeryLimit,
  setSurgeryLimit,
  hospitalDailyLimit,
  setHospitalDailyLimit,
  jobClass,
  setJobClass,
  drivingType,
  setDrivingType,
  hasLeisureRider,
  setHasLeisureRider
}) => {
  const formatWon = (value: number) => {
    if (value >= 100000000) {
      const eok = Math.floor(value / 100000000);
      const remain = Math.floor((value % 100000000) / 10000);
      return remain > 0 ? `${eok}억 ${remain}만 원` : `${eok}억 원`;
    }
    return `${(value / 10000).toLocaleString()}만 원`;
  };

  return (
    <div id="input-accident-fields" className="space-y-12 animate-in fade-in duration-500">
      
      {/* ── SECTION 1: 직업 및 운전정보 (핵심 리스크) ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Shield className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-red-500/25 text-red-300 px-3 py-1.5 rounded-full border border-red-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white">
              직업 및 운전 환경을 선택해 주세요
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 직업급수 선택 */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-red-400" /> 직무 위험군 (직업급수)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 1, label: '사무직/학생', desc: '1급 (저위험)' },
                  { value: 2, label: '서비스/기술직', desc: '2급 (중위험)' },
                  { value: 3, label: '현장직/운송직', desc: '3급 (고위험)' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setJobClass(item.value as 1 | 2 | 3)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      jobClass === item.value
                        ? 'bg-red-500/15 border-red-500 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="font-black text-sm">{item.label}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 운전형태 선택 */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                <Car className="w-4 h-4 text-red-400" /> 차량 운전 방식
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'none', label: '비운전', desc: '도보/대중교통' },
                  { value: 'private', label: '자가용', desc: '출퇴근/일상' },
                  { value: 'commercial', label: '영업용', desc: '화물/택시/배달' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setDrivingType(item.value as any)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      drivingType === item.value
                        ? 'bg-red-500/15 border-red-500 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="font-black text-sm">{item.label}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: 핵심 보장 한도 설정 ── */}
      <div className="bg-white border border-red-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-red-100 text-red-800 px-3 py-1.5 rounded-full border border-red-200 uppercase tracking-widest">Step 02</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            원하시는 한도액을 설계해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 상해사망 한도 */}
        <div id="input-accident-death" className="space-y-3 rounded-2xl p-2 transition-all">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-500">상해사망 보장액</label>
              <span className="text-sm font-black text-red-600">{formatWon(accidentDeathLimit)}</span>
            </div>
            <input
              type="range"
              min={10000000}
              max={200000000}
              step={10000000}
              value={accidentDeathLimit}
              onChange={(e) => setAccidentDeathLimit(Number(e.target.value))}
              className="w-full accent-red-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1,000만 원</span>
              <span>2억 원</span>
            </div>
          </div>

          {/* 상해후유장해 한도 */}
        <div id="input-accident-disability" className="space-y-3 rounded-2xl p-2 transition-all">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-500">상해후유장해(3% 이상) 보장액</label>
              <span className="text-sm font-black text-red-600">{formatWon(accidentDisabilityLimit)}</span>
            </div>
            <input
              type="range"
              min={10000000}
              max={150000000}
              step={10000000}
              value={accidentDisabilityLimit}
              onChange={(e) => setAccidentDisabilityLimit(Number(e.target.value))}
              className="w-full accent-red-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1,000만 원</span>
              <span>1억 5,000만 원</span>
            </div>
          </div>

          {/* 골절진단비 한도 */}
        <div id="input-accident-fracture" className="space-y-3 rounded-2xl p-2 transition-all">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-500">골절 진단비 (치아파절 포함)</label>
              <span className="text-sm font-black text-red-600">{formatWon(fractureLimit)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={2000000}
              step={100000}
              value={fractureLimit}
              onChange={(e) => setFractureLimit(Number(e.target.value))}
              className="w-full accent-red-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10만 원</span>
              <span>200만 원</span>
            </div>
          </div>

          {/* 상해수술비 한도 */}
        <div id="input-accident-surgery" className="space-y-3 rounded-2xl p-2 transition-all">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-500">상해 수술비 (사고 1회당)</label>
              <span className="text-sm font-black text-red-600">{formatWon(surgeryLimit)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={5000000}
              step={100000}
              value={surgeryLimit}
              onChange={(e) => setSurgeryLimit(Number(e.target.value))}
              className="w-full accent-red-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10만 원</span>
              <span>500만 원</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: 특약 및 레저/취미 스포츠 ── */}
      <div className="bg-white border border-red-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-red-100 text-red-800 px-3 py-1.5 rounded-full border border-red-200 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            치료 보완 특약과 레저 가입 여부를 정해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 특약 세부 설정 */}
          <div className="space-y-6">
            {/* 깁스치료비 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-500">깁스 치료비 한도</label>
                <span className="text-sm font-black text-red-600">{castLimit === 0 ? '미가입' : formatWon(castLimit)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1000000}
                step={100000}
                value={castLimit}
                onChange={(e) => setCastLimit(Number(e.target.value))}
                className="w-full accent-red-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>미가입</span>
                <span>100만 원</span>
              </div>
            </div>

            {/* 상해입원일당 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-500">상해 입원 일당 (1일당)</label>
                <span className="text-sm font-black text-red-600">{hospitalDailyLimit === 0 ? '미가입' : formatWon(hospitalDailyLimit)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100000}
                step={10000}
                value={hospitalDailyLimit}
                onChange={(e) => setHospitalDailyLimit(Number(e.target.value))}
                className="w-full accent-red-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>미가입</span>
                <span>10만 원</span>
              </div>
            </div>
          </div>

          {/* 레저 스포츠 보장 */}
          <div className="space-y-4">
            <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Target className="w-4 h-4 text-red-600" />
              레저/스포츠 상해 특약 (야외 취미 활동 케어)
            </h5>
            <div className="p-5 rounded-3xl bg-red-50/50 border border-red-100">
              <p className="text-[11px] text-red-800 font-bold leading-relaxed mb-4">
                등산, 골프, 자전거 라이딩, 주말 캠핑 등 일상 레저 스포츠 및 야외 취미 활동 중 발생하는 골절 및 충격 사고를 집중 보완합니다.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setHasLeisureRider(true)}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-xs transition-all border ${
                    hasLeisureRider
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  레저 특약 가입함
                </button>
                <button
                  type="button"
                  onClick={() => setHasLeisureRider(false)}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-xs transition-all border ${
                    !hasLeisureRider
                      ? 'bg-slate-900 text-white border-slate-800'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  미가입 / 일상형
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
