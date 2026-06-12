import React from 'react';
import { 
  Building, Flame, ShieldAlert, CheckCircle, Clock, Quote, Compass, Activity, Sparkles 
} from 'lucide-react';

interface Props {
  onAction?: () => void;
}

export const PropertyExplanation: React.FC<Props> = ({ onAction }) => (
  <section className="py-24 bg-orange-50/10 px-4 relative overflow-hidden" id="property-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-orange-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            소상공인과 중소기업의 소중한 비즈니스 자산을 안전하게 보장
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            예측할 수 없는 화재와 고객 사고 대비,<br />
            <span className="text-orange-500">재물종합보험의 명확한 가입 기준</span>을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            건물, 시설, 인테리어 집기와 소중한 상품 재고 보장부터<br />
            시설소유자 배상책임, 점포 휴업 손해 일당 지원까지 통합 설계.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '1급 건물 할인', label: '콘크리트 구조 최고 할인', sub: '목조/판넬 대비 40% 이상 보험료 감면' },
          { num: '실손보상 특약', label: '비례보상 없는 안심 보장', sub: '설정한 가입 한도 내 실제 손해액 전액 지급' },
          { num: '의무 배상책임', label: '다중이용업소 화재/재난 의무', sub: '미가입 시 과태료 발생 대상 항목 완벽 매칭' },
          { num: '점포 휴업손해', label: '화재 복구 기간 임대료 지원', sub: '영업중단 손실액 매일 정액 보상' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-orange-100 rounded-[3rem] p-8 text-center shadow-sm hover:shadow-xl hover:border-orange-200 transition-all group">
            <p className="text-2xl font-black text-orange-500 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 핵심 3대 질환 가이드 */}
        <div className="bg-white rounded-[4rem] p-12 border border-orange-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-orange-500 rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-orange-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">재물종합 3대 필수 체크</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            사업장에서 화재나 누수 발생 시 가징 고액의 복구비가 요구되며,{' '}
            <span className="text-orange-500 font-black">소상공인 설계 시 반드시 챙겨야 하는 3대 리스크</span>
            입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '건물/시설 실손', label: '건물 뼈대와 고가의 인테리어 복구비', color: 'bg-orange-50/50 border-orange-100', badge: 'text-orange-700 bg-orange-100', desc: '화재로 시설 전체 소실 시, 감가상각을 제외한 새 인테리어 재조달 가액 기준으로 가입해야 복구 공사가 가능합니다.' },
              { title: '시설소유자배상', label: '매장 내 미끄러짐, 낙하물 등 고객 피해 배상', color: 'bg-amber-50/50 border-amber-100', badge: 'text-amber-700 bg-amber-100', desc: '바닥 물기로 인한 고객 골절 사고, 집기 탈락 등 대인/대물 배상책임을 최대 10억 원 한도까지 보완 적용합니다.' },
              { title: '점포 휴업손해', label: '화재 복구 기간 중 고정 비용 임차료 보상', color: 'bg-yellow-50 border-yellow-100', badge: 'text-yellow-700 bg-yellow-100', desc: '화재 사고로 한 달간 영업이 전면 중단되어도 매달 나가야 하는 임차료, 관리비, 직원 인건비를 1일 단위 정액으로 지급합니다.' },
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

          <div className="mt-8 p-6 bg-orange-50 rounded-3xl border border-orange-100">
            <p className="text-orange-700 font-black text-xs mb-1">⚠️ 비례보상의 함정 주의</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              만약 5억 원 가치의 상가를 2억 원만 가입(일부보험)했을 경우, 화재 사고 시 실제 발생한 피해의 **40%만 비례 보상**되어 복구 자금이 모자라 파산하는 비극이 발생합니다. 가치 평가 100% 매칭이 핵심입니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 재물 실손 작동 원리 */}
        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Building className="w-56 h-56 text-orange-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-orange-500 rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-orange-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">재물종합보험 자산 보호의 원리</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-orange-300 mb-2 flex items-center gap-2">
                  🔥 급배수 누수 및 아래층 침수 보상
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  매장 내부 하수관 누수로 영업이 중단되고 아래 점포 인테리어를 훼손했을 경우, 급배수 누출손해 특약과 시설소유자 배상책임으로 복구 비용 일체를 전액 보완받을 수 있습니다.
                </p>
              </div>

              <div className="p-6 bg-orange-500/20 rounded-[2.5rem] border border-orange-400/30 hover:bg-orange-500/30 transition-colors">
                <p className="font-black text-orange-300 mb-2 flex items-center gap-2">
                  🛡️ 대물 배상책임 (화재 확산 위험 대비)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  내 가게에서 시작된 불이 빌딩 전체나 옆 상가로 번졌을 경우 막대한 손실을 물어내야 합니다. 화재배상책임 한도를 대물 10억 원 이상으로 튼튼하게 보완해 주어야 연쇄 부도를 예방합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-orange-400 font-black text-xs mb-1 uppercase tracking-widest">💡 소상공인 요율 팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "음식점처럼 불을 많이 쓰는 업종은 요율이 높으므로 인덕션 조리 기기 위주 사용 시 고지 적용을 받아 요율을 일부 인하받을 수 있으며, 건물 내 타 고위험 업종(노래방 등)이 입점했는지 확인하여 최적 조정을 받는 것이 좋습니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4rem] p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-orange-400/30">
              <Sparkles className="w-3 h-3" /> 최신 재물 보장 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">강화되는 소상공인 의무 책임보험 정책</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              다중이용업소의 안전관리에 관한 특별법에 따라 화재 배상책임 가입이 전면 의무화되었으며, 1층에 위치한 일반음식점 및 판매시설 등도 재난배상책임보험의 법정 의무 가입 대상입니다. 미가입 일수에 따라 과태료가 부과되므로 요율 비교를 통한 신속한 대비가 필요합니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '재난배상책임 의무', product: '1층 100㎡ 이상 매장 필수', limit: '대인 1.5억 / 대물 10억 보장', note: '미가입 시 가입 불이행 기간에 따라 과태료 최대 300만 원 부과' },
              { company: '점포 휴업일당 지원', product: '화재로 인한 임시 영업 중단', limit: '1일 최대 10~20만 원 지급', note: '실제 피해 복구 완료 후 영업 재개 선언 시점까지 전격 정액 보호' },
              { company: '기계 및 전기 고장 보상', product: '산업/공장 모터 및 기계 과부하', limit: '전기적 오작동 수리비 한도', note: '제조 공장 및 물류 창고 핵심 생산 기계의 사고 고장 실비 정산' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {item.company}{' '}
                    <span className="text-orange-300 text-xs font-bold ml-1">{item.product}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{item.note}</p>
                </div>
                <p className="font-black text-orange-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{item.limit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-orange-100 rounded-[4rem] p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-orange-500" /> 재물종합보험 필수 가입 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 건축물대장 검증', desc: '건축물대장상 1급(콘크리트)인지 3급(판넬)인지 실질 등급을 대조하여 고지 위반 방지' },
              { step: '02. 인테리어 가치 재산정', desc: '임차 상가의 경우 임대인 건물 화재보험과 무관하게 내 돈으로 지출한 인테리어 가액 별도 설정' },
              { step: '03. 아래층 누수 특약', desc: '배관 막힘 등으로 역류하여 아래 매장에 피해를 줬을 때 원만하게 합의하기 위한 필수 특약 탑재' },
              { step: '04. 의무 책임 코드 입력', desc: '의무 가입 대상의 경우 화재/재난배상 일련 코드를 조회 등록하여 정상 가입 보고 완료' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-orange-50/30 rounded-3xl border border-orange-100/50 hover:border-orange-200 transition-colors">
                <div className="shrink-0 font-black text-orange-700 text-sm w-full sm:w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-orange-500 text-white rounded-[3.5rem] p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">재물 리모델링 핵심 5원칙</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 건물 구조 등급의 실제 현장 일치화<br />
              ② 비례보상 차단을 위한 100% 자산 설정<br />
              ③ 업종 전용 특약(음식물 배상 등) 탑재<br />
              ④ 아래층 피해 복구를 위한 누수 특약 추가<br />
              ⑤ 화재 시 임차료 방어를 위한 휴업손해 확보
            </p>
          </div>
          <div className="bg-white border border-orange-100 rounded-[3.5rem] p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-orange-500 w-5 h-5" /> 가입 주기 권장
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              상가 임대차 계약 갱신이나 매장 대규모 인테리어 리모델링 완료 시점에는 반드시 보험 자산 가액을 증액 조율해야 화재 발생 시 실질 복구가 보장됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-[4rem] p-12 border border-orange-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 대표 6개사 소상공인 재물종합자산보험 경쟁력 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '메리츠화재', product: '성공파트너재물보험', highlight: '다양한 업종 인수 능력 우수, 화재 및 누수 복구 일당 패키지 요율 강점 보유', badges: ['인수 한도 최고', '음식점 요율 우대'] },
            { company: '삼성화재', product: '비즈앤안심파트너', highlight: '종합 배상책임 범위 우수, 건물 급수 감면 및 화재 벌금 등 법률비용 포함 강점', badges: ['브랜드 경쟁력', '법률 비용 포함'] },
            { company: '현대해상', product: '성공마스터재물종합', highlight: '소상공인 맞춤 플랜 지원, 휴업 손해 일당 신속 지급 프로세스 및 누수 특약 강점', badges: ['휴업 정액 지급', '누수 보장 강화'] },
            { company: 'KB손해보험', product: 'KB자산안심재물종합', highlight: '프랜차이즈 가맹점 단체 할인 연동 및 다중이용업소 화재 의무보험 최적화', badges: ['단체 할인 혜택', '의무보험 즉시발행'] },
            { company: 'DB손해보험', product: '참좋은소상공인재물', highlight: '대형 창고 및 복합 소매점 자산 평가 경쟁력, 물류 자산 손실 보장 업계 최대', badges: ['물류창고 우대', '재고자산 실손'] },
            { company: '한화손해보험', product: '세이프투게더재물종합', highlight: '사무실 및 학원 전용 최저 요율 플랜 지원, 초경량 실속 가입 희망 매장에 유리', badges: ['초경량 요율', '학원/사무실 추천'] },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-orange-50/20 rounded-[2.5rem] border border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-orange-600 mb-1">{item.company}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{item.product}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{item.highlight}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-200"
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
      <div className="border-t border-orange-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "가게와 공장의 미래를 안전하게 보존하는 길,<br />
            <span className="text-orange-500">보험리밸런스의 명확한 자산 분석과 비즈니스 밸런스 설계로 함께합니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-orange-500 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-orange-600 transition-all hover:scale-105 shadow-2xl shadow-orange-400/30 shrink-0"
          >
            우리 매장 맞춤 보험 무료 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);
