import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { B2BBranding } from '../hooks/useB2BBranding';

interface CustomerSupportSectionProps {
  branding: B2BBranding;
  onSubmitLead: (
    analysis: any,
    category: string,
    resultData: any,
    consultType?: 'anonymous' | 'regular'
  ) => Promise<any>;
  setView: (view: any) => void;
  setCalcTarget?: (target: string | null) => void;
}

export const CustomerSupportSection: React.FC<CustomerSupportSectionProps> = ({
  branding,
  onSubmitLead,
  setView,
  setCalcTarget
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('보험료 비교 설계');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const address = branding?.customAddress || branding?.agencyAddress || "서울특별시 영등포구 선유동2로 57, 10층";
  const displayPhone = branding?.customPhone || "080.808.1088";
  const displayEmail = branding?.customEmail || "support@rebalance.com";
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const simulatedAnalysis = {
        name,
        mobile: phone,
        age: 40,
        gender: 'M',
        jobClass: '1',
        selectedCategory: 'support'
      };

      const payload = {
        company,
        email,
        subject,
        message,
        source: 'support_page'
      };

      await onSubmitLead(simulatedAnalysis, 'support_consult', payload, 'regular');
      setSubmitted(true);
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('문의 전송 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full text-left">
      {/* 100% Full-Width Office Image Banner at the very top (Right below the Header) */}
      <div className="w-full relative h-[450px] md:h-[520px] bg-slate-950 overflow-hidden">
        <img
          src="/oh__img9356.webp"
          alt="Office"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent flex items-end">
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider">
              OUR OFFICE
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              따뜻함과 전문성이 공존하는 곳
            </h1>
            <p className="text-xs md:text-sm font-bold text-slate-200/90 max-w-xl leading-relaxed">
              고객님의 소중한 가치를 지키기 위해, 언제나 쾌적하고 신뢰할 수 있는 공간에서 열린 마음으로 기다리고 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Main Body Content wrapping inside the standard centered width */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Title bar & Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-8">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">고객센터 및 찾아오시는 길</h2>
            <p className="text-xs md:text-sm font-semibold text-slate-400">
              고객님의 든든한 파트너로서 신속하고 정확한 상담과 안내를 도와드리겠습니다.
            </p>
          </div>
          <button
            onClick={() => {
              if (setCalcTarget) setCalcTarget(null);
              setView('home');
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white font-black text-xs transition-all shadow-md active:scale-95 group cursor-pointer shrink-0"
          >
            메인으로 돌아가기
            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={14} />
          </button>
        </div>

        {/* Direction & Contact cards (Three-column layout) */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200/60 rounded-[2rem] p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900">찾아오시는 길 안내</h3>
            <p className="text-sm text-slate-600 font-bold leading-relaxed break-keep">
              {address}
            </p>
          </div>

          <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200/60 rounded-[2rem] p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
              <Phone size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900">대표 연락처</h3>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              전화: <a href={`tel:${displayPhone}`} className="hover:underline hover:text-orange-500 transition-colors">{displayPhone}</a>
            </p>
            {branding?.customPhone ? null : (
              <p className="text-xs text-slate-400 font-semibold">팩스: 02-3456-7890</p>
            )}
          </div>

          <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200/60 rounded-[2rem] p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
              <Clock size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900">영업시간 안내</h3>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              평일: 오전 9:00 ~ 오후 6:00
            </p>
            <p className="text-xs text-slate-400 font-semibold">주말 및 공휴일 휴무</p>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="w-full bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200/50 shadow-lg relative h-[450px]">
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={mapUrl}
          ></iframe>
        </div>

        {/* Inquiry Form */}
        <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] text-white grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-orange-500/20">
              ✉️ Get in Touch
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              실시간 문의하기
            </h3>
            <p className="text-sm text-slate-400 font-bold leading-relaxed break-keep">
              비교 설계, 리모델링, 제휴 등 원하시는 문의 사항을 남겨주시면 담당 설계사가 신속하고 친절하게 답변을 드리겠습니다.
            </p>
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-slate-350">
                <Mail size={16} className="text-orange-500 shrink-0" />
                <span className="text-xs font-bold">{displayEmail}</span>
              </div>
              <a href={`tel:${displayPhone}`} className="flex items-center gap-3 text-slate-350 hover:text-orange-400 transition-colors cursor-pointer">
                <Phone size={16} className="text-orange-500 shrink-0" />
                <span className="text-xs font-bold">{displayPhone}</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3 w-full bg-slate-900/60 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-inner">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-white">소중한 문의가 접수되었습니다</h4>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed break-keep">
                    보내주신 상세 내용을 확인한 후 담당자가 빠른 시일 내에 기재해주신 번호 또는 이메일로 회신해 드리겠습니다.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black text-xs rounded-xl border border-white/10 transition-all cursor-pointer"
                >
                  새로운 문의 남기기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">이름</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-slate-650 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">소속 (선택)</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="직장명 또는 개인"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-slate-650 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">이메일</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="example@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-slate-650 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">연락처</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="010-1234-5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-slate-650 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">문의 유형</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="보험료 비교 설계">보험료 비교 설계</option>
                    <option value="기존 보험 리모델링">기존 보험 리모델링</option>
                    <option value="제휴 및 광고 문의">제휴 및 광고 문의</option>
                    <option value="기타 일반 문의">기타 일반 문의</option>
                  </select>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">상세 문의 내용</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="문의하실 세부 사항을 작성해 주세요."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-slate-650 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-[0_10px_20px_-4px_rgba(255,107,0,0.4)] transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  {submitting ? "문의 전송 중..." : "전송하기"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
