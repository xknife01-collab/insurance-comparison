import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { checkAndDeductCredits } from '../utils/creditService';
import { 
  Coins, Briefcase, ShieldCheck, FileText, Sparkles, TrendingUp, 
  UserCheck, Printer, Clock, ArrowRight, X, Check, CheckCircle
} from 'lucide-react';

interface AdRequest {
  id: string;
  planner_id: string;
  agency_id: string;
  monthly_budget: number;
  target_products: string[];
  contact_phone: string;
  user_notes: string;
  contract_text: string;
  signature_base64: string;
  status: 'pending' | 'consulting' | 'active' | 'completed';
  created_at: string;
  planner?: {
    name: string;
    company_name?: string;
  };
}

interface AdCampaignTabProps {
  currentUser: {
    id: string;
    name: string;
    phone: string;
    role: string;
    agency_id?: string;
    company_name?: string;
  };
  isSuperAdmin: boolean;
}

const PRODUCTS_LIST = ['어린이보험', '종합 건강보험', '실손 의료보험', '치매/간병보험', '암보험', '운전자/자동차보험'];

export const AdCampaignTab: React.FC<AdCampaignTabProps> = ({ currentUser, isSuperAdmin }) => {
  const supabase = createClient();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // General states
  const [requests, setRequests] = useState<AdRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null);

  // Form states (For Planners)
  const [budget, setBudget] = useState<number>(3000000);
  const [customBudgetInput, setCustomBudgetInput] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [customProductInput, setCustomProductInput] = useState<string>('');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [notes, setNotes] = useState('');
  
  // Modal states
  const [showContractModal, setShowContractModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [agencyCredits, setAgencyCredits] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchRequests();
    if (!isSuperAdmin) {
      fetchAgencyCredits();
    }
  }, [isSuperAdmin]);

  const fetchAgencyCredits = async () => {
    try {
      const activeAgencyId = currentUser.agency_id || '88888888-8888-4888-a888-888888888888';
      const { data, error } = await supabase
        .from('agencies')
        .select('current_credits')
        .eq('id', activeAgencyId)
        .single();
      if (!error && data) {
        setAgencyCredits(data.current_credits);
      }
    } catch (err) {
      console.error('Failed to fetch agency credits:', err);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ad_requests')
        .select(`
          *,
          planner:planners(name, company_name)
        `)
        .order('created_at', { ascending: false });

      if (!isSuperAdmin) {
        // Normal planner can only see their own requests
        query = query.eq('planner_id', currentUser.id);
      }

      const { data, error } = await query;
      if (!error && data) {
        setRequests(data as AdRequest[]);
      }
    } catch (err) {
      console.error('Failed to fetch ad requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductToggle = (product: string) => {
    setSelectedProducts(prev => 
      prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]
    );
  };

  // Canvas Drawing Handlers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b'; // dark slate for pen
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  // Build the Contract text dynamically
  const generateContractText = () => {
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    const finalBudget = customBudgetInput ? parseInt(customBudgetInput.replace(/[^0-9]/g, '')) || 3000000 : budget;
    const fee = Math.floor(finalBudget * 0.20);
    const netAdSpend = finalBudget - fee;

    return `온라인 광고 대행 표준 계약서

광고주 (갑): ${currentUser.name} (소속: ${currentUser.company_name || '보험대리점'}, 연락처: ${phone})
대행사 (을): 더윤컴퍼니 (대표: 김홍일, 사업자번호: 105-12-78126)

제1조 (목적)
본 계약은 "갑"이 운영하는 보험 비교 분석 플랫폼의 B2B 고객 유치 마케팅 업무를 "을"에게 위탁하고, "을"이 이를 성실하게 기획 및 대행하여 상호 이익을 증대시키는 것을 목적으로 한다.

제2조 (업무의 범위 및 광고 집행)
1. "을"은 "갑"의 보험 비교 랜딩 페이지 유입을 증대시키기 위해 네이버 키워드 광고(롱테일 키워드 세팅), 인스타그램/메타 스폰서드 숏폼 광고, 카카오톡 상단 배너(비즈보드) 및 카카오 싱크 연동 등을 복합 운영한다.
2. "을"은 광고주 "갑"의 고유 홍보 링크 및 데이터베이스(DB) 수집 인프라를 실시간 연동하여, 광고 유입자가 이탈 없이 "갑"의 관리자 서버로 안심하고 데이터베이스를 제출하도록 유도한다.

제3조 (광고비 및 대행 수수료)
1. 본 계약에 따른 월간 광고 예산 총액은 최소 3,000,000원(금 삼백만원) 이상으로 제한한다.
2. "갑"이 신청한 본 약정의 월 광고 예산 총액은 금 ${finalBudget.toLocaleString()}원(보유 광고 캐시 선결제 차감)으로 하며, 이는 "을"의 대행 수수료가 포함된 금액이다.
3. 광고 대행 수수료는 예산 총액의 20%에 해당하는 금 ${fee.toLocaleString()}원(VAT 포함)으로 약정하며, 이를 제외한 실제 집행 광고 매체 비용은 금 ${netAdSpend.toLocaleString()}원으로 규정한다.
4. "갑"이 본 약관에 동의하고 계약을 전송하는 즉시 플랫폼 보유 광고 캐시에서 총 예산 ${finalBudget.toLocaleString()}원이 자동 차감 및 집행 대기 상태로 예치된다.

제4조 (계약 기간 및 연장)
1. 본 계약의 유효기간은 서명 후 광고가 최초 시작된 일로부터 1개월간으로 한다.
2. 계약 만료 7일 전까지 상호 서면 합의 또는 대시보드 연장 신청이 있거나 추가 충전 결제가 완료되는 경우, 본 계약은 1개월 단위로 자동 연장된다.

제5조 (개인정보보호 및 신뢰 의무)
"을"은 본 업무를 처리하며 획득한 "갑"의 고객 리드 데이터베이스(실명, 전화번호, 분석 결과)를 개인정보보호법에 준수하여 안전하게 취급해야 하며, 광고 캠페인 운영 이외의 임의 목적으로 사용하거나 제3자에게 배포 또는 양도해서는 아니 된다.

제6조 (계약의 성립)
본 계약은 "갑"이 약관에 동의하고 전자서명을 날인하여 전송한 일시로부터 법적 효력을 가진 전자 문서 계약으로 성립된다.

작성일자: ${today}

위 위탁인 (갑)
성명: ${currentUser.name} (서명/날인)
소속: ${currentUser.company_name || '개인 설계사'}
대표 번호: ${phone}

위 수임인 (을)
상호: 더윤컴퍼니
대표자: 김홍일 (인)
사업자등록번호: 105-12-78126
소재지: 경기도 남양주시 진접읍 부평로48번길 140, 107동 1102호(더샵퍼스트시티)
`;
  };

  const handleOpenContract = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBudget = customBudgetInput ? parseInt(customBudgetInput.replace(/[^0-9]/g, '')) || 3000000 : budget;
    if (finalBudget < 3000000) {
      alert('광고 대행 신청 최소 예산은 월 3,000,000원 이상입니다.');
      return;
    }
    const finalProducts = customProductInput.trim() 
      ? [...selectedProducts, customProductInput.trim()] 
      : selectedProducts;

    if (finalProducts.length === 0) {
      alert('최소 하나 이상의 마케팅 집중 보험 상품을 선택하거나 직접 입력해 주세요.');
      return;
    }
    if (!phone.trim()) {
      alert('신청자 연락처를 정확히 입력해 주세요.');
      return;
    }

    // Check cash balance
    if (agencyCredits !== null && agencyCredits < finalBudget) {
      alert(`보유하고 계신 광고 캐시가 부족합니다.\n현재 잔액: ${agencyCredits.toLocaleString()}원\n필요 예산: ${finalBudget.toLocaleString()}원\n\n대시보드 내 '구독 결제 관리'에서 캐시를 먼저 충전해 주세요.`);
      return;
    }

    setShowContractModal(true);
    setHasSigned(false);
  };

  const handleSubmitRequest = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSigned) {
      alert('계약 서명 영역에 대표 서명을 진행해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const signatureImg = canvas.toDataURL('image/png');
      const finalBudget = customBudgetInput ? parseInt(customBudgetInput.replace(/[^0-9]/g, '')) || 3000000 : budget;
      const contractBodyText = generateContractText();
      const finalProducts = customProductInput.trim() 
        ? [...selectedProducts, customProductInput.trim()] 
        : selectedProducts;

      // 1. Deduct credits first
      const activeAgencyId = currentUser.agency_id || '88888888-8888-4888-a888-888888888888';
      const deduction = await checkAndDeductCredits(
        activeAgencyId,
        finalBudget,
        currentUser.id,
        'ad_campaign',
        `B2B 광고대행 신청 선결제 (총액: ${finalBudget.toLocaleString()}원, 수수료 20% 포함)`
      );

      if (!deduction.success) {
        alert('광고 캐시 차감에 실패했습니다: ' + deduction.message);
        setSubmitting(false);
        return;
      }

      // 2. Save request to db
      const payload = {
        planner_id: currentUser.id,
        agency_id: activeAgencyId,
        monthly_budget: finalBudget,
        target_products: finalProducts,
        contact_phone: phone,
        user_notes: notes,
        contract_text: contractBodyText,
        signature_base64: signatureImg,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('ad_requests')
        .insert([payload]);

      if (error) throw error;

      alert('광고 대행 계약 신청서가 성공적으로 접수 및 선결제 처리되었습니다! 김홍일 대표님이 검토 후 신속히 연락해 드리겠습니다.');
      setShowContractModal(false);
      
      // Reset Form
      setNotes('');
      setSelectedProducts([]);
      setCustomProductInput('');
      setCustomBudgetInput('');
      setBudget(3000000);

      fetchRequests();
      fetchAgencyCredits();
    } catch (err: any) {
      alert('광고 대행 요청 저장 실패: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Super Admin Status Changer
  const handleUpdateStatus = async (requestId: string, newStatus: any) => {
    try {
      const { error } = await supabase
        .from('ad_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;
      
      alert('신청 상태가 정상적으로 변경되었습니다.');
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      alert('상태 업데이트 실패: ' + err.message);
    }
  };

  // Super Admin cancel and refund
  const handleCancelAndRefund = async (request: AdRequest) => {
    if (!window.confirm(`정말로 해당 광고 대행 신청을 취소하고 예산 총액 (${request.monthly_budget.toLocaleString()}원)을 설계사 캐시로 즉시 환불하시겠습니까?`)) {
      return;
    }

    try {
      const activeAgencyId = request.agency_id || '88888888-8888-4888-a888-888888888888';
      // Refund by deducting a NEGATIVE amount
      const refundResult = await checkAndDeductCredits(
        activeAgencyId,
        -request.monthly_budget,
        request.planner_id,
        'ad_campaign_refund',
        `광고 대행 신청 취소 환불 (총액: ${request.monthly_budget.toLocaleString()}원)`
      );

      if (!refundResult.success) {
        alert('환불 처리에 실패했습니다: ' + refundResult.message);
        return;
      }

      // Update request status to completed and log refund in notes
      const { error } = await supabase
        .from('ad_requests')
        .update({ 
          status: 'completed', 
          user_notes: (request.user_notes || '') + '\n[어드민 환불: 광고 대행 취소 및 예산 100% 환불 완료]', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', request.id);

      if (error) throw error;

      alert(`정상적으로 광고 대행 신청이 취소되었으며, 예산 ${request.monthly_budget.toLocaleString()}원이 환불 처리되었습니다.`);
      fetchRequests();
      setSelectedRequest(null);
    } catch (err: any) {
      alert('환불 및 취소 처리 중 오류 발생: ' + err.message);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('contract-print-area');
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    // reload window to restore react scripts binding
    window.location.reload();
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (statusFilter === 'all') return true;
    return req.status === statusFilter;
  });

  return (
    <div className="space-y-8 relative text-left">
      {/* Header card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-orange-400 font-extrabold uppercase tracking-widest">Ad Agency Service</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter">🎯 광고 대행 요청 & 전자계약</h2>
          <p className="text-xs text-slate-400 font-bold mt-1">
            {isSuperAdmin 
              ? '보험리밸런스 플랫폼 가입 설계사 및 대리점들이 요청한 실전 광고 대행 신청 리스트와 서명된 계약서를 총괄 관리합니다.'
              : '월 최소 300만원의 광고 충전 캐시 선결제로, 네이버 롱테일, 인스타 메타 릴스 광고 등 완벽히 대행해 드리는 플랫폼 연계 서비스입니다.'}
          </p>
        </div>
      </div>

      {!isSuperAdmin ? (
        /* Planner Form View */
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Ad Campaign Info Banner */}
          <div className="lg:col-span-2 space-y-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-[2.5rem] p-8">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              더윤컴퍼니 광고 대행 안내
            </h3>

            {/* Current Cash Balance Card */}
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-5 shadow-lg shadow-orange-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-orange-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> 보유 광고 캐시
                </span>
                <span className="text-[9px] text-slate-500 font-black">실시간 동기화 완료</span>
              </div>
              <div className="text-xl font-black text-white tracking-tight">
                {agencyCredits !== null ? `${agencyCredits.toLocaleString()} 원` : '조회 중...'}
              </div>
            </div>
            
            <p className="text-xs text-slate-400 font-bold leading-relaxed">
              독보적인 AI 보험 리밸런스 분석 플랫폼을 가동해 드리는 최고의 방법! 광고 기획부터 소재 제작, 실시간 카톡 싱크 연동까지 전부 맡기시고 오직 수집된 고품질 DB 상담에만 집중하세요.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-850">
              <div className="flex items-start gap-3">
                <Coins className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-white">최소 집행 예산 및 대행 수수료</h4>
                  <p className="text-[11px] text-slate-400 font-bold mt-1 leading-normal">
                    월 광고 예산 최소 **3,000,000원** 이상 진행 가능하며, 대행 및 기획 관리 수수료는 **예산 총액의 20%(포함)**입니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-white">100% 최적화 타겟팅 운영</h4>
                  <p className="text-[11px] text-slate-400 font-bold mt-1 leading-normal">
                    대기업 GA들이 진흙탕 싸움을 벌이는 메인 키워드 대신 가입 확률이 높은 세부 롱테일 검색어 세팅 및 인스타 숏폼 맞춤 마케팅을 적용합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-white">법적 효력의 전자계약서 작성</h4>
                  <p className="text-[11px] text-slate-400 font-bold mt-1 leading-normal">
                    신청과 동시에 플랫폼 내부 표준 광고 대행 계약서를 서명하여 보관하므로 계약서 우편 송달이나 도장 날인 번거로움이 없습니다.
                  </p>
                </div>
              </div>
            </div>
            
            {/* My Requests Preview List */}
            <div className="pt-6 border-t border-slate-850">
              <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">내 광고 대행 신청 이력</h4>
              {requests.length === 0 ? (
                <p className="text-[11px] text-slate-500 font-bold">아직 신청한 내역이 없습니다.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {requests.map(req => (
                    <div key={req.id} className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-black text-white">예산: {req.monthly_budget.toLocaleString()}원</p>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">신청일: {new Date(req.created_at).toLocaleDateString('ko-KR')}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        req.status === 'consulting' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        req.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {req.status === 'pending' ? '접수대기' :
                         req.status === 'consulting' ? '상담중' :
                         req.status === 'active' ? '대행중' : '완료'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ad Request Form Input */}
          <form onSubmit={handleOpenContract} className="lg:col-span-3 bg-slate-900/40 border border-slate-850 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-lg font-black text-white">광고 대행 서비스 신청서</h3>

            {/* Budget options */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                선택 광고 예산 (대행 수수료 20% 포함)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3000000, 5000000, 10000000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setBudget(val);
                      setCustomBudgetInput('');
                    }}
                    className={`py-3.5 px-4 rounded-xl text-xs font-black transition-all text-center border cursor-pointer ${
                      budget === val && !customBudgetInput
                        ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/15'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    월 {val === 10000000 ? '1,000' : val / 10000}만 원
                  </button>
                ))}
              </div>
              <div className="pt-1">
                <input
                  type="text"
                  value={customBudgetInput}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setCustomBudgetInput(raw ? parseInt(raw).toLocaleString() + ' 원' : '');
                    setBudget(0);
                  }}
                  placeholder="기타 예산 입력 (예: 최소 3,000,000원 이상)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-3 px-4 outline-none text-xs text-white font-bold"
                />
              </div>

              {/* Dynamic Fee Breakdown Box */}
              <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>총 차감 예산 (보유 캐시에서 차감)</span>
                  <span className="font-bold text-white">
                    {(customBudgetInput ? parseInt(customBudgetInput.replace(/[^0-9]/g, '')) || 3000000 : budget).toLocaleString()} 원
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-[11px] pt-1.5 border-t border-slate-900">
                  <span>실제 집행 광고비 (80%)</span>
                  <span className="font-bold text-emerald-400">
                    {Math.floor((customBudgetInput ? parseInt(customBudgetInput.replace(/[^0-9]/g, '')) || 3000000 : budget) * 0.8).toLocaleString()} 원
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-[11px]">
                  <span>더윤컴퍼니 대행 수수료 (20%)</span>
                  <span className="font-bold text-orange-400">
                    {Math.floor((customBudgetInput ? parseInt(customBudgetInput.replace(/[^0-9]/g, '')) || 3000000 : budget) * 0.2).toLocaleString()} 원
                  </span>
                </div>
              </div>
            </div>

            {/* Target products check list */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                마케팅을 진행할 주요 집중 상품군 (다중 선택)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRODUCTS_LIST.map(product => {
                  const isChecked = selectedProducts.includes(product);
                  return (
                    <button
                      key={product}
                      type="button"
                      onClick={() => handleProductToggle(product)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                        isChecked 
                          ? 'bg-orange-500/10 border-orange-500/50 text-orange-400'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                      }`}
                    >
                      {product}
                    </button>
                  );
                })}
              </div>
              <div className="pt-2">
                <input
                  type="text"
                  value={customProductInput}
                  onChange={e => setCustomProductInput(e.target.value)}
                  placeholder="기타 집중 상품군 직접 입력 (예: 치아보험, 태아보험 등)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-3 px-4 outline-none text-xs text-white font-bold"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                대행 관련 상담을 받을 연락처
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="예: 010-1234-5678"
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-3 px-4 outline-none text-xs text-white font-bold"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                광고 요청 세부 사항 및 전달 글
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="희망하시는 타겟 지역, 성별, 연령대 정보 또는 선호하시는 문안 컨셉이 있다면 편하게 적어 주세요."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-3 px-4 outline-none text-xs text-white font-medium resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xs py-4 px-6 rounded-2xl transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-2"
            >
              광고 대행 표준 약관 동의 및 전자서명 패널 열기
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Super Admin View (김홍일 대표님 리스트 화면) */
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* List panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-white uppercase tracking-wider">대행 신청 목록</h3>
              
              {/* Status Filter tab */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 py-1.5 px-3 outline-none"
              >
                <option value="all">전체 상태 조회</option>
                <option value="pending">접수 대기</option>
                <option value="consulting">상담 중</option>
                <option value="active">대행 진행 중</option>
                <option value="completed">종료</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-20 bg-slate-950/20 border border-slate-900 rounded-[2rem]">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <span className="text-xs text-slate-500 font-bold">요청 리스트 조회 중...</span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-20 bg-slate-950/20 border border-slate-900 rounded-[2rem] space-y-2">
                <FileText className="w-10 h-10 text-slate-700 mx-auto" />
                <h4 className="text-xs font-black text-slate-400">조회 조건에 부합하는 내역이 없습니다.</h4>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredRequests.map(req => {
                  const isSelected = selectedRequest?.id === req.id;
                  return (
                    <div
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={`border rounded-2xl p-4 cursor-pointer transition-all hover:bg-slate-900/60 text-left ${
                        isSelected 
                          ? 'bg-slate-900 border-orange-500/50 shadow-md shadow-orange-500/5' 
                          : 'bg-slate-900/40 border-slate-850 hover:border-slate-750'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black text-white">
                          {req.planner?.name || '설계사'} ({req.planner?.company_name || '소속 없음'})
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          req.status === 'consulting' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          req.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {req.status === 'pending' ? '접수대기' :
                           req.status === 'consulting' ? '상담중' :
                           req.status === 'active' ? '대행중' : '완료'}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-[11px] text-slate-400 font-bold">
                        <p>예산: <span className="text-white font-extrabold">{req.monthly_budget.toLocaleString()} 원</span></p>
                        <p className="line-clamp-1">상품: {req.target_products.join(', ')}</p>
                        <p className="text-[10px] text-slate-500 font-bold mt-2 flex items-center justify-between">
                          <span>연락처: {req.contact_phone}</span>
                          <span>{new Date(req.created_at).toLocaleDateString('ko-KR')}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details & Signed Contract View (Super Admin) */}
          <div className="lg:col-span-3 space-y-6">
            {selectedRequest ? (
              <div className="bg-slate-900/40 border border-slate-850 rounded-[2.5rem] p-8 space-y-6 relative">
                {/* Contract viewer actions */}
                <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-850">
                  <div>
                    <h3 className="text-base font-black text-white">상세 계약 신청서</h3>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">상태를 수동으로 변경하거나 인쇄할 수 있습니다.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-750 transition-all text-xs font-bold flex items-center gap-1.5"
                      title="계약서 전문 및 서명 인쇄"
                    >
                      <Printer className="w-3.5 h-3.5" /> 인쇄/출력
                    </button>

                    {/* Refund button */}
                    {(selectedRequest.status === 'pending' || selectedRequest.status === 'consulting') && (
                      <button
                        onClick={() => handleCancelAndRefund(selectedRequest)}
                        className="p-2.5 bg-red-950/40 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-xl border border-red-900/30 transition-all text-xs font-black flex items-center gap-1.5"
                        title="신청 거절 및 캐시 환불"
                      >
                        ❌ 거절 및 캐시 환불
                      </button>
                    )}
                    
                    {/* Status updater */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                      {(['pending', 'consulting', 'active', 'completed'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateStatus(selectedRequest.id, st)}
                          className={`text-[9px] font-black py-1 px-2.5 rounded-lg transition-all ${
                            selectedRequest.status === st 
                              ? 'bg-orange-500 text-white shadow shadow-orange-500/10'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {st === 'pending' ? '접수대기' :
                           st === 'consulting' ? '상담중' :
                           st === 'active' ? '대행중' : '완료'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submitter details */}
                <div className="grid sm:grid-cols-2 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-850 text-xs font-bold">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">광고주 정보</span>
                    <p className="text-white font-extrabold">{selectedRequest.planner?.name || '설계사'}</p>
                    <p className="text-[11px] text-slate-400">{selectedRequest.planner?.company_name || '보험대리점'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">예산 및 수수료 (20% 포함)</span>
                    <p className="text-orange-400 font-extrabold">월 {selectedRequest.monthly_budget.toLocaleString()} 원</p>
                    <p className="text-[11px] text-slate-400">
                      실제 광고비: {(selectedRequest.monthly_budget * 0.8).toLocaleString()} 원 / 
                      수수료: {(selectedRequest.monthly_budget * 0.2).toLocaleString()} 원
                    </p>
                  </div>
                  <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 uppercase">대행 보험 상품</span>
                    <p className="text-slate-300">{selectedRequest.target_products.join(', ')}</p>
                  </div>
                  {selectedRequest.user_notes && (
                    <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-900">
                      <span className="text-[10px] text-slate-500 uppercase">광고주 요청 사항</span>
                      <p className="text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">{selectedRequest.user_notes}</p>
                    </div>
                  )}
                </div>

                {/* Printed agreement view wrapper */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">서명 완료된 광고 대행 계약서</h4>
                  
                  <div className="bg-slate-950/70 border border-slate-850 rounded-2xl p-6 h-96 overflow-y-auto text-[11px] font-mono leading-relaxed text-slate-300 whitespace-pre-wrap shadow-inner relative">
                    {selectedRequest.contract_text}
                    
                    {/* Embedded signature inside text view */}
                    <div className="border-t border-slate-800 pt-6 mt-8 flex flex-col items-end">
                      <div className="w-48 bg-white/95 rounded-xl p-3 border border-slate-200 text-center text-slate-900 shadow">
                        <span className="text-[9px] text-slate-500 font-bold block mb-1">전자서명 날인</span>
                        <img 
                          src={selectedRequest.signature_base64} 
                          alt="대표자 서명" 
                          className="mx-auto max-h-16 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print Target Hidden Area */}
                <div id="contract-print-area" className="hidden">
                  <div style={{ padding: '40px', color: '#000000', backgroundColor: '#ffffff', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                    <h2 style={{ textAlign: 'center', fontWeight: 'black', fontSize: '18px', marginBottom: '30px' }}>온라인 광고 대행 표준 계약서</h2>
                    <div>{selectedRequest.contract_text}</div>
                    <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <div style={{ border: '1px solid #000000', padding: '10px', width: '200px', textAlign: 'center' }}>
                        <span style={{ fontSize: '9px', color: '#666', display: 'block', marginBottom: '5px' }}>전자서명 날인</span>
                        <img src={selectedRequest.signature_base64} alt="전자서명" style={{ maxHeight: '60px', margin: '0 auto' }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-slate-900/20 border-2 border-dashed border-slate-850 rounded-[2.5rem] p-12 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="text-base font-black text-slate-400">신청건을 선택해 주세요</h3>
                <p className="text-xs text-slate-600 font-bold max-w-xs mx-auto">
                  왼쪽 목록에서 신청인 내역을 클릭하면 전자 서명 계약서와 예산 정보를 열어볼 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contract & Electronic Signature Modal (Planner submission step) */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
              <div>
                <h3 className="text-base font-black text-white">광고 대행 표준 계약 동의 및 서명</h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1">내용을 읽으신 뒤 하단 서명 패널에 마우스 또는 터치로 대표 서명을 진행해 주세요.</p>
              </div>
              <button 
                onClick={() => setShowContractModal(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors shrink-0"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Scrollable Contract body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-slate-950/70 border border-slate-850 p-6 rounded-2xl text-[11px] font-mono leading-relaxed text-slate-300 whitespace-pre-wrap shadow-inner">
                {generateContractText()}
              </div>

              {/* HTML5 Canvas Drawing Signature Pad */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                    대표 서명 날인 (마우스 드래그 혹은 터치 스크린 서명)
                  </label>
                  {hasSigned && (
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-[10px] text-orange-400 hover:text-orange-300 font-black"
                    >
                      다시 그리기
                    </button>
                  )}
                </div>

                <div className="border-2 border-dashed border-slate-800 rounded-2xl bg-white overflow-hidden h-36 relative shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={144}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full cursor-crosshair touch-none"
                  />
                  {!hasSigned && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-xs text-slate-400 font-bold">
                      여기에 서명을 그려주세요.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowContractModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-6 rounded-2xl transition-all"
              >
                동의 안함
              </button>
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={submitting || !hasSigned}
                className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs py-3 px-6 rounded-2xl transition-all shadow-md shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {submitting ? '제출 중...' : '동의 및 계약서 전송'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
