import React from 'react';
import type { DonutData } from '../data/reportTypes';

interface DonutChartProps {
  data: DonutData[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSubLabel?: string;
}

/**
 * 순수 SVG 기반 고화질 도넛 차트 컴포넌트
 * 외부 라이브러리 없음 - 100% 독립 모듈
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 140,
  strokeWidth = 22,
  centerLabel,
  centerSubLabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  // 퍼센트 → strokeDasharray 계산
  let cumulative = 0;
  const segments = data.map((item) => {
    const offset = circumference * (1 - cumulative / 100);
    const dash = circumference * (item.value / 100);
    cumulative += item.value;
    return { ...item, dash, offset };
  });

  // 주요 값 (첫 번째 세그먼트)
  const primary = data[0];

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 배경 트랙 */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
        />
        {/* 데이터 세그먼트 */}
        {segments.map((seg, i) => (
          i === 0 || seg.value === 0 ? null : (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={seg.offset}
              strokeLinecap="butt"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.6s ease' }}
            />
          )
        ))}
        {/* 첫 번째 세그먼트 (주요값) */}
        {segments.length > 0 && segments[0].value > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={segments[0].color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segments[0].dash} ${circumference - segments[0].dash}`}
            strokeDashoffset={circumference}
            strokeLinecap="butt"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.6s ease' }}
          />
        )}
        {/* 중앙 텍스트 */}
        {centerLabel && (
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size * 0.13}
            fontWeight="800"
            fill={primary?.color || '#1E293B'}
            fontFamily="'Pretendard', 'Noto Sans KR', sans-serif"
          >
            {centerLabel}
          </text>
        )}
        {centerSubLabel && (
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size * 0.085}
            fontWeight="500"
            fill="#64748B"
            fontFamily="'Pretendard', 'Noto Sans KR', sans-serif"
          >
            {centerSubLabel}
          </text>
        )}
      </svg>
    </div>
  );
};

export default DonutChart;
