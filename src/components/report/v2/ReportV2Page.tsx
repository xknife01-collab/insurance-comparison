import React, { useEffect, useState } from 'react';
import { ReportTemplate } from './template/ReportTemplate';
import { estimateProfile } from './lib/estimator';
import { adaptLeadToProfile } from './lib/leadDataAdapter';
import { runAnalysis } from '../../../lib/analysisEngine';
import type { ReportData, BusinessCardData, InsuranceCategory } from './data/reportTypes';
import { createClient } from '../../../utils/supabase/client';
import { generateCustomMockData } from '../../../utils/mockGenerator';

// ============================================================
// 보장분석 리포트 v2 최상위 페이지
//
// URL 패턴 1: 실제 35개사 분석 결과 사용
//   /report-v2?code=RCN-40M125K
//   → customer_leads 테이블에서 실제 분석 결과 로드
//
// URL 패턴 2: 통계 추정 (분석 결과 없는 경우)
//   /report-v2?category=cancer&age=45&gender=남성&premium=125000
//   → estimator.ts 통계 알고리즘으로 즉석 계산
//
// 명함: useB2BBranding / branding 컨텍스트에서 1:1 자동 로드
// 기존 코드 파일 일체 건드리지 않음
// ============================================================

function getParam(key: string, fallback: string): string {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || fallback;
}

