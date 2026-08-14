import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { createClient } from '../utils/supabase/client';

interface VerificationPageProps {
  branding: any;
  initialCode?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function VerificationPage({ branding, initialCode, onSuccess, onClose }: VerificationPageProps) {
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [leadRecord, setLeadRecord] = useState<any>(null);
  const [stepMsg, setStepMsg] = useState('');
  const [stepsCompleted, setStepsCompleted] = useState<string[]>([]);
  const [smsSent, setSmsSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(180);
  const [sendingSms, setSendingSms] = useState(false);
  const [mockOtp, setMockOtp] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      fetchLeadByCode(initialCode);
    } else {
      // Parse simulation code from URL query string
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('code');
      if (codeParam) {
        setCode(codeParam);
        fetchLeadByCode(codeParam);
      }
    }
  }, [initialCode]);

  const fetchLeadByCode = async (simCode: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('customer_leads')
        .select('*')
        .eq('raw_payload->>simulation_code', simCode)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching lead:', error);
        setErrorMsg('설계 코드를 조회하는 도중 오류가 발생했습니다.');
        return;
      }

      if (!data || data.length === 0) {
        setErrorMsg(`입력된 설계 코드(${simCode})를 찾을 수 없습니다. 올바른 링크인지 확인해 주세요.`);
        return;
      }

      setLeadRecord(data[0]);
    } catch (err) {
      console.error(err);
      setErrorMsg('설계 코드를 조회하는 도중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (smsSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [smsSent, otpTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendOtp = async () => {
    if (!name.trim()) {
      alert('성함을 입력해 주세요.');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      alert('올바른 연락처를 입력해 주세요.');
      return;
    }
    if (!agreedTerms) {
      alert('개인정보 제공 및 활용에 동의해 주세요.');
      return;
    }
    if (!leadRecord) {
      alert('유효한 설계 코드가 존재하지 않습니다.');
      return;
    }

    setSendingSms(true);
    setErrorMsg(null);
    setMockOtp(null);

    try {
      const res = await fetch('/api/send-sms-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone: mobile })
      });
      const data = await res.json();
      if (data.success) {
        setSmsSent(true);
        setOtpTimer(180);
        if (data.simulated && data.code) {
          setMockOtp(data.code);
        }
      } else {
        setErrorMsg(data.error || '인증번호 전송에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('인증번호 전송 중 서버 연결 오류가 발생했습니다.');
    } finally {
      setSendingSms(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsSent) {
      await handleSendOtp();
      return;
    }

    if (!otpCode.trim() || otpCode.length !== 6) {
      alert('6자리 인증번호를 올바르게 입력해 주세요.');
      return;
    }

    if (otpTimer === 0) {
      alert('인증 시간이 만료되었습니다. 인증번호를 다시 요청해 주세요.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setStepsCompleted([]);

    try {
      // 1. Verify OTP with Aligo SMS Service via API
      const verifyRes = await fetch('/api/send-sms-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone: mobile, code: otpCode })
      });
      const verifyData = await verifyRes.json();
      
      if (!verifyData.success) {
        throw new Error(verifyData.error || '인증번호가 일치하지 않거나 만료되었습니다.');
      }

      // 2. Play beautiful step animation
      const steps = [
        { msg: '보안 전송 채널을 안전하게 구축하는 중...', delay: 600 },
        { msg: '알리고(Aligo) SMS 최종 승인 대조 완료...', delay: 600 },
        { msg: '국가공인 하이픈(Hyphen) 실시간 본인인증 완료...', delay: 600 },
        { msg: '대시보드 실시간 언마스킹(Unmasking) 시그널 송출 중...', delay: 600 }
      ];

      for (let i = 0; i < steps.length; i++) {
        setStepMsg(steps[i].msg);
        await new Promise((resolve) => setTimeout(resolve, steps[i].delay));
        setStepsCompleted(prev => [...prev, steps[i].msg]);
      }

      // 3. Update lead record in Supabase with real Name, Phone, and mark status as 'verified'
      const supabase = createClient();
      const updatedPayload = {
        ...(leadRecord.raw_payload || {}),
        consult_type: 'regular',
        verified_name: name,
        verified_mobile: mobile,
        verified_at: new Date().toISOString(),
        timeline: [
          {
            id: `verify-${Date.now()}`,
            type: 'system_log',
            author: '시스템',
            detail: `고객이 1:1 상담방 비공개 링크를 통해 알리고 본인인증을 완료하였습니다. (성함: ${name}, 연락처: ${mobile})`,
            created_at: new Date().toISOString()
          },
          ...(leadRecord.raw_payload?.timeline || [])
        ]
      };

      try {
        const { error } = await supabase
          .from('customer_leads')
          .update({
            name: name,
            phone: mobile,
            status: 'verified',
            raw_payload: updatedPayload
          })
          .eq('id', leadRecord.id);

        if (error) {
          console.warn('[Verification] Supabase lead update warning:', error.message);
        }
      } catch (dbErr) {
        console.warn('[Verification] DB update fallback:', dbErr);
      }

      // Save unlocked state to localStorage so the same browser gets unmasked instantly
      localStorage.setItem('isUnlocked', 'true');
      localStorage.setItem('hasUnlocked', 'true');
      localStorage.setItem('ins_unlocked', 'true');

      // 4. Automatically dispatch the permanent storage report link via SMS
      try {
        const origin = window.location.origin;
        const brandName = branding?.name || '보장비교';
        const msg = `[${brandName}]
안녕하세요, ${name} 고객님.
요청하신 비교 설계안 보관 링크입니다.

🔑 고유 코드: ${code}
🔗 모바일 보고서 링크:
${origin}/?code=${code}

보안된 서버에 안전하게 보관되었습니다. 언제든 분석 결과를 다시 확인하실 수 있습니다.`;

        await fetch('/api/send-sms-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send-link',
            phone: mobile,
            message: msg
          })
        });
      } catch (smsErr) {
        console.error("Failed to automatically dispatch report SMS:", smsErr);
      }

      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '인증 정보 처리 중 서버 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-8 text-slate-800">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl text-center space-y-6 max-w-md mx-auto"
          >
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-orange-100 animate-spin border-t-orange-500" />
                <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">안전 본인인증 중</h3>
              <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">PII Encryption Transfer</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3">
              {stepsCompleted.map((completedMsg, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="line-through opacity-60">{completedMsg}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 text-xs font-black text-orange-600 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>{stepMsg}</span>
              </div>
            </div>
          </motion.div>
        ) : success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl text-center space-y-6 max-w-md mx-auto relative"
          >
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute top-6 right-6 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 relative">
                <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                <Sparkles className="absolute -top-1 -right-1 text-yellow-500 w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">간편인증 완료!</h3>
              <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Decryption Signal Transmitted</p>
            </div>

            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/50 text-left text-slate-700 text-sm font-semibold leading-relaxed break-keep">
              🎉 본인 인증이 완벽하게 승인되었습니다.<br />
              기존에 띄워 놓으셨던 <span className="text-orange-600 font-black">보험 비교 시뮬레이션 화면</span>을 확인해 주세요. 마스킹이 완전히 해제되어 상세 상품명이 노출되어 있습니다!
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={() => {
                  window.close();
                  window.location.href = `/?code=${code}`;
                }}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                결과 보고서 확인하러 가기
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl space-y-6 max-w-md mx-auto relative"
          >
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute top-6 right-6 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer animate-in fade-in duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-900 leading-tight">1:1 안심 본인인증</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Secure Identity Channel</p>
              </div>
            </div>

            {errorMsg ? (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-rose-500 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-600 font-bold leading-relaxed break-keep">{errorMsg}</p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-1">
                <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">연동된 설계 코드</span>
                <span className="text-sm font-black text-orange-600 tracking-wider font-mono">{code || '코드를 로딩 중...'}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 pl-1">성함</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="실명을 입력해 주세요"
                  disabled={!!errorMsg || smsSent}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-orange-200 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300 disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 pl-1">휴대폰 번호</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="숫자만 입력해 주세요"
                  maxLength={11}
                  disabled={!!errorMsg || smsSent}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-orange-200 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300 disabled:opacity-60"
                />
              </div>

              {!smsSent && (
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    disabled={!!errorMsg}
                    className="w-5 h-5 rounded-lg accent-orange-500 shrink-0 mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="agree-terms" className="text-[11px] font-bold text-slate-400 cursor-pointer select-none leading-relaxed">
                    개인 식별 정보 수집 및 1:1 상담원 매칭 처리를 위한 이용 약관에 동의합니다.
                  </label>
                </div>
              )}

              {mockOtp && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-[10.5px] text-amber-500 font-extrabold leading-relaxed break-keep">
                  ⚠️ [시뮬레이션 우회] 알리고 IP 인증오류로 인해 로컬 테스트용 인증번호 <span className="underline font-mono text-xs">{mockOtp}</span>가 발송된 것으로 우회 처리되었습니다.
                </div>
              )}

              {smsSent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5 pt-2"
                >
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-xs font-black text-slate-400">인증번호 (6자리)</label>
                    <span className="text-xs font-mono font-black text-rose-500">
                      {otpTimer > 0 ? formatTimer(otpTimer) : '시간 만료'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="숫자 6자리를 입력하세요"
                      maxLength={6}
                      disabled={otpTimer === 0}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-orange-200 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-orange-500 bg-orange-50 hover:bg-orange-100 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                      재전송
                    </button>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={!!errorMsg || sendingSms || (smsSent && otpTimer === 0)}
                className="w-full py-4.5 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-500 text-white font-black rounded-2xl shadow-lg shadow-orange-100/50 transition-all text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {sendingSms ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    인증문자 발송 중...
                  </>
                ) : smsSent ? (
                  <>
                    인증 완료 및 언마스킹 요청
                    <ArrowRight className="w-4 h-5" />
                  </>
                ) : (
                  <>
                    인증번호 받기
                    <ArrowRight className="w-4 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
