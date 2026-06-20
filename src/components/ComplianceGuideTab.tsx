import React, { useState } from 'react';
import { 
  BookOpen, Copy, Check, FileText, Download, CheckCircle, 
  ExternalLink, ArrowRight, ShieldCheck, HeartHandshake, AlertCircle 
} from 'lucide-react';

interface ComplianceGuideTabProps {
  plannerCode: string;
  onGoToProfile: () => void;
}

export function ComplianceGuideTab({ plannerCode, onGoToProfile }: ComplianceGuideTabProps) {
  const [copiedText, setCopiedText] = useState<'template' | 'link' | null>(null);
  
  // Interactive mockup state
  const [mockAgencyName, setMockAgencyName] = useState('주식회사 아이지에이수수');
  const [mockRegNo, setMockRegNo] = useState('생명보험협회 심의필 제 2026-99999호');
  const [mockDuration, setMockDuration] = useState('2026.06.18 ~ 2027.06.17');

  const shareUrl = `${window.location.origin}/?planner=${plannerCode}`;

  const handleCopy = (text: string, type: 'template' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const sameItemTemplate = `[동일 광고물 심의 기기재 사용 통보]

본 설계사는 이미 협회 심의를 통과한 'AI 빅데이터 보장분석 플랫폼'(마스터 심의번호: 생명보험협회 심의필 제 2026-00000호)을 레이아웃 및 원본 텍스트의 임의 수정 없이 활용할 것을 서약합니다.

이에 따라 하단 공시 영역의 [설계사명/연락처/개인심의번호] 정보만을 변경하여 동일물 광고물로 사용하고자 통보(신청)합니다.`;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[2rem] p-6 lg:p-8 text-left shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] -z-10" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>금융소비자보호법 준수 가이드</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight break-keep">
              광고 심의 및 동일물 기기재 등록 가이드라인
            </h1>
            <p className="text-slate-400 text-xs lg:text-sm font-semibold leading-relaxed break-keep">
              AI 빅데이터 보장 진단 플랫폼은 협회 심의를 통과한 정식 마스터 레이아웃을 제공합니다. 
              구독 설계사분들은 <strong>신규 심의 대신 소속 대리점 준법팀에 '동일물 통보'</strong>를 거쳐 즉시 합법적으로 배포하실 수 있습니다.
            </p>
          </div>
          
          <button
            onClick={onGoToProfile}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 text-white font-black text-xs hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95"
          >
            <span>프로필 설정으로 이동</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Steps Flowchart (Interactive UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
        {/* Step 1 */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded">Step 01</span>
              <BookOpen className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-sm font-black text-white">마스터 심의 규격 확인</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              최초 1회 대표 심의를 거쳐 획득한 마스터 심의 정보를 확인하고 증빙용 캡처를 준비합니다.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 font-semibold space-y-1">
            <div>• 마스터 심의번호:</div>
            <div className="text-slate-300 bg-slate-950 px-2 py-1.5 rounded font-mono break-all text-[10px] border border-slate-800">
              생명보험협회 심의필 제 2026-00000호
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest bg-violet-400/10 px-2 py-0.5 rounded">Step 02</span>
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-sm font-black text-white">준법팀 동일물 신청</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              아래 신청서 양식을 복사하여 소속 대리점(GA) 준법팀에 동일물 광고 기기재 신고를 접수합니다.
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => handleCopy(sameItemTemplate, 'template')}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-violet-500/40 text-slate-300 font-bold text-xs transition-all"
            >
              {copiedText === 'template' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>신청양식 복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded">Step 03</span>
              <CheckCircle className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-sm font-black text-white">심의필 번호 어드민 등록</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              본사 준법팀으로부터 개인 고유 심의번호가 발급되면 어드민 프로필 설정창에 등록합니다.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 font-semibold">
            <div>• 적용 위치:</div>
            <div className="text-slate-300 font-mono text-[10px]">
              내 프로필/랜딩 설정 &gt; 심의필 번호 입력란
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative group">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded">Step 04</span>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-sm font-black text-white">개인 전용 링크 홍보</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              개인화 주소로 접속하면 사진 속 대리점명과 심의번호가 즉시 변경된 화면으로 배포됩니다.
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => handleCopy(shareUrl, 'link')}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 text-orange-400 font-bold text-xs transition-all"
            >
              {copiedText === 'link' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-orange-400">링크 복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>내 진단 링크 복사</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Mockup & Simulation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mockup Profile Edit Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-left space-y-5 relative">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            <span>실시간 가상 시뮬레이터 (MOCK)</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black text-white">1. 어드민 입력창 변경하기</h2>
            <p className="text-slate-400 text-[11px] font-semibold break-keep leading-normal">
              아래 가상의 어드민 설정값들을 수정해 보세요. 오른쪽 모의 화면의 준법 감시 안내문구가 <strong>0.1초 만에 실시간으로 즉시 동기화</strong>됩니다.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 block uppercase">보험 대리점 지점명</label>
              <input 
                type="text" 
                value={mockAgencyName}
                onChange={(e) => setMockAgencyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:border-orange-500 focus:outline-none transition-all"
                placeholder="지점(소속) 이름 입력"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 block uppercase">보험대리점 광고심의필 번호</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={mockRegNo}
                  onChange={(e) => setMockRegNo(e.target.value)}
                  className="w-full bg-slate-950 border border-orange-500/50 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:border-orange-500 focus:outline-none transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                  placeholder="대리점 심의필 번호 입력"
                />
                <span className="absolute right-3 top-2.5 text-[9px] font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  핵심 연동 필드
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 block uppercase">심의필 유효기간</label>
              <input 
                type="text" 
                value={mockRegNo ? mockDuration : ''}
                onChange={(e) => setMockDuration(e.target.value)}
                disabled={!mockRegNo}
                className="w-full bg-slate-950 border border-slate-800 disabled:opacity-40 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:border-orange-500 focus:outline-none transition-all"
                placeholder="예: 2026.06.18 ~ 2027.06.17"
              />
            </div>
          </div>
        </div>

        {/* Mockup Preview Area */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-left flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-black">
            <span>진단 화면 미리보기</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black text-white">2. 실시간 반영 결과</h2>
            <p className="text-slate-400 text-[11px] font-semibold break-keep leading-normal">
              설계사의 개인 전용 링크로 분석 완료 시, 하단 사진 영역에 다음과 같이 법적 공시문이 완벽하게 갱신됩니다.
            </p>
          </div>

          {/* Simulated Footer Box */}
          <div className="my-6 p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-slate-400 font-semibold leading-relaxed border-b border-slate-800/80 pb-4">
              <div className="space-y-1 bg-slate-900/50 p-3 rounded-lg border border-slate-800/40">
                <div className="font-extrabold text-white text-[11px] flex items-center gap-1">
                  <span>⚠️ 중도 해지 시 환급금에 관한 안내</span>
                </div>
                <p className="text-slate-500 text-[9px] leading-relaxed break-all">
                  보장계약을 중도에 해지할 경우 해지환급금은 이미 납입한 보험료보다 적거나 없을 수 있습니다.
                </p>
              </div>

              <div className="space-y-1 bg-slate-900/50 p-3 rounded-lg border border-slate-800/40">
                <div className="font-extrabold text-white text-[11px] flex items-center gap-1">
                  <span>📊 비교 공시 및 예상 요율 기준 안내</span>
                </div>
                <p className="text-slate-500 text-[9px] leading-relaxed break-all">
                  본 분석 리포트의 비교 기준일은 2026년 06월 공시 기준이며, 실제 가입 조건에 따라 달라질 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-[10px] text-slate-500 font-bold">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-orange-400 bg-orange-500/10 px-1 py-0.2 rounded border border-orange-500/20">대리점 정보</span>
                  <span className="text-white text-[11px]">{mockAgencyName || '주식회사 아이지에이수수'}</span>
                </div>
                <div>본 광고는 상품 광고가 아닌 회사 브랜드 및 서비스 목적의 업무광고입니다.</div>
              </div>

              {mockRegNo ? (
                <div className="text-right bg-orange-500/5 border border-orange-500/20 px-3 py-2 rounded-xl text-[10px]">
                  <div className="text-orange-400 font-black">{mockRegNo}</div>
                  {mockDuration && <div className="text-[9px] text-slate-400 font-semibold mt-0.5">유효기간: {mockDuration}</div>}
                </div>
              ) : (
                <div className="text-right bg-slate-900 px-3 py-2 rounded-xl text-[10px] border border-slate-800 text-slate-500 italic">
                  심의 번호 미등록 (기본 정보로 자동 노출)
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-950/60 p-3 rounded-xl border border-slate-800/50 leading-relaxed font-semibold">
            📢 <strong>실제 작동 구조:</strong> 어드민 페이지(탭 1)에서 저장 버튼을 누르는 순간, 브라우저의 <code>storage</code> 이벤트를 타고 열려 있는 모든 보험 진단 탭으로 브랜딩 데이터가 0.1초 만에 전송되어 화면을 즉시 갱신시킵니다.
          </div>
        </div>
      </div>

      {/* Helpful Guidelines & Rules */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-400" />
          <span>준법 감시 및 모니터링 주의사항</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-400 leading-relaxed">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-white font-extrabold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>자구 임의 수정 금지</span>
            </div>
            <p className="text-[11px] leading-relaxed break-keep pl-3 text-slate-500">
              이미 심의가 완료된 진단 페이지의 안내 문구, 헤더 텍스트, 경고문 및 로직은 어떠한 경우에도 임의 수정할 수 없습니다. 
              기본 제공 규격을 그대로 사용해야만 동일물 적용 효력이 유지됩니다.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-white font-extrabold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>심의 유효기간 만료 주의</span>
            </div>
            <p className="text-[11px] leading-relaxed break-keep pl-3 text-slate-500">
              일반적인 협회 심의 광고물의 유효기간은 <strong>승인일로부터 1년</strong>입니다. 
              유효기간 만료 1개월 전 준법감시팀을 통해 동일물 연장 신청 또는 재심의를 진행하여 노출을 갱신해 주셔야 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
