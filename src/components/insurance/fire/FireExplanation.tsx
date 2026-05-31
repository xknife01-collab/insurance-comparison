import React from 'react';
import { Home, ShieldCheck, Flame, Award, Sparkles, CheckCircle, Clock, Quote, Compass, AlertTriangle } from 'lucide-react';

interface Props {
  onAction?: () => void;
}

export const FireExplanation: React.FC<Props> = ({ onAction }) => (
  <section className="py-24 bg-red-50/10 px-4 relative overflow-hidden" id="fire-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-red-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            소중한 내 보금자리를 지키는 확실한 재산 안전망
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            눈 깜짝할 사이 모든 것을 앗아가는 화재 사고,<br />
            <span className="text-red-500">집주인과 세입자별 맞춤 설계 기준</span>을 제안합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            건물 소실 손해와 이웃집 배상 책임액 매칭!<br />
            급배수 누수 보장과 임시거주 비용 지급 조건 비교까지.
          </p>
        </div>
      </div>

      {/* ── 핵심 지표 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '실손 보상 설계', label: '가입 한도 내 실제 손해 전액', sub: '비례 보상이 아닌 실손 비례 여부 대조' },
          { num: '급배수 시설 누수', label: '누수로 젖은 마루/벽지 교체', sub: '누수 배관 자체 수리비는 제외됨에 유의' },
          { num: '임시 거주비 지원', label: '화재로 입주 불가 시 일당 지급', sub: '최대 90일 동안 1일 10만 원 한도 숙식 지원' },
          { num: '이웃집 화재 전파', label: '화재배상책임 대물 최대 20억', sub: '벌금 특약 최대 2천만 원 함께 보완' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-red-100 rounded-[3rem] p-8 text-center shadow-sm hover:shadow-xl hover:border-red-200 transition-all group">
            <p className="text-2xl font-black text-red-500 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 임차자배상 vs 화재배상 */}
        <div className="bg-white rounded-[4rem] p-12 border border-red-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-red-500 rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-red-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">집주인과 세입자의 가입 목적 차이</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            화재 보험은{' '}
            <span className="text-red-500 font-black">피보험자의 법적 신분과 목적물 책임 구조</span>에 따라 완전히 다른 성격의 특약을 추가해야 합니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '집주인 (임대인)', label: '건물 노후 사고 배상 및 소실 원상 복구', color: 'bg-red-50/50 border-red-100', badge: 'text-red-700 bg-red-100', desc: '건물 본체 화재 소실 보장 및 누수로 발생한 아랫집 배상책임(임대인 배상책임) 가입 필수' },
              { title: '세입자 (임차인)', label: '집주인에 대한 원상 복구 책임 및 가재도구', color: 'bg-amber-50/50 border-amber-100', badge: 'text-amber-700 bg-amber-100', desc: '내 과실로 불이 났을 때 건물주에게 갚아야 하는 임차자배상책임 및 내 고가 가전/의류 보장 필수' },
              { title: '구상권 리스크', label: '건물주가 가입했어도 세입자 책임 시 청구', color: 'bg-yellow-50 border-yellow-100', badge: 'text-yellow-700 bg-yellow-100', desc: '집주인이 화재보험을 들어놨더라도 세입자 잘못이면 보험사는 건물 복구 후 세입자에게 소송(구상)을 걸어 환수합니다.' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-red-50 rounded-3xl border border-red-100">
            <p className="text-red-700 font-black text-xs mb-1">⚠️ 아파트 단체보험의 맹점</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              관리비에 포함된 단체 화재보험은 보장 금액이 시세보다 매우 낮게 설정(건물 평당 100~200만 원 선)되어 있어 전소 시 원상복구가 불가능합니다. 또한 가재도구와 이웃집 배상 한도가 턱없이 적으므로, 개인 화재보험을 1만 원 내외로 보완 가입해 두는 것이 일반적입니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 급배수시설누출손해 */}
        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Flame className="w-56 h-56 text-red-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-red-500 rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-red-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">급배수시설 누수 보장의 작동 구조</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-red-300 mb-2 flex items-center gap-2">
                  💧 급배수누출 특약 (우리집 도배/장판 피해 복구)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  배관 동파나 파열로 물이 흘러넘쳐 우리집 바닥 마루가 썩거나 도배지가 손상된 비용을 가입 한도(대개 300~500만 원) 내에서 실비 지급합니다.
                </p>
              </div>

              <div className="p-6 bg-red-500/20 rounded-[2.5rem] border border-red-400/30 hover:bg-red-500/30 transition-colors">
                <p className="font-black text-red-300 mb-2 flex items-center gap-2">
                  🤝 일상생활배상책임 (이웃집 피해 배상 복구)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  누수로 인해 아랫집 도배가 젖고 천장에서 물이 샐 때, 아랫집 손해를 물어주는 비용은 화재보험 내 '가족일상생활배상책임' 특약(한도 1억)을 통해 해결합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-red-400 font-black text-xs mb-1 uppercase tracking-widest">💡 누수 보장 가입 시 핵심 확인 팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "급배수시설누출손해 특약은 아파트나 공동주택 연식에 따라 가입 조건이 다릅니다. 건물이 20년 이상 노후되었을 경우 보험사에서 급배수 특약 가입을 인수 거절하거나 본인부담금을 높게 책정하므로, 건물 연식이 더 오래되기 전에 미리 가입해 두는 것이 중요합니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 가전제품 고장수리 및 도난 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4rem] p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-red-400/30">
              <Sparkles className="w-3 h-3" /> 최신 생활 밀착형 특약 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">불만 끄는 보험은 옛말, 일상 가전 수리비 지원</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              최근 주택화재보험은 화재 발생 시 피해뿐만 아니라 TV, 냉장고, 세탁기, 에어컨 등 가전제품 고장 시 무상 보증 수리비(AS비용)를 연간 한도 내에서 보장하는 특약이 큰 인기를 얻고 있습니다. 또한 도난 사고 발생 시 가재도구 도난 실비 특약도 선택 가능합니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '6대/12대 가전 수리', product: '제조사 공식 수리비 보전', limit: '연간 100만 원 한도 실손 보장', note: '구입 후 10년 미만 가전 대상, 자부담 2만 원 차감 후 지급' },
              { company: '임시 거주비 신속 지급', product: '화재 직후 숙식 거주 정산', limit: '1일 최대 10만 원 (90일 한도)', note: '숙박업소 이용 영수증 및 식대 비용 실비 청구 프로세스 지원' },
              { company: '붕괴 및 침강 손해', product: '주변 공사로 인한 균열 대책', limit: '건물 가입금액 한도 실손 보장', note: '단독주택 등 주변 토목공사 영향으로 건물 균열/붕괴 시 보장' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {item.company}{' '}
                    <span className="text-red-300 text-xs font-bold ml-1">{item.product}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{item.note}</p>
                </div>
                <p className="font-black text-red-400 text-sm shrink-0 ml-4">{item.limit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-red-100 rounded-[4rem] p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-red-500" /> 주택 화재보험 가입 전 필수 자가진단표
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 비례 vs 실손 체크', desc: '과거 가입한 화재보험이 비례보상형인지 파악하고, 전손 시 100% 보장하는 실손보상형으로 신규 매칭' },
              { step: '02. 건물 평당 단가 설정', desc: '최근 건설 자재 및 인건비 상승을 고려하여 건물 가입 금액을 현실적으로 평당 400~500만 원 선 적용' },
              { step: '03. 이사 시 주소 등록', desc: '주택화재보험은 부동산에 종속되므로 이사 후 보험사에 주소지 승인을 거치지 않으면 사고 시 보장 거절' },
              { step: '04. 세입자 구상권 방어', desc: '전세/월세 입주자는 계약 종료 시 원상복구 의무가 있으므로 임차자배상책임 한도를 확실히 확보' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-red-50/30 rounded-3xl border border-red-100/50 hover:border-red-200 transition-colors">
                <div className="shrink-0 font-black text-red-700 text-sm w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-red-500 text-white rounded-[3.5rem] p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">화재보험 리모델링 5대 원칙</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 관리비 단체보험 한도 부족 확인 및 보완<br />
              ② 아파트 연식 오래되기 전 급배수 특약 탑재<br />
              ③ 임차인인 경우 임차자 배상책임 탑재<br />
              ④ 실질 건물 원상복구 시세 기준 한도 증액<br />
              ⑤ 6대 가전제품AS 보장 연동 여부 대조
            </p>
          </div>
          <div className="bg-white border border-red-100 rounded-[3.5rem] p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-red-500 w-5 h-5" /> 리모델링 시점
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              기존 장기 보장성 보험 가입 시 끼워넣은 화재 특약은 비례보상이거나 한도가 작아 비효율적인 경우가 많습니다. 단독 화재보험을 월 1만 원대로 깔끔하게 분리 설계하는 것이 훨씬 실속있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-[4rem] p-12 border border-red-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 Top 6 손해보험사 주택화재보험 상품 전수 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '메리츠화재', product: '올인원 주택화재보험', highlight: '급배수시설누출손해 보장 조건 완화, 아파트 단지 특성에 맞춰 저렴한 설계 지원', badges: ['누수 보장 우수', '아파트 전용 요율'] },
            { company: '삼성화재', product: '다이렉트 주택화재보험', highlight: '다이렉트 요율로 가성비 극대화, 모바일 즉시 청구 연동 및 대형 가전 AS 특약 지원', badges: ['다이렉트 요율', '가전 수리 강점'] },
            { company: '현대해상', product: 'H주택화재보험', highlight: '세입자 전용 임차자배상 및 이웃집 전파 피해 배상 한도 우수, 빌라/연립 최적화', badges: ['세입자 안심 설계', '대물배상 우수'] },
            { company: 'DB손해보험', product: '다이렉트 주택화재보험', highlight: '단독주택 및 상가주택 복구비용 요율 테이블 경쟁력, 노후 빌라 특별 심사 지원', badges: ['단독주택 특화', '노후주택 특별심사'] },
            { company: 'KB손해보험', product: 'KB 주택화재보험', highlight: '일상생활배상책임 한도 우수, 누수로 인한 아랫집 배상 처리 및 화재 벌금 일괄 보장', badges: ['배상책임 최고한도', '벌금 특약 완비'] },
            { company: '한화손해보험', product: '한화 다이렉트 주택화재보험', highlight: '실속형 최저 보험료 플랜 지원, 필수 특약만 골라 설계하여 월 5~7천원대 가입 지원', badges: ['최저가 플랜 지원', '실속 맞춤 설계'] },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-red-50/20 rounded-[2.5rem] border border-red-100 hover:border-red-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-red-600 mb-1">{item.company}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{item.product}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{item.highlight}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-red-700 bg-red-100 px-3 py-1 rounded-full border border-red-200"
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
      <div className="border-t border-red-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "가장 편안해야 할 공간을 위한 영구적인 화재 안심막,<br />
            <span className="text-red-500">정밀한 거주 분석과 합리적인 요율 조합으로 설계하는 스마트한 주택 화재 대비입니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-red-500 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-red-600 transition-all hover:scale-105 shadow-2xl shadow-red-400/30 shrink-0"
          >
            내 집 주거 화재보험 무료 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);
export default FireExplanation;
