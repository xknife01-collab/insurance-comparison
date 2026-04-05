/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrendingUp, ShieldCheck, Clock, MessageCircle, Star, Quote, Stethoscope, ChevronRight, Activity, Search, Sparkles, Hotel, HeartHandshake, UserCheck } from 'lucide-react';

const REVIEWS = [
  { name: "김*일", age: 45, gender: "M", avatarIdx: 0, job: "사무직", content: "지인 권유로 10년 넘게 납입하던 종신 보험이 있었는데, 여기서 분석해보니 정작 제가 필요한 뇌혈관이나 심장 쪽 진단비가 턱없이 부족하더라고요. 전문가분께서 불필요한 사망 보장은 줄이고 핵심 진단비를 비갱신형으로 리모델링해주셔서 월 보험료는 12만 원이나 줄었는데 보장 한도는 3배나 늘어났습니다. 진작 할 걸 그랬네요!" },
  { name: "이*희", age: 38, gender: "F", avatarIdx: 1, job: "자영업", content: "고혈압약을 복용 중이라 유병자 보험은 무조건 비싼 줄만 알았어요. 그런데 여기서 여러 보험사를 한눈에 비교해주시니 생각보다 훨씬 저렴한 곳이 있더라고요. 제 병력을 꼼꼼히 체크해서 가장 유리한 3.3.5 조건으로 알맞게 매칭해주신 덕분에 월 6만 원대로 든든하게 암 보험 가입했습니다. 발로 뛰지 않아도 데이터로 딱딱 보여주니 믿음이 가네요." },
  { name: "박*준", age: 31, gender: "M", avatarIdx: 2, job: "IT개발자", content: "사회초년생 때 가입한 보험이 전부 갱신형이라 나중에 60대 넘어서 보험료 폭탄 맞을 뻔했습니다. 여기 시스템으로 시뮬레이션 돌려보고 깜짝 놀라 바로 비갱신형으로 갈아탔어요. 지금 당장은 몇 천 원 더 내는 것 같아도 20년 납입만 하면 평생 보장받는다고 생각하니 속이 다 시원합니다. 데이터 수치로 미래 보험료 변화를 보여주니까 결정하기가 참 쉬웠어요." },
  { name: "최*윤", age: 52, gender: "F", avatarIdx: 3, job: "주부", content: "아이들 셋 보험료만 합쳐도 생활비에 부담이 컸는데, 여기서 가족 단위 점검을 받았습니다. 겹치는 일상생활 배상책임이나 중복 특약들을 싹 정리했더니 보험료가 한 달에 20만 원 가까이 세이브됐어요! 그 돈으로 아이들 적금을 하나 더 들어줬네요. 꼼꼼하게 차트까지 그려가며 설명해주셔서 보험 문외한인 저도 금방 이해할 수 있었습니다." },
  { name: "정*우", age: 42, gender: "M", avatarIdx: 4, job: "현장직", content: "직업이 위험군이라 가입 거절도 많이 당해보고 가입해도 너무 비싸서 포기했었는데, 여기서 직업 급수를 정확히 다시 조정하고 최적의 상품을 찾아주셨습니다. 사고 났을 때 당장 수입이 끊기는 게 제일 걱정이었는데 상해 후유장해랑 수술비 위주로 실속 있게 설계해주셔서 이제 발 뻗고 잡니다. 현장에서 일하는 동료들한테도 입소문 많이 내고 있어요." },
  { name: "강*은", age: 29, gender: "F", avatarIdx: 5, job: "간호사", content: "병원에서 일하다 보니 큰 병 걸렸을 때의 고통을 누구보다 잘 압니다. 그래서 보장이 빵빵해야 한다고만 생각해서 월급의 절반을 보험에 쏟아붓고 있었거든요. 그런데 분석해보니 오히려 보장은 약하고 환급률만 높은 저축성 보험에 가입되어 있더라고요. 덕분에 거품 싹 빼고 진짜 나를 지켜줄 수 있는 핵심 보장 위주로 가성비 있게 재구성했습니다. 합리적인 소비를 한 것 같아 뿌듯해요." },
  { name: "윤*호", age: 47, gender: "M", avatarIdx: 6, job: "공무원", content: "실손 의료비가 예전 거라 보장은 좋은데 갱신될 때마다 보험료가 너무 가파르게 올라서 유지가 고민이었어요. 4세대 실손으로 전환했을 때의 장단점을 전문가께서 표로 만들어서 비교해주시니까 확신이 생기더라고요. 보험료는 절반 이하로 줄이고, 아낀 돈으로 부족했던 뇌혈관 진단비를 보완했습니다. 전문적인 분석 덕분에 불필요한 고민을 끝낼 수 있었습니다." },
  { name: "한*지", age: 35, gender: "F", avatarIdx: 7, job: "디자이너", content: "직업병인지 UI가 예쁜 곳을 좋아하는데, 여긴 디자인만 세련된 게 아니라 분석 데이터가 너무 명확해서 놀랐어요. 막연하게 보험이 필요하다는 생각만 있었는데, 제 나이대 평균 보장 범위랑 비교해서 부족한 부분을 빨간색으로 딱 보여주니 바로 체감되더라고호. 디자인만큼이나 깔끔한 상담 서비스 덕분에 군더더기 없는 완벽한 포트폴리오를 짠 기분입니다." },
  { name: "임*민", age: 40, gender: "M", avatarIdx: 8, job: "운전직", content: "매일 운전하며 지내다 보니 사고 걱정이 늘 있었는데, 운전자 보험이랑 자부상(자동차사고 부상치료비) 특약을 정말 저렴하게 잘 묶어주셨어요. 벌점이나 변호사 선임비용 대비도 예전 보험보다 훨씬 조건이 좋아졌는데 보험료는 오히려 5천 원 정도 저렴해졌네요. 운전자라면 꼭 여기서 확인해보라고 권하고 싶습니다. 상담 과정도 속전속결로 시원시원했습니다." },
  { name: "송*아", age: 44, gender: "F", avatarIdx: 9, job: "교사", content: "복잡한 보장 내용이랑 어려운 보험 용어 때문에 항상 미뤄오던 숙제였는데, 여기서 한 번에 해결했습니다. 설계사분께서 제가 가진 증권들을 일일이 다 분석해서 '이건 꼭 유지하시고 이건 버리세요'라고 냉정하게 말씀해주시는 게 참 좋았어요. 과한 영업 없이 제 입장에서만 생각해주시는 진심이 느껴졌습니다. 덕분에 숙원 사업을 기분 좋게 마무리했네요." },
  { name: "오*현", age: 33, gender: "M", avatarIdx: 10, job: "연구원", content: "직업상 숫자에 민감한데, 여긴 수치와 근거로만 얘기해서 신뢰가 갔습니다. 제가 가입한 보험의 손해율과 향후 보험료 갱신 예상 지표까지 보여주는 곳은 처음이었어요. 덕분에 막연한 불안감이 아니라 확실한 데이터에 기반해서 보험을 선택할 수 있었습니다. 보험도 금융 공학의 영역이라는 것을 제대로 보여주는 훌륭한 시스템입니다." },
  { name: "권*서", age: 55, gender: "M", avatarIdx: 11, job: "제조업", content: "나이가 들면서 여기저기 아픈 데도 생기고 보험료가 부담스러워져서 해지할까도 생각했습니다. 하지만 전문가께서 해지 대신 부분 감액이나 특약 조정을 추천해주셨고, 그 결과 보험료는 30% 줄이면서도 암 진단비는 유지할 수 있었습니다. 하마터면 노후에 무보험 상태로 고생할 뻔했는데 정말 큰 도움 받았습니다. 저 같은 중년층에게 강력 추천합니다." },
  { name: "신*진", age: 37, gender: "F", avatarIdx: 12, job: "프리랜서", content: "불규칙한 수입 때문에 고정 지출인 보험료가 늘 고민이었어요. 그래서 가장 필수적인 보장만 남기면서도 월 보험료는 3만 원대로 맞춘 '다이어트 플랜'을 추천받았는데 정말 대만족입니다. 수입이 적은 달에도 부담 없이 유지할 수 있고, 그러면서도 큰 질병 대비는 되어 있으니 마음이 한결 가볍습니다. 저 같은 프리랜서분들에게 딱 맞는 합리적인 서비스네요." },
  { name: "유*재", age: 28, gender: "M", avatarIdx: 13, job: "취업준비생", content: "부모님이 들어주신 보험만 믿고 있었는데 분석해보니 만기가 너무 짧거나 보장 범위가 좁은 게 많더군요. 아직 젊을 때 비갱신형으로 좋은 담보들을 잘 잡아놓으라는 조언을 듣고 100세 만기로 든든하게 새로 짰습니다. 알바비 수준에서 충분히 감당 가능한 금액이라 만족스럽고, 인생의 첫 보험을 이렇게 공정하게 비교해보고 들게 되어 다행입니다." },
  { name: "조*미", age: 49, gender: "F", avatarIdx: 14, job: "서비스직", content: "다른 비교 사이트들도 가봤지만 이렇게 구체적으로 제 상황에 맞춰서 최적화해주는 곳은 없었습니다. 상담원분이 정말 친절하게 제 기존 보험들의 허점을 짚어주셨고, 덕분에 제가 암 보험에 가입되어 있음에도 유방암 보장이 약했다는 사실을 처음 알았습니다. 놓칠 뻔한 구멍을 메운 것 같아 정말 안심이 됩니다. 친절하고 꼼꼼한 분석, 최고입니다!" },
  { name: "이*석", age: 36, gender: "M", avatarIdx: 15, job: "IT컨설턴트", content: "잦은 업무 스트레스로 건강이 걱정되어 보장 내역을 점검했습니다. 뇌혈관 질환에 대한 가족력이 있었는데 미처 몰랐던 부분을 꼼꼼하게 챙겨주셔서 정말 든든합니다. 복잡한 서류 절차도 간편하게 안내해 주셔서 좋았습니다." },
  { name: "김*진", age: 41, gender: "F", avatarIdx: 16, job: "초등교사", content: "아이들을 가르치다 보니 제 노후와 건강도 미리 준비해야겠다는 생각이 들더군요. 무해지 환급형 상품을 추천받아 합리적인 가격에 암과 수술비를 완벽히 보완했습니다. 설명이 너무 명확해서 지인들에게도 추천하고 있어요." },
  { name: "장*우", age: 30, gender: "M", avatarIdx: 17, job: "신입사원", content: "첫 월급으로 부모님 보험부터 제 보험까지 싹 정리했어요. 전문가께서 사회초년생 눈높이에 맞춰서 설명해 주신 덕분에 보험이 더 이상 어렵지 않게 느껴집니다. 불필요한 지출을 줄여 저축 여력이 늘어난 게 가장 큰 수확입니다." },
  { name: "문*희", age: 58, gender: "F", avatarIdx: 18, job: "주부", content: "갱신 때마다 오르는 실손 보험료 때문에 걱정이 많았는데 4세대 실손으로 똑똑하게 전환했습니다. 아낀 비용으로 간병인 특약을 추가했더니 이제야 마음이 놓이네요. 고연령층을 위한 배려 깊은 상담에 정말 감사드립니다." },
  { name: "배*호", age: 51, gender: "M", avatarIdx: 19, job: "공인중개사", content: "일의 특성상 운전이 잦은데 운전자 보험 혜택이 예전보다 훨씬 좋아졌더라고요. 데이터 기반으로 정확히 비교해 주셔서 최선의 선택을 할 수 있었습니다. 법률 대리인 선임비용 등 실질적인 보장이 강화되어 든든합니다." },
  { name: "주*현", age: 32, gender: "F", avatarIdx: 20, job: "은행원", content: "금융권에 종사하지만 보험은 또 다른 영역이더라고요. 이곳의 분석 리포트는 정말 체계적이고 설득력 있었습니다. 저에게 꼭 필요한 진단비 위주로 슬림하게 재설계했습니다. 데이터가 보여주는 결과라 신뢰하지 않을 수 없었죠." },
  { name: "황*택", age: 44, gender: "M", avatarIdx: 21, job: "개인택시", content: "운전이 생업이라 사고 시 수입 단절이 가장 두려웠습니다. 영업용 운전자 보험과 상해 진단비를 가성비 있게 묶어주셔서 이제 편안한 마음으로 핸들을 잡습니다. 사고 처리 과정에 대한 상세한 조언도 큰 도움이 되었습니다." },
  { name: "조*슬", age: 27, gender: "F", avatarIdx: 22, job: "스타트업", content: "부모님이 들어주신 보험만 믿고 있었는데 분석해보니 만기가 너무 짧거나 보장 범위가 좁은 게 많더군요. 아직 젊을 때 비갱신형으로 좋은 담보들을 잘 잡아놓으라는 조언을 듣고 100세 만기로 든든하게 새로 짰습니다. 보험료 부담은 적고 보장은 빵빵해서 아주 만족스럽습니다." },
  { name: "손*민", age: 39, gender: "M", avatarIdx: 23, job: "요리사", content: "주방에서 일하다 보니 손을 다치거나 화상을 입을 위험이 컸는데 이 부분을 집중적으로 보완했습니다. 제 직업적 특성을 이해하고 배려해 주신 상담에 감동받았습니다. 실제 보험금 청구 사례를 예시로 들어주셔서 이해가 쏙쏙 됐어요." },
  { name: "박*연", age: 46, gender: "F", avatarIdx: 24, job: "공무원", content: "정년 이후까지 생각해서 비갱신형으로 미리 준비해 두니 든든합니다. 복잡했던 여러 보험사의 보장 범위를 한눈에 비교할 수 있는 시스템이 정말 편리했습니다. 과잉 가입된 특약들을 정리하니 보험료는 낮아지고 보장 질은 높아졌네요." },
];

