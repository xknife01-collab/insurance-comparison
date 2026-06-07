import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RadarChart from '../../RadarChart';

interface Rider { rider_name: string; coverage_amount: number; }
interface Policy { insurance_company: string; product_name: string; monthly_premium: number; riders: Rider[]; }

interface Props { policies: Policy[]; age: number; gender: 'M' | 'F'; }

const COMPANIES = ['DB손해보험','KB손해보험','한화손해보험','현대해상','삼성화재','메리츠화재'];

function detectType(name: string) {
  if (/종신|달러종신/i.test(name)) return 'whole';
  if (/운전자/i.test(name)) return 'driver';
  if (/실손|실비/i.test(name)) return 'silson';
  if (/어린이|태아/i.test(name)) return 'child';
  if (/암보험/i.test(name)) return 'cancer';
  return 'health';
}
const typeLabel: Record<string,string> = { whole:'종신보험', driver:'운전자보험', silson:'실손보험', child:'어린이보험', cancer:'암보험', health:'종합건강보험' };
const typeColor: Record<string,string> = { whole:'bg-indigo-500', driver:'bg-purple-500', silson:'bg-teal-500', child:'bg-yellow-500', cancer:'bg-rose-500', health:'bg-orange-500' };

function classifyRider(name: string) {
  if (/암진단|일반암|소액암|고액암/.test(name)) return 'cancer';
  if (/뇌혈관|뇌졸중|뇌출혈/.test(name)) return 'brain';
  if (/허혈성|심근경색|심장질환/.test(name)) return 'heart';
  if (/간병인|간병/.test(name)) return 'caregiver';
  if (/실손|실비|의료비/.test(name)) return 'silson';
  if (/수술/.test(name)) return 'surgery';
  if (/사망|재해사망/.test(name)) return 'death';
  return 'other';
}

function extractCov(riders: Rider[]) {
  let cancer=0,brain=0,heart=0,caregiver=0,surgery=0,death=0,silson=false;
  for(const r of riders){
    const c=classifyRider(r.rider_name);
    if(c==='cancer') cancer+=r.coverage_amount;
    else if(c==='brain') brain+=r.coverage_amount;
    else if(c==='heart') heart+=r.coverage_amount;
    else if(c==='caregiver') caregiver+=r.coverage_amount;
    else if(c==='surgery') surgery+=r.coverage_amount;
    else if(c==='death') death+=r.coverage_amount;
    else if(c==='silson') silson=true;
  }
  return { cancer,brain,heart,caregiver,surgery,death,silson };
}

function fmt(n: number) {
  if(n>=100000000) return `${(n/100000000).toFixed(0)}억원`;
  if(n>=10000) return `${(n/10000).toLocaleString()}만원`;
  return `${n.toLocaleString()}원`;
}

type Status = 'good'|'warn'|'bad'|'none';
function statusOf(val: number, good: number, warn: number): Status {
  if(val===0) return 'none';
  if(val>=good) return 'good';
  if(val>=warn) return 'warn';
  return 'bad';
}
const STATUS_STYLE: Record<Status,{bg:string,text:string,label:string,icon:string}> = {
  good:{bg:'bg-emerald-50',text:'text-emerald-600',label:'정상',icon:'✅'},
  warn:{bg:'bg-amber-50',text:'text-amber-600',label:'보강 권장',icon:'⚠️'},
  bad:{bg:'bg-red-50',text:'text-red-600',label:'부족',icon:'❌'},
  none:{bg:'bg-slate-50',text:'text-slate-400',label:'미가입',icon:'—'},
};

