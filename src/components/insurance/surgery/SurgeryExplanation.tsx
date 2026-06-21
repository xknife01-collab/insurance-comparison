import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import { 
  Activity, Search, ShieldCheck, Heart, ChevronRight, 
  HelpCircle, AlertCircle, RefreshCw, Award, CheckCircle2, HeartPulse, Sparkles
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const SurgeryExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => {
  return (
    <div className="mt-16 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* ── 1. 프리미엄 HERO 헤더 섹션 ── */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-orange-950 rounded-3xl md:rounded-[3rem] p-5 md:p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl border border-orange-500/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-60"></div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500/20 text-orange-300 rounded-full text-xs font-black uppercase tracking-[0.25em] border border-orange-500/30">
            <HeartPulse size={14} className="text-orange-400" /> Surgery & Hospitalization Guide
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.15]">
            실손보험을 채우는 가장 확실한 카드<br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
              수술비·입원비 보험의 모든 비밀
            </span>
          </h2>
          <p className="text-orange-200/80 font-semibold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            나이가 들수록 급증하는 수술 리스크. 1~5종 수술 분류표의 핵심 약관을 든든하게 마스터하고, 4세대 실손의 비급여 자기부담금(최대 30%) 구멍을 철저히 방어하는 고품격 가이드입니다.
          </p>
        </div>
      </div>

      {/* ── 2. 핵심 4대 지표 배너 (Summary Cards) ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: '1~5종 종수술비',
            desc: '백내장/치핵(1종)부터 중대 심장 수술(5종)까지 약관상 명시된 수술 종류에 따라 정액 요금을 반복 지급.',
            tag: '기본 보장 핵심',
            tagBg: 'bg-orange-50 text-orange-700 border-orange-200',
            icon: <Award className="w-5 h-5 text-orange-600" />
          },
          {
            title: '관혈 / 비관혈 보장',
            desc: '피부를 절개하는 전통 관혈 수술은 물론, 현대인들에게 빈번한 내시경/카테터 등 비관혈 수술도 차별 없이 보장.',
            tag: '최신 트렌드',
            tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
            icon: <Activity className="w-5 h-5 text-amber-600" />
          },
          {
            title: '상급병실 입원일당',
            desc: '전체 입원의 80%를 차지하는 상급종합병원 1인실 및 2인실 이용 시 하루 최대 10~20만원 집중 지원.',
            tag: '입원 만족도',
            tagBg: 'bg-rose-50 text-rose-700 border-rose-200',
            icon: <RefreshCw className="w-5 h-5 text-rose-600" />
          },
          {
            title: 'N대 특정 질병 특약',
            desc: '발병률과 치료비 부담이 매우 높은 뇌혈관·심장·여성 특정 질병 수술 시 종수술비에 더해 고액을 특별 지급.',
            tag: '고액 집중 케어',
            tagBg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            icon: <CheckCircle2 className="w-5 h-5 text-yellow-600" />
          }
        ].map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-10px_rgba(249,115,22,0.08)] transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
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

      {/* ── 3. GUIDE 01: 1~5종 수술 분류표 상세 가이드 ── */}
      <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-8 md:p-16 border border-gray-100 shadow-xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
              <Search size={28} />
            </div>
            <div>
              <p className="text-xs text-orange-600 font-black tracking-widest uppercase">Guide 01</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">1~5종 수술 분류표 해부</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-bold max-w-md">
            질병 수술비는 수술의 난이도와 규모에 따라 1종부터 5종까지 분류하여 정액 보상합니다. 각 종에 해당하는 주요 수술 명칭을 확인해 보세요.
          </p>
        </div>

        {/* 1~5종 수술 분류 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              grade: '1종',
              limit: '10 ~ 30만원',
              title: '비교적 흔한 경미한 수술',
              examples: ['백내장 수술', '치핵(치질) 수술', '하지정맥류 시술', '안검하수(눈꺼풀 처짐) 수술'],
              badge: '최다 수술 빈도'
            },
            {
              grade: '2종',
              limit: '30 ~ 50만원',
              title: '간단한 절개 및 처치 수술',
              examples: ['대장 용종(폴립) 제거술', '자궁근종 절제술', '충수염(맹장) 수술', '탈장 수술'],
              badge: '용종 제거 특화'
            },
            {
              grade: '3종',
              limit: '100 ~ 200만원',
              title: '내시경/레이저 응용 수술',
              examples: ['담낭(쓸개) 절제술', '추간판(디스크) 수술', '녹내장 수술', '편도 절제술'],
              badge: '내시경 치료 중심'
            },
            {
              grade: '4종',
              limit: '300 ~ 500만원',
              title: '중등도 고난이도 장기 수술',
              examples: ['위 절제술', '간 절제술', '기관지 성형술', '심장 판막 풍선확장술'],
              badge: '주요 장기 처치'
            },
            {
              grade: '5종',
              limit: '1000 ~ 2000만원',
              title: '고위험/생명 관련 대수술',
              examples: ['개심술(심장수술)', '개두술(뇌수술)', '신장·간 장기이식 수술', '관상동맥 우회술'],
              badge: '대형 위험 방어'
            }
          ].map((item, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl md:rounded-[2rem] p-5 md:p-6 border border-slate-100 flex flex-col justify-between space-y-6 hover:bg-orange-50/20 hover:border-orange-100 transition-colors duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-orange-600">{item.grade}</span>
                  <span className="text-[8px] font-black px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md">
                    {item.badge}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold">평균 보장 한도</p>
                  <p className="text-base font-black text-gray-900">{maskText(item.limit, isUnlocked)}</p>
                </div>
                <p className="text-[11px] text-slate-700 font-black leading-snug">{item.title}</p>
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {item.examples.map((ex, i) => (
                    <p key={i} className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <span className="w-1 h-1 bg-orange-400 rounded-full shrink-0"></span>
                      {ex}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. GUIDE 02: 4세대 실손의료비 보완 및 수술비 보험 필요성 ── */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* 실손의 보완재 역할 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-10 border border-slate-800">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 rotate-12 pointer-events-none">
            <ShieldCheck size={260} className="text-white" />
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400 border border-white/10 shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs text-orange-400 font-black tracking-widest">Guide 02</p>
                <h3 className="text-xl font-black text-white">4세대 실손의 확실한 보완재</h3>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 font-semibold leading-relaxed">
              실손보험이 모든 것을 다 해결해 준다고 안심하면 곤란합니다. 4세대 실손의료비는 자기부담금이 존재하고, 비급여 치료를 많이 청구하면 할증 등급이 올라갑니다. 수술비 보험이 필요한 3가지 강력한 이유를 분석합니다.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                { title: '중복 가입 시에도 정액 중복 보장', desc: '실손보험은 실제 청구된 병원비의 70~80%만 비례 보상하지만, 수술비 보험은 가입한 약정 금액을 그대로 중복 지급하므로 보장의 구멍을 완전히 채웁니다.' },
                { title: '치료비 외의 생활자금/간병비 확보', desc: '고액 수술 시 직장 중단에 따른 생활비 손실, 간병인 사용 요금 등은 실손보험에서 지원하지 않습니다. 정액 수술비는 자유로운 용도로 치료비 외 사용이 가능합니다.' },
                { title: '할증 없는 든든한 정액 지원', desc: '정액 수술비는 수십 번 수술을 청구하여 수천만 원을 수령하더라도 다음 해 갱신 보험료가 개인적으로 할증되지 않아 안정성이 높습니다.' }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 text-xs font-black">{i + 1}</div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white">{tip.title}</p>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 매회 지급 약관의 중요성 */}
        <div className="bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 md:p-14 border border-gray-100 shadow-xl flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                <RefreshCw size={24} />
              </div>
              <div>
                <p className="text-xs text-orange-600 font-black tracking-widest">Crucial Check</p>
                <h3 className="text-xl font-black text-gray-900">약관의 "매회 지급" 여부를 꼭 확인하세요</h3>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              많은 보험 가입자들이 놓치는 가장 치명적인 약관 조항은 바로 **'지급 횟수 제한'**입니다. 동일한 질병으로 여러 번 수술을 받게 될 때, 돈을 매번 주는지 한 번만 주는지에 따라 인생의 보장 한도가 완전히 갈립니다.
            </p>

            <div className="bg-orange-50/50 p-5 md:p-6 rounded-2xl border border-orange-100 space-y-4">
              <p className="text-sm font-black text-orange-950">💡 매회 지급 vs 연 1회 지급 차이</p>
              <div className="flex items-center justify-center gap-6 text-center py-2">
                <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm w-36">
                  <p className="text-xs font-bold text-gray-500">매회 지급형 상품</p>
                  <p className="text-lg font-black text-emerald-600 mt-1">수술할 때마다</p>
                  <p className="text-[9px] text-gray-400 font-bold">연간 횟수 제한 없이 보장</p>
                </div>
                <div className="text-gray-300 font-bold text-xl">VS</div>
                <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm w-36">
                  <p className="text-xs font-bold text-gray-500">연 1회 제한 상품</p>
                  <p className="text-lg font-black text-red-500 mt-1">최초 1회만</p>
                  <p className="text-[9px] text-gray-400 font-bold">이후 365일 내 재수술 면책</p>
                </div>
              </div>
              <p className="text-[10px] text-orange-800 font-bold leading-relaxed">
                * 대장 용종 제거술, 혈관 카테터 시술 등 재발 위험이 높고 반복 시술이 필요한 치료일수록 '매회 지급'하는 약관을 확보하는 것이 유리합니다.
              </p>
            </div>
          </div>

          <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-orange-600 font-black mb-1">📢 전문가 조언</p>
            <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
              "최근 개발된 관동맥 혈관 스텐트 삽입술 등은 1회 시술 후 몇 개월 뒤 다시 좁아져 재수술을 하는 경우가 많습니다. 가입 설계 시 반드시 '질병 종수술비(매회 지급)' 특약이 중심에 있는지 확인하세요."
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. 국내 6대 대표 손해사 수술비 상품 비교 그리드 ── */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-black uppercase tracking-widest">
            Brand Analytics
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            국내 대형 6개 손해사 수술비/입원비 혜택 비교
          </h3>
          <p className="text-xs text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
            수술비 특약과 상급병실 입원비는 보험사별로 인수 기준과 보장 범위에 큰 차이가 있습니다. 주요 6개사의 강점을 명확히 비교해 드립니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              company: '삼성화재',
              badge: '상급병실 특화',
              badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
              highlight: '1인실 입원일당 높은 가입 한도',
              desc: '상급종합병원 1인실 입원 시 지원하는 하루당 입원일당 한도가 업계 우수한 수준으로 설정 가능하여, 쾌적하고 조용한 입원 치료환경을 희망하는 고객에게 안성맞춤입니다.',
              strength: '상급병실 입원 보장 & 대형 수술 한도 우위'
            },
            {
              company: 'DB손해보험',
              badge: '인수 한도 우수',
              badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              highlight: '특정 시술(체외충격파 등) 완화 가입',
              desc: '질병 수술 및 특정 뇌/심장 관상동맥 수술비 한도가 넉넉하고, 요로결석 체외충격파 쇄석술 등 타사에서 횟수 제한을 두는 수술의 인수 기준을 비교적 넓게 적용합니다.',
              strength: '다빈도 생활 질환 수술 최적의 인수 한도'
            },
            {
              company: '현대해상',
              badge: '로봇 수술 특화',
              badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
              highlight: '다빈치 로봇수술 & 신 의료기술 최다 보유',
              desc: '자궁근종 하이푸 시술, 암 치료를 위한 표적 치료와 다빈치 로봇 수술 등 정밀 신의료기술 관련 보장 담보를 가장 빠르게 도입하고 약관에 폭넓게 보장합니다.',
              strength: '최신 의학 수술 및 스마트 치료 수술비 최다 매칭'
            },
            {
              company: '메리츠화재',
              badge: '매회 종수술비 강자',
              badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
              highlight: '반복 지급 종수술비 업계 우수 요율',
              desc: '연간 제한이 절대 없는 순수 매회 지급형 질병 1~5종 수술비 특약이 매우 튼튼하게 설계됩니다. 심사 절차가 신속하여 간편 고지 유병자 수술비로도 우수합니다.',
              strength: '질병 종수술비 매회 한도 중심의 튼튼한 설계'
            },
            {
              company: 'KB손해보험',
              badge: '2대 질환 집중',
              badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
              highlight: '심장·뇌혈관 관혈/비관혈 합리적 요율',
              desc: '뇌혈관 질환 및 심장 허혈성/심장판막 등 2대 혈관 관련 수술 시의 관혈과 비관혈 보장 금액 비율이 가장 합리적으로 설계되어 중증 혈관 건강 관리에 특화되어 있습니다.',
              strength: '심혈관/뇌혈관 집중 수술 특화 가성비 설계'
            },
            {
              company: '한화손해보험',
              badge: '월 보험료 최저가',
              badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
              highlight: '해약환급금 미지급형 고효율 가성비',
              desc: '해지 환급금을 줄이거나 없앤 설계를 통해 동일 보장 대비 월 납입 보험료를 가장 가볍게 줄여주어, 수술비 보장만 콤팩트하게 끼워 넣으려는 리모델링 고객에게 유리합니다.',
              strength: '종수술비 핵심 특약 최저가 가입 설계 추천'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.06)] hover:border-orange-100 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-gray-900">{maskCompany(item.company, isUnlocked)}</span>
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-[11px] text-orange-600 font-black">{maskText(item.highlight, isUnlocked)}</p>
                  <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
                    {maskText(item.desc, isUnlocked)}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">강력 추천 매칭</p>
                <p className="text-xs text-gray-700 font-black mt-1 flex items-center gap-1.5">
                  🛡️ {maskText(item.strength, isUnlocked)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. 전문가 실전 수술비 리모델링 체크리스트 ── */}
      <div className="bg-slate-50 rounded-3xl md:rounded-[4rem] p-5 md:p-8 md:p-16 border border-slate-100">
        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-orange-600" /> 수술비·입원비 보험 리모델링 실전 4단계 체크리스트
        </h4>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              step: '01',
              title: '보장 횟수 조항 확인 ("매 수술 시마다" 여부)',
              desc: '약관 상에 "수술 1회당", "매 수술 시마다 지급"하는 규정이 명확한지 확인하세요. 1년에 1회만 주거나, 재수술 시 면책 기간(예: 365일)이 걸려 있는 상품은 배제하는 것이 좋습니다.'
            },
            {
              step: '02',
              title: '비관혈(내시경/카테터) 보장 비율 체크',
              desc: '과거 약관에는 칼을 대지 않는 수술을 비수술로 보아 적게 주거나 안 주는 경우가 많았습니다. 최신 상품은 복강경, 내시경, 스텐트 시술도 관혈 수술과 대등하게 보장하는지 반드시 확인해야 합니다.'
            },
            {
              step: '03',
              title: '상급병실 1인실 입원일당 추가 여부 검토',
              desc: '일반 병실 입원일당은 보험료 대비 하루 지급액(1~3만원)이 낮아 효율이 떨어집니다. 반면, 최근 각광받는 상급병원 1인실 특약은 상대적으로 낮은 보험료로 고액(10~20만원)을 주기 때문에 추가를 적극 검토하세요.'
            },
            {
              step: '04',
              title: '가입 전 이미 확정된 수술 일정은 부담보 조항 체크',
              desc: '가입 전에 병원에서 이미 수술 권유를 받았거나 검사가 예약되어 있다면, 해당 부위는 가입 후 일정 기간 동안 보장받지 못하는 부담보 처리가 될 수 있으므로 심사 전에 반드시 고지 및 예외 규정을 확인하세요.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 md:p-8 rounded-3xl border border-slate-100 flex gap-6">
              <span className="text-3xl font-black text-orange-100 leading-none">{item.step}</span>
              <div className="space-y-2">
                <h5 className="text-base font-black text-slate-900">{item.title}</h5>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">{maskText(item.desc, isUnlocked)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. 하단 CALL TO ACTION (CTA) 연동 블록 ── */}
      <div className="bg-gradient-to-br from-orange-900 to-orange-950 rounded-3xl md:rounded-[3rem] p-5 md:p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl border border-orange-500/20">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 pointer-events-none">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-xl md:text-2xl font-black">
            실손보험만으로 수술비가 부족하셨나요?<br />
            <span className="text-orange-300">지금 실시간 수술/입원 리모델링 지수를 무료 진단하세요!</span>
          </h3>
          <p className="text-xs text-orange-200/70 font-semibold leading-relaxed">
            나이와 건강 상태만 입력해 보세요. 6대 손해사의 종수술비 요율과 상급병실 입원비 혜택을 실시간 대조하여 본인에게 최적화된 가장 저렴하고 든든한 설계안을 추천해 드립니다.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={onAction}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-900 rounded-full font-black text-sm transition-all hover:bg-orange-50 active:scale-95 shadow-2xl hover:shadow-orange-500/20 group"
            >
              수술/입원 맞춤 보험 무료 진단하기
              <ChevronRight className="group-hover:translate-x-1.5 transition-transform text-orange-900" size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
