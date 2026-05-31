import React from 'react';
import {
  PiggyBank, ShieldCheck, TrendingUp, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, AlertTriangle
} from 'lucide-react';

interface Props {
  onAction?: () => void;
}

export const AnnuityExplanation: React.FC<Props> = ({ onAction }) => (
  <section className="py-24 bg-blue-50/10 px-4 relative overflow-hidden text-left" id="annuity-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-200 shadow-sm">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            현명한 직장인의 연말정산 환급 무기이자 평생 소득 파트너
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            연말정산 13%~16% 즉시 환급받고,<br />
            <span className="text-blue-600">안정적인 노후 연금 자산</span>을 확보하세요.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            세액공제를 통한 매년 확실한 환급(연간 최대 900만 원 한도)과<br />
            복리 이자로 굴러가는 든든한 은퇴 비상금 매칭 가이드.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '최대 16.5%', label: '소득 수준별 환급율 차등', sub: '총급여 5,500만 원 이하는 최고이율 공제' },
          { num: '연 600만 원', label: '연금저축 단독 납입 한도', sub: 'IRP 결합 시 최대 연 900만 원 공제 가능' },
          { num: '3.3% ~ 5.5%', label: '수령 시 저율 연금소득세', sub: '수령 개시 연령이 늦을수록 세율 인하' },
          { num: '10년 이상 비과세', label: '일반 연금보험 선택 시', sub: '연금 수령 시 발생하는 이자 전액 면제' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-blue-100 rounded-[3rem] p-8 text-center shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
            <p className="text-2xl font-black text-blue-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 체크 3대 세제 혜택 */}
        <div className="bg-white rounded-[4rem] p-12 border border-blue-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-blue-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">연금저축 핵심 체크리스트</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            풍요로운 미래를 위해 국가가 마련해 준{' '}
            <span className="text-blue-600 font-black">가장 혜택이 큰 금융/보험 수단</span>의 핵심 요소입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '세액공제 최적 세팅', label: '월 50만 원 (연 600만 원) 납입액 목표', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '한도에 맞춰 납입 금액을 설계하고, 그 이상 저축할 여유 자산은 비과세 연금보험이나 IRP 추가 납입으로 포트폴리오를 분배합니다.' },
              { title: '복리 적립식 이자', label: '공시이율에 따라 복리로 굴러가는 자산', color: 'bg-indigo-50/50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '은행 적금의 단리와 달리, 쌓인 이자에 다시 이자가 붙는 월 복리 방식으로 운용되어 장기 유지 시 원금대비 환급률이 비약적으로 성장합니다.' },
              { title: '연금소득세 절세', label: '수령 시점에 따라 적용되는 3.3%~5.5% 세율', color: 'bg-sky-50 border-sky-100', badge: 'text-sky-700 bg-sky-100', desc: '만 55~69세 개시 시 5.5%, 만 70~79세 개시 시 4.4%, 만 80세 이상 수령 시 3.3%로 개시 연령을 늦출수록 연금 세액이 절감됩니다.' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <p className="text-blue-700 font-black text-xs mb-1">⚠️ 중도 해지 리스크 안내 (16.5% 기타소득세)</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              연금저축보험은 중도에 해약하거나 연금 외 형태로 수령할 때, **그동안 공제받은 원금과 이자 전체에 대하여 16.5%의 기타소득세가 일괄 부과**되어 손실을 볼 수 있으므로 은퇴 전까지 해지하지 않을 안전한 예산으로 관리해야 합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 연금저축 vs 일반연금 차이 */}
        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <PiggyBank className="w-56 h-56 text-blue-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-blue-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">연금 종류별 적합자 선택 가이드</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  💼 직장인 / 자영업자 (연금저축 권장)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  매월 일정한 근로소득 또는 종합소득이 있어 연말정산이나 종합소득세 신고 시 세금을 납부하는 분들은, **매년 확실한 환급(최대 99만 원)**을 받는 연금저축보험이 무조건 유리합니다.
                </p>
              </div>

              <div className="p-6 bg-emerald-950/40 rounded-[2.5rem] border border-emerald-500/20 hover:bg-emerald-950/60 transition-colors">
                <p className="font-black text-emerald-300 mb-2 flex items-center gap-2">
                  🏡 전업주부 / 자녀 / 고소득 자산가 (일반연금 권장)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  납세 소득이 없어 세액공제 환급 혜택을 받지 못하거나, 은퇴 후 비과세 혜택을 원하고 금융소득종합과세 한도를 우려하는 고소득자는, 수령 시 이자세를 아끼는 **일반 연금보험(비과세)**이 현명한 선택입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-blue-400 font-black text-xs mb-1 uppercase tracking-widest">💡 플랫폼 수석 아키텍트의 꿀팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "연금저축에 가입할 때는 매월 부과되는 사업비 비율이 낮고, 공시이율이 높은 다이렉트(인터넷) 상품을 고르는 것이 장기 적립금 가치를 올리는 핵심입니다. 당사가 비교해 드리는 추천 리스트는 인터넷 전용 저사업비 상품들로 구성되어 있습니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 연금 이전 제도 및 비과세 동향 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4rem] p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-400/30">
              <Sparkles className="w-3 h-3" /> 연금 세제 정책 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">수수료 없는 계좌 이전제도와 연간 공제액 상향</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              과거 연금저축 한도가 400만 원이었으나 현재 연 600만 원(통합 900만 원)으로 세액공제 한도가 크게 확대되었습니다. 또한 기존에 가입해 두었으나 이율이 낮거나 수수료가 비싼 연금보험을 해지수수료 없이 다른 보험사나 펀드로 이전할 수 있는 **'연금저축 계좌이전 제도'**를 적극 활용하실 수 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: '연금저축 통합 계좌이전', val: '원금 손실 없이 타사로 이전 가능', note: '해지하지 않고 가입 이력을 그대로 보존하며 더 유리한 이율의 타사로 갈아타기' },
              { title: 'IRP 퇴직연금 합산', val: '연간 공제한도 최대 900만 원', note: '연금저축 600만 원 + IRP 300만 원 세팅 시 연말정산 최적 절세 조합 완성' },
              { title: '종신 수령 보장형 옵션', val: '평생 동안 노후 연금 확보 보장', note: '확정기간형이 끝나 사망 전까지 매달 생존연금을 지급해 노후 장수 리스크 방지' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm text-left">
                    {item.title}{' '}
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5 text-left">{item.note}</p>
                </div>
                <p className="font-black text-blue-400 text-sm shrink-0 ml-4">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-blue-100 rounded-[4rem] p-12 shadow-sm hover:shadow-xl transition-all">
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
              <div key={i} className="flex items-center gap-5 p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50 hover:border-blue-200 transition-colors">
                <div className="shrink-0 font-black text-blue-700 text-sm w-32 text-left">{item.step}</div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-blue-600 text-white rounded-[3.5rem] p-10 shadow-xl text-left">
            <h4 className="text-xl font-black mb-4">연금저축 리모델링 핵심 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 연간 600만 원 (월 50만) 납입금 비율 조절<br />
              ② 소득 대비 공제율 요율(16.5%/13.2%) 대조<br />
              ③ 연금보험(비과세)과 연금저축(공제) 타겟팅 선별<br />
              ④ 고사업비 대면 채널 상품에서 다이렉트 이전<br />
              ⑤ 은퇴 연령에 따른 수령 개시 연한 최대 확보
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-[3.5rem] p-10 shadow-sm hover:shadow-xl transition-all text-left">
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
      <div className="mb-20 bg-white rounded-[4rem] p-12 border border-blue-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 대표 생명보험사 온라인 연금저축 / 연금보험 대표 상품 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '교보라이프플래닛', product: '(무)라이프플래닛 연금저축보험', highlight: '다이렉트 전용 보험사로 수수료가 업계 최저 수준이며, 높은 공시이율(3.1%)로 복리 적립 효율성 극대화', badges: ['수수료 최저', '공시이율 1위'] },
            { company: '삼성생명', product: '인터넷 연금저축보험 (무)', highlight: '1위 생보사의 자산 운용 안정성 기반, 최저보증이율이 튼튼하며 장기 가입 보너스 혜택 탑재', badges: ['장기유지 보너스', '브랜드 1위'] },
            { company: '한화생명', product: '한화 e연금저축보험 (무)', highlight: '납입 유연성이 돋보이는 유니버셜 기능 지원, 급전 필요 시 해지 없이 중도 인출/추가 납입 가능', badges: ['납입 유연성', '중도인출 지원'] },
            { company: '미래에셋생명', product: '온라인 연금저축보험 (무)', highlight: '해외 자산 배분 펀드 연계 운용 노하우 반영, 고이율의 연금 자산 시뮬레이션 및 포트폴리오 다양성', badges: ['자산 배분 노하우', '다양한 포트폴리오'] },
            { company: '동양생명', product: '(무)수호천사 인터넷연금저축보험', highlight: '중저소득 직장인을 위한 적립금 가산 혜택 제공, 우수 고객 수수료 감면으로 해지 환급 가치 우위', badges: ['적립 가산', '수수료 감면'] },
            { company: '교보라이프플래닛', product: '(무)라이프플래닛 연금보험(비과세)', highlight: '세액공제 환급 대신 수령액 비과세 혜택 집중, 10년 거치 시 완벽한 비과세 계좌 전환 지원', badges: ['비과세 집중형', '이자소득세 면제'] },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-blue-50/20 rounded-[2.5rem] border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all text-left">
              <p className="text-xs font-black text-blue-600 mb-1">{item.company}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{item.product}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{item.highlight}</p>
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
            내 연금 맞춤 절세 무료 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);
export default AnnuityExplanation;
