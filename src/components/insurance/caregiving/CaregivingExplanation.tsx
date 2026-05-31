import React from 'react';
import { 
  Activity, Search, ShieldCheck, HeartPulse, ChevronRight, 
  HelpCircle, AlertCircle, RefreshCw, Award, CheckCircle2, Heart, Sparkles,
  Hotel, HeartHandshake, UserCheck, Calendar
} from 'lucide-react';

interface Props {
  onAction?: () => void;
}

export const CaregivingExplanation: React.FC<Props> = ({ onAction }) => {
  return (
    <div className="mt-16 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* ── 1. 프리미엄 HERO 헤더 섹션 ── */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl border border-purple-500/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-60"></div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-500/20 text-purple-300 rounded-full text-xs font-black uppercase tracking-[0.25em] border border-purple-500/30">
            <HeartPulse size={14} className="text-purple-400 animate-pulse" /> Caregiving Insurance Guide
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.15]">
            가장 현실적인 노후 준비와 돌봄의 품격<br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
              간병인 매칭과 미래 물가 방어
            </span>
          </h2>
          <p className="text-purple-200/80 font-semibold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            하늘의 별 따기보다 힘든 간병인 구인 대란 속에서, 보험사가 직접 파견하는 **'지원형(서비스)'**과 가입자가 구한 뒤 일당을 받는 **'사용형(현금)'**의 정교한 비교 및 고물가 극복을 위한 **'체증형 특약'**을 상세 분석해 드립니다.
          </p>
        </div>
      </div>

      {/* ── 2. 핵심 4대 지표 배너 (Summary Cards) ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: '간병인 지원일당 (파견형)',
            desc: '인건비 폭등 리스크 제로! 보험사 제휴 협력사에서 48시간 내에 전문 간병인을 입원실로 직접 파견 지원.',
            tag: '인플레이션 완전 방어',
            tagBg: 'bg-purple-50 text-purple-700 border-purple-200',
            icon: <Hotel className="w-5 h-5 text-purple-600" />
          },
          {
            title: '간병인 사용일당 (현금형)',
            desc: '원하는 간병인을 마음대로 선택 고용하거나 가족이 직접 간병하더라도 일당 정액 현금(최대 15만원) 지급.',
            tag: '높은 자유도와 비갱신',
            tagBg: 'bg-violet-50 text-violet-700 border-violet-200',
            icon: <HeartHandshake className="w-5 h-5 text-violet-600" />
          },
          {
            title: '간병비 체증형 설계',
            desc: '고령기 간병비 부담 가치를 방어하기 위해, 가입 금액이 5년 또는 10년마다 10%씩 평생 우상향하는 특약.',
            tag: '2026년 필수 추천 선택',
            tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
            icon: <RefreshCw className="w-5 h-5 text-amber-600" />
          },
          {
            title: '간호·간병 통합 서비스',
            desc: '병동 간호 인력이 공동 간병을 책임져 보호자 상주가 없는 통합 병동 입원 시에도 하루 일당 정액 지급.',
            tag: '현대 병원 필수 특약',
            tagBg: 'bg-slate-50 text-slate-700 border-slate-200',
            icon: <UserCheck className="w-5 h-5 text-slate-600" />
          }
        ].map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-10px_rgba(147,51,234,0.08)] transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                  {card.icon}
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${card.tagBg}`}>
                  {card.tag}
                </span>
              </div>
              <h4 className="text-lg font-black text-gray-900 tracking-tight">{card.title}</h4>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. GUIDE 01: 지원형 vs 사용형 장단점 완벽 대조 (Tabs/Table/Grids) ── */}
      <div className="bg-white rounded-[4rem] p-8 md:p-16 border border-gray-100 shadow-xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
              <Search size={28} />
            </div>
            <div>
              <p className="text-xs text-purple-600 font-black tracking-widest uppercase">Guide 01</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">지원형(파견) vs 사용형(현금) 선택 전략</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-bold max-w-md">
            자녀가 타지에 있어 간병인을 직접 구하고 매칭하는 과정 자체가 부담스럽다면 **지원형**을, 비갱신형으로 매달 나가는 보험료를 고정하고 가족 간병을 염두에 둔다면 **사용형**이 현명합니다.
          </p>
        </div>

        {/* 대조 테이블 그리드 */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* 1. 간병인 지원일당 (파견 서비스 제공형) */}
          <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-purple-100 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-black text-purple-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-ping"></span> 간병인 지원일당 (서비스 제공)
                </h4>
                <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">인프라 활용 강점</span>
              </div>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                보험금 청구 대신 콜센터로 서비스를 접수하면, 제휴를 맺은 간병 전문 업체 소속의 전문 간병인을 지정 병실로 보내 줍니다.
              </p>
              <div className="space-y-3 bg-white p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>📌 인건비 변동 리스크</span>
                  <span className="text-purple-600 font-black">완전 없음 (보험사가 100% 부담)</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>📌 구인 편의성</span>
                  <span className="text-purple-600 font-black">매우 우수 (신청만 하면 즉시 파견)</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>📌 상품 구조</span>
                  <span className="text-red-500 font-black">3년 / 5년 주기 갱신형 (고연령 갱신 폭탄 대비 필요)</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg text-center">
              🛡️ "간병인을 구할 일손이 부족한 맞벌이 자녀분들에게 최고의 방패"
            </div>
          </div>

          {/* 2. 간병인 사용일당 (정액 현금 지급형) */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between space-y-6 shadow-xl border border-slate-800">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-black text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-violet-400 rounded-full"></span> 간병인 사용일당 (현금 지급)
                </h4>
                <span className="text-[10px] font-black text-violet-300 bg-white/10 px-2 py-0.5 rounded border border-white/10">비갱신 설계 가능</span>
              </div>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                가입자가 아파트 간병인 플랫폼, 간병 협회 등을 통해 직접 구인을 진행한 후, 결제 영수증이나 확인서를 제출하여 약정 일당을 청구합니다.
              </p>
              <div className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>📌 인건비 변동 리스크</span>
                  <span className="text-red-400 font-black">있음 (미래 일당 단가 초과 시 자부담 발생)</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>📌 가족 간병 여부</span>
                  <span className="text-violet-400 font-black">일부 가능 (가족이 돌보아도 일당 청구 승인)</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>📌 상품 구조</span>
                  <span className="text-violet-400 font-black">비갱신형 (만기까지 월 납입료 인상 없음)</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white/10 text-violet-300 text-[10px] font-bold rounded-lg text-center border border-white/10">
              🛡️ "간병인을 꼼꼼히 선택하고 싶고 평생 보험료를 고정하고 싶은 고객군 최적"
            </div>
          </div>

        </div>

        {/* 체증형 가입 필수 강조 */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-100/50 rounded-[3rem] p-8 md:p-12 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h4 className="text-lg font-black text-purple-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" /> 화폐 가치 하락과 물가 폭등을 이기는 '체증형 간병 사용일당'
            </h4>
            <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-2xl">
              현재 간병인 하루 인건비는 13~15만 원 선입니다. 만약 20년 뒤 간병인을 쓰게 된다면 물가 상승으로 하루 인건비가 20만 원을 훌쩍 넘을 확률이 지배적입니다. 이때 고정형 사용일당(15만 원) 상품은 차액을 고스란히 자비로 채워야 합니다. **체증형 특약은 가입 후 5년 또는 10년이 경과할 때마다 가입금액이 10%씩 복리/단리로 늘어나 미래 보장 결손 문제를 원천 해결해 줍니다.**
            </p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-purple-100 text-center shrink-0">
            <span className="text-[10px] text-gray-400 font-bold block">5년마다 보장 금액</span>
            <span className="text-sm font-black text-purple-600 block mt-1">📈 10%씩 누적 체증 (복리식)</span>
          </div>
        </div>
      </div>

      {/* ── 4. GUIDE 02: 치매 CDR 척도 및 노인 장기요양등급 연계 설계 ── */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* 치매 임상평가 (CDR 척도) */}
        <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-10 border border-slate-800">
          <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 pointer-events-none">
            <ShieldCheck size={260} className="text-white" />
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-purple-400 border border-white/10 shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-black tracking-widest">Guide 02-1</p>
                <h3 className="text-xl font-black text-white">치매 진단 기준 (CDR 척도)</h3>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 font-semibold leading-relaxed">
              치매 간병보험은 병원에서 판단하는 임상치매척도(CDR, Clinical Dementia Rating)에 연동되어 진단비를 정산합니다.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                { title: 'CDR 1점 (경도 치매 - 중요)', desc: '사회 활동이나 일상에 약한 지장이 있으며 간단한 힌트 제공 시 자립 가능. 치매 진단비 설계 시 반드시 이 1점부터 고액 보장되는지 확인해야 합니다.' },
                { title: 'CDR 2점 (중등도 치매)', desc: '시간 관념 상실, 단기 기억 장애가 동반되며 혼자 외출 시 길을 잃을 위험이 있어 일상에 부분적 간조력이 상주해야 합니다.' },
                { title: 'CDR 3점 ~ 5점 (중증 치매)', desc: '대소변 장애, 거동 장애가 발생하여 24시간 철저한 돌봄이 수반되어야 하는 상태로 중증 간병 생활 자금 지급 대상입니다.' }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 text-xs font-black">{i + 1}</div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white">{tip.title}</p>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 국민건강보험공단 장기요양등급 연계 */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-gray-100 shadow-xl flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <RefreshCw size={24} />
              </div>
              <div>
                <p className="text-xs text-purple-600 font-black tracking-widest">Guide 02-2</p>
                <h3 className="text-xl font-black text-gray-900">국가 장기요양등급(1~5등급)의 가치</h3>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              만 65세 이상 노인성 질환(뇌혈관, 치매, 파킨슨 등)으로 누워 지내게 되면, 국민건강보험공단에서 일상생활 자립도를 평가하여 1등급~5등급의 판정을 내립니다. 이와 결합하여 **'국가 장기요양 판정비 및 매월 재가/시설급여 보조금'** 특약을 장착하면 노후 실버타운이나 주야간보호센터 방문 비용을 큰 부담 없이 충당할 수 있습니다.
            </p>

            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 space-y-4">
              <p className="text-sm font-black text-purple-950">💡 장기요양 재가/시설 이용 보장 비교</p>
              <div className="space-y-2 text-[10px] text-gray-600 font-bold">
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-purple-100/50">
                  <span>재가급여 특약</span>
                  <span className="text-purple-600 font-black">매월 1회 이상 집에서 방문요양/목욕 이용 시 월정액 매월 지급</span>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-purple-100/50">
                  <span>시설급여 특약</span>
                  <span className="text-violet-600 font-black">노인요양원, 실버 전문 복지시설에 상주 입소 시 매월 연계 지원</span>
                </div>
              </div>
              <p className="text-[10px] text-purple-850 font-bold leading-relaxed">
                * 특히 혼자 거주하시는 독거노인의 경우, 노인복지센터 도우미가 집으로 직접 방문하는 '재가급여(방문요양)' 지원 비용 특약의 청구 비율이 압도적으로 높습니다.
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-purple-600 font-black mb-1">📢 전문가 분석 조언</p>
            <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
              "치매는 가족의 영혼을 갉아먹는 질병이라 불릴 만큼 긴 간병 기간(평균 5~7년)을 보입니다. 진단비 1회 수령 후 끝나는 담보 대신, 재가 요양이나 사설 요양병원 입원 시 매월 평생(또는 10년간) 반복하여 통장에 찍히는 생활자금형 연금식 설계가 가입자 만족도가 높습니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. 국내 6대 대표 손해사 간병보험 혜택 비교 ── */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-black uppercase tracking-widest">
            Brand Analytics
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            국내 대형 6개 손해사 간병보험 상품 특징 비교
          </h3>
          <p className="text-xs text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
            보험사별로 간병인 지원 파견 속도, 사용일당 가입 한도 감액 비율, 요양병원 입원 한도, 그리고 치매 CDR 1점 가입금 조건 등을 정리한 지표입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              company: '삼성화재',
              badge: '요양병원 한도 우대',
              badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
              highlight: '노인 요양병원 간병인 사용일당 최고치 한도 적용',
              desc: '타사가 요양병원 사용일당을 하루 2~3만 원으로 묶어두는 데 반해, 삼성은 요양병원 입원 시에도 하루 간병인 사용 비용 지원 한도를 상대적으로 넉넉하게 세팅할 수 있게 지원합니다.',
              strength: '장기 요양병원 입소 목적의 간병 리모델링 특화'
            },
            {
              company: 'DB손해보험',
              badge: '간호간병 통합 우수',
              badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              highlight: '간호·간병통합서비스 입원 일당 업계 최고액 보강',
              desc: '보호자 없는 간호통합병동 입원 빈도가 높은 현대 트렌드에 발맞춰, 공동 병동 이용 시 지급되는 하루 정액 일당 한도를 가장 강력한 단가로 보장해 줍니다.',
              strength: '실용적인 대학병원 공동간병 이용 플랜 최적'
            },
            {
              company: '현대해상',
              badge: '지원형 파견 인프라 1위',
              badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
              highlight: '업계 최다 제휴 네트워크 보유로 간병인 신속 파견',
              desc: '간병인 지원형(파견) 운영 시, 전국구 규모의 조율 협력망을 확보하여 명절 연휴나 대도시 외곽 지역 입원 시에도 간병인 매칭 대기 지연 시간을 대폭 줄였습니다.',
              strength: '지방 거주 부모님을 위한 파견 지원형 설계 1순위'
            },
            {
              company: '메리츠화재',
              badge: '사용일당 체증형 특화',
              badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
              highlight: '5년마다 10% 증액되는 체증 비율 가성비 우수',
              desc: '미래 인건비 인상분을 온전히 방어하기 위한 체증형 간병인 사용일당 설계 시, 세대별 요율 가중치 단가를 가장 안정적으로 책정하여 비갱신 세팅 부담을 덜어줍니다.',
              strength: '4050 세대용 미래 물가 방어 체증형 상품 1순위'
            },
            {
              company: 'KB손해보험',
              badge: '첫날 즉시 보장',
              badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
              highlight: '뇌혈관/심혈관 등 주요 급성 질환 시 첫날 일당 지급',
              desc: '일부 사가 3일 초과 입원 시부터 간병 일당을 적용하는 장벽을 낮춰, 뇌와 심장 질환 등으로 단기 입원 시 첫날부터 간병 사용 혜택을 100% 감액 없이 정산합니다.',
              strength: '주요 뇌/심장 3대 질병 단기 입원 간병비 보강'
            },
            {
              company: '한화손해보험',
              badge: '초가성비 비갱신',
              badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
              highlight: '무해지 환급 플랜 결합 시 고정 보험료 최저 요율',
              desc: '해약환급금이 없는 무해지형 비갱신 플랜으로 설계 시, 매달 나가는 고정 보험료 단가를 6대사 평균 대비 약 10~15% 저렴하게 맞춤 매칭하여 가성비가 훌륭합니다.',
              strength: '젊은 직장인들의 노후대비 비갱신 다이어트 플랜'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-10px_rgba(147,51,234,0.06)] hover:border-purple-100 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-gray-900">{item.company}</span>
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-[11px] text-purple-600 font-black">{item.highlight}</p>
                  <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">강력 추천 매칭</p>
                <p className="text-xs text-gray-700 font-black mt-1 flex items-center gap-1.5">
                  🛡️ {item.strength}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. 전문가 실전 간병보험 리모델링 체크리스트 ── */}
      <div className="bg-slate-50 rounded-[4rem] p-8 md:p-16 border border-slate-100">
        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-purple-600" /> 간병 보험 가입 및 리모델링 실전 4단계 체크리스트
        </h4>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              step: '01',
              title: '지원형(파견) vs 사용형(현금) 성향 선택',
              desc: '보험사가 간병인을 매칭해 주는 편리함을 원한다면 지원형을, 원하는 사설 플랫폼 간병인 선호 및 가족 돌봄 청구를 원한다면 사용형을 선택하는 것이 최우선 분류 기준입니다.'
            },
            {
              step: '02',
              title: '요양병원 면책 기간 및 지급 한도 확인',
              desc: '많은 상품이 180일 간병인 한도를 쓰고 나면 180일의 요양병원 면책(지급 일시정지) 기간을 가집니다. 요양병원 장기 입원이 걱정되는 고연령층은 이 면책 기간의 약관 조항을 사전에 꼼꼼히 대조해야 합니다.'
            },
            {
              step: '03',
              title: '4050 세대 가입 시 체증형 옵션 필수 탑재',
              desc: '젊은 시절에 가입하는 간병보험은 노후 시점까지의 기간(20~30년)이 매우 깁니다. 인플레이션으로 인한 화폐 가치 하락과 구인 단가 상승을 온전히 메우려면 보장 금액이 늘어나는 체증형 특약이 무조건 권장됩니다.'
            },
            {
              step: '04',
              title: '치매 CDR 1점 및 재가/시설 이용 특약 보강',
              desc: '중증 치매(CDR 3점)만 보장하는 레거시 보험은 혜택을 받기 극도로 어렵습니다. 경도 치매(CDR 1점)부터 진단비가 분할 지급되고, 국가 장기요양 1~5등급 판정 시 재가방문 요양 혜택이 탑재되었는지 확인하세요.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 flex gap-6">
              <span className="text-3xl font-black text-purple-100 leading-none">{item.step}</span>
              <div className="space-y-2">
                <h5 className="text-base font-black text-slate-900">{item.title}</h5>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. 하단 CALL TO ACTION (CTA) 연동 블록 ── */}
      <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-[3rem] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl border border-purple-500/20">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-xl md:text-2xl font-black">
            간병인 수급 대란과 물가 상승이 두려우신가요?<br />
            <span className="text-purple-300">지금 노후 실버 간병 remolding 지수를 무료로 진단해 보세요!</span>
          </h3>
          <p className="text-xs text-purple-200/70 font-semibold leading-relaxed">
            성별, 나이, 가입 희망 유형(지원형/사용형)만 선택해 보세요. 국내 대표 6대사 상품의 체증형 보험료 단가와 요양병원/간호간병통합서비스 지급 비율을 정밀 분석하여 자녀들에게 짐이 되지 않는 최고 품질의 노후 간병 안심 설계를 매칭해 드립니다.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={onAction}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-900 rounded-full font-black text-sm transition-all hover:bg-violet-50 active:scale-95 shadow-2xl hover:shadow-purple-500/20 group"
            >
              간병 보험 맞춤 비교 무료 진단하기
              <ChevronRight className="group-hover:translate-x-1.5 transition-transform text-purple-900" size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
