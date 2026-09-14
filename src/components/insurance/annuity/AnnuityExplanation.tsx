import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  PiggyBank, ShieldCheck, TrendingUp, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, AlertTriangle
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const AnnuityExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-blue-50/10 px-2 sm:px-4 relative overflow-hidden text-left" id="annuity-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-200 shadow-sm">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            직장인 및 사업자를 위한 연말정산 절세 혜택과 노후 소득 플랜
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            연말정산 세액공제 혜택과 함께,<br />
            <span className="text-blue-600">안정적인 노후 연금 자산</span>을 준비하세요.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            세액공제를 통한 연말정산 환급 혜택(연간 최대 900만 원 한도)과<br />
            복리 이자로 굴러가는 든든한 은퇴 연금 매칭 가이드.
          </p>
        </div>
      </div>

      {/* ── 표준 산출 기준 및 세액공제 / 중도해지 위험 사전 고지 ── */}
      <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 md:p-8 mb-12 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1 text-xs text-slate-600 font-bold leading-relaxed">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-[11px] font-black px-2.5 py-1 rounded-md">
                필수 안내사항
              </span>
              <span className="text-slate-800 font-black text-sm">
                연금저축보험 및 연금보험 가입 시 핵심 유의사항
              </span>
            </div>
            <p className="text-slate-700">
              * 본 비교 안내 화면의 보험료 및 예상 적립금 예시는 <strong>[가입기준: 40세 남성 / 월 납입액 50만 원 / 10년 납입 / 65세 연금개시 / 공시이율(매월 변동 가능) 가정]</strong>을 기준으로 산출된 단순 참고용 예시이며, 실제 적립액 및 연금 수령액은 가입자의 연령, 성별, 납입기간, 보험사별 공시이율 변동 및 계약체결비용(사업비) 차감 수준에 따라 달라집니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                <span className="text-blue-700 font-black">⚖️ 세액공제 한도 및 조건:</span> 연금저축의 연간 세액공제 납입한도는 최대 600만 원(퇴직연금 IRP 합산 시 최대 900만 원)이며, 총급여 5,500만 원 이하 16.5%, 초과 시 13.2%가 적용됩니다. (단, 과세표준상 납부할 종합소득산출세액이 있는 경우에 한해 공제됩니다.)
              </div>
              <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100">
                <span className="text-rose-700 font-black">⚠️ 중도해지 시 16.5% 기타소득세 추징:</span> 연금저축을 중도 해약하거나 연금 외 형태로 수령할 경우, <strong>세액공제 받은 납입원금과 운용수익 전액에 대해 16.5%의 기타소득세</strong>가 부과되며, 사업비 차감 등으로 인해 원금 손실이 발생할 수 있습니다.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '최대 16.5%', label: '소득 수준별 환급율 차등', sub: '총급여 5,500만 원 이하는 16.5% 세액공제' },
          { num: '연 600만 원', label: '연금저축 단독 납입 한도', sub: 'IRP 합산 시 연 최대 900만 원까지 공제' },
          { num: '3.3% ~ 5.5%', label: '수령 시 저율 연금소득세', sub: '만 55세 이후 연금 수령 연령에 따라 차등' },
          { num: '10년 유지 비과세', label: '일반 연금보험(세제비적격)', sub: '소득세법 시행령 요건 충족 시 이자소득세 면제' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-blue-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
            <p className="text-2xl font-black text-blue-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 체크 3대 세제 혜택 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-blue-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-blue-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">연금저축 핵심 체크리스트</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            풍요로운 미래를 위해 국가가 마련해 준{' '}
            <span className="text-blue-600 font-black">대표적인 노후 대비 세제 혜택 금융/보험 수단</span>의 핵심 요소입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '세액공제 최적 세팅', label: '월 50만 원 (연 600만 원) 납입액 목표', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '한도에 맞춰 납입 금액을 설계하고, 그 이상 저축할 여유 자산은 비과세 연금보험이나 IRP 추가 납입으로 포트폴리오를 분배합니다.' },
              { title: '복리 적립식 이자', label: '공시이율에 따라 복리로 굴러가는 자산', color: 'bg-indigo-50/50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '은행 적금의 단리와 달리, 쌓인 이자에 다시 이자가 붙는 월 복리 방식으로 운용되어 장기 유지 시 적립금이 안정적으로 누적됩니다.' },
              { title: '연금소득세 절세', label: '수령 시점에 따라 적용되는 3.3%~5.5% 세율', color: 'bg-sky-50 border-sky-100', badge: 'text-sky-700 bg-sky-100', desc: '만 55~69세 개시 시 5.5%, 만 70~79세 개시 시 4.4%, 만 80세 이상 수령 시 3.3%로 개시 연령을 늦출수록 연금 소득세율이 낮아집니다.' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 w-full sm:w-24 text-center ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm break-keep">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <p className="text-blue-700 font-black text-xs mb-1">⚠️ 중도 해지 리스크 안내 (16.5% 기타소득세)</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              연금저축보험은 중도에 해약하거나 연금 외 형태로 수령할 때, **그동안 공제받은 원금과 이자 전체에 대하여 16.5%의 기타소득세가 일괄 부과**되어 손실을 볼 수 있으므로 은퇴 전까지 해지하지 않을 안전한 예산으로 관리해야 합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 연금저축 vs 일반연금 차이 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <PiggyBank className="w-56 h-56 text-blue-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-blue-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">연금 종류별 적합자 선택 가이드</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  💼 직장인 / 자영업자 (연금저축 권장)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  매월 일정한 근로소득 또는 종합소득이 있어 연말정산이나 종합소득세 신고 시 세금을 납부하는 분들은, **매년 납입한도 내에서 세액공제 환급(최대 99만 원)**을 받는 연금저축보험 설계를 우선적으로 검토할 수 있습니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-emerald-950/40 rounded-2xl md:rounded-[2.5rem] border border-emerald-500/20 hover:bg-emerald-950/60 transition-colors">
                <p className="font-black text-emerald-300 mb-2 flex items-center gap-2">
                  🏡 전업주부 / 자녀 / 고소득 자산가 (일반연금 권장)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  납세 소득이 없어 세액공제 환급 혜택을 받지 못하거나, 은퇴 후 비과세 혜택을 원하고 금융소득종합과세 한도를 우려하는 분은, 수령 시 이자소득세를 아끼는 **일반 연금보험(비과세)**이 적합한 대안이 될 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-blue-400 font-black text-xs mb-1 uppercase tracking-widest">💡 연금 설계 참고 팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "연금저축에 가입할 때는 매월 부과되는 사업비 비율과 공시이율 추이를 종합적으로 비교하는 것이 중요합니다. 본 플랫폼은 소비자의 합리적 선택을 돕기 위해 생명보험협회 공시실 기준의 객관적 정보를 제공해 드립니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 연금 이전 제도 및 비과세 동향 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-400/30">
              <Sparkles className="w-3 h-3" /> 연금 세제 정책 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">수수료 없는 계좌 이전제도와 연간 공제액 상향</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              과거 연금저축 한도가 400만 원이었으나 현재 연 600만 원(통합 900만 원)으로 세액공제 한도가 크게 확대되었습니다. 또한 기존에 가입해 두었으나 이율이 낮거나 수수료가 비싼 연금보험을 세제상 불이익(기타소득세 추징) 없이 다른 금융사로 이전할 수 있는 **'연금저축 계좌이전 제도'**를 적극 활용하실 수 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: '연금저축 통합 계좌이전', val: '세제 불이익 없이 타사 이전 가능', note: '해지 가산세 없이 가입 기간과 세제 혜택을 보존하며 적격 이전 (단, 해약환급금 기준으로 이전)' },
              { title: 'IRP 퇴직연금 합산', val: '연간 공제한도 최대 900만 원', note: '연금저축 600만 원 + IRP 300만 원 세팅 시 연말정산 최적 절세 조합 완성' },
              { title: '종신 수령 보장형 옵션', val: '평생 생존연금 수령 설계 가능', note: '약관상 정한 종신연금형 선택 시 생존 기간 동안 매월 연금 지급으로 장수 리스크 완화' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm text-left">
                    {item.title}{' '}
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5 text-left">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-blue-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-blue-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-blue-500" /> 합리적 연금 설계 가입 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 내 소득 한도 파악', desc: '총급여 5,500만 원을 기준으로 16.5%와 13.2% 공제율 구간을 사전에 체크' },
              { step: '02. 최저보증이율 점검', desc: '기준금리가 마이너스로 폭락해도 원금 손실을 방지하고 최소 적립을 보장하는 최저이율 기준 대조' },
              { step: '03. 사업비와 차감액 비율', desc: '가입 초기 원금 회복 기간을 단축하기 위해 모집 수수료가 적게 차감되는 다이렉트형 가입 우대' },
              { step: '04. 연금 계좌이전 가능여부', desc: '향후 운용 전략 변경을 대비해 세금 불이익 없이 금융기관 간 양도가 자유로운지 확인' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50 hover:border-blue-200 transition-colors">
                <div className="shrink-0 font-black text-blue-700 text-sm w-32 text-left">{item.step}</div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-blue-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl text-left">
            <h4 className="text-xl font-black mb-4">연금저축 리모델링 핵심 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 연간 600만 원 (월 50만) 납입금 비율 조절<br />
              ② 소득 대비 공제율 요율(16.5%/13.2%) 대조<br />
              ③ 연금보험(비과세)과 연금저축(공제) 타겟팅 선별<br />
              ④ 고사업비 대면 채널 상품에서 다이렉트 이전<br />
              ⑤ 은퇴 연령에 따른 수령 개시 연한 최대 확보
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all text-left">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-blue-500 w-5 h-5" /> 장기 유지의 마법
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              연금저축은 복리가 적용되므로 가입 시점부터 개시 시점까지의 기간(거치 기간)이 길어질수록 적립 자산이 기하급수적으로 늘어납니다. 단 5년이라도 먼저 시작하는 것이 미래의 월 수령액을 20% 이상 끌어올리는 비결입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-blue-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              주요 생명보험사 온라인 연금저축 / 연금보험 대표 상품 특징 안내 (생명보험협회 공시 기준)
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              * 각 보험사별 대표 상품의 공시 정보이며, 가입자의 연령, 성별, 납입기간, 적용 공시이율에 따라 실제 적립금 및 연금 수령액은 달라집니다.
            </p>
          </div>
          <span className="text-[11px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full shrink-0">
            생명보험협회 심의 기준 준수
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '교보라이프플래닛', product: '(무)라이프플래닛 연금저축보험', highlight: '다이렉트 전용 보험사로 사업비 구조가 합리적이며, 공시이율 연동 복리 적립 프로세스 운영', badges: ['다이렉트 저사업비', '공시이율 연동'] },
            { company: '삼성생명', product: '인터넷 연금저축보험 (무)', highlight: '선두 생보사의 안정적인 자산 운용 체계 기반, 시중금리 하락 시 최저보증이율 안전망 및 장기유지 혜택', badges: ['장기유지 가산', '브랜드 선두'] },
            { company: '한화생명', product: '한화 e연금저축보험 (무)', highlight: '납입 유연성을 갖춘 구조 지원, 자금 필요 시 약관상 정한 조건에 따른 추가납입/중도인출 기능', badges: ['납입 유연성', '인출/추가납입'] },
            { company: '미래에셋생명', product: '온라인 연금저축보험 (무)', highlight: '자산 배분 운용 노하우 반영, 생애주기에 맞춘 포트폴리오 연계 및 온라인 간편 가입 절차', badges: ['자산 배분 플랜', '간편 가입 설계'] },
            { company: '동양생명', product: '(무)수호천사 인터넷연금저축보험', highlight: '장기 유지 가입자를 위한 적립금 가산 혜택 제공, 온라인 전용 요율 적용으로 환급 가치 설계', badges: ['적립 가산 보너스', '온라인 요율형'] },
            { company: '교보라이프플래닛', product: '(무)라이프플래닛 연금보험(비과세)', highlight: '세액공제 대신 연금 수령 시 비과세 혜택 집중, 10년 이상 유지 시 이자소득세(15.4%) 전액 면제', badges: ['이자소득 비과세', '10년 유지 플랜'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-blue-50/20 rounded-2xl md:rounded-[2.5rem] border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all text-left">
              <p className="text-xs font-black text-blue-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── 법적 고지 및 소비자 유의사항 (금소법 제19조 준수) ── */}
        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-2">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
            금융소비자보호법 제19조에 따른 법적 고지 및 유의사항
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-600 font-medium">
            <li>본 비교 안내는 특정 금융상품의 청약을 권유하거나 확정하는 것이 아니며, 생명보험협회 공시자료를 기초로 한 단순 비교 정보입니다.</li>
            <li>보험계약 체결 전 반드시 해당 상품의 약관 및 상품설명서를 면밀히 확인하시기 바랍니다.</li>
            <li>보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결할 경우, 인수가 거절되거나 보험료가 인상될 수 있으며 보장 내용이 달라질 수 있습니다.</li>
            <li>저축성 보험은 납입보험료에서 계약체결비용(사업비) 및 위험보험료를 차감한 잔액이 적립되므로, <strong>중도 해약 시 지급되는 해약환급금은 납입원금에 미달</strong>할 수 있습니다.</li>
            <li>적용 공시이율은 보험사의 운용자산이익률 및 시중금리 변동에 따라 매월 변동될 수 있으며, 시중금리가 하락하더라도 약관에 명시된 최저보증이율이 적용됩니다.</li>
            <li>연금저축보험의 세액공제 혜택은 세법 기준 충족 시 적용되며, 향후 관련 세법 개정에 따라 공제율 및 과세 기준이 변동될 수 있습니다. 중도 해지 시에는 16.5%의 기타소득세가 추징됩니다.</li>
            <li>본 금융상품은 예금자보호법에 따라 예금보험공사가 보호하되, 보호한도는 본 보험회사에 있는 귀하의 모든 예금보호 대상 금융상품의 해약환급금(또는 만기 시 보험금이나 사고보험금)에 기타지급금을 합하여 1인당 "최고 5천만 원"이며, 5천만 원을 초과하는 나머지 금액은 보호하지 않습니다.</li>
          </ul>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-blue-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "미래의 나를 위해 오늘의 세금을 돌려받는 현명한 선택,<br />
            <span className="text-blue-600 font-black">체계적인 분석과 절세 리모델링으로 노후의 소중한 연금 안전벨트를 채워드립니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-2xl shadow-blue-400/30 shrink-0"
          >
            연금저축/연금보험 실시간 비교 상담하기
          </button>
        )}
      </div>

    </div>
  </section>
);
export default AnnuityExplanation;
