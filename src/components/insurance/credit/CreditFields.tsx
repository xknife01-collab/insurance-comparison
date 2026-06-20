import React from 'react';
import { ShieldCheck, Heart, Sparkles, CheckCircle2, Coins, Calendar, Wallet, HeartPulse, Building2, UserCheck, Percent } from 'lucide-react';

interface Props {
  loanType: 'mortgage' | 'jeonse' | 'credit' | 'business';
  setLoanType: (v: 'mortgage' | 'jeonse' | 'credit' | 'business') => void;
  loanAmount: number;
  setLoanAmount: (v: number) => void;
  loanPeriod: number;
  setLoanPeriod: (v: number) => void;
  creditBureau: 'nice' | 'kcb';
  setCreditBureau: (v: 'nice' | 'kcb') => void;
  creditScore: number;
  setCreditScore: (v: number) => void;
  hasIllnessRider: boolean;
  setHasIllnessRider: (v: boolean) => void;
  hasDisabilityRider: boolean;
  setHasDisabilityRider: (v: boolean) => void;
}

export const CreditFields: React.FC<Props> = ({
  loanType,
  setLoanType,
  loanAmount,
  setLoanAmount,
  loanPeriod,
  setLoanPeriod,
  creditBureau,
  setCreditBureau,
  creditScore,
  setCreditScore,
  hasIllnessRider,
  setHasIllnessRider,
  hasDisabilityRider,
  setHasDisabilityRider,
}) => {
  // 실시간 할인율 계산
  let discountRate = 0;
  let discountGrade = '9~10등급';
  if (creditScore >= 900) {
    discountRate = 10;
    discountGrade = '최우수 (1~2등급)';
  } else if (creditScore >= 800) {
    discountRate = 8;
    discountGrade = '우수 (3~4등급)';
  } else if (creditScore >= 700) {
    discountRate = 5;
    discountGrade = '보통 (5~6등급)';
  } else if (creditScore >= 600) {
    discountRate = 3;
    discountGrade = '주의 (7~8등급)';
  } else {
    discountRate = 0;
    discountGrade = '미흡 (9~10등급)';
  }

  const formatAmount = (amt: number) => {
    if (amt >= 100000000) {
      const eok = Math.floor(amt / 100000000);
      const remaining = amt % 100000000;
      if (remaining > 0) {
        return `${eok}억 ${(remaining / 10000).toLocaleString()}만원`;
      }
      return `${eok}억원`;
    }
    return `${(amt / 10000).toLocaleString()}만원`;
  };

  return (
    <div id="input-credit-fields" className="space-y-12 animate-in fade-in duration-500 text-left">
      
      {/* ── STEP 01: 대출 종류 선택 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Building2 className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-emerald-500/25 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              상환 보장이 필요한 대출 종류는 무엇인가요?
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'mortgage', label: '주택담보대출', desc: '담보 주택 경매 방지', icon: Building2 },
              { id: 'jeonse', label: '전세자금대출', desc: '전세 자산 보존', icon: Wallet },
              { id: 'credit', label: '개인신용대출', desc: '고이율 채무 연체 예방', icon: Coins },
              { id: 'business', label: '개인사업자대출', desc: '사업 채무 부실 방지', icon: UserCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setLoanType(item.id as any)}
                  type="button"
                  className={`flex flex-col items-center p-6 rounded-[2.5rem] border-2 text-center transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    loanType === item.id
                      ? 'bg-emerald-500/15 border-emerald-500 shadow-lg text-emerald-400'
                      : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <Icon className="w-8 h-8 mb-3" />
                  <span className="font-black text-sm text-white mb-1">{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── STEP 02: 현재 총 대출 잔액 설정 ── */}
      <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-50">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">Step 02</span>
              <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
                현재 대출 잔액이 얼마인가요?
              </h4>
            </div>
            <p className="text-xs text-slate-400 font-bold">
              대출 잔액을 한도로 보장받아 가계 위험을 완전히 소거합니다.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500">보장 희망 한도 (대출 총액)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-800">{formatAmount(loanAmount)}</span>
            </div>
          </div>

          <input
            type="range"
            min={10000000}
            max={1000000000}
            step={10000000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex flex-wrap gap-2">
            {[30000000, 50000000, 100000000, 200000000, 300000000, 500000000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setLoanAmount(amt)}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                  loanAmount === amt
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                {formatAmount(amt)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── STEP 03: 남은 대출 만기 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-emerald-500/25 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-400/30 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            남은 대출 기간(보장 만기)은 몇 년인가요?
          </h4>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-400">남은 대출 연한</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-emerald-400">{loanPeriod}</span>
              <span className="text-sm font-bold text-slate-400">년</span>
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={loanPeriod}
            onChange={(e) => setLoanPeriod(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex flex-wrap gap-2">
            {[1, 3, 5, 10, 15, 20, 30].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setLoanPeriod(yr)}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                  loanPeriod === yr
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/25'
                }`}
              >
                {yr}년
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── STEP 04: 신용점수 및 평가기관 입력 ── */}
      <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-50">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">Step 04</span>
              <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
                본인의 신용점수를 입력해 주세요
              </h4>
            </div>
            <p className="text-xs text-slate-400 font-bold">
              입력하신 점수에 따른 신용생명지수 등급 및 보험료 추가 할인 요율이 즉시 산출됩니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">신용정보 평가기관 선택</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCreditBureau('nice')}
                  className={`py-4 rounded-2xl text-xs font-black border transition-all ${
                    creditBureau === 'nice'
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  NICE (나이스평가정보)
                </button>
                <button
                  type="button"
                  onClick={() => setCreditBureau('kcb')}
                  className={`py-4 rounded-2xl text-xs font-black border transition-all ${
                    creditBureau === 'kcb'
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  올크레딧 (KCB)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">
                  {creditBureau.toUpperCase()} 신용점수
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-800">{creditScore}</span>
                  <span className="text-sm font-bold text-slate-500">점</span>
                </div>
              </div>

              <input
                type="range"
                min={200}
                max={1000}
                step={10}
                value={creditScore}
                onChange={(e) => setCreditScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-black text-slate-400">
                <span>200점</span>
                <span>현재 설정 ({creditScore}점)</span>
                <span>1000점</span>
              </div>
            </div>
          </div>

          {/* 신용생명지수 할인 예측 카드 */}
          <div className="p-6 rounded-[2rem] border-2 text-left relative overflow-hidden bg-emerald-50/20 border-emerald-500">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-3 py-1 rounded-full border bg-emerald-500/10 border-emerald-400/30 text-emerald-600">
                  신용생명지수 예상 혜택
                </span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">신용 등급 구간</span>
                  <span className="text-lg font-black text-slate-800">{discountGrade}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">적용 예상 보험료 할인율</span>
                  <div className="flex items-baseline gap-0.5 text-emerald-600 font-black">
                    <span className="text-3xl">{discountRate}</span>
                    <span className="text-sm">% 할인</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed pt-3 border-t border-slate-100">
                {discountRate > 0 ? (
                  <>
                    우수 신용 데이터 반영으로 <strong>매년 최대 {discountRate}% 할인</strong>이 적용됩니다. 지수가 낮아지더라도 패널티나 할증은 절대 부과되지 않습니다.
                  </>
                ) : (
                  <>
                    현재 신용점수 구간에서는 즉시 할인이 어렵습니다. NICE/KCB 신용 데이터 개선 시 연 1회 재산출을 통해 즉시 최대 10% 추가 할인을 획득하실 수 있습니다.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── STEP 05: 특약 가입 여부 ── */}
      <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">Step 05</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">
            대출 안심 특약을 추가로 희망하시나요?
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => {
              setHasIllnessRider(true);
              setHasDisabilityRider(true);
            }}
            type="button"
            className={`flex flex-col items-start p-8 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
              hasIllnessRider && hasDisabilityRider
                ? 'bg-emerald-50/10 border-emerald-500 shadow-xl'
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <HeartPulse className={`w-10 h-10 mb-4 ${hasIllnessRider && hasDisabilityRider ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span className="font-black text-lg text-slate-800 mb-2">3대 질병 + 장해 종합안심형 (추천)</span>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              사망은 물론, 암 / 뇌출혈 / 급성심근경색증 최초 진단 시 및 50% 이상 장해 시에도 <strong>보험회사가 남은 대출금을 대신 완납</strong>하여 채무 연체를 완전 차단합니다.
            </p>
          </button>
          <button
            onClick={() => {
              setHasIllnessRider(false);
              setHasDisabilityRider(false);
            }}
            type="button"
            className={`flex flex-col items-start p-8 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
              !hasIllnessRider && !hasDisabilityRider
                ? 'bg-slate-50 border-slate-800 shadow-xl'
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <ShieldCheck className={`w-10 h-10 mb-4 ${!hasIllnessRider && !hasDisabilityRider ? 'text-slate-800' : 'text-slate-400'}`} />
            <span className="font-black text-lg text-slate-800 mb-2">순수 사망 단독형 (실속 보장)</span>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              사건 사고나 고령 등으로 인한 사망 위험에 대해서만 대출금 완납을 보장합니다. 보장 요율이 매우 저렴하지만 투병 중 이자 납입 연체 리스크는 보장하지 않습니다.
            </p>
          </button>
        </div>
      </div>

    </div>
  );
};