// 로딩 화면
const LoadingScreen: React.FC = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0A1628 0%, #1E3A8A 100%)',
    fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", gap: 20,
  }}>
    <div style={{
      width: 56, height: 56, borderRadius: 14,
      background: 'rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div style={{ color: '#93C5FD', fontSize: 16, fontWeight: 700 }}>
      보장 분석 리포트 생성 중...
    </div>
    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
      35개 생·손보사 빅데이터 분석 중입니다
    </div>
  </div>
);

export const ReportV2Page: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function buildReport() {
      try {
        const supabase = createClient();
        const simulationCode = getParam('code', '');
        const category = getParam('category', 'cancer') as InsuranceCategory;

        let profile;

        // ────────────────────────────────────────────────────
        // 패턴 1: ?code= 있으면 → customer_leads 실제 분석 결과
        // ────────────────────────────────────────────────────
        if (simulationCode) {
          const { data: leads, error: leadError } = await supabase
            .from('customer_leads')
            .select('analysis_result, monthly_premium, insurance_type, raw_payload')
            .eq('raw_payload->>simulation_code', simulationCode)
            .order('created_at', { ascending: false })
            .limit(1);

          if (!leadError && leads && leads.length > 0) {
            const lead = leads[0];
            const analysisResult = lead.analysis_result;

            if (analysisResult && analysisResult.analysis) {
              // ✅ 실제 35개사 계산 결과 사용
              const leadCategory = (
                lead.insurance_type?.replace('_consult', '').replace('_underwriting', '') ||
                analysisResult.analysis.selectedCategory ||
                category
              ) as InsuranceCategory;

              profile = adaptLeadToProfile(analysisResult, leadCategory);
            }
          }
        }

        // ────────────────────────────────────────────────────
        // 패턴 2: code 없거나 DB 결과 없으면
        // 1단계: 역추산 (나이+보험료 ➔ 암 1억 원 역산)
        // 2단계: 기존 리밸런싱 연산 엔진(analyzeRemodeling) 쏘기!
        // ────────────────────────────────────────────────────
        if (!profile) {
          const age = parseInt(getParam('age', '45'), 10);
          const rawGender = getParam('gender', '남성');
          const gender = rawGender === '여성' ? 'F' : 'M';
          const premium = parseInt(getParam('premium', '125000'), 10);

          // 1단계: 제미나이(AI) 역추정 (나이 + 성별 + 입력보험료 ➔ 보장 내역 역산)
          const estimated = estimateProfile(age, rawGender as '남성' | '여성', premium, category);

          // 2단계: 메인 앱 mockGenerator와 100% 동일한 standardized 패킷 생성
          const customPolicies = [
            {
              categoryId: category,
              premium: premium,
              riders: estimated.estimatedCoverages.map(item => ({
                rider_name: item.name,
                coverage_amount: item.currentAmount
              }))
            }
          ];

          const standardized = generateCustomMockData(age, gender as 'M' | 'F', customPolicies);

          try {
            // 3단계: 메인 앱 AnalysisSection.tsx와 100% 동일하게 standardized 패킷을 백엔드 엔진(runAnalysis)에 전달
            const dbAnalysisResult = await runAnalysis({
              name: '고객님',
              mobile: '010-0000-0000',
              age: standardized.age,
              gender: standardized.gender,
              jobClass: 1,
              selectedCategory: 'remodeling',
              cancer: {
                currentAmount: standardized.cancer_diagnosis || 50000000,
                targetAmount: 50000000,
                paymentType: 'non-renewable',
                treatmentCost2025: true,
                targetedTherapy: true,
              } as any,
              cerebrovascular: { currentAmount: standardized.brain_vascular || 10000000, targetAmount: 30000000 },
              cardiovascular: { currentAmount: standardized.ischemic_heart || 10000000, targetAmount: 30000000 },
              surgery: { currentAmount: standardized.surgery_amount || 300000, targetAmount: 10000000 },
              postDisability: { currentAmount: standardized.post_disability_amount || 0, targetAmount: 30000000 },
              paymentExemption: 'standard',
              healthStatus: 'standard',
              monthlyPremium: premium,
              _remodelingCoverage: standardized,
            });

            if (dbAnalysisResult) {
              profile = adaptLeadToProfile(dbAnalysisResult, category);
              profile.estimatedCoverages = estimated.estimatedCoverages;
              profile.monthlyPremium = premium;
              if (profile.optimizedPremium > 0) {
                profile.monthlySavings = Math.max(0, premium - profile.optimizedPremium);
                profile.totalSavings20yr = profile.monthlySavings * 12 * 20;
                const savingsRate = Math.round((profile.monthlySavings / premium) * 100);
                profile.premiumDonut = [
                  { label: '절감 예상액', value: savingsRate, color: '#3B82F6', subLabel: `월 ${profile.monthlySavings.toLocaleString()}원` },
                  { label: '최적화 보험료', value: 100 - savingsRate, color: '#E2E8F0', subLabel: `월 ${profile.optimizedPremium.toLocaleString()}원` },
                ];
              }
            }
          } catch (e) {
            console.warn('연산 엔진 쿼리 실패, 역추산 결과 사용:', e);
          }

          if (!profile) {
            profile = estimated;
          }
        }

        // ────────────────────────────────────────────────────
        // 명함: sessionStorage/localStorage에 캐시된 branding 사용
        // (useB2BBranding이 BrandingProvider 없이도 캐시 접근 가능)
        // ────────────────────────────────────────────────────
        let businessCard: BusinessCardData | undefined = undefined;

        try {
          // BrandingProvider 컨텍스트가 없으므로 캐시에서 직접 읽음
          const CACHE_KEY = 'ins_rebalance_b2b_branding';
          const cached =
            sessionStorage.getItem(CACHE_KEY) ||
            localStorage.getItem(CACHE_KEY);

          if (cached) {
            const branding = JSON.parse(cached);
            // plannerId 또는 agencyId가 있어야 유효한 B2B 명함
            if (branding.plannerId || branding.agencyId) {
              businessCard = {
                agencyName: branding.agencyName || '',
                agencyLogo: branding.logoUrl || undefined,
                plannerName: branding.name || '',
                plannerPhone: branding.customPhone || '',
                plannerEmail: branding.customEmail || undefined,
                plannerPhoto: branding.profileImageUrl || undefined,
                registrationNumber: branding.registrationNumber || undefined,
                title: branding.greetingTitle || undefined,
              };
            }
          }

          // 캐시 없을 때: ?planner= URL 파라미터로 직접 DB 조회
          if (!businessCard) {
            const plannerId = getParam('planner', '');
            if (plannerId) {
              const { data: plannerRow } = await supabase
                .from('planners')
                .select('name, phone, email, profile_image_url, registration_number, title, greeting_title, agency_id')
                .eq('id', plannerId)
                .maybeSingle();

              if (plannerRow) {
                let agencyName = '';
                let agencyLogo = '';
                if (plannerRow.agency_id) {
                  const { data: agencyRow } = await supabase
                    .from('agencies')
                    .select('name, logo_url')
                    .eq('id', plannerRow.agency_id)
                    .maybeSingle();
                  agencyName = agencyRow?.name || '';
                  agencyLogo = agencyRow?.logo_url || '';
                }
                businessCard = {
                  agencyName,
                  agencyLogo: agencyLogo || undefined,
                  plannerName: plannerRow.name || '',
                  plannerPhone: plannerRow.phone || '',
                  plannerEmail: plannerRow.email || undefined,
                  plannerPhoto: plannerRow.profile_image_url || undefined,
                  registrationNumber: plannerRow.registration_number || undefined,
                  title: plannerRow.greeting_title || plannerRow.title || undefined,
                };
              }
            }
          }
        } catch (e) {
          console.warn('명함 데이터 로드 실패 (무시):', e);
        }

        const now = new Date();
        const generatedAt = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

        setReportData({
          profile,
          businessCard,
          generatedAt,
          disclaimer:
            '본 분석은 고객님의 나이·성별·납입 보험료를 기반으로 통계 추정한 금액으로, 실제 계약 내역과 다를 수 있습니다.',
        });
      } catch (err) {
        console.error('리포트 생성 오류:', err);
        setError('리포트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    buildReport();
  }, []);

  if (loading) return <LoadingScreen />;

  if (error || !reportData) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F8FAFC', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
        color: '#64748B', fontSize: 14,
      }}>
        {error || '리포트를 불러올 수 없습니다.'}
      </div>
    );
  }

  return (
    <>
      {/* PDF 인쇄 버튼 */}
      <div className="no-print" style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000, display: 'flex', gap: 8 }}>
        <button
          onClick={() => window.print()}
          style={{
            background: 'linear-gradient(90deg, #1E3A8A, #2563EB)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 20px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,58,138,0.3)',
          }}
        >
          🖨️ PDF 저장 / 인쇄
        </button>
      </div>

      <style>{`
        @media print { .no-print { display: none !important; } }
      `}</style>

      <ReportTemplate data={reportData} />
    </>
  );
};

export default ReportV2Page;
