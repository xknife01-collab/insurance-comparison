/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface RadarChartProps {
  data: {
    label: string;
    value: number; // 0-100
    target: number; // 0-100 (평군/권장)
  }[];
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 300 }) => {
  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const targetPoints = data.map((d, i) => getPoint(i, d.target));
  const userPoints = data.map((d, i) => getPoint(i, d.value));

  const targetPath = targetPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const userPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Circles */}
        {[20, 40, 60, 80, 100].map((tick) => (
          <circle
            key={tick}
            cx={center}
            cy={center}
            r={(tick / 100) * radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {data.map((d, i) => {
          const pt = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={pt.x}
              y2={pt.y}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          );
        })}

        {/* Labels */}
        {data.map((d, i) => {
          const pt = getPoint(i, 115);
          return (
            <text
              key={i}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              className="text-[10px] font-black fill-gray-400 uppercase tracking-tighter"
            >
              {d.label}
            </text>
          );
        })}

        {/* Target Area (Average) */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          d={targetPath}
          fill="rgba(107, 114, 128, 0.05)"
          stroke="rgba(107, 114, 128, 0.2)"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        {/* User Area (Current) */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d={userPath}
          fill="rgba(249, 115, 22, 0.3)"
          stroke="#f97316"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {userPoints.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ r: 0 }}
            animate={{ r: 4 }}
            transition={{ delay: 1 + i * 0.1 }}
            cx={p.x}
            cy={p.y}
            fill="#f97316"
            stroke="white"
            strokeWidth="2"
            className="shadow-sm"
          />
        ))}
      </svg>
      
      <div className="flex gap-4 mt-8 text-[10px] font-bold">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-gray-900">내 현재 보장</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-200 rounded-full border border-dashed border-gray-400"></div>
          <span className="text-gray-400">동일 연령대 평균</span>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
