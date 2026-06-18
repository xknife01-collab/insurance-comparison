import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Heart, ShieldCheck, Activity, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, AlertTriangle
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const PetExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-orange-50/10 px-2 sm:px-4 relative overflow-hidden" id="pet-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-orange-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            소중한 반려가족의 일생을 지키는 든든한 의료 안심막
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            나날이 비싸지는 반려동물 병원비 걱정 끝,<br />
            <span className="text-orange-500">합리적인 펫보험 선택 기준</span>을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            슬개골/고관절 탈구 보장부터 만성 피부염 및 구강 질환까지!<br />
            동물등록 시 최대 5% 추가 할인과 다견 가정 할인 혜택 매칭.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '동물등록 할인', label: '등록번호 확인 시 즉시 적용', sub: '2% ~ 5% 보험료 추가 할인 혜택' },
          { num: '슬개골 기본/특약', label: '소형견 다발 질환 보장', sub: '대기기간 1년 여부 반드시 확인 필요' },
          { num: '보장 비율 선택', label: '50%부터 최대 90% 보상', sub: '자기부담금 1만~10만 원 설계 매칭' },
          { num: '실손 의료비 청구', label: '통원/입원 일당 15~30만', sub: '수술 회당 최대 200~250만 원 보장' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-orange-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-orange-200 transition-all group">
            <p className="text-2xl font-black text-orange-500 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 핵심 3대 질환 가이드 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-orange-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-orange-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">필수 체크 3대 핵심 보장</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            소중한 아이의 병원비 중 가장 빈번하게 발생하며,{' '}
            <span className="text-orange-500 font-black">펫보험 설계 시 필수로 챙겨야 할 3대 주요 영역</span>
            입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '슬개골/고관절', label: '소형견 90% 이상 겪는 유전적 관절 질환', color: 'bg-orange-50/50 border-orange-100', badge: 'text-orange-700 bg-orange-100', desc: '슬개골 탈구 및 고관절 형성 부전 등 대부분 특약으로 제공되며, 가입 후 1년 대기기간 미적용 조건 확인 필수' },
              { title: '피부/귓병 보장', label: '만성으로 발전하기 쉬운 잦은 염증 질환', color: 'bg-amber-50/50 border-amber-100', badge: 'text-amber-700 bg-amber-100', desc: '아토피, 귓병, 지루성 피부염 등 한 번 발생 시 치료가 장기화되므로 통원 일수 한도가 넉넉한 상품 선택 우대' },
              { title: '구강/치과 보장', label: '노령견 진입 시 가장 수술 비용이 큰 치아', color: 'bg-yellow-50 border-yellow-100', badge: 'text-yellow-700 bg-yellow-100', desc: '스케일링 및 단순 치과 보장은 제외되는 경우가 대다수이나, 최근 일부 사에서 발치 및 치주질환 수술 특약 확대 추세' },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 w-full sm:w-24 text-center ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm break-keep">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-orange-50 rounded-3xl border border-orange-100">
            <p className="text-orange-700 font-black text-xs mb-1">⚠️ 가입 전 주의사항 (대기기간)</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              펫보험은 가입 즉시 효력이 발생하는 상해 치료와 달리, **질병 보장은 30일**, **슬개골 등 특정 관절 질환은 1년(또는 6개월)**의 면책 대기기간이 적용되므로 건강할 때 미리 가입해두는 것이 가장 유리합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 반려 실손 vs 사람 실손 비교 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Heart className="w-56 h-56 text-orange-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-orange-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">반려동물 실손의료비의 작동 원리</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-orange-300 mb-2 flex items-center gap-2">
                  🐾 비급여 100% 동물병원 의료비
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  국민건강보험이 없는 반려동물은 동물병원마다 의료비 편차가 크며, 진료비 전체를 보호자가 100% 부담해야 해 수술 시 가계에 큰 부담이 됩니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-orange-500/20 rounded-2xl md:rounded-[2.5rem] border border-orange-400/30 hover:bg-orange-500/30 transition-colors">
                <p className="font-black text-orange-300 mb-2 flex items-center gap-2">
                  🛡️ 펫 실손보험 (보장률 50~90% 매칭)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  가입자가 지출한 실제 치료비에서 자기부담금(1~10만 원)을 뺀 후, 선택한 보장률(50%~90%)만큼 보험사에서 지급받는 구조입니다. (예: 50만 원 치료비 발생 시 자기부담금 3만 원 차감 후 80% 보장 시 약 37.6만 원 지급)
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-orange-400 font-black text-xs mb-1 uppercase tracking-widest">💡 품종별 요율 설계 팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "견종/묘종별로 취약한 유전 질환 요율이 각 보험사마다 상이합니다. 말티즈, 푸들, 포메라니안 등 우리나라 인기 견종일수록 슬개골 보장이 튼튼하고 갱신 시 인상 폭이 적은 상품을 비교 매칭받으셔야 합니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 동물등록제 및 간편 청구 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-orange-400/30">
              <Sparkles className="w-3 h-3" /> 최신 펫헬스케어 동향
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">정부의 반려식별제 의무화와 즉시 청구 서비스</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              내장형/외장형 등록동물에 대한 보험료 즉시 할인 제도가 확대 시행되고 있습니다. 또한 번거로운 종이 영수증 제출 없이, 동물병원 키오스크 및 모바일 앱 터치 한 번으로 보험금을 청구하는 편리한 병원들이 점점 늘어나고 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '국가동물등록 할인', product: '내장형 칩/외장형 식별 번호', limit: '2% ~ 5% 보험료 영구 감면', note: '가입 시 등록증 또는 내장 번호 입력 시 바로 자동 적용 완료' },
              { company: '원스톱 현장 청구', product: '보험금 현장 간편 접수 서비스', limit: '제휴 서류 생략 모바일 연동', note: '제휴 병원에서 진료 후 원무과에서 팩스/앱 없이 직접 전송 가능' },
              { company: '노령견 안심 가입 연령', product: '신규 가입 상한선 연장 트렌드', limit: '최대 만 10세까지 첫 가입 가능', note: '과거 만 8세 한도에서 확대되어 노령 반려동물도 초기 진입 개방' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {maskCompany(item.company, isUnlocked)}{' '}
                    <span className="text-orange-300 text-xs font-bold ml-1">{maskProductName(item.product, isUnlocked)}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-orange-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{maskText(item.limit, isUnlocked)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-orange-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-orange-500" /> 합리적 펫보험 스마트 가입 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 대기기간 확인', desc: '상해 사고 보장 개시일과 질병 보장 면책기간(30일) 및 관절 수술 면책기간(1년) 유무 대조' },
              { step: '02. 갱신 기간 비교', desc: '3년/5년 등 장기 갱신형의 경우 아이 연령 상승에 따른 예상 누적 보험료 인상폭 가늠' },
              { step: '03. 다가구 다견 할인', desc: '동일 가정 내 2마리 이상의 반려견/반려묘 가입 시 가구당 추가 5~10% 패키지 할인 유무 확인' },
              { step: '04. 보장비율 조절 팁', desc: '월 부담액을 낮추기 위해 보장 비율을 80%에서 70%로 낮추고 자기부담금을 적절히 상향 세팅' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-orange-50/30 rounded-3xl border border-orange-100/50 hover:border-orange-200 transition-colors">
                <div className="shrink-0 font-black text-orange-700 text-sm w-full sm:w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-orange-500 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">펫보험 리모델링 핵심 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 동물등록 완료 후 즉시 2~5% 할인 적용<br />
              ② 슬개골 특약이 제외되어 있는지 확인<br />
              ③ 질병 통원 1일 한도 금액(15~30만) 비교<br />
              ④ 다견 가정 추가 할인 여부 체크<br />
              ⑤ 갱신 주기 최대 연장으로 연간 인상 최소화
            </p>
          </div>
          <div className="bg-white border border-orange-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-orange-500 w-5 h-5" /> 가입 최적 연령대
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              질병 이력이 생기기 전인 만 2세~5세 사이가 가입 승인 확률이 높고 보험료 부담이 가장 적은 최적의 타이밍입니다. 이미 기왕력이 있는 경우 해당 부위가 면책되어 가입될 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-orange-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 Top 6 보험사 펫실손의료비보험 상품 경쟁력 전수 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '메리츠화재', product: '펫퍼민트 Puppy&Cat', highlight: '국내 대표 펫보험, 수술 횟수 무제한 및 보장 한도 넉넉, 자동 간편 청구 병원 최다', badges: ['시장 선두 상품', '통원 한도 우수'] },
            { company: '삼성화재', product: '다이렉트 위풍댕댕', highlight: '다양한 견종 요율 세분화, 대인 배상책임 및 반려인 동반 보장 옵션 경쟁력 보유', badges: ['다이렉트 요율', '대인배상 포함'] },
            { company: '현대해상', product: '굿앤굿 우리펫보험', highlight: '유연한 갱신 주기 설계 가능, 내장칩 할인과 더불어 잦은 잔병치레 치료 특약 최적화', badges: ['갱신 유연성', '잔병치레 케어'] },
            { company: 'KB손해보험', product: 'KB금쪽같은 펫보험', highlight: '만성 피부염/알레르기 치료비 특약 한도 우수, 유기견 입양 시 2년간 추가 할인', badges: ['피부염 강점', '유기견 가치 우대'] },
            { company: 'DB손해보험', product: '아이러브펫블리', highlight: '높은 수술비 및 MRI/CT 정밀 진단비 특약 보장, 대형견 요율 테이블 경쟁력', badges: ['MRI 특약', '대형견 요율 강점'] },
            { company: '한화손해보험', product: '펫투게더 플러스', highlight: '실속형 50% 보장 플랜 지원으로 보험료 다이어트 최적화, 슬개골 탈구 보장 완비', badges: ['실속 플랜 지원', '최저 요율 매칭'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-orange-50/20 rounded-2xl md:rounded-[2.5rem] border border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-orange-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
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
            "가족의 이름으로 끝까지 안심할 수 있는 반려 생활,<br />
            <span className="text-orange-500">진심을 담은 분석과 최적화 설계로 시작하는 반려동물의 든든한 파트너십입니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-orange-500 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-orange-600 transition-all hover:scale-105 shadow-2xl shadow-orange-400/30 shrink-0"
          >
            우리 아이 맞춤 보험 무료 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);
