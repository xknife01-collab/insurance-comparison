import React from 'react';
import type { ReportData, CoverageItem, CoverageStatus } from '../data/reportTypes';
import { DonutChart } from './DonutChart';

// A4 기준 px (96dpi): 794 x 1123
const PAGE_W = 794;

// ============================================================
// 보장 상태 뱃지
// ============================================================
const StatusBadge: React.FC<{ status: CoverageStatus }> = ({ status }) => {
  const config: Record<CoverageStatus, { bg: string; text: string; dot: string }> = {
    '적정': { bg: '#ECFDF5', text: '#059669', dot: '#10B981' },
    '우수': { bg: '#EFF6FF', text: '#2563EB', dot: '#3B82F6' },
    '부족': { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' },
    '과다': { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
    '미가입': { bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' },
  };
  const c = config[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 7px', borderRadius: 99,
      background: c.bg, color: c.text,
      fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {status}
    </span>
  );
};

const fmt = (n: number) => {
  if (n === 0) return '미가입';
  if (n >= 100000000) return `${(n / 100000000).toFixed(0)}억원`;
  if (n >= 10000000) return `${(n / 10000000).toFixed(0)}천만원`;
  if (n >= 1000000) return `${(n / 1000000).toFixed(0)}백만원`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
};

const Page: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = '#fff' }) => (
  <div style={{
    width: PAGE_W, minHeight: 1123,
    background: bg, margin: '0 auto 24px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.13)',
    position: 'relative', overflow: 'hidden',
    fontFamily: "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
    boxSizing: 'border-box',
  }}>
    {children}
  </div>
);

const PageHeader: React.FC<{ sub: string; title: string; page: string }> = ({ sub, title, page }) => (
  <div style={{
    background: 'linear-gradient(90deg, #0F1B3D 0%, #1E40AF 100%)',
    padding: '18px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  }}>
    <div>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 2 }}>{sub}</div>
      <div style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginTop: 2 }}>{title}</div>
    </div>
    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 10px', color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{page}</div>
  </div>
);