const ReviewMarquee = () => {
  return (
    <div className="mt-40 overflow-hidden relative py-20 bg-white">
      <div className="flex animate-marquee gap-12 items-center hover:[animation-play-state:paused]">
        {[...REVIEWS, ...REVIEWS].map((review, i) => {
          const idx = review.avatarIdx;
          
          let avatarStyle = {};
          if (idx < 8) {
             // Use 8 individually generated unique high-quality portraits
             avatarStyle = {
               backgroundImage: `url('/assets/avatars/avatar_${idx}.png')`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             };
          } else if (idx < 16) {
             // Use unique people from Grid A (4x4)
             const subIdx = idx - 8;
             const col = subIdx % 4;
             const row = Math.floor(subIdx / 4);
             avatarStyle = {
               backgroundImage: `url('/assets/avatars/grid_a.png')`,
               backgroundSize: '400% 400%',
               backgroundPosition: `${(col / 3) * 100}% ${(row / 3) * 100}%`
             };
          } else {
             // Use unique people from Grid B (5x5)
             const subIdx = idx - 8;
             const col = subIdx % 5;
             const row = Math.floor(subIdx / 5);
             avatarStyle = {
               backgroundImage: `url('/assets/avatars/grid_b.png')`,
               backgroundSize: '500% 500%',
               backgroundPosition: `${(col / 4) * 100}% ${(row / 4) * 100}%`
             };
          }
          
          return (
            <div 
              key={i} 
              className="flex-shrink-0 w-[640px] h-[480px] min-w-[640px] bg-white p-16 rounded-[4rem] border border-gray-100 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] whitespace-normal group hover:border-orange-200 hover:-translate-y-6 hover:shadow-[0_80px_150px_-40px_rgba(255,107,0,0.22)] transition-all duration-1000 ease-out relative"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 text-orange-400">
                    {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
                  </div>
                  <div className="w-16 h-16 bg-orange-50 rounded-[1.5rem] flex items-center justify-center text-orange-200 group-hover:text-orange-400 transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110 shadow-inner">
                    <Quote size={32} />
                  </div>
                </div>
                
                <div className="flex-1 flex items-center py-6">
                  <p className="text-gray-900 font-bold leading-[1.8] text-lg tracking-tight opacity-90 group-hover:opacity-100 transition-opacity">
                    "{review.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-8 pt-10 border-t border-gray-100/80">
                  <div className="w-24 h-24 rounded-[1.5rem] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden border-2 border-gray-100 group-hover:border-orange-100 transition-colors">
                     <div 
                       className="w-full h-full scale-110 group-hover:scale-125 transition-transform duration-700"
                       style={avatarStyle}
                     />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-2xl font-black text-gray-900 leading-none">{review.name}</p>
                    <div className="flex items-center gap-4">
                       <span className="text-[0.85rem] font-black text-orange-500 bg-orange-50 px-4 py-1.5 rounded-2xl border border-orange-100/50 shadow-sm">{review.age}세</span>
                       <span className="text-[0.85rem] font-bold text-gray-400 tracking-widest bg-gray-50 px-4 py-1.5 rounded-2xl border border-gray-100/50">{review.job}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export const ProblemSection = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
      <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">혹시 당신도 모르게 버려지는 돈이 있지는 않나요?</h2>
      <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
    </div>

    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10 mb-32">
      {[
        {
          icon: <TrendingUp className="w-7 h-7 text-red-600" />,
          bg: 'bg-red-50 border-red-100',
          title: '국밥 세 그릇의 낭비',
          desc: <>보험료 15만 원 중 4만 원이 중복이라면? 당신은 매달 아무 이유 없이 <span className="font-bold text-red-600">국밥 세 그릇 값을 길바닥에 버리고 있는 셈</span>입니다.</>
        },
        {
          icon: <ShieldCheck className="w-7 h-7 text-orange-600" />,
          bg: 'bg-orange-50 border-orange-100',
          title: '지인이라서 가입한 보험',
          desc: <>미안해서 가입한 보험... <span className="font-bold text-orange-600">나중에 정말 아플 때 당신을 지켜줄 수 있을까요?</span> 이제는 데이터로 냉정하게 따져볼 때입니다.</>
        },
        {
          icon: <Clock className="w-7 h-7 text-orange-400" />,
          bg: 'bg-gray-900 text-white border-gray-800',
          title: '노후의 시한폭탄',
          desc: <>지금 3만 원인 갱신형 보험, 10년 뒤엔 15만 원이 될 수도 있습니다. <span className="font-bold text-white">노후의 시한폭탄</span>을 지금 확정 지출로 바꾸세요.</>
        }
      ].map((item, i) => (
        <div key={i} className={`p-10 rounded-[3rem] border shadow-sm ${item.bg} hover:scale-[1.03] transition-transform`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${item.bg === 'bg-gray-900 text-white border-gray-800' ? 'bg-white/10' : 'bg-white/60'}`}>
            {item.icon}
          </div>
          <h3 className="text-2xl font-black mb-4 tracking-tighter">{item.title}</h3>
          <p className="opacity-80 leading-relaxed font-bold text-sm tracking-tight">{item.desc}</p>
        </div>
      ))}
    </div>

    <div className="w-full relative">
      <ReviewMarquee />
    </div>

    <div className="mt-20 text-center animate-bounce">
       <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          실시간 1:1 상담 예약 현황 (전국 1,248명 대기 중)
       </p>
    </div>
  </section>
);

export const IndemnitySection = ({ onAction }: { onAction: () => void }) => (
  <section className="py-32 bg-white px-4 relative overflow-hidden" id="indemnity-detail">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-black mb-6 border border-blue-100 shadow-sm">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
             제 2의 건강보험, 실손의료비 완벽 가이드
           </div>
           <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1]">
             의료실비의 <span className="text-blue-600">모든 것</span><br />
             한눈에 분석해 드립니다.
           </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
           <p className="text-sm font-bold text-gray-500 leading-relaxed">
             대한민국 국민 4,000만 명이 가입한 국민 보험 실손.<br />
             복잡한 약관 뒤에 숨겨진 진짜 혜택을 전문가가 직접 정리했습니다.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-gray-50 rounded-[4rem] p-12 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-black">CONTENT 01</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">실손보험 핵심 보장</h3>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group-hover:-translate-y-2 transition-transform">
              <p className="text-lg font-black text-blue-600 mb-2">🏥 급여 (공통 치료)</p>
              <p className="text-gray-500 font-bold text-sm leading-relaxed">
                국민건강보험이 적용되는 항목으로, 실제 병원비에서 자기부담금을 제외한 금액을 보상합니다. (입원, 외래, 처방조제 포함)
              </p>
            </div>
            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-blue-200 shadow-2xl group-hover:-translate-y-2 transition-transform">
              <p className="text-lg font-black mb-2 flex items-center gap-2">⭐ 비급여 (특화 치료)</p>
              <p className="opacity-90 font-bold text-sm leading-relaxed">
                건강보험이 적용되지 않아 부담이 큰 도수치료, 비급여 주사료, MRI/MRA 등을 중점 보장합니다. 실손 가입의 핵심 이유입니다.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[4rem] p-12 border-4 border-gray-50 hover:border-blue-50 transition-all group flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-gray-900 rounded-[2.2rem] flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-black">CONTENT 02</p>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">3대 필수 체크 용어</h3>
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black text-xs shrink-0 mt-1">1</div>
                    <div>
                       <p className="font-black text-gray-900">자기부담금 (Deductible)</p>
                       <p className="text-xs text-gray-400 font-bold mt-1">치료비 전액이 아닌, 본인이 부담해야 하는 20~30%의 최소 비율입니다.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black text-xs shrink-0 mt-1">2</div>
                    <div>
                       <p className="font-black text-gray-900">갱신 및 재가입 주기</p>
                       <p className="text-xs text-gray-400 font-bold mt-1">실손은 100% 갱신형이며, 가입 시기에 따라 1~5년 주기로 조건이 변경됩니다.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black text-xs shrink-0 mt-1">3</div>
                    <div>
                       <p className="font-black text-gray-900">고지의무 (계약 전 알릴 의무)</p>
                       <p className="text-xs text-gray-400 font-bold mt-1">5년 내 큰 질환이나 1년 내 추가 검사 소견 등을 정확히 밝혀야 보장이 취소되지 않습니다.</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="mt-12 p-8 bg-orange-50 rounded-[3rem] border border-orange-100">
              <p className="text-orange-600 font-black text-sm mb-2 opacity-80 uppercase tracking-widest">💡 전문가의 핵심 팁</p>
              <p className="text-gray-900 font-bold text-sm leading-relaxed tracking-tight">
                "실물 카드가 아닌 '모바일 앱' 청구가 가능한지 확인하세요. 소액 통원비는 그때그때 청구하는 것이 실손을 가장 똑똑하게 활용하는 방법입니다."
              </p>
           </div>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all">
            <h4 className="text-xl font-black mb-4">대형 보험사 (S사, H사)</h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
               전국적인 서비스망과 빠른 보험금 지급 심사가 최대 강점입니다. 갱신 연령이 높아져도 자금력이 풍부해 안정적인 운영이 가능합니다.
            </p>
         </div>
         <div className="p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all">
            <h4 className="text-xl font-black mb-4">다이렉트 전용 (D사, M사)</h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
               설계사 수수료가 빠져 있어 동일 보장 대비 월 보험료가 15~20% 저렴합니다. 합리적인 소비를 지향하는 젊은 층에 적합합니다.
            </p>
         </div>
         <div className="p-10 bg-blue-600 rounded-[3.5rem] shadow-xl text-white">
            <h4 className="text-xl font-black mb-4">4세대 착한 실손</h4>
            <p className="text-xs font-bold opacity-80 leading-relaxed">
               가장 최신 실손으로, 병원을 자주 안 가면 보험료를 깎아주고 병원 방문이 매우 잦으면 할증되는 구조입니다. 과잉 진료를 방지하는 실질적인 대안입니다.
            </p>
         </div>
      </div>

      <div className="mt-20 border-t border-gray-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600">
               <Quote className="w-8 h-8 opacity-40 rotate-180" />
            </div>
            <p className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
               "실손은 건강할 때 가입해야 하는 <br />
               <span className="text-blue-600">진입장벽이 가장 높은 보험</span>입니다."
            </p>
         </div>
         <button 
           onClick={onAction}
           className="bg-gray-900 text-white px-12 py-6 rounded-full font-black text-lg hover:bg-orange-500 transition-all hover:scale-105 shadow-2xl"
         >
            내 보험료 확인하기
         </button>
      </div>
    </div>
  </section>
);

export const CaregivingSection = ({ onAction }: { onAction: () => void }) => (
  <section className="py-32 bg-slate-50 px-4 relative overflow-hidden" id="caregiving-detail">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
           <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm font-black mb-6 border border-purple-100 shadow-sm">
             <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
             자녀에게 짐이 되지 않는 노후, 간병 서비스 보험
           </div>
           <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1]">
             간병인 걱정 <span className="text-purple-600">끝.</span><br />
             2024-25 최신 트렌드 분석
           </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
           <p className="text-sm font-bold text-gray-500 leading-relaxed">
             하늘의 별 따기보다 힘들다는 간병인 구하기.<br />
             보험사가 직접 보내주는 '지원형'과 현금으로 받는 '사용형'을 전격 비교합니다.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-[4rem] p-12 border border-purple-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-purple-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Hotel className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-black">CARE TYPE 01</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">간병인 지원형 (파견)</h3>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-8 bg-purple-50 rounded-[2.5rem] border border-purple-100">
              <p className="font-black text-purple-700 mb-2">✅ 보험사가 직접 보내드립니다</p>
              <p className="text-sm text-gray-600 font-bold leading-relaxed">
                48시간 전 신청 시 보험사 제휴 업체에서 간병인을 직접 파견합니다. 인건비가 아무리 올라도 추가 비용이 없다는 것이 최대 장점입니다.
              </p>
            </div>
            <div className="px-8 space-y-4">
               <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  인건비 상승(물가) 리스크 제로
               </div>
               <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  간병인을 직접 구해야 하는 스트레스 해소
               </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-900 rounded-[4rem] p-12 text-white shadow-2xl group flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-white rounded-[2.2rem] flex items-center justify-center text-purple-900 shadow-xl">
                  <HeartHandshake className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-purple-300 font-black">CARE TYPE 02</p>
                  <h3 className="text-3xl font-black tracking-tight">간병인 사용형 (현금)</h3>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-8 bg-white/10 rounded-[2.5rem] border border-white/10">
                  <p className="font-black text-purple-200 mb-2">✅ 현금 일당으로 돌려받습니다</p>
                  <p className="text-sm opacity-80 font-bold leading-relaxed">
                    내가 원하는 간병인을 직접 고용하거나 가족이 간병해도 일당(15만 원 등)을 현금으로 지급받습니다. 비갱신형 가입이 가능해 경제적입니다.
                  </p>
                </div>
                <div className="px-8 space-y-4">
                   <div className="flex items-center gap-3 text-sm font-bold opacity-70">
                      <div className="w-1.5 h-1.5 bg-purple-300 rounded-full"></div>
                      배우자/자녀 등 가족 간병 시에도 보험금 수령 가능
                   </div>
                   <div className="flex items-center gap-3 text-sm font-bold opacity-70">
                      <div className="w-1.5 h-1.5 bg-purple-300 rounded-full"></div>
                      비갱신형 가입 시 보험료 인상 걱정 없음
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2"><Sparkles className="text-purple-500 w-5 h-5"/> 체증형 특약 필수!</h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
               5년/10년마다 보장 금액이 늘어나는 특약입니다. 10년 뒤 20만 원이 되는 인건비를 감당하기 위한 2024년 필수 선택 사항입니다.
            </p>
         </div>
         <div className="p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2"><UserCheck className="text-purple-500 w-5 h-5"/> 요양병원 한도 확인</h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
               일반 병원과 요양병원의 보상 금액이 다를 수 있습니다. 치매 등이 걱정된다면 요양병원 한도가 높은 상품(DB, 메리츠 등)이 유리합니다.
            </p>
         </div>
         <div className="p-10 bg-purple-600 rounded-[3.5rem] shadow-xl text-white">
            <h4 className="text-xl font-black mb-4">전문가의 추천 전략</h4>
            <p className="text-xs font-bold opacity-80 leading-relaxed">
               60대 이상 부모님께는 무조건 '지원형'을, 4050대 활동기 고객님께는 미래 인건비 폭등을 대비한 '사용형 체증 플랜'을 강력 추천합니다.
            </p>
         </div>
      </div>

      <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-10">
         <button 
           onClick={onAction}
           className="bg-purple-600 text-white px-16 py-7 rounded-full font-black text-xl hover:bg-purple-700 transition-all hover:scale-105 shadow-2xl"
         >
            간병인 보험료 무료 비교하기
         </button>
      </div>
    </div>
  </section>
);

export const PreExistingSection = ({ onAction }: { onAction: () => void }) => (
  <section className="py-32 bg-gray-50 px-4 relative overflow-hidden" id="preexisting-detail">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
           <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-black mb-6 border border-indigo-100 shadow-sm">
             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
             병력이 있어도 가입 가능한 '유병자 보험' 가이드
           </div>
           <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1]">
             아파도 걱정 마세요.<br />
             <span className="text-indigo-600">더 쉽고 저렴하게.</span>
           </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
           <p className="text-sm font-bold text-gray-500 leading-relaxed">
             고혈압, 당뇨부터 최근 수술 이력까지.<br />
             복잡한 3.3.5, 3.5.5 숫자의 비밀을 전문가가 쉽게 풀어드립니다.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">3.X.5 시스템 정복</h3>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 mb-8">
               <p className="text-sm font-black text-indigo-600 mb-4 flex items-center gap-2">
                 <Search className="w-4 h-4" /> 3.X.5 숫자의 비밀을 아시나요?
               </p>
               <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100">
                     <p className="text-2xl font-black text-indigo-600">3</p>
                     <p className="text-[10px] font-bold text-gray-400">3개월 내</p>
                     <p className="text-[10px] text-gray-500 mt-1">입원/수술/검사 소견</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100 ring-2 ring-indigo-500/20">
                     <p className="text-2xl font-black text-indigo-600">X</p>
                     <p className="text-[10px] font-bold text-gray-400">X년 내</p>
                     <p className="text-[10px] text-gray-500 mt-1">질병/상해 입원 또는 수술</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100">
                     <p className="text-2xl font-black text-indigo-600">5</p>
                     <p className="text-[10px] font-bold text-gray-400">5년 내</p>
                     <p className="text-[10px] text-gray-500 mt-1">암 진단/입원/수술 이력</p>
                  </div>
               </div>
               <p className="text-[11px] text-gray-400 font-bold mt-6 text-center leading-relaxed">
                 ※ 중간 숫자(X)가 본인이 가입할 수 있는 가장 큰 숫자를 택할수록 보험료가 드라마틱하게 저렴해집니다!
               </p>
            </div>

            {[
              { title: '3.0.5 (가장 쉬움)', desc: 'X가 0! 입원/수술 이력을 전혀 묻지 않아 누구나 가입 가능합니다.' },
              { title: '3.2.5 (표준형)', desc: '최근 2년 내에만 수술/입원이 없었다면 가장 무난하게 승인됩니다.' },
              { title: '3.3.5 (실속형)', desc: '3년 무사고 시, 3.2.5 대비 월 보험료가 약 15% 이상 절감됩니다.' },
              { title: '3.5.5 (초저가)', desc: '5년 무사고라면 일반 보험 수준의 혜택과 저렴함을 동시에 누립니다.' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group-hover:border-indigo-50 transition-colors">
                <div className="flex-1">
                  <p className="font-black text-gray-900 text-lg">{item.title}</p>
                  <p className="text-xs text-gray-400 font-bold mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <ChevronRight className="text-indigo-300 shrink-0" size={20} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
             <Activity className="w-48 h-48" />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-white rounded-[2.2rem] flex items-center justify-center text-indigo-900 shadow-xl">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-indigo-300 font-black">GUIDE 02</p>
                  <h3 className="text-3xl font-black tracking-tight">가입 전 필수 체크리스트</h3>
                </div>
              </div>
              <div className="space-y-8 mt-12">
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">1</div>
                    <div>
                       <p className="text-xl font-black mb-2">높은 숫자부터 공략하세요</p>
                       <p className="text-sm opacity-70 font-bold leading-relaxed">
                         무조건 가입되는 3.0.5를 택하기보다, 3.5.5부터 심사를 넣어보는 것이 보험료를 30% 이상 아끼는 비결입니다.
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">2</div>
                    <div>
                       <p className="text-xl font-black mb-2">계약 전환권을 확보하세요</p>
                       <p className="text-sm opacity-70 font-bold leading-relaxed">
                         가입 당시엔 아팠더라도, 추후 사고 없이 건강해지면 더 저렴한 등급으로 갈아탈 수 있는 '계약 전환 기능'이 필수입니다.
                       </p>
                    </div>
                 </div>
              </div>
              <div className="mt-16 p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-md">
                 <p className="text-indigo-400 font-black text-sm mb-2 uppercase tracking-widest">💡 전문가의 핵심 팁</p>
                 <p className="text-white font-bold text-sm leading-relaxed tracking-tight">
                   "단순히 약을 복용 중인 상태(고혈압, 당뇨 등)는 고지 대상이 아닌 경우가 많습니다. '약 때문에 가입 안 되겠지'하고 미리 포기하지 마세요."
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all">
            <h4 className="text-xl font-black mb-4">현대 / 삼성 (업계 선두)</h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
               3.0.5부터 3.5.5까지 가장 촘촘한 라인업을 보유하고 있어 고객 건강 상태에 맞는 '정교한 매칭'이 가능합니다.
            </p>
         </div>
         <div className="p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all">
            <h4 className="text-xl font-black mb-4">DB / 메리츠 (전환권 특화)</h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
               무사고 기간이 1년만 지나도 더 저렴한 플랜으로 자동 안내해 주는 '전환 케어' 시스템이 매우 강력합니다.
            </p>
         </div>
         <div className="p-10 bg-indigo-600 rounded-[3.5rem] shadow-xl text-white">
            <h4 className="text-xl font-black mb-4">간편 실손보험 연계</h4>
            <p className="text-xs font-bold opacity-80 leading-relaxed">
               질병 이력이 있는 분들도 '유병자 실손'을 통해 입원/수술비를 보장받을 수 있습니다. 진단비와 함께 구성 시 최적의 효과를 냅니다.
            </p>
         </div>
      </div>

      <div className="mt-20 border-t border-gray-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600">
               <Quote className="w-8 h-8 opacity-40 rotate-180" />
            </div>
            <p className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
               "유병자 보험은 '포기하지 않는 마음'으로 <br />
               <span className="text-indigo-600">최적의 구간을 찾아내는 데이터의 싸움</span>입니다."
            </p>
         </div>
         <button 
           onClick={onAction}
           className="bg-gray-900 text-white px-12 py-6 rounded-full font-black text-lg hover:bg-indigo-600 transition-all hover:scale-105 shadow-2xl"
         >
            가입 가능한 플랜 시뮬레이션
         </button>
      </div>
    </div>
  </section>
);

export const DentalSection = ({ onAction }: { onAction: () => void }) => (
  <section className="py-32 bg-white px-4 relative overflow-hidden" id="dental-detail">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
           <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-black mb-6 border border-emerald-100 shadow-sm">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
             비싼 치과 치료비, 이제 안심하세요. 치아보험 가이드
           </div>
           <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1]">
             임플란트부터 크라운까지.<br />
             <span className="text-emerald-600">빈틈없이 든든하게.</span>
           </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
           <p className="text-sm font-bold text-gray-500 leading-relaxed">
             보존치료와 보철치료의 차이점을 아시나요?<br />
             가입 전 반드시 확인해야 할 면책/감액기간을 정리해드립니다.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Category 1: 보전 vs 보철 */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-[4rem] p-12 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <Sparkles className="w-32 h-32 text-emerald-600" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">핵심 보장 항목 분석</h3>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-emerald-100">
                <p className="font-black text-emerald-600 mb-2 whitespace-nowrap">🛠️ 보존치료 (내 치아 살리기)</p>
                <p className="text-sm text-gray-600 font-bold leading-relaxed">
                  레진, 인레이, 온레이, 크라운 등 치아를 뽑지 않고 치료하는 방식입니다. 대기기간 없이 개수 무제한 보장이 많습니다.
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-emerald-100">
                <p className="font-black text-emerald-600 mb-2 whitespace-nowrap">🦷 보철치료 (인공 치아 넣기)</p>
                <p className="text-sm text-gray-600 font-bold leading-relaxed">
                  임플란트, 브릿지, 틀니 등 치아 손실 시 대체물을 만드는 방식입니다. 비용이 높아 감액기간(50% 지급) 확인이 필수입니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category 2: 가입 전략 */}
        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group">
           <div className="relative z-10">
              <h3 className="text-3xl font-black mb-10 tracking-tight">가입 시 필수 체크리스트</h3>
              <div className="space-y-8">
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                       <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                       <p className="text-xl font-black mb-2">면책/감액기간을 고려하세요</p>
                       <p className="text-sm opacity-60 font-bold leading-relaxed">
                         치아보험은 가입 후 90일(면책) 및 1~2년(감액) 기간이 있습니다. 큰 수술이 예상된다면 미리 준비해야 합니다.
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                       <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                       <p className="text-xl font-black mb-2">건강할 때 진단형 가입!</p>
                       <p className="text-sm opacity-60 font-bold leading-relaxed">
                         치아가 아주 건강하다면 '진단형' 가입을 권장합니다. 면책기간 없이 즉시 100% 보장받을 수 있는 유일한 방법입니다.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-24 bg-gray-50 rounded-[4rem] p-12 border border-gray-100">
         <div className="grid md:grid-cols-3 gap-12">
            <div>
               <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                 <ShieldCheck className="text-emerald-500" /> 라이나 / 삼성
               </h4>
               <p className="text-sm text-gray-400 font-bold leading-relaxed">
                 가장 넓은 치과 네트워크와 빠른 보상 처리가 강점입니다. 임플란트 보장 한도가 업계 최고 수준입니다.
               </p>
            </div>
            <div>
               <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                 <TrendingUp className="text-emerald-500" /> DB / 메리츠
               </h4>
               <p className="text-sm text-gray-400 font-bold leading-relaxed">
                 크라운 치료 무제한 플랜 등 가성비 높은 보존치료 중심의 경쟁력 있는 상품을 보유하고 있습니다.
               </p>
            </div>
            <div className="flex flex-col justify-center">
               <button 
                 onClick={onAction}
                 className="w-full bg-emerald-600 text-white px-8 py-5 rounded-3xl font-black text-lg hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl shadow-emerald-600/20"
               >
                 내 치아 보험료 확인하기
               </button>
            </div>
         </div>
      </div>
    </div>
  </section>
);

export const PhilosophySection = () => (
  <section className="py-24 bg-gray-50 overflow-hidden px-4">
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-xl relative border border-gray-100">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <ShieldCheck className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 leading-tight">
            "저는 보험을 팔지 않습니다.<br />
            당신의 <span className="text-orange-500">'안심'</span>을 설계합니다."
          </h2>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              저도 보험이 외계어처럼 어렵기만 했던 시절이 있었습니다. 하지만 제대로 된 보험 하나가 한 가정을 무너뜨리지 않는 든든한 버팀목이 된다는 것을 수많은 사례로 지켜봤습니다.
            </p>
            <p>
              어려운 경기 속에 여러분의 땀 묻은 돈이 보험사가 아닌 <span className="font-bold text-gray-900">여러분의 가족을 위해 쓰이도록</span>, 설계사의 양심을 걸고 정직하게 분석하겠습니다.
            </p>
          </div>

          <div className="mt-16 flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-3xl overflow-hidden shadow-lg transform -rotate-3">
              <img src="https://picsum.photos/seed/planner/200/200" alt="Planner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="font-black text-2xl tracking-tight">보험 분석가 김리치</p>
              <p className="text-gray-400 font-bold">인카금융서비스 공식 인증 설계사</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="bg-[#1A1A1A] text-white pt-24 pb-12 px-4 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
        <div className="max-w-sm">
          <p className="text-xs text-gray-500 font-bold mb-4 uppercase tracking-widest">무료 전화 상담 센터</p>
          <p className="text-5xl font-black text-white leading-none mb-8 tracking-tighter">080.808.1088</p>
          <div className="space-y-2 text-xs text-gray-500 font-bold">
            <p>고객센터 영업시간</p>
            <p>평일 09:00 - 18:00 / 주말 10:00 - 15:00</p>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
           {[1,2,3,4].map(i => (
             <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                <span className="text-[10px] text-gray-500 font-bold block mb-2">실시간 분석 현황</span>
                <span className="text-sm font-bold block mb-4">암보험 김**님</span>
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mx-auto animate-pulse"></div>
             </div>
           ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-12 text-[10px] text-gray-600 space-y-4 max-w-4xl opacity-60">
        <p>[ 필수안내사항 ]</p>
        <p>보험대리점 : 리치앤코 (등록번호 : 제2006038313호) 본 광고는 광고심의기준을 준수하였으며, 유효기간은 심의일로부터 1년입니다.</p>
        <p>보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결하는 과정에서 질병이력, 연령증가 등으로 가입이 거절되거나 보험료가 인상될 수 있습니다. 또한 해약환급금 손실이 발생할 수 있으니 유의하시기 바랍니다.</p>
        <p>© GoodRich Co., Ltd. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);
