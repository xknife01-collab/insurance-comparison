import React from 'react';
import {
  Scale, Shield, FileText, CheckCircle, Clock, Quote, Compass, Activity, Sparkles, Award
} from 'lucide-react';

interface Props {
  onAction?: () => void;
}

export const LegalExplanation: React.FC<Props> = ({ onAction }) => (
  <section className="py-24 bg-slate-50/10 px-2 sm:px-4 relative overflow-hidden" id="legal-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-indigo-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            갑작스러운 법적 공방으로부터 가계를 지켜주는 수호 장막
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            나날이 급증하는 변호사 및 송달 수수료 걱정 끝,<br />
            <span className="text-indigo-600">합리적인 법률비용보험 선택 기준</span>을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            민사소송 변호사 보수 및 인지대/송달료 지원부터 형사방어비용까지!<br />
            대법원 전자소송 이용 시 최대 5% 보험료 우대 혜택 매칭.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '전자소송 할인', label: '인터넷 소송 진행 동의 시 적용', sub: '5% 월 보험료 평생 우대 감면 혜택' },
          { num: '급발진 분쟁 보장', label: '최신 급발진 대응 전용 특약', sub: 'EDR 해석 및 기술 검증 비용 지원' },
          { num: '비례 공제 요율', label: '10% 비례 자기부담금 설정 시', sub: '매월 보험료 10% 추가 세이빙 할인' },
          { num: '변호사 보수 한도', label: '심급별 최대 3,000만원 보장', sub: '1심, 2심, 3심 독립적인 한도 매핑' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-indigo-100/50 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
            <p className="text-2xl font-black text-indigo-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 법률비용 3대 핵심 보장 가이드 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-indigo-100/60 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-indigo-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">법률비용 3대 핵심 가이드</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            나에게 닥칠 수 있는 소송 사건 중 가장 빈번하게 일어나며,{' '}
            <span className="text-indigo-600 font-black">보험 가입 시 반드시 대조해야 하는 3대 보장 구성</span>
            입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '변호사 보수', label: '법정 대리인 변호사 선임 착수금 및 성공 보수', color: 'bg-indigo-50/50 border-indigo-100/50', badge: 'text-indigo-700 bg-indigo-100', desc: '대법원 규칙 한도 내에서 심급별 실손 보상하며, 1심 판결 후 항소 시 2심에서도 동일 한도가 독립 리셋되는지 확인 필요' },
              { title: '공적 법원비용', label: '소송 개시 시 납부하는 인지대 및 송달용 우편료', color: 'bg-slate-50/50 border-slate-100', badge: 'text-slate-700 bg-slate-100', desc: '소가(소송금액)가 커질수록 법원 인지액도 눈덩이처럼 불어나므로 인지대 실비 한도가 최소 500만 원 이상 설계되어야 안전' },
              { title: '사전 대면 상담', label: '분쟁 촉발 시 소송 제기 전 변호사 자문료 지원', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '소송을 제기하기 전에 내용증명 발송이나 가처분 신청 등 변호사와의 사전 상담 수수료를 실손 보전해주는 상담 특약 강점' },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 w-full sm:w-24 text-center ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm break-keep">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold break-keep">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/40">
            <p className="text-indigo-800 font-black text-xs mb-1">⚠️ 가입 전 면책 범위 유의사항</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              법률비용보험은 대부분 **'가족 간의 소송(가사 소송)'**, **'도박 및 불법 행위 관련 소송'**, **'고의로 인한 고소사건'** 등은 보상에서 엄격히 제외합니다. 또한 기왕력처럼 가입일 이전에 이미 소인(소송의 원인)이 발생한 분쟁에 대해서는 보장받을 수 없으니 사전 확인이 요구됩니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 민사소송비용 작동 원리 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Scale className="w-56 h-56 text-indigo-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-indigo-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">소송비용 확정과 실손보험의 비례 원칙</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-indigo-300 mb-2 flex items-center gap-2">
                  ⚖️ 승소 시 소송비용 확정 절차
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  소송에서 승소하면 법원에 '소송비용액 확정 신청'을 통해 상대방 측에게 대법원 규칙 한도 내의 변호사 보수 및 인지대/송달료를 상환 청구하여 돌려받을 수 있습니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-indigo-600/25 rounded-2xl md:rounded-[2.5rem] border border-indigo-400/30 hover:bg-indigo-600/40 transition-colors">
                <p className="font-black text-indigo-300 mb-2 flex items-center gap-2">
                  🛡️ 실손 보상 비례 분담 원칙
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  법률비용보험은 실제 부담한 '실비'를 한도 내에서 보상하는 실손형 상품입니다. 따라서 2개 이상의 보험사에 가입하더라도 변호사 선임비를 한도 초과하여 중복 지급받을 수 없으며, 각 보험사가 한도 한도별로 비례 분담하여 보상합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-indigo-400 font-black text-xs mb-1 uppercase tracking-widest">💡 변호사 보수 규칙 해설</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "대법원 규칙(변호사보수의 소송비용 산입에 관한 규칙)에 의거하여, 민사소송금액의 규모에 따라 상대방에게 청구할 수 있는 보장 금액 상한선이 정의됩니다. 이 규칙과 보험의 심급별 보장액을 세심하게 매칭 설계해야 소송비 손실을 제로화할 수 있습니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: EDR 급발진 소송 특약 및 전자소송 5% 할인 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-indigo-400/30">
              <Sparkles className="w-3 h-3" /> 최신 법률보험 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">급발진 사고 방어 특약 및 대법원 전자소송 할인제</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              최근 완성차량의 급발진 의심 사고가 증가함에 따라, 운전자 및 민사 법률비용 특약 내에 '차량 급발진 분쟁 변호사 선임 비용'을 보장하는 신설 특약이 주목받고 있습니다. 또한 대법원 인터넷 전자소송 활용 시 서류 인지대를 감면받는 것과 연계되어 보험료 추가 할인제가 도입되었습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '대법원 전자소송 할인', product: '인터넷 전자 제출 이용자 우대', limit: '5% 월 보험료 평생 감면', note: '대법원 전자소송 시스템 연동 동의 시 요율 할인 적용 완료' },
              { company: '급발진(EDR) 분쟁 특약', product: '급발진 의심 소송 비용 한도 증액', limit: '사고당 최고 2,000만원 한도', note: '제조사 상대 소송 시 분석 및 기술 검증 변호 비용 지원' },
              { company: '법률 상담 바우처 제공', product: '1:1 대면 및 유선 법률 상담 연동', note: '소송 전 내용증명 및 약정서 작성 지원 전담 변호사 상담 보조' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {item.company}{' '}
                    <span className="text-indigo-300 text-xs font-bold ml-1">{item.product}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{item.note}</p>
                </div>
                <p className="font-black text-indigo-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{item.limit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-indigo-100/50 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-indigo-600" /> 합리적 법률비용보험 스마트 설계 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 심급별 독립 한도', desc: '1심 패소 후 2심 항소 시 변호사 선임 한도가 축소되지 않고 심급별 독립적으로 지급되는지 검사' },
              { step: '02. 비례 공제 할인 연동', desc: '자부담 10% 비례공제를 적용하면 매월 정기 보험료가 10% 일괄 할인 적용되는 요율 대조' },
              { step: '03. 교통/형사 특약 병합', desc: '운전자보험 내 교통사고 형사방어비용과 일반 민사소송 법률비용 특약의 중복 보장 여부 조회' },
              { step: '04. 사전 상담 특약 가입', desc: '소송 개시 전 조기에 상담을 통해 합의 종결을 돕는 변호사 1:1 상담 특약 탑재 유무 확인' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-indigo-50/20 rounded-3xl border border-indigo-100/30 hover:border-indigo-200/50 transition-colors">
                <div className="shrink-0 font-black text-indigo-800 text-sm w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-indigo-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">법률보장 최적화 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 대법원 전자소송 이용 동의로 5% 절감<br />
              ② 비례 자부담 방식으로 10% 추가 요율 할인<br />
              ③ 1심부터 3심까지 심급별 개별 리셋 확인<br />
              ④ 최근 핫한 EDR 급발진 특약 탑재 완료<br />
              ⑤ 가족간 소송 면책 약관 제외 확인
            </p>
          </div>
          <div className="bg-white border border-indigo-100/50 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-indigo-600 w-5 h-5" /> 분쟁 전 가입의 중요성
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              소송의 핵심인 갈등(체납, 미반환 등)이 이미 시작된 시점 이후에 보험에 가입하는 경우 보장이 절대 불가능합니다. 마치 화재 후 화재보험 가입이 안 되는 것과 같으므로 일상 분쟁이 생기기 전 사전 안심망 구축이 강력 권장됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-indigo-100/50 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 대표 6대 보험사 법률비용손해 특약 및 보험 경쟁력 분석
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '삼성화재', product: '다이렉트 법률파트너', highlight: '업계 최고 수준의 변호사 선임비 및 대면 상담 지원 연동, 높은 신뢰성의 빠른 실손 청구 지급 처리', badges: ['한도 우수성', '상담 특약 우수'] },
            { company: '현대해상', product: 'H&H 권리보호 법률비용', highlight: '다양한 소송 범위 설계 지원 및 갱신 주기 연장 트렌드 최적화, 비례 공제 할인율 강점', badges: ['소송 범위 특화', '비례 공제 우대'] },
            { company: 'DB손해보험', product: '프로미라이프 법률안심', highlight: '민사 소송 외에도 다양한 행정 소송 및 생활 법률 비용 보전 집중, 가성비 기초요율 설계', badges: ['행정소송 강점', '가성비 요율'] },
            { company: 'KB손해보험', product: '마이케어 법률비용보장', highlight: '급발진 의심 대응 변호사 선임 비용 업계 최초 선제 탑재, 스마트 전자소송 5% 할인 보장', badges: ['급발진 특약', '전자소송 우대'] },
            { company: '메리츠화재', product: '(무)법률방패 수호신', highlight: '착수금 실손 한도를 든든히 확보하여 소송 초기 대응력 극대화, 간편 가입 승인 제도', badges: ['착수금 보장 강점', '간편 심사'] },
            { company: '한화손해보험', product: '다이렉트 든든법률비용', highlight: '최저 수준의 기본 월 납입료로 실속 민사 중심의 다이어트형 플랜 조율 적합', badges: ['실속 플랜 지원', '최저 기초료'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-indigo-50/20 rounded-2xl md:rounded-[2.5rem] border border-indigo-100/40 hover:border-indigo-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-indigo-600 mb-1">{item.company}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{item.product}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{item.highlight}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200"
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
      <div className="border-t border-indigo-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "법에 대처하는 가장 스마트한 자세, 일상 소송 걱정 없는 생활 안심,<br />
            <span className="text-indigo-600">최적의 법률비용 특약 비교 매칭으로 가계 자산을 견고하게 호위합니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-indigo-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-indigo-700 transition-all hover:scale-105 shadow-2xl shadow-indigo-600/30 shrink-0"
          >
            내 상황에 딱 맞는 법률보험 무료 설계하기
          </button>
        )}
      </div>

    </div>
  </section>
);