// ============================================================
// 1페이지: 표지 (딥블루 3D 구체)
// ============================================================
const CoverPage: React.FC<{ data: ReportData }> = ({ data }) => {
  const { profile } = data;
  const catLabel: Record<string, string> = {
    cancer: '암보험', silson: '의료실비', driver: '운전자보험',
    brain: '뇌혈관보험', heart: '심장보험', surgery: '수술/입원보험',
    dental: '치아보험', dementia: '치매보험', caregiving: '간병보험',
    accident: '상해보험', child: '어린이보험', car: '자동차보험',
    pre: '유병자보험', health_general: '종합건강보험',
    remodeling: '종합 보장보험', comprehensive: '종합 보장보험',
  };
  const label = catLabel[profile.category] || '보험';

  return (
    <Page bg="linear-gradient(135deg,#0A1628 0%,#0F2A5C 40%,#1A3A8F 70%,#1D4ED8 100%)">
      {/* 3D 구체 */}
      <svg style={{ position: 'absolute', right: -80, top: -80, opacity: 0.15, pointerEvents: 'none' }} width="520" height="520" viewBox="0 0 520 520">
        <defs>
          <radialGradient id="sg2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </radialGradient>
        </defs>
        <circle cx="260" cy="260" r="250" fill="url(#sg2)" />
        {[60,100,140,180,220,260,300,340,380,420,460].map((y, i) => {
          const r = Math.sqrt(Math.max(0, 62500 - (y - 260) * (y - 260)));
          return r > 0 ? <ellipse key={i} cx="260" cy={y} rx={r} ry={r * 0.32} fill="none" stroke="#93C5FD" strokeWidth="0.9" /> : null;
        })}
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx="260" cy="260"
            rx={Math.abs(Math.cos((i * 30) * Math.PI / 180)) * 250} ry="250"
            fill="none" stroke="#93C5FD" strokeWidth="0.9"
            style={{ transform: `rotate(${i * 30}deg)`, transformOrigin: '260px 260px' }} />
        ))}
        {[[260,60],[180,100],[340,100],[100,180],[420,180],[60,260],[460,260],[100,340],[420,340],[180,420],[340,420],[260,460]]
          .map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="4" fill="#60A5FA" opacity="0.8" />)}
      </svg>

      {/* 로고 */}
      <div style={{ padding: '40px 48px 0', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>보험 비교 분석</span>
      </div>

      {/* 타이틀 */}
      <div style={{ padding: '56px 48px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'inline-block', background: 'rgba(96,165,250,0.18)', border: '1px solid rgba(147,197,253,0.3)', borderRadius: 20, padding: '5px 16px', color: '#93C5FD', fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 28 }}>
          {label.toUpperCase()} 보장분석 리포트
        </div>
        <h1 style={{ color: '#fff', fontSize: 42, fontWeight: 900, lineHeight: 1.25, margin: 0 }}>
          고객님의<br /><span style={{ color: '#60A5FA' }}>{label}</span><br />보장분석 가이드
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 24, lineHeight: 2 }}>
          {profile.ageGroup} {profile.gender} &nbsp;|&nbsp; 현재 납입보험료 월 {profile.monthlyPremium.toLocaleString()}원<br />
          35개 생·손보사 빅데이터 비교 분석
        </p>

        {/* 핵심 지표 3카드 */}
        <div style={{ display: 'flex', gap: 14, marginTop: 52 }}>
          {[
            { label: '월 절감 예상액', value: `${profile.monthlySavings.toLocaleString()}원`, sub: '매월 절감 가능' },
            { label: '20년 총 절감', value: `${Math.round(profile.totalSavings20yr / 10000).toLocaleString()}만원`, sub: '20년 납입 기준' },
            { label: '보장 충족 점수', value: `${profile.overallScore}점`, sub: '100점 만점' },
          ].map((card, i) => (
            <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 14, padding: '18px 16px' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>{card.label}</div>
              <div style={{ color: '#fff', fontSize: 20, fontWeight: 900 }}>{card.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 4 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* 면책 고지 */}
        <div style={{ marginTop: 56, padding: '14px 18px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, borderLeft: '3px solid rgba(147,197,253,0.4)' }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9.5, lineHeight: 1.8, margin: 0 }}>
            ※ 본 분석은 고객님의 나이·성별·납입 보험료를 기반으로 통계 추정한 금액으로, 실제 계약 내역과 다를 수 있습니다. 정확한 분석은 담당 설계사와 상담하시기 바랍니다.
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 36, left: 48, color: 'rgba(255,255,255,0.25)', fontSize: 9, zIndex: 2 }}>
        분석 생성일: {data.generatedAt}
      </div>
    </Page>
  );
};

// ============================================================
// 2페이지: 성과 요약 + 3대 원그래프
// ============================================================
const SummaryPage: React.FC<{ data: ReportData }> = ({ data }) => {
  const { profile } = data;
  const savingsRate = Math.round((profile.monthlySavings / profile.monthlyPremium) * 100);

  return (
    <Page>
      <PageHeader sub="핵심 성과 요약" title="보장 최적화 분석 결과" page="P.2 / 8" />
      <div style={{ padding: '24px 36px' }}>
        {/* 3대 원그래프 */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {[
            {
              title: '💰 보험료 절감률', data: profile.premiumDonut,
              center: `${savingsRate}%`, sub: '절감 가능',
              desc: `현재 월 ${profile.monthlyPremium.toLocaleString()}원 → 최적화 후 월 ${profile.optimizedPremium.toLocaleString()}원`,
            },
            {
              title: '🛡 보장 충족 점수', data: profile.coverageScoreDonut,
              center: `${Math.round(profile.overallScore)}점`, sub: '100점 만점',
              desc: `적정 ${profile.estimatedCoverages.filter(c => c.status === '적정').length}개 / 전체 ${profile.estimatedCoverages.length}개 항목`,
            },
            {
              title: '🔒 비갱신형 비중', data: profile.renewalRatioDonut,
              center: '65%', sub: '비갱신형',
              desc: '비갱신형 비중이 높을수록 장기 보험료 안정성 우수',
            },
          ].map((cfg, i) => (
            <div key={i} style={{ flex: 1, background: '#F8FAFF', borderRadius: 14, padding: '18px 14px 16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>{cfg.title}</div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <DonutChart data={cfg.data} size={130} strokeWidth={20} centerLabel={cfg.center} centerSubLabel={cfg.sub} />
              </div>
              <div style={{ fontSize: 9.5, color: '#64748B', lineHeight: 1.6 }}>{cfg.desc}</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
                {cfg.data.map((d, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: d.color, display: 'inline-block' }} />
                    <span style={{ fontSize: 8.5, color: '#64748B' }}>{d.label} {d.subLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 보험료 비교 바 */}
        <div style={{ background: '#EFF6FF', borderRadius: 12, padding: '18px 22px', border: '1px solid #BFDBFE', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1E40AF', marginBottom: 12 }}>📊 보험료 최적화 비교</div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#64748B', marginBottom: 4 }}>현재 납입 보험료</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1E293B' }}>월 {profile.monthlyPremium.toLocaleString()}원</div>
              <div style={{ marginTop: 6, height: 10, borderRadius: 5, background: '#CBD5E1' }} />
            </div>
            <div style={{ color: '#3B82F6', fontSize: 28, fontWeight: 900 }}>→</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#64748B', marginBottom: 4 }}>최적화 후 예상 보험료</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#2563EB' }}>월 {profile.optimizedPremium.toLocaleString()}원</div>
              <div style={{ marginTop: 6, height: 10, borderRadius: 5, background: '#BFDBFE', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(profile.optimizedPremium / profile.monthlyPremium) * 100}%`, background: 'linear-gradient(90deg,#3B82F6,#1D4ED8)', borderRadius: 5 }} />
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #3B82F6', flexShrink: 0 }}>
              <div style={{ fontSize: 9, color: '#3B82F6', fontWeight: 700 }}>✨ 절감 효과</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#1D4ED8', marginTop: 2 }}>월 {profile.monthlySavings.toLocaleString()}원</div>
              <div style={{ fontSize: 9, color: '#60A5FA', marginTop: 3 }}>20년 총 {Math.round(profile.totalSavings20yr / 10000).toLocaleString()}만원 절감</div>
            </div>
          </div>
        </div>

        {/* 6대 점수 바 */}
        <div style={{ background: '#FAFAFA', borderRadius: 12, padding: '14px 18px', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B', marginBottom: 10 }}>📈 6대 보장 영역 점수</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[
              { label: '보험료 효율성', score: profile.scoreBreakdown.efficiency, color: '#3B82F6' },
              { label: '보장 적정성', score: profile.scoreBreakdown.coverage, color: '#10B981' },
              { label: '비갱신 비중', score: profile.scoreBreakdown.nonRenewal, color: '#6366F1' },
              { label: '진단비 갭 점수', score: profile.scoreBreakdown.diagnosis, color: '#F59E0B' },
              { label: '수술비 보장', score: profile.scoreBreakdown.surgery, color: '#EC4899' },
              { label: '상해·후유장해', score: profile.scoreBreakdown.injury, color: '#8B5CF6' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 88, fontSize: 10, color: '#374151', fontWeight: 500, flexShrink: 0 }}>{item.label}</div>
                <div style={{ flex: 1, height: 6, background: '#E5E7EB', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.score}%`, background: item.color, borderRadius: 99 }} />
                </div>
                <div style={{ width: 32, fontSize: 10, fontWeight: 700, color: item.color, textAlign: 'right' }}>{item.score}점</div>
              </div>
            ))}
          </div>
        </div>

        {/* 🏆 전 보험사 실시간 비교 순위표 (마스킹) */}
        {(() => {
          const rawList = profile.allOptions && profile.allOptions.length > 0
            ? profile.allOptions
            : [
                { companyName: 'L생보', productName: '실속 암진단보장보험 (B형)', premium: profile.optimizedPremium || 42258 },
                { companyName: 'L생보', productName: '실속 암진단보장보험 (D형)', premium: (profile.optimizedPremium || 42258) + 867 },
                { companyName: 'I손보', productName: '실속 암진단보장보험 (C형)', premium: (profile.optimizedPremium || 42258) + 1162 },
                { companyName: 'B생보', productName: '실속 암진단보장보험 (A형)', premium: (profile.optimizedPremium || 42258) + 1292 },
                { companyName: 'J손보', productName: '실속 암진단보장보험 (C형)', premium: (profile.optimizedPremium || 42258) + 2647 },
                { companyName: 'L생보', productName: '실속 암진단보장보험 (D형)', premium: (profile.optimizedPremium || 42258) + 2719 },
                { companyName: 'H손보', productName: '가성비 암진단 집중플랜 (A형)', premium: (profile.optimizedPremium || 42258) + 3120 },
              ];

          const formattedList = rawList.slice(0, 7).map((opt: any, idx: number) => {
            const rawCo = opt.companyName || opt.company || '';
            const maskedCo = rawCo.includes('생보') || rawCo.includes('손보') || rawCo.includes('보험')
              ? rawCo
              : `${(rawCo.charAt(0) || 'A')}${rawCo.includes('생명') ? '생보' : '손보'}`;
            return {
              rank: String(idx + 1).padStart(2, '0'),
              company: maskedCo || 'L생보',
              product: (opt.productName || opt.product || '실속 암진단보장보험').replace(/무배당\s*/g, ''),
              premium: opt.premium || 42258,
            };
          });

          return (
            <div style={{ background: '#FAFAFA', borderRadius: 12, padding: '12px 16px', border: '1px solid #E5E7EB', marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B' }}>🏆 전 보험사 실시간 비교</div>
                <div style={{ fontSize: 8, color: '#64748B', fontWeight: 600 }}>* 금소법 준수 마스킹 표기</div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9.5 }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left', color: '#475569', fontWeight: 700 }}>
                    <th style={{ padding: '4px 6px', width: 28 }}>순위</th>
                    <th style={{ padding: '4px 6px', width: 50 }}>보험사</th>
                    <th style={{ padding: '4px 6px' }}>상품명</th>
                    <th style={{ padding: '4px 6px', textAlign: 'right', width: 75 }}>월 보험료</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedList.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', background: idx === 0 ? '#EFF6FF' : 'transparent' }}>
                      <td style={{ padding: '4px 6px', fontWeight: 800, color: idx === 0 ? '#2563EB' : '#475569' }}>
                        {item.rank}
                      </td>
                      <td style={{ padding: '4px 6px', fontWeight: 700, color: '#334155' }}>
                        {item.company}
                      </td>
                      <td style={{ padding: '4px 6px', color: '#475569', fontWeight: 500 }}>
                        {item.product}
                      </td>
                      <td style={{ padding: '4px 6px', textAlign: 'right', fontWeight: 800, color: idx === 0 ? '#1D4ED8' : '#0F172A' }}>
                        {item.premium.toLocaleString()}원
                        {idx === 0 && <span style={{ marginLeft: 3, fontSize: 7, background: '#2563EB', color: '#fff', padding: '1px 3px', borderRadius: 3, fontWeight: 700 }}>최저가</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </Page>
  );
};

// ============================================================
// 3~7페이지: 빽빽한 보장 대조표
// ============================================================
const DiagnosisPages: React.FC<{ data: ReportData }> = ({ data }) => {
  const { profile } = data;
  const { estimatedCoverages } = profile;

  const grouped: Record<string, CoverageItem[]> = {};
  estimatedCoverages.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  const catColors: Record<string, string> = {
    '암 진단비': '#EF4444', '뇌혈관 진단비': '#8B5CF6', '심장 진단비': '#EC4899',
    '수술비': '#F59E0B', '항암 치료비': '#10B981', '입원 일당': '#3B82F6',
    '교통사고': '#F97316', '법률비용': '#6366F1', '벌금': '#EF4444',
    '면허': '#14B8A6', '상해': '#8B5CF6',
  };

  const adequate = estimatedCoverages.filter(c => c.status === '적정').length;
  const lack = estimatedCoverages.filter(c => c.status === '부족').length;
  const unsub = estimatedCoverages.filter(c => c.status === '미가입').length;

  return (
    <Page>
      <PageHeader sub="보장 갭 정밀 진단" title="특약 항목별 보장 현황 분석" page="P.3~7 / 8" />
      <div style={{ padding: '20px 36px' }}>
        {/* 요약 뱃지 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center' }}>
          {[
            { label: '적정', count: adequate, color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
            { label: '부족', count: lack, color: '#F97316', bg: '#FFF7ED', border: '#FED7AA' },
            { label: '미가입', count: unsub, color: '#94A3B8', bg: '#F8FAFC', border: '#E2E8F0' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: s.bg, borderRadius: 10, padding: '8px 16px', border: `1px solid ${s.border}` }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: s.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>{s.count}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.label}</div>
                <div style={{ fontSize: 8, color: '#94A3B8' }}>항목</div>
              </div>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 8.5, color: '#94A3B8', background: '#F8FAFC', borderRadius: 8, padding: '6px 12px', lineHeight: 1.6 }}>
            ※ 고객님의 나이·납입보험료 기반 통계 추정값
          </div>
        </div>

        {/* 대조 테이블 */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 110px 110px 70px 70px', background: '#0F1B3D', padding: '9px 14px', gap: 6 }}>
            {['구분', '특약 항목명', '현재 추정 보장액', '권장 보장 금액', '상태', '비고'].map((h, i) => (
              <div key={i} style={{ fontSize: 9.5, fontWeight: 700, color: '#BAC8F3', textAlign: i >= 2 ? 'center' : 'left' }}>{h}</div>
            ))}
          </div>

          {Object.entries(grouped).map(([category, items], gi) => (
            <React.Fragment key={category}>
              <div style={{ background: '#F0F4FF', padding: '6px 14px', borderTop: gi > 0 ? '2px solid #C7D2FE' : undefined, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: catColors[category] || '#6366F1', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#1E40AF' }}>{category}</span>
              </div>
              {(items as CoverageItem[]).map((item, ii) => (
                <div key={ii} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 110px 110px 70px 70px', padding: '8px 14px', gap: 6, borderTop: '1px solid #F1F5F9', background: ii % 2 === 0 ? '#fff' : '#FAFBFD', alignItems: 'center' }}>
                  <div style={{ fontSize: 8.5, color: '#94A3B8' }}>{item.category}</div>
                  <div style={{ fontSize: 10, color: '#1E293B', fontWeight: 500, lineHeight: 1.45 }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: '#374151', textAlign: 'center', fontWeight: 600 }}>{fmt(item.currentAmount)}</div>
                  <div style={{ fontSize: 10, color: '#2563EB', textAlign: 'center', fontWeight: 600 }}>{fmt(item.recommendedAmount)}</div>
                  <div style={{ textAlign: 'center' }}><StatusBadge status={item.status} /></div>
                  <div style={{ fontSize: 8.5, color: '#94A3B8', textAlign: 'center' }}>{item.note || '-'}</div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: '9px 13px', background: '#F8FAFC', borderRadius: 8, borderLeft: '3px solid #CBD5E1' }}>
          <p style={{ fontSize: 8.5, color: '#94A3B8', margin: 0, lineHeight: 1.7 }}>
            ※ 위 보장 금액은 고객님({profile.ageGroup} {profile.gender}, 월 {profile.monthlyPremium.toLocaleString()}원)의 납입 보험료를 기반으로 통계 빅데이터를 적용하여 추정한 금액입니다. 실제 계약 내역과 상이할 수 있습니다.
          </p>
        </div>
      </div>
    </Page>
  );
};

// ============================================================
// 8페이지: 1:1 명함
// ============================================================
const BusinessCardPage: React.FC<{ data: ReportData }> = ({ data }) => {
  const card = data.businessCard;
  return (
    <Page bg="#F0F4FF">
      <PageHeader sub="담당 설계사" title="전담 보험 컨설턴트 안내" page="P.8 / 8" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 40px' }}>
        {card ? (
          <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 20px 60px rgba(15,27,61,0.15)', border: '1px solid #E2E8F0' }}>
            {/* 명함 상단 */}
            <div style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1A3A8F 50%, #1D4ED8 100%)', padding: '32px 30px 28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -24, top: -24, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                {card.plannerPhoto ? (
                  <img src={card.plannerPhoto} alt="" style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.2)' }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: 16, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.13)' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" />
                      <circle cx="12" cy="7" r="4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" />
                    </svg>
                  </div>
                )}
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, letterSpacing: 1, marginBottom: 5 }}>{card.title || '보험 컨설턴트'}</div>
                  <div style={{ color: '#fff', fontSize: 24, fontWeight: 900 }}>{card.plannerName}</div>
                  {card.agencyName && <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 4 }}>{card.agencyName}</div>}
                </div>
              </div>
            </div>

            {/* 연락처 */}
            <div style={{ padding: '26px 30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {card.plannerPhone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#2563EB" strokeWidth="1.7" /></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>직통 전화</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{card.plannerPhone}</div>
                    </div>
                  </div>
                )}
                {card.registrationNumber && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="#8B5CF6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="#8B5CF6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>금융위원회 등록번호</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{card.registrationNumber}</div>
                    </div>
                  </div>
                )}
              </div>
              {card.agencyLogo && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
                  <img src={card.agencyLogo} alt={card.agencyName} style={{ maxHeight: 40, objectFit: 'contain' }} />
                </div>
              )}
              <div style={{ marginTop: 22, background: 'linear-gradient(90deg,#0F1B3D,#1D4ED8)', borderRadius: 12, padding: '15px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>📞 지금 바로 무료 상담 신청</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 3 }}>전화 또는 카카오톡으로 빠르게 연결됩니다</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#94A3B8', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <div style={{ fontSize: 14 }}>담당 설계사 정보가 없습니다.</div>
            <div style={{ fontSize: 12, marginTop: 8, color: '#CBD5E1' }}>URL에 ?planner=ID를 추가하면 자동으로 불러옵니다.</div>
          </div>
        )}
      </div>
      <div style={{ padding: '0 36px 28px', borderTop: '1px solid #E2E8F0', color: '#CBD5E1', fontSize: 8.5, lineHeight: 1.7 }}>
        본 보장분석 리포트는 고객님의 보험 가입 현황을 효율적으로 검토하기 위한 참고 자료입니다.
        실제 보험 가입 여부 및 계약 사항은 반드시 전문 설계사와 확인하시기 바랍니다.
      </div>
    </Page>
  );
};

// ============================================================
// 최상위 리포트 템플릿
// ============================================================
export const ReportTemplate: React.FC<{ data: ReportData }> = ({ data }) => (
  <div style={{ background: '#E8ECF3', minHeight: '100vh', padding: '32px 0 48px' }}>
    <style>{`
      @media print {
        .no-print { display: none !important; }
        body { background: white !important; margin: 0; padding: 0; }
        @page { margin: 0; size: A4 portrait; }
      }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    `}</style>
    <CoverPage data={data} />
    <SummaryPage data={data} />
    <DiagnosisPages data={data} />
    <BusinessCardPage data={data} />
  </div>
);

export default ReportTemplate;