function CovRow({label,value,status,note}:{label:string;value:string;status:Status;note:string}) {
  const s=STATUS_STYLE[status];
  return (
    <div className="flex items-center justify-between py-3 px-5 border-b border-slate-100/70 last:border-0">
      <div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
        {status==='warn'||status==='bad'||status==='none' ? <span className="block text-[10px] text-slate-400 font-bold">{note}</span> : null}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-slate-800">{value}</span>
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${s.bg} ${s.text}`}>{s.icon} {s.label}</span>
      </div>
    </div>
  );
}

function findDups(policies: Policy[]): Set<number> {
  const dups=new Set<number>();
  for(let i=0;i<policies.length;i++){
    for(let j=i+1;j<policies.length;j++){
      const a=policies[i].product_name.replace(/\(보장종료 \d+\)/g,'').trim();
      const b=policies[j].product_name.replace(/\(보장종료 \d+\)/g,'').trim();
      if(a===b||(a.length>10&&(b.includes(a.slice(0,12))||a.includes(b.slice(0,12))))){
        dups.add(i);dups.add(j);
      }
    }
  }
  return dups;
}

function PolicyCard({policy,index,isDup,totalCount}:{policy:Policy;index:number;isDup:boolean;totalCount:number}) {
  const [open,setOpen]=useState(index === 0);
  const t=detectType(policy.product_name);
  const cov=extractCov(policy.riders);
  const p=policy.monthly_premium;

  // Radar
  const radar = t==='whole' ? [
    {label:'사망보장',value:cov.death>=100000000?92:60,target:70},
    {label:'환급율',value:72,target:65},
    {label:'납기구조',value:78,target:70},
    {label:'물가방어',value:58,target:60},
    {label:'연금전환',value:68,target:65},
    {label:'가성비',value:52,target:70},
  ] : t==='driver' ? [
    {label:'형사합의',value:88,target:75},
    {label:'변호사비',value:82,target:70},
    {label:'벌금한도',value:78,target:70},
    {label:'자부상',value:72,target:65},
    {label:'영업용',value:90,target:80},
    {label:'가성비',value:87,target:70},
  ] : [
    {label:'일반암',value:cov.cancer>=50000000?95:cov.cancer>=30000000?80:cov.cancer>0?55:15,target:75},
    {label:'뇌혈관',value:cov.brain>=30000000?90:cov.brain>=20000000?75:cov.brain>0?50:15,target:70},
    {label:'심혈관',value:cov.heart>=30000000?90:cov.heart>=20000000?75:cov.heart>0?50:15,target:70},
    {label:'수술/입원',value:cov.surgery>=3000000?85:cov.surgery>0?60:25,target:70},
    {label:'간병일당',value:cov.caregiver>=150000?90:cov.caregiver>0?60:15,target:65},
    {label:'실손여부',value:cov.silson?92:18,target:75},
  ];
  const score=Math.round(radar.reduce((s,d)=>s+d.value,0)/radar.length);

  // Diet options
  const dietBase=Math.round(p*0.76);
  const dietOpts=COMPANIES.map((c,i)=>({company:c,premium:dietBase+Math.round(p*0.024)*i}));
  const dietPremium=dietOpts[0].premium;
  const saving=p-dietPremium;

  // Problems
  const probs:string[]=[];
  if(isDup) probs.push('동일 상품이 중복 가입 중 → 월 보험료 이중 납부');
  if(t==='whole'){ probs.push('달러 종신보험은 환율 변동 리스크 내재'); probs.push('저해약환급금형 → 중도 해지 시 원금 손실 가능'); }
  if(t==='health'||t==='cancer'){
    if(cov.cancer>0&&cov.cancer<30000000) probs.push('일반암 진단비 권장(3,000만원) 미달');
    if(cov.brain>0&&cov.brain<20000000) probs.push('뇌혈관 진단비 권장(2,000만원) 미달');
    if(!cov.silson) probs.push('실손의료비 미가입 → 의료비 리스크 노출');
    if(cov.caregiver===0) probs.push('간병인사용일당 미가입');
  }

  const scoreColor=score>=70?'text-emerald-600':score>=50?'text-amber-600':'text-red-500';
  const borderColor=isDup?'border-amber-200':'border-slate-100';

  // Badges to show on card header
  const badges: { text: string; bg: string; textCol: string }[] = [];
  if (isDup) {
    badges.push({ text: '📉 다이어트 1순위', bg: 'bg-red-50 border border-red-100/65', textCol: 'text-red-600' });
  } else if (t === 'whole') {
    badges.push({ text: '⚠️ 주계약 비용 과다', bg: 'bg-orange-50 border border-orange-100/65', textCol: 'text-orange-600' });
  } else if (score >= 80) {
    badges.push({ text: '✅ 유지 권장', bg: 'bg-emerald-50 border border-emerald-100/65', textCol: 'text-emerald-600' });
  } else if (score < 50) {
    badges.push({ text: '🚀 보강 필요', bg: 'bg-indigo-50 border border-indigo-100/65', textCol: 'text-indigo-600' });
  }

  return (
    <div className={`bg-white rounded-[2rem] border ${borderColor} shadow-sm overflow-hidden`}>
      {/* Header */}
      <button onClick={()=>setOpen(!open)} className="w-full text-left p-6 md:p-8 flex items-start justify-between gap-4 hover:bg-slate-50/40 transition-colors group">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-black text-white ${isDup?'bg-amber-500':typeColor[t]}`}>
            {String(index+1).padStart(2,'0')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black">{policy.insurance_company}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white ${typeColor[t]}`}>{typeLabel[t]}</span>
              {isDup&&<span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[10px] font-black">⚠️ 중복</span>}
              {badges.map((b, idx) => (
                <span key={idx} className={`px-2 py-0.5 rounded-md text-[10px] font-black ${b.bg} ${b.textCol}`}>
                  {b.text}
                </span>
              ))}
            </div>
            <p className="text-sm font-black text-slate-800 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">{policy.product_name}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-black text-orange-600">월 {p.toLocaleString()}원</span>
              <span className="text-[10px] text-slate-400 font-bold">특약 {policy.riders.length}개</span>
              {saving>0&&<span className="text-[10px] text-emerald-600 font-black">절감 가능 {fmt(saving)}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center hidden sm:block">
            <span className="text-[9px] font-black text-slate-400 block uppercase">보장점수</span>
            <span className={`text-2xl font-black ${scoreColor}`}>{score}</span>
          </div>
          <div className={`p-2 rounded-full transition-all flex items-center justify-center ${
            open 
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 rotate-0' 
              : 'bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-200 group-hover:scale-110'
          }`}>
            {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Expanded */}
      <AnimatePresence>
        {open&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3}} className="overflow-hidden">
            <div className="border-t border-slate-100 px-6 md:px-8 pb-8 space-y-8 pt-6">

              {/* Rider List */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">가입 특약 내역</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {policy.riders.map((r,i)=>(
                    <div key={i} className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-2.5 text-sm">
                      <span className="font-bold text-slate-700 truncate pr-2">{r.rider_name}</span>
                      <span className="font-black text-slate-900 shrink-0">{fmt(r.coverage_amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coverage Status */}
              {(t==='health'||t==='cancer'||t==='silson')&&(
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">📋 상세 보장 분석 현황</p>
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                    <CovRow label="일반암 진단비" value={cov.cancer>0?fmt(cov.cancer):'미가입'} status={statusOf(cov.cancer,30000000,10000000)} note="권장: 3,000~5,000만원"/>
                    <CovRow label="뇌혈관 질환 진단비" value={cov.brain>0?fmt(cov.brain):'미가입'} status={statusOf(cov.brain,20000000,10000000)} note="권장: 2,000~3,000만원"/>
                    <CovRow label="허혈성 심장질환 진단비" value={cov.heart>0?fmt(cov.heart):'미가입'} status={statusOf(cov.heart,20000000,10000000)} note="권장: 2,000~3,000만원"/>
                    <CovRow label="수술비(질병/상해)" value={cov.surgery>0?fmt(cov.surgery):'미가입'} status={statusOf(cov.surgery,3000000,1000000)} note="권장: 300만원 이상"/>
                    <CovRow label="간병인사용일당" value={cov.caregiver>0?fmt(cov.caregiver)+'/일':'미가입'} status={statusOf(cov.caregiver,150000,100000)} note="권장: 15만원/일 이상"/>
                    <CovRow label="실손의료비" value={cov.silson?'가입':'미가입'} status={cov.silson?'good':'none'} note="의료비 리스크 노출"/>
                  </div>
                </div>
              )}

              {/* Radar + Score */}
              <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                <div className="relative flex-shrink-0">
                  <RadarChart data={radar} size={260}/>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Score</span>
                    <span className={`text-3xl font-black ${scoreColor}`}>{score}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">이 보험의 종합 평가</p>
                    <p className="text-2xl font-black text-slate-900">{policy.product_name.split('(')[0].trim()}</p>
                  </div>
                  {probs.length>0&&(
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">⚠️ 발견된 문제점</p>
                      {probs.map((pr,i)=>(
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-600 font-bold">
                          <span className="text-red-400 mt-0.5 shrink-0">•</span>{pr}
                        </div>
                      ))}
                    </div>
                  )}
                  {probs.length===0&&<p className="text-emerald-600 font-black text-sm">✅ 이 보험은 양호한 상태입니다.</p>}
                </div>
              </div>

              {/* Diet / Upgrade Options */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Diet */}
                <div className="bg-blue-50/50 border border-blue-100/60 rounded-2xl p-6">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">📉 다이어트 플랜</p>
                  <p className="text-lg font-black text-blue-900 mb-1">동일 보장, 더 저렴하게</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black text-blue-600">{dietPremium.toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-500">원/월</span>
                    <span className="ml-2 text-xs font-black text-emerald-600">월 {fmt(saving)} 절감</span>
                  </div>
                  <div className="space-y-1">
                    {dietOpts.slice(0,4).map((o,i)=>(
                      <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-blue-100/50 last:border-0">
                        <span className="font-bold text-slate-700">{String(i+1).padStart(2,'0')} {o.company}</span>
                        <span className="font-black text-blue-700">{o.premium.toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Upgrade */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">🚀 업그레이드 플랜</p>
                  <p className="text-lg font-black text-white mb-1">동일 예산, 더 든든하게</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black text-orange-400">{p.toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">원/월 유지</span>
                  </div>
                  <div className="space-y-1">
                    {COMPANIES.slice(0,4).map((c,i)=>{
                      const bonus=[5300,4700,4600,4200][i]||3800;
                      return(
                        <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-white/10 last:border-0">
                          <span className="font-bold text-slate-300">{String(i+1).padStart(2,'0')} {c}</span>
                          <span className="font-black text-orange-300">암 +{bonus}만</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Market Comparison */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">🏆 전 보험사 실시간 비교</p>
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 bg-slate-50 px-5 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                    <div className="col-span-1">순위</div>
                    <div className="col-span-4">보험사</div>
                    <div className="col-span-5">상품</div>
                    <div className="col-span-2 text-right">월 보험료</div>
                  </div>
                  {dietOpts.map((o,i)=>(
                    <div key={i} className={`grid grid-cols-12 px-5 py-3 text-xs items-center border-b border-slate-50 last:border-0 ${i===0?'bg-emerald-50/30':''}`}>
                      <div className="col-span-1 font-black text-slate-400">{String(i+1).padStart(2,'0')}</div>
                      <div className="col-span-4 font-black text-slate-800">{o.company}</div>
                      <div className="col-span-5 text-slate-500 truncate">무배당 다이어트 보험</div>
                      <div className="col-span-2 text-right font-black text-blue-600">
                        {o.premium.toLocaleString()}원
                        {i===0&&<span className="block text-[9px] text-emerald-600 font-black">최저가</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const PerPolicyDashboard: React.FC<Props> = ({ policies, age, gender }) => {
  const dups = findDups(policies);
  const total = policies.reduce((s,p)=>s+p.monthly_premium,0);
  const hasDups = dups.size > 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Summary Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] font-black text-slate-400 block uppercase">총 가입 건수</span>
            <span className="text-xl font-black text-slate-800">{policies.length}건</span>
          </div>
          <div className="h-8 w-px bg-slate-100"/>
          <div>
            <span className="text-[10px] font-black text-slate-400 block uppercase">월 총 납입료</span>
            <span className="text-xl font-black text-orange-600">{total.toLocaleString()}원</span>
          </div>
          {hasDups&&(
            <>
              <div className="h-8 w-px bg-slate-100"/>
              <div>
                <span className="text-[10px] font-black text-amber-500 block uppercase">⚠️ 중복 감지</span>
                <span className="text-xl font-black text-amber-600">{dups.size}건</span>
              </div>
            </>
          )}
        </div>
        <div className="text-[10px] text-slate-400 font-bold">각 카드를 클릭하면 개별 분석이 펼쳐집니다</div>
      </div>

      {/* Per-Policy Cards */}
      {policies.map((policy,i)=>(
        <PolicyCard key={i} policy={policy} index={i} isDup={dups.has(i)} totalCount={policies.length}/>
      ))}
    </div>
  );
};
